import { findSpamWords } from '@/lib/email/checklist';
import type { Finding } from './severity';

/**
 * Subject line and preview text checks. Everything here is a guideline, not a verdict: whether a message
 * reaches the inbox depends mostly on sender reputation and authentication, not on a single word.
 */

const length = (text: string) => [...text].length; // code points, so an emoji counts as one

const PLACEHOLDER = /\{\{[^}]*\}\}|\{%[^%]*%\}|\[\s*(?:first\s*name|name|fname|company)\s*\]|\*\|[A-Z0-9_:]+\|\*|%[A-Z0-9_]+%|\{\$[a-z_]+\}/i;
const EMOJI = /\p{Extended_Pictographic}/gu;

/** Words of 4+ letters written entirely in capitals (shorter ones, like "VIP" or "SMS", are usually acronyms). */
function shoutedWords(text: string): string[] {
  return text.match(/\b[A-Z]{4,}\b/g) ?? [];
}

export interface SubjectAnalysis {
  chars: number;
  words: number;
  findings: Finding[];
}

export function analyzeSubject(subject: string): SubjectAnalysis {
  const trimmed = subject.trim();
  const chars = length(trimmed);
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  if (!trimmed) return { chars, words, findings: [] };

  const findings: Finding[] = [];

  // Length. Phones and desktop inboxes cut at different points, so the advice is "front-load", not a magic number.
  if (chars <= 40) {
    findings.push({ id: 'length', severity: 'good', title: `${chars} characters: short`, detail: 'Short enough to be read in full in most inboxes, including on a phone.' });
  } else if (chars <= 60) {
    findings.push({ id: 'length', severity: 'info', title: `${chars} characters`, detail: 'Fine on desktop, but phones often cut a subject off at around 35 to 45 characters, so put the important words first.' });
  } else if (chars <= 80) {
    findings.push({ id: 'length', severity: 'warn', title: `${chars} characters: long`, detail: 'Desktop inboxes start cutting subjects off at roughly 60 to 70 characters, and phones much earlier. Move the main point to the start or trim it.' });
  } else {
    findings.push({ id: 'length', severity: 'warn', title: `${chars} characters: very long`, detail: 'Most of this will be hidden in the inbox list. Aim for one clear idea in the first few words.' });
  }

  // Capitals
  const shouted = shoutedWords(trimmed);
  const letters = trimmed.replace(/[^A-Za-z]/g, '');
  if (letters.length >= 6 && letters === letters.toUpperCase()) {
    findings.push({ id: 'caps', severity: 'warn', title: 'Entirely in capitals', detail: 'A subject in all caps reads as shouting and is a common marker of promotional spam. Sentence case usually performs and reads better.' });
  } else if (shouted.length > 0) {
    findings.push({ id: 'caps', severity: 'warn', title: `ALL-CAPS ${shouted.length === 1 ? 'word' : 'words'}: ${shouted.join(', ')}`, detail: 'Capitalised words can feel like shouting. One for emphasis is sometimes fine; several is a flag.' });
  }

  // Punctuation
  const exclamations = (trimmed.match(/!/g) ?? []).length;
  if (/[!?]{2,}|\${2,}/.test(trimmed) || exclamations > 1) {
    findings.push({ id: 'punctuation', severity: 'warn', title: 'Heavy punctuation', detail: 'Repeated !!, ?? or $$ looks like a promotional blast. One mark, or none, is plenty.' });
  }

  // Sales-sounding phrases (the same list the email checklist in the editor uses)
  const spammy = findSpamWords(trimmed);
  if (spammy.length > 0) {
    findings.push({
      id: 'spam-words',
      severity: 'info',
      title: `Sales-sounding ${spammy.length === 1 ? 'word' : 'words'}: ${spammy.join(', ')}`,
      detail: 'These do not send an email to spam by themselves; filters weigh sender reputation and authentication far more. But they can read as pushy, so use them only when they are literally true.',
    });
  }

  // Emoji
  const emojiCount = (trimmed.match(EMOJI) ?? []).length;
  if (emojiCount >= 3) {
    findings.push({ id: 'emoji', severity: 'warn', title: `${emojiCount} emojis`, detail: 'A few emojis can help a subject stand out, but this many tends to look like marketing noise.' });
  } else if (emojiCount > 0) {
    findings.push({ id: 'emoji', severity: 'info', title: `${emojiCount} emoji${emojiCount > 1 ? 's' : ''}`, detail: 'Emojis can stand out in a crowded inbox, but they render a little differently in each app. Check it on a phone.' });
  }

  // Fake reply / forward
  if (/^\s*(?:re|fwd?)\s*:/i.test(trimmed)) {
    findings.push({ id: 'fake-reply', severity: 'warn', title: 'Starts with Re: or Fwd:', detail: 'If this is not a real reply or forward, it is a misleading subject line, which CAN-SPAM prohibits and recipients notice.' });
  }

  // Unreplaced personalisation tags
  if (PLACEHOLDER.test(trimmed)) {
    findings.push({ id: 'placeholder', severity: 'warn', title: 'Looks like a merge tag', detail: 'That is fine in a template, but if this is what subscribers will see, the raw tag would show instead of a name. Send yourself a test first.' });
  }

  // Stray spaces
  if (subject !== subject.trim() || /\s{2,}/.test(trimmed)) {
    findings.push({ id: 'spaces', severity: 'info', title: 'Extra spaces', detail: 'Leading, trailing or doubled spaces are easy to miss and look careless. Trim them.' });
  }

  return { chars, words, findings };
}

