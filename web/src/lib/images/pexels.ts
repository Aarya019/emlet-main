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
 * Search Pexels for a photo matching the keyword.
 * Returns a permanent CDN URL suitable for embedding in emails.
 */
export async function fetchPexelsImage(
  keyword: string,
  orientation: ImageOrientation = 'landscape',
  size: ImageSize = 'large'
): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY is not set. Skipping image fetch.');
    return null;
  }

  try {
    const params = new URLSearchParams({
      query: keyword,
      per_page: '3',   // 3 is enough for variety; less payload than 5
      page: '1',
      orientation,
      size,
    });

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

    // Pick a random photo from the results for variety
    const photo = data.photos[Math.floor(Math.random() * data.photos.length)];

    // `large` (1280px wide) is sufficient for email; `large2x` is overkill
    return photo.src.large;
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
  keywords: Array<{ keyword: string; orientation?: ImageOrientation }>
): Promise<Record<string, string | null>> {
  const uniqueKeywords = [...new Map(keywords.map(k => [k.keyword, k])).values()];

  const results = await Promise.all(
    uniqueKeywords.map(async ({ keyword, orientation = 'landscape' }) => {
      const url = await fetchPexelsImage(keyword, orientation);
      return [keyword, url] as [string, string | null];
    })
  );

  return Object.fromEntries(results);
}
