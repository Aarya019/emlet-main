import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EmailEditor from '@/components/EmailEditor';

export default async function EmailEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;

  return <EmailEditor emailId={id} />;
}
