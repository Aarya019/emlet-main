/**
 * Pexels API image fetching utility.
 * Docs: https://www.pexels.com/api/documentation/
 *
 * Set PEXELS_API_KEY in .env.local
 * Free tier: 200 requests/hour, no attribution required for commercial use.
 */

const PEXELS_API_BASE = 'https://api.pexels.com/v1';

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

type ImageOrientation = 'landscape' | 'portrait' | 'square';
type ImageSize = 'large' | 'medium' | 'small';

/**
 * Per design style: a 1-2 word aesthetic modifier appended to the keyword
 * and an optional Pexels-accepted color name to filter results by palette.
 * Pexels accepted color names: red orange yellow green turquoise blue violet pink brown black gray white
 * Leave color empty ("") to skip the filter where it would be too restrictive.
 */
export const styleImageConfig: Record<string, { modifier: string; color: string }> = {
  minimalist:  { modifier: 'minimal bright clean',       color: 'white'  },
  editorial:   { modifier: 'editorial film grain',        color: 'gray'   },
  retro:       { modifier: 'vintage warm sunlight',       color: 'orange' },
  brutalist:   { modifier: 'bold high contrast',          color: ''       },
  cyberpunk:   { modifier: 'neon dark futuristic rain',   color: 'blue'   },
  handwritten: { modifier: 'cozy warm natural light',     color: 'gray'   },
  bauhaus:     { modifier: 'geometric architectural flat', color: ''       },
};

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
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY is not set. Skipping image fetch.');
    return null;
  }

  try {
    const params = new URLSearchParams({
      query: keyword,
      per_page: '15',  // fetch 15 so we can pick the best quality/composition
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
      return null;
    }

    const data: PexelsSearchResponse = await response.json();

    if (!data.photos || data.photos.length === 0) {
      console.warn(`No Pexels results for keyword: "${keyword}"`);
      return null;
    }

    // Select the best photo based on a quality score.
    // Score = resolution (width × height) × aspect-ratio bonus.
    //
    // Content images (preferPanoramic=false): bonus peaks at ~1.5:1 (editorial
    //   landscape proportions). Penalises extreme panoramas or near-square shots.
    // Background images (preferPanoramic=true): bonus peaks at ~1.9:1 and stays
    //   high for wider panoramics (good full-width section backgrounds).
    let photo: PexelsPhoto;
    if (orientation === 'landscape') {
      const idealRatio = preferPanoramic ? 1.9 : 1.5;
      const tolerance  = preferPanoramic ? 0.08 : 0.12;
      const scorePhoto = (p: PexelsPhoto) => {
        const ratio = p.width / p.height;
        if (ratio < 1.1) return 0; // skip near-square photos
        const ratioBonus = Math.max(0.2, 1 - Math.abs(ratio - idealRatio) * tolerance);
        return (p.width * p.height) * ratioBonus;
      };
      photo = data.photos.reduce((best, p) =>
        scorePhoto(p) > scorePhoto(best) ? p : best
      );
    } else if (orientation === 'square') {
      photo = data.photos.reduce((best, p) => {
        const diff = Math.abs(p.width / p.height - 1);
        const bestDiff = Math.abs(best.width / best.height - 1);
        return diff < bestDiff ? p : best;
      });
    } else {
      photo = data.photos[0];
    }

    // `large2x` (2560px wide) gives sharp images on retina/HiDPI displays
    return photo.src.large2x;
  } catch (error) {
    console.error(`Failed to fetch Pexels image for "${keyword}":`, error);
    return null;
  }
}

/**
 * Batch-fetch Pexels images for multiple keywords, deduplicating requests.
 * Returns a map of keyword → URL (or null if fetch failed).
 */
export async function batchFetchPexelsImages(
  keywords: Array<{ keyword: string; orientation?: ImageOrientation; color?: string; preferPanoramic?: boolean }>
): Promise<Record<string, string | null>> {
  const uniqueKeywords = [...new Map(keywords.map(k => [k.keyword, k])).values()];

  const results = await Promise.all(
    uniqueKeywords.map(async ({ keyword, orientation = 'landscape', color, preferPanoramic = false }) => {
      const url = await fetchPexelsImage(keyword, orientation, 'large', color, preferPanoramic);
      return [keyword, url] as [string, string | null];
    })
  );

  return Object.fromEntries(results);
}
