import { colorOr, escapeHtml, safeUrl } from './html';

/**
 * Email signature builder. Output is a table with inline styles, which is what Gmail, Outlook and Apple Mail
 * all render reliably. Everything typed is escaped and every link is checked.
 */

export type SignatureLayout = 'classic' | 'stacked' | 'minimal';
export type SignatureFont = 'arial' | 'georgia' | 'verdana' | 'trebuchet' | 'tahoma';

export const FONT_STACKS: Record<SignatureFont, { label: string; css: string }> = {
  arial: { label: 'Arial (clean, safe everywhere)', css: "Arial, Helvetica, sans-serif" },
  georgia: { label: 'Georgia (classic serif)', css: "Georgia, 'Times New Roman', serif" },
  verdana: { label: 'Verdana (wide and readable)', css: 'Verdana, Geneva, sans-serif' },
  trebuchet: { label: 'Trebuchet MS (friendly)', css: "'Trebuchet MS', Helvetica, sans-serif" },
  tahoma: { label: 'Tahoma (compact)', css: 'Tahoma, Geneva, sans-serif' },
};

export interface SignatureInput {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  imageUrl: string;
  imageShape: 'round' | 'square';
  imageSize: number;
  linkedin: string;
  twitter: string;
  instagram: string;
  github: string;
  layout: SignatureLayout;
  font: SignatureFont;
  fontSize: number;
  accentColor: string;
  textColor: string;
  attribution: boolean;
}

export const DEFAULT_SIGNATURE: SignatureInput = {
  name: 'Alex Rivera',
  title: 'Owner',
  company: 'Groove Street Records',
  phone: '+1 503 555 0142',
  email: 'alex@example.com',
  website: 'example.com',
  address: '12 Example Lane, Portland, OR',
  imageUrl: '',
  imageShape: 'round',
  imageSize: 88,
  linkedin: '',
  twitter: '',
  instagram: '',
  github: '',
  layout: 'classic',
  font: 'arial',
  fontSize: 14,
  accentColor: '#c8452d',
  textColor: '#1f2937',
  attribution: true,
};

export const ATTRIBUTION_URL = 'https://www.emlet.app/?utm_source=signature&utm_medium=email_signature&utm_campaign=signature_generator';

/** tel: links want digits and a leading +; spaces and punctuation are for display only. */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/[^\d+]/g, '');
  return /\d{5,}/.test(digits) ? `tel:${digits}` : null;
}

/** "https://www.example.com/" shown as "example.com". */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');
}

interface Social {
  label: string;
  href: string;
}

function socials(input: SignatureInput): Social[] {
  const list: [string, string, string][] = [
    ['LinkedIn', input.linkedin, 'https://www.linkedin.com/in/'],
    ['X', input.twitter, 'https://x.com/'],
    ['Instagram', input.instagram, 'https://www.instagram.com/'],
    ['GitHub', input.github, 'https://github.com/'],
  ];
  const out: Social[] = [];
  for (const [label, raw, base] of list) {
    const value = raw.trim();
    if (!value) continue;
    // A bare handle ("alexrivera" or "@alexrivera") becomes a profile link; a full link is used as typed.
    const handle = value.replace(/^@/, '');
    const href = /^[A-Za-z0-9._-]+$/.test(handle) ? `${base}${handle}` : safeUrl(value);
    if (href) out.push({ label, href });
  }
  return out;
}

export interface SignatureOutput {
  html: string;
  text: string;
  warnings: string[];
}

