/**
 * Deterministic, zero-cost quality/compliance checklist for a generated email.
 * Pure functions only — no network calls, no AI, runs instantly against data
 * already in the editor's React state.
 */

import type { EmailSection, GeneratedEmail } from '@/lib/ai/claude';
import { contrastRatio } from '@/lib/colors/contrast';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface CheckResult {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
}

export interface ChecklistCategory {
  name: string;
  checks: CheckResult[];
}

export interface ResolvedColors {
  bodyBg: string;
  bodyColor: string;
  primaryColor: string;
  secondaryColor: string;
}

// ─── Spam-trigger words (curated, not exhaustive) ──────────────────────────

const SPAM_TRIGGER_WORDS = [
  'free', 'act now', 'guaranteed', 'guarantee', 'click here', 'risk-free', 'risk free',
  '100% free', 'earn cash', 'earn money', 'make money', 'no obligation', 'no credit check',
  'limited time', 'buy now', 'buy direct', 'winner', 'congratulations', "you've been selected",
  'cash bonus', 'double your', 'cancel at any time', 'no catch', 'no fees', 'no strings attached',
  'urgent', 'act immediately', 'apply now', 'call now', 'once in a lifetime', 'as seen on',
  'miracle', 'increase sales', 'extra income', 'work from home', 'be your own boss',
  'get paid', 'get rich', 'lowest price', 'dear friend', "this isn't spam", 'not spam',
  'unsecured credit', 'credit card offers', 'eliminate debt', 'lower your mortgage', 'refinance',
  'weight loss', 'lose weight', '$$$', 'why pay more', '100% satisfied',
];

function findSpamWords(subject: string): string[] {
  const lower = subject.toLowerCase();
  return SPAM_TRIGGER_WORDS.filter((w) => {
    if (w.includes(' ') || /[^a-z0-9]/i.test(w)) return lower.includes(w);
    return new RegExp(`\\b${w}\\b`).test(lower);
  });
}

// ─── Section-walking helpers ────────────────────────────────────────────────

function allCtaUrls(sections: EmailSection[]): string[] {
  const urls: string[] = [];
  for (const s of sections) {
    if (s.buttonUrl) urls.push(s.buttonUrl);
    if (s.secondaryButtonUrl) urls.push(s.secondaryButtonUrl);
    if (s.columns) for (const c of s.columns) if (c.buttonUrl) urls.push(c.buttonUrl);
    if (s.plans) for (const p of s.plans) if (p.buttonUrl) urls.push(p.buttonUrl);
  }
  return urls;
}

function isDeadUrl(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '' || trimmed === '#') return true;
  return /example\.com|yourdomain/i.test(trimmed);
}

// ─── Category: Compliance ───────────────────────────────────────────────────

function buildComplianceChecks(sections: EmailSection[]): CheckResult[] {
  const footer = sections.find((s) => s.type === 'footer');
  const checks: CheckResult[] = [];

  checks.push(
    footer
      ? { id: 'unsubscribe', label: 'Unsubscribe link', status: 'pass', message: 'A footer with an opt-out link is present.' }
      : { id: 'unsubscribe', label: 'Unsubscribe link', status: 'fail', message: 'No footer section found — every commercial email needs a working unsubscribe mechanism (CAN-SPAM requirement). Add a Footer block.' }
  );

  const footerText = footer?.text || '';
  const hasAddressSignal = /\b\d{5}\b/.test(footerText) || /\b(st|street|ave|avenue|suite|ste|blvd|road|rd|po box)\b/i.test(footerText);
  checks.push(
    footer && hasAddressSignal
      ? { id: 'physical-address', label: 'Physical mailing address', status: 'pass', message: 'Footer text appears to include a mailing address.' }
      : { id: 'physical-address', label: 'Physical mailing address', status: 'warn', message: 'No physical mailing address detected in the footer. CAN-SPAM requires a valid postal address in every commercial email — add yours to the footer text.' }
  );

  return checks;
}

// ─── Category: Deliverability ───────────────────────────────────────────────

