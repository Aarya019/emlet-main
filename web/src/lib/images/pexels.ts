/**
 * Pexels + Pixabay image fetching utility.
 * Docs: https://www.pexels.com/api/documentation/ / https://pixabay.com/api/docs/
 *
 * Set PEXELS_API_KEY and PIXABAY_API_KEY in .env.local
 * Pexels free tier: 200 requests/hour, no attribution required for commercial use.
 * Pixabay free tier: ~100 requests/minute, no attribution required.
 *
 * TEMPORARY (testing): Pixabay is currently tried FIRST, with Pexels as the
 * fallback — the reverse of the eventual intended setup — so Pixabay's output
 * quality can be evaluated directly. Swap the two calls in
 * `rankImageCandidates` to flip back to Pexels-primary/Pixabay-fallback.
 */

const PEXELS_API_BASE = 'https://api.pexels.com/v1';
const PIXABAY_API_BASE = 'https://pixabay.com/api/';

// Pexels and Pixabay both accept a named-color filter but disagree on one name.
const PIXABAY_COLOR_ALIASES: Record<string, string> = { violet: 'lilac' };

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  alt: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

interface PixabayHit {
  id: number;
  imageWidth: number;
  imageHeight: number;
  largeImageURL: string;
}

interface PixabaySearchResponse {
  total: number;
  totalHits: number;
  hits: PixabayHit[];
}

type ImageOrientation = 'landscape' | 'portrait' | 'square';
type ImageSize = 'large' | 'medium' | 'small';

/** Provider-agnostic so Pexels and Pixabay candidates can be scored and picked with the same logic. */
interface RankedCandidate {
  id: string; // namespaced per provider (e.g. "pexels-123") so cross-provider IDs can never collide
  width: number;
  height: number;
  url: string;
  score: number;
}

/**
 * Per design style: a 1-2 word aesthetic modifier appended to the keyword
 * and an optional Pexels-accepted color name to filter results by palette.
 * Pexels accepted color names: red orange yellow green turquoise blue violet pink brown black gray white
 * Leave color empty ("") to skip the filter where it would be too restrictive.
 */
export const styleImageConfig: Record<string, { modifier: string; color: string }> = {
  simple:      { modifier: 'plain natural light',        color: 'white'  },
  minimalist:  { modifier: 'minimal bright clean',       color: 'white'  },
  editorial:   { modifier: 'editorial film grain',        color: 'gray'   },
  retro:       { modifier: 'vintage warm sunlight',       color: 'orange' },
  brutalist:   { modifier: 'bold high contrast',          color: ''       },
  cyberpunk:   { modifier: 'neon dark futuristic rain',   color: 'blue'   },
  handwritten: { modifier: 'cozy warm natural light',     color: 'gray'   },
  bauhaus:     { modifier: 'geometric architectural flat', color: ''       },
};

/**
 * Score a candidate photo. Relevance (the provider's own result ranking) is
 * the primary driver — a smoothly-decaying weight by list position — with
 * aspect ratio fit as a strong secondary factor. Resolution is only a light
 * tie-breaker: `size: large` already guarantees a 24MP+ floor server-side, so
 * raw pixel count must not be allowed to dominate and override relevance
 * (previously a much higher-res but less relevant photo could always win).
 */
function scoreCandidate(
  dims: { width: number; height: number },
  index: number,
  orientation: ImageOrientation,
  preferPanoramic: boolean,
): number {
  const relevance = 1 / (1 + index * 0.05);

  let ratioBonus = 1;
  if (orientation === 'landscape') {
    const ratio = dims.width / dims.height;
    if (ratio < 1.1) return 0; // skip near-square photos entirely
    const idealRatio = preferPanoramic ? 1.9 : 1.5;
    const tolerance = preferPanoramic ? 0.08 : 0.12;
    ratioBonus = Math.max(0.15, 1 - Math.abs(ratio - idealRatio) * tolerance);
  } else if (orientation === 'square') {
    const diff = Math.abs(dims.width / dims.height - 1);
    ratioBonus = Math.max(0.2, 1 - diff * 2);
  }

  const megapixels = (dims.width * dims.height) / 1_000_000;
  const resolutionBonus = Math.min(1, 0.92 + megapixels / 600);

  return relevance * ratioBonus * resolutionBonus;
}

