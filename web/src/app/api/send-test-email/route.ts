import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmailGeneration } from '@/lib/db/queries';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { emailId, toEmail } = body;

  if (!emailId || typeof emailId !== 'string') {
    return NextResponse.json({ error: 'Missing emailId' }, { status: 400 });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!toEmail || typeof toEmail !== 'string' || !emailRegex.test(toEmail)) {
    return NextResponse.json({ error: 'Invalid recipient email address' }, { status: 400 });
  }

  const generation = await getEmailGeneration(emailId, user.id);
  if (!generation) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  if (!generation.html_code) {
    return NextResponse.json({ error: 'Email has no HTML to send' }, { status: 400 });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Emlet <onboarding@resend.dev>';
  const subject = generation.subject_line || 'Test Email from Emlet';

  // Generate plain-text fallback by stripping HTML tags — critical for inbox placement
  const plainText = generation.html_code
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, '\n')
    .trim();

  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    subject: `Preview: ${subject}`,
    html: generation.html_code,
    text: plainText,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send email. Check your Resend API key.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, messageId: data?.id });
}
