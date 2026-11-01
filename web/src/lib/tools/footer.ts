import { colorOr, escapeHtml, isMergeTag, safeUrl } from './html';
import type { Finding } from './severity';

/**
 * Email footer builder. Produces an email-safe HTML footer (tables, inline styles) and a plain-text version,
 * plus a short compliance check. General information, not legal advice.
 */

export type Platform = 'generic' | 'mailchimp' | 'mailerlite' | 'brevo' | 'custom';

export const PLATFORMS: { id: Platform; label: string; unsubscribe: string; preferences: string }[] = [
  { id: 'generic', label: 'Not sure yet (placeholder)', unsubscribe: '{{unsubscribe_url}}', preferences: '' },
  { id: 'mailchimp', label: 'Mailchimp', unsubscribe: '*|UNSUB|*', preferences: '*|UPDATE_PROFILE|*' },
  { id: 'mailerlite', label: 'MailerLite', unsubscribe: '{$unsubscribe}', preferences: '' },
  { id: 'brevo', label: 'Brevo', unsubscribe: '{{ unsubscribe }}', preferences: '{{ update_profile }}' },
  { id: 'custom', label: 'Other: I will type the link', unsubscribe: '', preferences: '' },
];

export interface FooterInput {
  businessName: string;
  street: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  contactEmail: string;
  reason: string;
  introText: string;
  unsubscribeText: string;
  platform: Platform;
  customUnsubscribe: string;
  includePreferences: boolean;
  customPreferences: string;
  privacyUrl: string;
  align: 'left' | 'center';
  fontSize: number;
  textColor: string;
  linkColor: string;
  backgroundColor: string;
}

export const DEFAULT_FOOTER: FooterInput = {
  businessName: 'Groove Street Records',
  street: '12 Example Lane',
  city: 'Portland',
  region: 'OR',
  postal: '97201',
  country: 'United States',
  contactEmail: 'hello@example.com',
  reason: 'You are receiving this email because you signed up for updates from Groove Street Records.',
  introText: "Don't want these emails?",
  unsubscribeText: 'Unsubscribe',
  platform: 'generic',
  customUnsubscribe: '',
  includePreferences: false,
  customPreferences: '',
  privacyUrl: '',
  align: 'center',
  fontSize: 12,
  textColor: '#6b7280',
  linkColor: '#6b7280',
  backgroundColor: '#ffffff',
};

const platformOf = (id: Platform) => PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0];

export function resolveUnsubscribe(input: FooterInput): string {
  return input.platform === 'custom' ? input.customUnsubscribe.trim() : platformOf(input.platform).unsubscribe;
}

export function resolvePreferences(input: FooterInput): string {
  if (!input.includePreferences) return '';
  return input.platform === 'custom' || platformOf(input.platform).preferences === ''
    ? input.customPreferences.trim()
    : platformOf(input.platform).preferences;
}

