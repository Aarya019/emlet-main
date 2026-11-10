import type { Finding } from './severity';

/**
 * Static checks for email HTML: the things that most often break in Gmail and Outlook. It reads the markup
 * as text (nothing is executed or fetched), so it can flag risks but cannot render each client. Treat it as
 * a checklist, and still send yourself a test.
 */

export interface CheckFinding extends Finding {
  /** Which clients are affected, in plain words. */
  clients: string;
  fix: string;
  /** How many places in the HTML triggered it, when that is useful to show. */
  count?: number;
}

export interface CheckResult {
  findings: CheckFinding[];
  /** Titles of checks that ran and found nothing wrong. */
  passed: string[];
  stats: { bytes: number; images: number; links: number; tables: number };
}

const GMAIL_CLIP_BYTES = 102 * 1024;

const count = (text: string, re: RegExp) => (text.match(re) ?? []).length;

/** Style attributes written by many tools use entities for quotes (font-family:&quot;Inter&quot;), which must be read as quotes. */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&');
}

/** Remove the content of the (declaration-level) @media / @font-face style blocks, so what is left are plain rules. */
function plainRules(css: string): string {
  let out = css.replace(/\/\*[\s\S]*?\*\//g, '');
  for (let i = 0; i < 4; i++) {
    out = out.replace(/@(?:media|supports|font-face|keyframes|-webkit-keyframes)[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/gi, '');
  }
  return out;
}

export function checkEmailHtml(html: string): CheckResult {
  const findings: CheckFinding[] = [];
  const passed: string[] = [];
  const bytes = new TextEncoder().encode(html).length;

  const hasMso = /<!--\[if[^\]]*mso/i.test(html);
  // Look at the markup the way a client does: comments (including Outlook conditionals) are not content.
  const scan = html.replace(/<!--[\s\S]*?-->/g, '');
  const styleBlocks = [...scan.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
  const inlineStyles = [...scan.matchAll(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map((m) => decodeEntities(m[1] ?? m[2] ?? ''));
  const css = [...styleBlocks, ...inlineStyles].join('\n');
  const imgTags = scan.match(/<img\b[^>]*>/gi) ?? [];
  const tableTags = scan.match(/<table\b[^>]*>/gi) ?? [];
  const hrefs = [...scan.matchAll(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map((m) => (m[1] ?? m[2] ?? '').trim());
  const bodyText = scan
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const add = (f: Omit<CheckFinding, 'id'> & { id: string }) => findings.push(f);

  if (!html.trim()) return { findings, passed, stats: { bytes: 0, images: 0, links: 0, tables: 0 } };

  // ── Size ──────────────────────────────────────────────────────────────────
  if (bytes > GMAIL_CLIP_BYTES) {
    add({ id: 'size', severity: 'bad', title: `${Math.round(bytes / 1024)} KB: Gmail will clip this`, clients: 'Gmail', detail: 'Gmail cuts off messages larger than about 102 KB and hides the rest behind "View entire message", which can hide your footer and unsubscribe link.', fix: 'Remove unused CSS and repeated markup, shorten the content, and avoid pasting huge inline styles. Images do not count; the HTML does.' });
  } else if (bytes > 80 * 1024) {
    add({ id: 'size', severity: 'warn', title: `${Math.round(bytes / 1024)} KB: close to Gmail's clipping limit`, clients: 'Gmail', detail: 'Gmail clips messages larger than about 102 KB. Inlining CSS makes the HTML bigger, so you may cross the line.', fix: 'Trim unused CSS and markup to leave some room.' });
  } else {
    passed.push('Size is under Gmail’s clipping limit');
  }

  // ── Things that are stripped or blocked outright ──────────────────────────
  const blocked: string[] = [];
  if (/<script\b/i.test(scan)) blocked.push('script');
  if (/<(?:iframe|object|embed|canvas)\b/i.test(scan)) blocked.push('iframe, object or embed');
  if (blocked.length > 0) {
    add({ id: 'blocked-tags', severity: 'bad', title: `Uses ${blocked.join(' and ')}`, clients: 'Gmail, Outlook, Apple Mail and almost every other client', detail: 'JavaScript and embedded content are removed or blocked in email. Anything that depends on them will not work.', fix: 'Link to a web page instead, or use an image with a link.' });
  } else {
    passed.push('No scripts, iframes or embeds');
  }

  if (/<(?:form|input|select|textarea|button)\b/i.test(scan)) {
    add({ id: 'forms', severity: 'warn', title: 'Contains a form or form fields', clients: 'Gmail, Outlook and many others', detail: 'Forms are stripped or do not submit in most email clients.', fix: 'Replace it with a button that links to a page containing the form.' });
  } else {
    passed.push('No form fields');
  }

  if (/<(?:video|audio)\b/i.test(scan)) {
    add({ id: 'media', severity: 'warn', title: 'Uses HTML video or audio', clients: 'Gmail, Outlook and most others', detail: 'Only a few clients play embedded media. Everywhere else the fallback content shows.', fix: 'Use a screenshot or GIF that links to the video, and make sure the fallback is good.' });
  }

  if (/<svg\b/i.test(scan) || /<img\b[^>]*\bsrc\s*=\s*["'][^"']*\.svg(?:[?#][^"']*)?["']/i.test(scan)) {
    add({ id: 'svg', severity: 'warn', title: 'Uses SVG', clients: 'Gmail, Outlook for Windows', detail: 'Inline SVG and SVG images are not displayed in Gmail or Outlook.', fix: 'Export PNG or JPG versions (with an alt text) and use those.' });
  } else {
    passed.push('No SVG');
  }

  if (/<link\b[^>]*\brel\s*=\s*["']?stylesheet/i.test(scan) && /<link\b(?![^>]*fonts\.googleapis)[^>]*\brel\s*=\s*["']?stylesheet/i.test(scan)) {
    add({ id: 'external-css', severity: 'bad', title: 'Links to an external stylesheet', clients: 'Gmail, Outlook and most other clients', detail: 'Linked stylesheets are ignored by almost every email client, so the email will arrive unstyled.', fix: 'Put the CSS in a <style> block and inline it (the Inline CSS button below does this).' });
  }

  if (hrefs.some((h) => /^\s*javascript:/i.test(h))) {
    add({ id: 'js-links', severity: 'bad', title: 'A link uses javascript:', clients: 'Every client', detail: 'javascript: links are blocked, and they can get the whole message flagged as unsafe.', fix: 'Use a normal https:// link.' });
  }

  // ── Layout and CSS support ───────────────────────────────────────────────
  if (/display\s*:\s*(?:inline-)?(?:flex|grid)\b|\bflex-(?:direction|wrap|grow)\s*:|\bgrid-template/i.test(css)) {
    add({ id: 'flex-grid', severity: 'warn', title: 'Uses flexbox or grid', clients: 'Outlook for Windows, and some older apps', detail: 'Outlook for Windows renders email with Word’s engine, which ignores flexbox and grid. The columns will stack or collapse.', fix: 'Build the layout with nested tables, or treat flex as an enhancement on top of a table layout that already works.' });
  } else {
    passed.push('No flexbox or grid');
  }

  if (/position\s*:\s*(?:absolute|fixed|sticky)/i.test(css)) {
    add({ id: 'position', severity: 'warn', title: 'Uses absolute, fixed or sticky positioning', clients: 'Gmail, Outlook for Windows and others', detail: 'Positioned elements are unreliable or ignored in most email clients and can overlap other content.', fix: 'Use table cells and padding to place things.' });
  }

  if (/\bfloat\s*:\s*(?:left|right)/i.test(css)) {
    add({ id: 'float', severity: 'info', title: 'Uses float', clients: 'Outlook for Windows', detail: 'Floats behave inconsistently in Outlook for Windows.', fix: 'Use table columns, or the align attribute on images.' });
  }

  if (/background(?:-image)?\s*:[^;}"']*url\(/i.test(css) || /<(?:table|td|tr|body)\b[^>]*\bbackground\s*=/i.test(scan)) {
    add({ id: 'background-image', severity: hasMso ? 'info' : 'warn', title: 'Uses a background image', clients: 'Outlook for Windows', detail: hasMso ? 'Outlook for Windows ignores CSS background images unless there is VML. You have Outlook conditionals in the file, so check they cover it.' : 'Outlook for Windows ignores CSS background images unless you add VML, so the area will show only its background colour.', fix: 'Always set a background colour that works on its own, keep text readable without the image, and add a VML fallback if the image matters.' });
  } else {
    passed.push('No CSS background images');
  }

  if (/var\(\s*--|calc\(/i.test(css)) {
    add({ id: 'css-vars', severity: 'warn', title: 'Uses CSS variables or calc()', clients: 'Gmail, Outlook for Windows and others', detail: 'CSS variables and calc() have patchy or no support in major email clients, so the values may be dropped.', fix: 'Write the real values (hex colours, pixel sizes) directly.' });
  }

  // A @font-face block names the font it defines (no fallback list belongs there), so leave those out.
  const fontFamilies = [...css.replace(/@font-face\s*\{[^}]*\}/gi, '').matchAll(/font-family\s*:\s*([^;}"]+)/gi)].map((m) => m[1].trim());
  const usesWebFonts = /@font-face|@import\s+url|<link\b[^>]*fonts\.googleapis/i.test(css + scan);
  if (usesWebFonts) {
    add({ id: 'web-fonts', severity: 'info', title: 'Uses web fonts', clients: 'Gmail, Outlook and some others', detail: 'Web fonts show in some apps (such as Apple Mail and iOS Mail) and fall back to another font in others, so the email will not look identical everywhere.', fix: 'Choose a fallback font that looks similar and list it after your web font.' });
  }
  if (fontFamilies.some((f) => !f.includes(','))) {
    add({ id: 'font-fallback', severity: 'info', title: 'A font has no fallback', clients: 'Any client without that font', detail: 'A font-family with only one font falls back to the client’s default (often a serif) if that font is missing.', fix: 'Add a fallback list, such as Arial, Helvetica, sans-serif.' });
  }

  // <style> blocks that hold ordinary rules (not only @media / @font-face)
  const plain = plainRules(styleBlocks.join('\n').slice(0, 400_000));
  if (/\{[^}]*\}/.test(plain)) {
    add({ id: 'style-blocks', severity: 'warn', title: 'Styles are in a <style> block, not on the elements', clients: 'Some clients and routes, such as Gmail with non-Google addresses', detail: 'Most modern clients read <style> blocks, but a few drop them (and forwarding can too). Anything you depend on should also be inlined.', fix: 'Use the Inline CSS button below. Media queries and hover rules stay in the <style> block, which is correct.' });
  } else if (styleBlocks.length > 0 || inlineStyles.length > 0) {
    passed.push('Styles are inlined on the elements');
  }

  // Structure
  const tableCount = tableTags.length;
  const divCount = count(scan, /<div\b/gi);
  if (tableCount === 0 && divCount > 3) {
    add({ id: 'div-layout', severity: 'warn', title: 'Layout is made of divs, not tables', clients: 'Outlook for Windows', detail: 'Outlook for Windows uses Word to render email and handles table layouts far more reliably than div layouts, where widths, spacing and columns often break.', fix: 'Rebuild the structure with tables (role="presentation", cellpadding and cellspacing at 0) and keep divs for small details.' });
  } else if (tableCount > 0) {
    passed.push('Layout uses tables');
  }

  const noRole = tableTags.filter((t) => !/\brole\s*=\s*["']presentation["']/i.test(t)).length;
  if (tableCount > 0 && noRole > 0) {
    add({ id: 'table-role', severity: 'info', title: 'Layout tables are not marked role="presentation"', clients: 'Screen readers', detail: 'Without role="presentation", screen readers may announce layout tables as data tables, row by row.', fix: 'Add role="presentation" to tables that are only used for layout.', count: noRole });
  }

  const wide = [...scan.matchAll(/<(?:table|td)\b[^>]*\bwidth\s*=\s*["']?(\d{3,4})(?!%)/gi)].map((m) => Number(m[1])).concat([...css.matchAll(/(?:^|[;{"\s])width\s*:\s*(\d{3,4})px/gi)].map((m) => Number(m[1])));
  if (wide.some((w) => w > 700)) {
    add({ id: 'fixed-width', severity: 'warn', title: 'A fixed width is wider than 700px', clients: 'Phones and narrow windows', detail: 'Emails wider than about 600 to 700px force sideways scrolling or shrink on phones.', fix: 'Keep the main container at 600px, with max-width for flexibility.' });
  }

  if (!/@media/i.test(css)) {
    add({ id: 'no-media', severity: 'info', title: 'No responsive (media query) rules', clients: 'Phones', detail: 'Without media queries the email cannot rearrange itself on a phone. That is fine for a single-column layout of 600px or less, but columns will stay side by side.', fix: 'Keep it to one column, or add a @media (max-width: 600px) block to stack columns.' });
  }

  // Document basics
  const basics: string[] = [];
  if (!/<!doctype/i.test(html)) basics.push('a doctype');
  if (!/<html\b[^>]*\blang\s*=/i.test(scan)) basics.push('a lang attribute on <html>');
  if (!/<title\b/i.test(scan)) basics.push('a <title>');
  if (basics.length > 0) {
    add({ id: 'doc-basics', severity: 'info', title: `Missing ${basics.join(', ')}`, clients: 'Screen readers, some webmail', detail: 'These help clients render consistently and let screen readers announce the language and title.', fix: 'Start with <!DOCTYPE html>, <html lang="en"> and a short <title>.' });
  } else {
    passed.push('Doctype, language and title are set');
  }
  if (!/<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(scan)) {
    add({ id: 'viewport', severity: 'warn', title: 'No viewport meta tag', clients: 'Phones', detail: 'Without it, some mobile apps render the email at desktop width and shrink it.', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> in the head.' });
  } else {
    passed.push('Viewport meta tag is present');
  }
  if (!/<meta\b[^>]*(?:charset\s*=|http-equiv\s*=\s*["']content-type)/i.test(scan)) {
    add({ id: 'charset', severity: 'info', title: 'No character set declared', clients: 'Some clients', detail: 'Without a declared character set, accented letters, quotes and symbols can show up as garbage characters.', fix: 'Add <meta charset="utf-8"> in the head.' });
  }
  if (!/color-scheme|prefers-color-scheme/i.test(scan)) {
    add({ id: 'dark-mode', severity: 'info', title: 'No dark-mode handling', clients: 'Apple Mail, Outlook, Gmail app', detail: 'Some apps invert or recolour emails in dark mode. Without any dark-mode styles, logos with white backgrounds and low-contrast text can look wrong.', fix: 'Add <meta name="color-scheme" content="light dark"> and test with dark mode on. Our dark-mode guide covers what breaks.' });
  }

  // Images
  const noAlt = imgTags.filter((t) => !/\balt\s*=/i.test(t)).length;
  if (noAlt > 0) {
    add({ id: 'img-alt', severity: 'warn', title: `${noAlt} ${noAlt === 1 ? 'image has' : 'images have'} no alt attribute`, clients: 'Blocked-image views, screen readers', detail: 'Many people see emails with images off, and screen readers read the alt text. Without it they get nothing, or the file name.', fix: 'Add a short, meaningful alt to each image, and alt="" for purely decorative ones.', count: noAlt });
  } else if (imgTags.length > 0) {
    passed.push('Every image has an alt attribute');
  }
  const noSize = imgTags.filter((t) => !/\bwidth\s*=/i.test(t)).length;
  if (noSize > 0) {
    add({ id: 'img-width', severity: 'info', title: `${noSize} ${noSize === 1 ? 'image has' : 'images have'} no width attribute`, clients: 'Outlook for Windows', detail: 'Outlook for Windows may show an image at its full pixel size when there is no width attribute, which can break the layout.', fix: 'Add width (and height) attributes in pixels to each image.', count: noSize });
  }
  if (imgTags.length > 0 && bodyText.length < 60) {
    add({ id: 'image-only', severity: 'warn', title: 'Almost no text, mostly images', clients: 'Blocked-image views, spam filters, screen readers', detail: 'An email that is only images shows nothing when images are blocked and is a common spam signal. It is also unreadable to screen readers.', fix: 'Keep the key message, offer and button as live text.' });
  }

  // Links
  const placeholderLinks = hrefs.filter((h) => h === '' || h === '#' || /example\.(?:com|org)|your-?(?:domain|site|company)/i.test(h)).length;
  if (placeholderLinks > 0) {
    add({ id: 'placeholder-links', severity: 'warn', title: `${placeholderLinks} placeholder ${placeholderLinks === 1 ? 'link' : 'links'}`, clients: 'Every client', detail: 'Links to "#", empty links, or example.com go nowhere for the reader.', fix: 'Replace each with the real destination before sending.', count: placeholderLinks });
  } else if (hrefs.length > 0) {
    passed.push('No placeholder links');
  }
  if (!/unsubscribe|opt[- ]?out|manage (?:your )?preferences|\*\|UNSUB\|\*|\{\{\s*unsubscribe|\{\$unsubscribe|%unsub/i.test(scan)) {
    add({ id: 'unsubscribe', severity: 'warn', title: 'No unsubscribe link found', clients: 'Gmail, Yahoo and legal requirements', detail: 'Marketing email needs a working unsubscribe link, and mailbox providers look for one. (Transactional emails such as receipts and password resets do not need it.)', fix: 'Add an unsubscribe link or your email platform’s unsubscribe tag. Our footer generator builds one.' });
  } else {
    passed.push('An unsubscribe link or tag is present');
  }

  const order: Record<string, number> = { bad: 0, warn: 1, info: 2, good: 3 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  return { findings, passed, stats: { bytes, images: imgTags.length, links: hrefs.length, tables: tableCount } };
}

/** A deliberately flawed email, so people can see what the checker finds. */
export const SAMPLE_BROKEN_EMAIL = `<html>
<head>
<style>
  @font-face { font-family: 'Brand Sans'; src: url(https://example.com/brand.woff2); }
  .wrap { max-width: 600px; margin: 0 auto; font-family: 'Brand Sans'; color: #222; }
  .row { display: flex; gap: 16px; }
  .hero { background-image: url(https://example.com/hero.jpg); padding: 40px 24px; color: #fff; }
  .col { flex: 1; padding: 12px; }
  a.button { background: #c8452d; color: #ffffff; padding: 12px 20px; text-decoration: none; display: inline-block; }
  @media (max-width: 480px) { .row { display: block; } }
</style>
</head>
<body>
<div class="wrap">
  <div class="hero">
    <h1>The Sunday drop</h1>
    <p>12 new arrivals and 3 rare pressings.</p>
    <a class="button" href="#">See what's new</a>
  </div>
  <div class="row">
    <div class="col"><img src="https://example.com/a.jpg"><p>New arrivals</p></div>
    <div class="col"><img src="https://example.com/b.jpg"><p>Rare pressings</p></div>
  </div>
  <svg width="24" height="24"><circle cx="12" cy="12" r="10" fill="#c8452d"/></svg>
</div>
</body>
</html>`;
