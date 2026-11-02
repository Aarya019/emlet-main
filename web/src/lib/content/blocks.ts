/**
 * A blog post body as typed data instead of hand-written JSX. Deliberately
 * minimal — covers what the hand-written posts already use (paragraphs,
 * h2 sections, bulleted lists with an optional bold lead-in phrase, inline
 * images, pull quotes). No markdown parser, no MDX — just an array a new
 * post file exports directly.
 *
 * Text in paragraphs, list items and quotes may contain links written as
 * `[anchor text](/blog/some-slug)` (internal) or `[anchor text](https://…)`
 * (external, opens in a new tab). Nothing else is parsed.
 */
export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: Array<{ text: string; bold?: string }> }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string };