function buildDeliverabilityChecks(email: GeneratedEmail, sections: EmailSection[]): CheckResult[] {
  const checks: CheckResult[] = [];
  const subject = email.subject || '';
  const preview = email.previewText || '';

  if (!subject.trim()) {
    checks.push({ id: 'subject-length', label: 'Subject line length', status: 'fail', message: 'Subject line is empty.' });
  } else if (subject.length > 60) {
    checks.push({ id: 'subject-length', label: 'Subject line length', status: 'warn', message: `Subject is ${subject.length} characters — aim for under 60 (ideally under 50) so it doesn't get cut off on mobile.` });
  } else {
    checks.push({ id: 'subject-length', label: 'Subject line length', status: 'pass', message: `${subject.length} characters — good length.` });
  }

  const hits = subject.trim() ? findSpamWords(subject) : [];
  if (hits.length >= 2) {
    checks.push({ id: 'subject-spam-words', label: 'Spam-trigger words', status: 'fail', message: `Subject contains ${hits.length} spam-flagged phrases: "${hits.join('", "')}". Rewrite more naturally.` });
  } else if (hits.length === 1) {
    checks.push({ id: 'subject-spam-words', label: 'Spam-trigger words', status: 'warn', message: `Subject contains a spam-flagged phrase: "${hits[0]}". Consider rewording.` });
  } else {
    checks.push({ id: 'subject-spam-words', label: 'Spam-trigger words', status: 'pass', message: 'No common spam-trigger phrases detected.' });
  }

  const capsRun = /[A-Z]{4,}/.test(subject);
  const punctRun = /[!?]{2,}/.test(subject);
  if (capsRun || punctRun) {
    const parts = [capsRun && 'ALL-CAPS words', punctRun && 'repeated punctuation (!!! or ???)'].filter(Boolean);
    checks.push({ id: 'subject-formatting', label: 'Subject formatting', status: 'fail', message: `Subject uses ${parts.join(' and ')} — both are strong spam-filter signals.` });
  } else {
    checks.push({ id: 'subject-formatting', label: 'Subject formatting', status: 'pass', message: 'No all-caps runs or excessive punctuation.' });
  }

  if (!preview.trim()) {
    checks.push({ id: 'preview-text', label: 'Preview text', status: 'warn', message: 'No preview/preheader text set — inboxes will show a fallback snippet from the body instead.' });
  } else if (preview.trim().toLowerCase() === subject.trim().toLowerCase()) {
    checks.push({ id: 'preview-text', label: 'Preview text', status: 'warn', message: 'Preview text is identical to the subject line — use it to add complementary information instead.' });
  } else {
    checks.push({ id: 'preview-text', label: 'Preview text', status: 'pass', message: 'Preview text is set and distinct from the subject.' });
  }

  const distinctCtas = new Set(allCtaUrls(sections).map((u) => u.trim()).filter(Boolean));
  if (distinctCtas.size > 4) {
    checks.push({ id: 'cta-count', label: 'Call-to-action count', status: 'warn', message: `${distinctCtas.size} distinct CTA links found — too many competing asks can dilute clicks. Consider consolidating around one primary action.` });
  } else {
    checks.push({ id: 'cta-count', label: 'Call-to-action count', status: 'pass', message: `${distinctCtas.size} distinct CTA link${distinctCtas.size === 1 ? '' : 's'} — a focused ask.` });
  }

  const imageCount = sections.reduce((n, s) => n + (s.imageUrl ? 1 : 0) + (s.images?.length || 0) + (s.backgroundImageUrl ? 1 : 0), 0);
  const textSections = sections.filter((s) => (s.text && s.text.trim()) || (s.heading && s.heading.trim())).length;
  if (imageCount >= 4 && imageCount > textSections * 2) {
    checks.push({ id: 'image-text-balance', label: 'Image-to-text balance', status: 'warn', message: `${imageCount} images vs ${textSections} text-bearing sections — image-heavy, text-light emails can hurt deliverability and look lower-quality.` });
  } else {
    checks.push({ id: 'image-text-balance', label: 'Image-to-text balance', status: 'pass', message: `${imageCount} images across ${textSections} text-bearing sections — reasonable balance.` });
  }

  return checks;
}

// ─── Category: Accessibility ────────────────────────────────────────────────

