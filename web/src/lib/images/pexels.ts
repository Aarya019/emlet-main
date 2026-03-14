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
 * and a Pexels-accepted color name to filter results by palette.
 * Pexels accepted color names: red orange yellow green turquoise blue violet pink brown black gray white
 */
export const styleImageConfig: Record<string, { modifier: string; color: string }> = {
  minimalist:  { modifier: 'minimal clean',       color: 'white'     },
  editorial:   { modifier: 'editorial magazine',   color: 'gray'      },
  retro:       { modifier: 'vintage warm',         color: 'orange'    },
  brutalist:   { modifier: 'bold graphic',         color: 'black'     },
  cyberpunk:   { modifier: 'dark neon futuristic', color: 'blue'      },
  handwritten: { modifier: 'cozy lifestyle',       color: 'gray'      },
  bauhaus:     { modifier: 'geometric modern',     color: 'red'       },
};

/**
 * Search Pexels for a photo matching the keyword.
 * Returns a permanent CDN URL suitable for embedding in emails.
 */
export async function fetchPexelsImage(
  keyword: string,
  orientation: ImageOrientation = 'landscape',
  size: ImageSize = 'large',
  color?: string,
): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('PEXELS_API_KEY is not set. Skipping image fetch.');
    return null;
  }

  try {
    const params = new URLSearchParams({
      query: keyword,
      per_page: '5',   // fetch 5 so we can pick best aspect ratio
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

    // For landscape/hero sections, pick the photo with the widest aspect ratio.
    // For square/portrait, pick the one closest to 1:1. Falls back to first.
    let photo: PexelsPhoto;
    if (orientation === 'landscape') {
      photo = data.photos.reduce((best, p) =>
        p.width / p.height > best.width / best.height ? p : best
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
  keywords: Array<{ keyword: string; orientation?: ImageOrientation; color?: string }>
): Promise<Record<string, string | null>> {
  const uniqueKeywords = [...new Map(keywords.map(k => [k.keyword, k])).values()];

  const results = await Promise.all(
    uniqueKeywords.map(async ({ keyword, orientation = 'landscape', color }) => {
      const url = await fetchPexelsImage(keyword, orientation, 'large', color);
      return [keyword, url] as [string, string | null];
    })
  );

  return Object.fromEntries(results);
}
