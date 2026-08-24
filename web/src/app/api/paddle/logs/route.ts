import { NextRequest, NextResponse } from 'next/server';

// GET /api/paddle/logs?notification_id=ntf_xxx (optional)
// Header: x-debug-secret: <PADDLE_LOGS_DEBUG_SECRET>
// Fetches delivery attempt logs for Paddle notifications (debugging only)
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Gated by its own dedicated secret (never the live Paddle API key — a leaked
  // debug URL/log line would otherwise hand out full Paddle account access).
  // Also read from a header, not a query param, so it doesn't end up in
  // browser history, proxy access logs, or Referer headers.
  const debugSecret = process.env.PADDLE_LOGS_DEBUG_SECRET;
  if (!debugSecret) {
    return NextResponse.json({ error: 'Not configured' }, { status: 404 });
  }
  const provided = req.headers.get('x-debug-secret');
  if (!provided || provided !== debugSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: 'PADDLE_API_KEY not set' }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const notificationId = searchParams.get('notification_id');

  const baseUrl = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';

  try {
    if (notificationId) {
      const res = await fetch(`${baseUrl}/notifications/${notificationId}/logs`, {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      const res = await fetch(`${baseUrl}/notifications?per_page=10`, {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error('Error fetching Paddle notification logs:', err);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