function buildAccessibilityChecks(sections: EmailSection[], colors: ResolvedColors): CheckResult[] {
  const checks: CheckResult[] = [];

  let missingAlt = 0;
  let totalContentImages = 0;
  for (const s of sections) {
    if (s.imageUrl) {
      totalContentImages++;
      if (!s.imageAlt || !s.imageAlt.trim()) missingAlt++;
    }
    if (s.images) {
      for (const img of s.images) {
        totalContentImages++;
        if (!img.alt || !img.alt.trim()) missingAlt++;
      }
    }
  }
  checks.push(
    missingAlt > 0
      ? { id: 'image-alt-text', label: 'Image alt text', status: 'fail', message: `${missingAlt} of ${totalContentImages} content images are missing alt text — screen reader users won't know what they show.` }
      : { id: 'image-alt-text', label: 'Image alt text', status: 'pass', message: totalContentImages > 0 ? `All ${totalContentImages} content images have alt text.` : 'No content images to check.' }
  );

  let worst: { ratio: number; label: string } | null = null;
  for (const s of sections) {
    if (s.backgroundGradient || s.backgroundImageUrl) continue; // can't measure contrast against a gradient/photo background
    const bg = s.backgroundColor || colors.bodyBg;
    const fg = s.textColor || colors.bodyColor;
    const ratio = contrastRatio(bg, fg);
    if (ratio !== null && (worst === null || ratio < worst.ratio)) {
      worst = { ratio, label: s.heading?.trim() || s.type };
    }
  }
  if (worst) {
    if (worst.ratio < 3) {
      checks.push({ id: 'contrast', label: 'Text/background contrast', status: 'fail', message: `Lowest contrast is ${worst.ratio.toFixed(1)}:1 (in the "${worst.label}" section) — WCAG AA requires at least 4.5:1 for normal text. Text may be hard to read.` });
    } else if (worst.ratio < 4.5) {
      checks.push({ id: 'contrast', label: 'Text/background contrast', status: 'warn', message: `Lowest contrast is ${worst.ratio.toFixed(1)}:1 (in the "${worst.label}" section) — below the WCAG AA 4.5:1 target for normal text, though acceptable for large/bold text.` });
    } else {
      checks.push({ id: 'contrast', label: 'Text/background contrast', status: 'pass', message: `Lowest contrast ratio found is ${worst.ratio.toFixed(1)}:1 — meets WCAG AA.` });
    }
  } else {
    checks.push({ id: 'contrast', label: 'Text/background contrast', status: 'pass', message: 'No color pairs to check.' });
  }

  const dead = allCtaUrls(sections).filter(isDeadUrl);
  checks.push(
    dead.length > 0
      ? { id: 'dead-links', label: 'Placeholder / dead links', status: 'fail', message: `${dead.length} button link${dead.length === 1 ? '' : 's'} still point${dead.length === 1 ? 's' : ''} to a placeholder ("#" or an example domain) — update before sending.` }
      : { id: 'dead-links', label: 'Placeholder / dead links', status: 'pass', message: 'All button links point to a real destination.' }
  );

  return checks;
}

// ─── Category: Professional polish ──────────────────────────────────────────

function buildPolishChecks(htmlCode?: string | null): CheckResult[] {
  if (!htmlCode) {
    return [{ id: 'email-size', label: 'Email HTML size', status: 'pass', message: 'Save the email to check its rendered size.' }];
  }
  const bytes = new TextEncoder().encode(htmlCode).length;
  const kb = Math.round(bytes / 1024);
  return [
    bytes > 95_000
      ? { id: 'email-size', label: 'Email HTML size', status: 'warn', message: `~${kb}KB (based on the last saved version) — approaching Gmail's ~102KB clipping limit, which would hide your footer and unsubscribe link. Consider trimming sections/images.` }
      : { id: 'email-size', label: 'Email HTML size', status: 'pass', message: `~${kb}KB (based on the last saved version) — well under Gmail's clipping limit.` },
  ];
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export function runEmailChecklist(
  email: GeneratedEmail,
  colors: ResolvedColors,
  htmlCode?: string | null
): ChecklistCategory[] {
  const sections = email.sections || [];
  return [
    { name: 'Compliance', checks: buildComplianceChecks(sections) },
    { name: 'Deliverability', checks: buildDeliverabilityChecks(email, sections) },
    { name: 'Accessibility', checks: buildAccessibilityChecks(sections, colors) },
    { name: 'Professional polish', checks: buildPolishChecks(htmlCode) },
  ];
}