/**
 * Search Pexels for a keyword and return every candidate ranked best-first.
 * Requests the max page size (80) so there's a large pool to pick a good,
 * on-topic, well-composed photo from — costs the same single API call as a
 * smaller page.
 */
async function rankPexelsCandidates(
  keyword: string,
  orientation: ImageOrientation,
  size: ImageSize,
  color: string | undefined,
  preferPanoramic: boolean,
): Promise<RankedCandidate[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY is not set. Skipping image fetch.');
    return [];
  }

  try {
    const params = new URLSearchParams({
      query: keyword,
      per_page: '80', // Pexels' max page size — same request cost, bigger candidate pool
      page: '1',
      orientation,
      size,
    });

    // Optional color filter — keeps images on-palette for the design style
    if (color) params.set('color', color);

    const response = await fetch(`${PEXELS_API_BASE}/search?${params}`, {
      headers: {
        Authorization: apiKey,
      },
      // Cache identical keyword lookups for 24 hours via Next.js data cache.
      // Same keyword won't hit Pexels again until revalidation, making
      // repeat generations near-instant and saving rate-limit quota.
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PexelsSearchResponse = await response.json();

    if (!data.photos || data.photos.length === 0) {
      console.warn(`No Pexels results for keyword: "${keyword}"`);
      return [];
    }

    return data.photos
      .map((photo, index): RankedCandidate => ({
        id: `pexels-${photo.id}`,
        width: photo.width,
        height: photo.height,
        // `large2x` (2560px wide) gives sharp images on retina/HiDPI displays
        url: photo.src.large2x,
        score: scoreCandidate(photo, index, orientation, preferPanoramic),
      }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error(`Failed to fetch Pexels image for "${keyword}":`, error);
    return [];
  }
}

/**
 * Search Pixabay for a keyword and return every candidate ranked best-first.
 */
async function rankPixabayCandidates(
  keyword: string,
  orientation: ImageOrientation,
  color: string | undefined,
  preferPanoramic: boolean,
): Promise<RankedCandidate[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    console.warn('PIXABAY_API_KEY is not set. Skipping Pixabay fetch.');
    return [];
  }

  try {
    // Unlike Pexels' semantic/ML relevance ranking, Pixabay matches queries
    // against a small set of manually-assigned tags per photo (~5). The
    // keywords this app sends are already 5-8 words on their own (per the AI's
    // IMAGE KEYWORD RULES) before a 3-4 word style modifier gets appended on
    // top — an 8-12 word query against a 5-tag index returns scattershot,
    // often off-topic matches. Trim to the leading words (always the actual
    // subject — the modifier is only ever appended after) so Pixabay gets a
    // short, focused query it can actually match well.
    const pixabayQuery = keyword.split(/\s+/).slice(0, 5).join(' ');

    const params = new URLSearchParams({
      key: apiKey,
      q: pixabayQuery,
      image_type: 'photo',
      per_page: '80', // Pixabay's max-ish page size (3-200) — same request cost, bigger pool
      safesearch: 'true',
      orientation: orientation === 'portrait' ? 'vertical' : orientation === 'landscape' ? 'horizontal' : 'all',
    });

    // Optional color filter — keeps images on-palette for the design style
    if (color) params.set('colors', PIXABAY_COLOR_ALIASES[color] ?? color);

    const response = await fetch(`${PIXABAY_API_BASE}?${params}`, {
      // Cache identical keyword lookups for 24 hours via Next.js data cache.
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      console.error(`Pixabay API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PixabaySearchResponse = await response.json();

    if (!data.hits || data.hits.length === 0) {
      console.warn(`No Pixabay results for query: "${pixabayQuery}" (from keyword: "${keyword}")`);
      return [];
    }

    return data.hits
      .map((hit, index): RankedCandidate => ({
        id: `pixabay-${hit.id}`,
        width: hit.imageWidth,
        height: hit.imageHeight,
        url: hit.largeImageURL,
        score: scoreCandidate({ width: hit.imageWidth, height: hit.imageHeight }, index, orientation, preferPanoramic),
      }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error(`Failed to fetch Pixabay image for "${keyword}":`, error);
    return [];
  }
}

/**
 * Rank candidates, trying one provider then falling back to the other if the
 * first comes back empty — a 429/quota error, any other API error, or a
 * genuine no-match. This is the single point both `fetchPexelsImage` and
 * `batchFetchPexelsImages` go through.
 *
 * TEMPORARY (testing): Pixabay first, Pexels as fallback. Swap the two blocks
 * below to flip back to Pexels-primary once done evaluating Pixabay.
 */
async function rankImageCandidates(
  keyword: string,
  orientation: ImageOrientation,
  size: ImageSize,
  color: string | undefined,
  preferPanoramic: boolean,
): Promise<RankedCandidate[]> {
  const pixabayResults = await rankPixabayCandidates(keyword, orientation, color, preferPanoramic);
  if (pixabayResults.length > 0) return pixabayResults;

  console.warn(`Pixabay had no usable results for "${keyword}" — falling back to Pexels`);
  return rankPexelsCandidates(keyword, orientation, size, color, preferPanoramic);
}

/**
 * Pick a candidate, preferring ones not already used elsewhere in this email
 * (avoids two sections showing the identical stock photo). Picks randomly
 * among the top near-ties (within 15% of the best score) rather than always
 * the single top-ranked photo, so repeat searches for the same keyword —
 * including ones served from the 24h response cache — don't always resolve
 * to the literal same image across different generations.
 */
function pickWithVariety(ranked: RankedCandidate[], usedPhotoIds: Set<string>): RankedCandidate | null {
  const available = ranked.filter(c => !usedPhotoIds.has(c.id));
  // If every good candidate is already used elsewhere in this email (rare —
  // only happens with very few results for a very specific keyword), fall
  // back to allowing reuse rather than showing no image at all.
  const pool = available.length > 0 ? available : ranked;
  if (pool.length === 0) return null;

  const topScore = pool[0].score;
  const nearTies = pool.filter(c => c.score >= topScore * 0.85).slice(0, 5);
  return nearTies[Math.floor(Math.random() * nearTies.length)];
}

/**
 * Search Pexels for a photo matching the keyword.
 * Returns a permanent CDN URL suitable for embedding in emails.
 *
 * @param preferPanoramic - When true (background images), favour very wide
 *   aspect ratios (1.6–3:1). When false (content images), favour well-composed
 *   editorial shots peaking around 1.5:1.
 */
export async function fetchPexelsImage(
  keyword: string,
  orientation: ImageOrientation = 'landscape',
  size: ImageSize = 'large',
  color?: string,
  preferPanoramic = false,
): Promise<string | null> {
  const ranked = await rankImageCandidates(keyword, orientation, size, color, preferPanoramic);
  const pick = pickWithVariety(ranked, new Set());
  return pick?.url ?? null;
}

/**
 * Batch-fetch Pexels images for multiple keywords, deduplicating requests.
 * Also ensures no two keywords in the same batch (i.e. the same email) end up
 * with the identical photo, by tracking already-picked photo IDs across the
 * whole batch and skipping them when assigning the next keyword's image.
 * Returns a map of keyword → URL (or null if fetch failed).
 */
export async function batchFetchPexelsImages(
  keywords: Array<{ keyword: string; orientation?: ImageOrientation; color?: string; preferPanoramic?: boolean }>
): Promise<Record<string, string | null>> {
  const uniqueEntries = [...new Map(keywords.map(k => [k.keyword, k])).values()];

  const candidateLists = await Promise.all(
    uniqueEntries.map(async ({ keyword, orientation = 'landscape', color, preferPanoramic = false }) => ({
      keyword,
      ranked: await rankImageCandidates(keyword, orientation, 'large', color, preferPanoramic),
    }))
  );

  const usedPhotoIds = new Set<string>();
  const results: Record<string, string | null> = {};

  for (const { keyword, ranked } of candidateLists) {
    const pick = pickWithVariety(ranked, usedPhotoIds);
    if (pick) {
      usedPhotoIds.add(pick.id);
      results[keyword] = pick.url;
    } else {
      results[keyword] = null;
    }
  }

  return results;
}
