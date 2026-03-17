import { NextRequest, NextResponse } from 'next/server';

// GET /api/paddle/logs?secret=<PADDLE_API_KEY>&notification_id=ntf_xxx (optional)
// Fetches delivery attempt logs for Paddle notifications (debugging only)
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Protect with the Paddle API key as a simple secret (never expose in browser)
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (!secret || secret !== process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.PADDLE_API_KEY) {
    return NextResponse.json({ error: 'PADDLE_API_KEY not set' }, { status: 500 });
  }

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
