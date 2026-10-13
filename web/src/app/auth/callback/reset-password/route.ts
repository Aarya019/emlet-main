import { exchangeCodeAndRedirect } from '@/lib/supabase/callback';

export async function GET(request: Request) {
  return exchangeCodeAndRedirect(request, '/reset-password');
}