/** Address as printed lines: street / "City, Region Postal" / Country. */
export function addressLines(input: FooterInput): string[] {
  const cityLine = [input.city.trim(), [input.region.trim(), input.postal.trim()].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  return [input.street.trim(), cityLine, input.country.trim()].filter(Boolean);
}

export interface FooterOutput {
  html: string;
  text: string;
  checks: Finding[];
}

export function buildFooter(input: FooterInput): FooterOutput {
  const size = Math.min(16, Math.max(11, Math.round(input.fontSize) || 12));
  const color = colorOr(input.textColor, '#6b7280');
  const link = colorOr(input.linkColor, '#6b7280');
  const bg = colorOr(input.backgroundColor, '#ffffff');
  const align = input.align === 'left' ? 'left' : 'center';
  const lineHeight = Math.round(size * 1.5);

  const unsubscribeHref = safeUrl(resolveUnsubscribe(input), { allowMergeTag: true });
  const preferencesHref = safeUrl(resolvePreferences(input), { allowMergeTag: true });
  const privacyHref = safeUrl(input.privacyUrl);
  const mailHref = input.contactEmail.trim() ? safeUrl(`mailto:${input.contactEmail.trim()}`) : null;

  const name = input.businessName.trim();
  const lines = addressLines(input);
  const reason = input.reason.trim();
  const intro = input.introText.trim();
  const unsubscribeLabel = input.unsubscribeText.trim() || 'Unsubscribe';

  const linkStyle = `color:${link};text-decoration:underline;`;
  const a = (href: string, label: string) => `<a href="${escapeHtml(href)}" style="${linkStyle}">${escapeHtml(label)}</a>`;
  const p = (inner: string, last = false) => `<p style="margin:0${last ? '' : ' 0 10px 0'};">${inner}</p>`;

  const blocks: string[] = [];
  if (reason) blocks.push(p(escapeHtml(reason)));
  if (name || lines.length > 0) {
    const nameHtml = name ? `<strong>${escapeHtml(name)}</strong>` : '';
    blocks.push(p([nameHtml, ...lines.map(escapeHtml)].filter(Boolean).join('<br>')));
  }
  if (mailHref) blocks.push(p(a(mailHref, input.contactEmail.trim())));

  const links: string[] = [];
  if (unsubscribeHref) links.push(a(unsubscribeHref, unsubscribeLabel));
  if (preferencesHref) links.push(a(preferencesHref, 'Manage preferences'));
  if (privacyHref) links.push(a(privacyHref, 'Privacy policy'));
  if (links.length > 0) {
    const prefix = intro && unsubscribeHref ? `${escapeHtml(intro)} ` : '';
    blocks.push(p(prefix + links.join(' &nbsp;&middot;&nbsp; '), true));
  }

  const html = [
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${bg};">`,
    '  <tr>',
    `    <td align="${align}" style="padding:24px 16px;">`,
    '      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">',
    '        <tr>',
    `          <td align="${align}" style="font-family:Arial,Helvetica,sans-serif;font-size:${size}px;line-height:${lineHeight}px;color:${color};text-align:${align};">`,
    ...blocks.map((b) => `            ${b}`),
    '          </td>',
    '        </tr>',
    '      </table>',
    '    </td>',
    '  </tr>',
    '</table>',
  ].join('\n');

  // Plain-text version: for the text/plain part of the email, where links appear as bare URLs.
  const textParts: string[] = [];
  if (reason) textParts.push(reason);
  const addressBlock = [name, ...lines].filter(Boolean).join('\n');
  if (addressBlock) textParts.push(addressBlock);
  if (input.contactEmail.trim()) textParts.push(input.contactEmail.trim());
  const textLinks: string[] = [];
  if (unsubscribeHref) textLinks.push(`${intro ? `${intro} ` : ''}${unsubscribeLabel}: ${unsubscribeHref}`);
  if (preferencesHref) textLinks.push(`Manage preferences: ${preferencesHref}`);
  if (privacyHref) textLinks.push(`Privacy policy: ${privacyHref}`);
  if (textLinks.length > 0) textParts.push(textLinks.join('\n'));
  const text = textParts.join('\n\n');

  return { html, text, checks: footerChecks(input, { unsubscribeHref, privacyHref }) };
}

function footerChecks(input: FooterInput, hrefs: { unsubscribeHref: string | null; privacyHref: string | null }): Finding[] {
  const checks: Finding[] = [];
  const hasAddress = Boolean(input.street.trim() && input.city.trim() && input.country.trim());

  checks.push(
    input.businessName.trim()
      ? { id: 'name', severity: 'good', title: 'Sender is identified', detail: 'Your business name is in the footer, so recipients can tell who is writing.' }
      : { id: 'name', severity: 'bad', title: 'Add your business name', detail: 'Every commercial email should clearly identify who sent it.' },
  );

  checks.push(
    hasAddress
      ? { id: 'address', severity: 'good', title: 'Postal address included', detail: 'CAN-SPAM requires a valid physical postal address in commercial email (a street address, a PO box, or a private mailbox). Canada and most other regions expect a mailing address too.' }
      : { id: 'address', severity: 'bad', title: 'Add a postal address', detail: 'CAN-SPAM requires a valid physical postal address in commercial email: a street address, a PO box, or a private mailbox. Street, city and country are needed here.' },
  );

  const unsub = resolveUnsubscribe(input);
  if (!hrefs.unsubscribeHref) {
    checks.push({ id: 'unsubscribe', severity: 'bad', title: 'Add an unsubscribe link', detail: 'A working, easy unsubscribe is required in commercial email, and mailbox providers check for it.' });
  } else if (input.platform === 'generic') {
    checks.push({ id: 'unsubscribe', severity: 'warn', title: 'Replace the unsubscribe placeholder', detail: `The footer uses ${unsub} as a stand-in. Choose your email platform above, or swap in its real unsubscribe tag, before you send.` });
  } else {
    checks.push({ id: 'unsubscribe', severity: 'good', title: 'Unsubscribe link included', detail: isMergeTag(unsub) ? 'Your email platform replaces this tag with a working link for each recipient. Send yourself a test to confirm it.' : 'Make sure the link works with one click and takes effect promptly (CAN-SPAM and CASL allow up to 10 business days at most).' });
  }

  checks.push(
    input.reason.trim()
      ? { id: 'reason', severity: 'good', title: 'Says why they are receiving it', detail: 'A one-line reminder cuts spam complaints and is expected under GDPR-style transparency rules.' }
      : { id: 'reason', severity: 'info', title: 'Consider a "why you are getting this" line', detail: 'A one-line reminder of how they signed up cuts spam complaints.' },
  );

  checks.push(
    input.contactEmail.trim()
      ? { id: 'contact', severity: 'good', title: 'Contact email included', detail: 'Canada\'s CASL expects contact details (phone, email or web address) alongside your mailing address.' }
      : { id: 'contact', severity: 'info', title: 'Consider adding a contact email', detail: 'Canada\'s CASL expects a phone number, email or web address in addition to your mailing address, and it helps people reach you instead of reporting spam.' },
  );

  checks.push(
    hrefs.privacyHref
      ? { id: 'privacy', severity: 'good', title: 'Privacy policy linked', detail: 'Linking your privacy policy supports GDPR and UK transparency requirements.' }
      : { id: 'privacy', severity: 'info', title: 'Consider linking your privacy policy', detail: 'If you email people in the EU or UK, linking to your privacy policy supports the transparency rules there.' },
  );

  return checks;
}
