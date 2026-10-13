import { exchangeCodeAndRedirect } from '@/lib/supabase/callback';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') ?? '/dashboard';
  return exchangeCodeAndRedirect(request, next);
}
