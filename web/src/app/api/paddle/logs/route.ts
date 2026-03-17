import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/paddle/logs?notification_id=ntf_xxx
// Fetches delivery logs for a Paddle notification (for debugging webhooks)
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Auth-gate: only signed-in users can call this
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
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
      // Fetch logs for a specific notification
      const res = await fetch(`${baseUrl}/notifications/${notificationId}/logs`, {
        headers: {
          Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      return NextResponse.json(data);
    } else {
      // List recent notifications
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
