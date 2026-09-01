import { NextRequest, NextResponse } from 'next/server';
import { fetchPexelsImage } from '@/lib/images/pexels';

/**
 * Dev-only helper for sourcing blog post images against the real,
 * relevance-ranked Pexels/Pixabay search this app already uses for email
 * generation — so authoring a post gets a real scored pick instead of
 * manually eyeballing Pexels' public search page. Never available outside
 * a local dev server.
 *
 * GET /api/dev/find-image?q=keyword&orientation=landscape&color=blue
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('q');
  if (!keyword) {
    return NextResponse.json({ error: 'Missing ?q=keyword' }, { status: 400 });
  }

  const orientation = (searchParams.get('orientation') as 'landscape' | 'portrait' | 'square') || 'landscape';
  const color = searchParams.get('color') || undefined;

  const url = await fetchPexelsImage(keyword, orientation, 'large', color);
  return NextResponse.json({ keyword, url });
}