export interface PreviewAnalysis {
  chars: number;
  findings: Finding[];
}

export function analyzePreview(preview: string, subject: string): PreviewAnalysis {
  const trimmed = preview.trim();
  const chars = length(trimmed);
  const findings: Finding[] = [];

  if (!trimmed) {
    findings.push({
      id: 'preview-empty',
      severity: 'warn',
      title: 'No preview text',
      detail: 'The inbox will show the first text it finds in the email instead, which is often "View in browser" or a navigation link. A short, specific line does more.',
    });
    return { chars, findings };
  }

  const normalizedSubject = subject.trim().toLowerCase();
  if (normalizedSubject && trimmed.toLowerCase().startsWith(normalizedSubject)) {
    findings.push({ id: 'preview-repeats', severity: 'warn', title: 'Repeats the subject', detail: 'The preview sits right next to the subject, so repeating it wastes the space. Use it to add the next piece of information.' });
  }

  if (chars < 40) {
    findings.push({ id: 'preview-length', severity: 'info', title: `${chars} characters: short`, detail: 'Inboxes will usually fill the rest of the line with other text from the email body, which may be less tidy than a longer preview you wrote yourself.' });
  } else if (chars <= 110) {
    findings.push({ id: 'preview-length', severity: 'good', title: `${chars} characters`, detail: 'A good length: enough to add to the subject, short enough to mostly show.' });
  } else {
    findings.push({ id: 'preview-length', severity: 'info', title: `${chars} characters: long`, detail: 'Many apps show roughly 40 to 140 characters of preview text depending on width, so the end of this will often be cut. Put the useful part first.' });
  }

  if (PLACEHOLDER.test(trimmed)) {
    findings.push({ id: 'preview-placeholder', severity: 'warn', title: 'Looks like a merge tag', detail: 'If this is what subscribers will see, the raw tag would show instead of a name.' });
  }

  return { chars, findings };
}

/** One line of the comparison table for an alternative subject line. */
export function summarizeAlternative(subject: string) {
  const { chars, words, findings } = analyzeSubject(subject);
  return {
    subject,
    chars,
    words,
    flags: findings.filter((f) => f.severity === 'warn' || f.severity === 'bad').map((f) => f.title),
    notes: findings.filter((f) => f.severity === 'info').length,
  };
}