export function buildSignature(input: SignatureInput): SignatureOutput {
  const accent = colorOr(input.accentColor, '#2563eb');
  const ink = colorOr(input.textColor, '#1f2937');
  const muted = '#6b7280';
  const size = Math.min(16, Math.max(12, Math.round(input.fontSize) || 14));
  const font = (FONT_STACKS[input.font] ?? FONT_STACKS.arial).css;
  const imgSize = Math.min(140, Math.max(48, Math.round(input.imageSize) || 88));
  const warnings: string[] = [];

  const name = input.name.trim();
  const title = input.title.trim();
  const company = input.company.trim();
  const address = input.address.trim();
  const phoneText = input.phone.trim();
  const phoneHref = phoneText ? telHref(phoneText) : null;
  const emailText = input.email.trim();
  const emailHref = emailText ? safeUrl(`mailto:${emailText}`) : null;
  const websiteHref = input.website.trim() ? safeUrl(input.website) : null;
  const imageHref = input.imageUrl.trim() ? safeUrl(input.imageUrl) : null;

  if (input.imageUrl.trim() && (!imageHref || !/^https?:\/\//i.test(imageHref))) {
    warnings.push('The image link was not a valid web address (it should start with https://), so it was left out.');
  } else if (imageHref && /^http:\/\//i.test(imageHref)) {
    warnings.push('The image link uses http. Many email apps block non-secure images, so use an https:// link.');
  }
  if (phoneText && !phoneHref) warnings.push('The phone number looks too short to be dialled, so it is shown without a link.');
  if (emailText && !emailHref) warnings.push('The email address was not valid, so it is shown without a link.');
  if (input.website.trim() && !websiteHref) warnings.push('The website was not a valid web address, so it was left out.');

  const linkStyle = `color:${accent};text-decoration:none;`;
  const label = (text: string) => `<span style="color:${accent};font-weight:bold;">${escapeHtml(text)}</span>`;
  const a = (href: string, text: string) => `<a href="${escapeHtml(href)}" style="${linkStyle}">${escapeHtml(text)}</a>`;

  // Contact lines
  const contact: { label: string; html: string; text: string }[] = [];
  if (phoneText) contact.push({ label: 'P', html: phoneHref ? a(phoneHref, phoneText) : escapeHtml(phoneText), text: phoneText });
  if (emailText) contact.push({ label: 'E', html: emailHref ? a(emailHref, emailText) : escapeHtml(emailText), text: emailText });
  if (websiteHref) contact.push({ label: 'W', html: a(websiteHref, displayUrl(websiteHref)), text: displayUrl(websiteHref) });

  const social = socials(input);

  // ── Details block (shared by every layout) ────────────────────────────────
  const role = [title, company].filter(Boolean);
  const nameHtml = name
    ? `<div style="font-size:${size + 3}px;line-height:${size + 8}px;font-weight:bold;color:${ink};">${escapeHtml(name)}</div>`
    : '';
  const roleHtml = role.length
    ? `<div style="font-size:${size}px;line-height:${size + 6}px;color:${muted};">${role.map(escapeHtml).join(' &middot; ')}</div>`
    : '';

  const contactHtml =
    contact.length === 0
      ? ''
      : input.layout === 'minimal'
        ? `<div style="font-size:${size - 1}px;line-height:${size + 6}px;color:${ink};margin-top:6px;">${contact.map((c) => c.html).join(' &nbsp;|&nbsp; ')}</div>`
        : `<div style="margin-top:8px;font-size:${size - 1}px;line-height:${size + 7}px;color:${ink};">${contact.map((c) => `${label(c.label)}&nbsp;&nbsp;${c.html}`).join('<br>')}</div>`;

  const addressHtml = address ? `<div style="margin-top:4px;font-size:${size - 2}px;line-height:${size + 4}px;color:${muted};">${escapeHtml(address)}</div>` : '';
  const socialHtml = social.length
    ? `<div style="margin-top:8px;font-size:${size - 2}px;line-height:${size + 4}px;">${social.map((s) => a(s.href, s.label)).join(` <span style="color:${muted};">&middot;</span> `)}</div>`
    : '';
  const attributionHtml = input.attribution
    ? `<div style="margin-top:10px;font-size:11px;line-height:14px;color:#9ca3af;">${`<a href="${escapeHtml(ATTRIBUTION_URL)}" style="color:#9ca3af;text-decoration:underline;">Made with Emlet</a>`}</div>`
    : '';

  const details = [nameHtml, roleHtml, contactHtml, addressHtml, socialHtml, attributionHtml].filter(Boolean).join('');

  // ── Image ─────────────────────────────────────────────────────────────────
  const radius = input.imageShape === 'round' ? `${Math.round(imgSize / 2)}px` : '4px';
  const imageHtml =
    imageHref && /^https?:\/\//i.test(imageHref)
      ? `<img src="${escapeHtml(imageHref)}" width="${imgSize}" height="${imgSize}" alt="${escapeHtml(name || input.company.trim() || '')}" style="display:block;width:${imgSize}px;height:${imgSize}px;border:0;border-radius:${radius};">`
      : '';

  const wrapperOpen = `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:${font};font-size:${size}px;line-height:${size + 6}px;color:${ink};border-collapse:collapse;">`;
  let html: string;

  if (input.layout === 'stacked') {
    html = [
      wrapperOpen,
      imageHtml ? `<tr><td style="padding-bottom:10px;">${imageHtml}</td></tr>` : '',
      `<tr><td style="padding-top:${imageHtml ? 10 : 0}px;${imageHtml ? `border-top:2px solid ${accent};` : ''}">${details}</td></tr>`,
      '</table>',
    ].filter(Boolean).join('\n');
  } else if (input.layout === 'minimal') {
    html = [wrapperOpen, `<tr><td>${details}</td></tr>`, '</table>'].join('\n');
  } else {
    html = [
      wrapperOpen,
      '<tr>',
      imageHtml ? `<td valign="top" style="padding-right:16px;">${imageHtml}</td>` : '',
      `<td valign="top" style="border-left:3px solid ${accent};padding-left:16px;">${details}</td>`,
      '</tr>',
      '</table>',
    ].filter(Boolean).join('\n');
  }

  // ── Plain text ────────────────────────────────────────────────────────────
  const textLines: string[] = [];
  if (name) textLines.push(name);
  if (role.length) textLines.push(role.join(', '));
  if (contact.length) textLines.push(contact.map((c) => `${c.label}: ${c.text}`).join('\n'));
  if (address) textLines.push(address);
  if (social.length) textLines.push(social.map((s) => `${s.label}: ${s.href}`).join('\n'));
  const text = textLines.join('\n');

  return { html, text, warnings };
}
