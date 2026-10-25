/**
 * Pure helpers for element style ids (see applyElementStyles in overrides.ts).
 * Kept free of React/@react-email imports so the editor can use them too.
 *
 * Ids: 'heading', 'text:0' (text fields the renderer tags), or 'button#0',
 * 'card#2', 'icon#1' (numbered per kind in document order). 'role:*' and
 * 'role#*' are wildcards that style every item of that role.
 */

/** 'card#2' -> 'card#*', 'text:1' -> 'text:*', 'heading' -> null. */
export function wildcardOf(id: string): string | null {
  const m = id.match(/^(.*)([:#])\d+$/);
  return m ? `${m[1]}${m[2]}*` : null;
}

const FIELD_LABELS: Record<string, string> = {
  heading: 'Heading',
  subheading: 'Subheading',
  intro: 'Intro',
  eyebrow: 'Label',
  text: 'Paragraph',
  quote: 'Quote',
  author: 'Author',
  authorTitle: 'Author title',
  tagline: 'Tagline',
  code: 'Coupon code',
  expiryText: 'Expiry note',
};

const ROLE_LABELS: Record<string, string> = {
  button: 'Button',
  link: 'Link',
  image: 'Image',
  icon: 'Icon',
  card: 'Card',
  iconBox: 'Icon box',
  badge: 'Label badge',
  panel: 'Panel',
  text: 'Text',
  heading: 'Heading',
};

/** Human label for the toolbar: 'text:1' -> 'Paragraph 2', 'card#0' -> 'Card 1'. */
export function describeElement(id: string): string {
  const m = id.match(/^(.*)([:#])(\d+|\*)$/);
  const role = m ? m[1] : id;
  const sep = m ? m[2] : '';
  const index = m ? m[3] : null;
  const label = (sep === ':' ? FIELD_LABELS[role] : ROLE_LABELS[role]) ?? FIELD_LABELS[role] ?? ROLE_LABELS[role] ?? role;
  if (index === null) return label;
  return index === '*' ? `All ${label.toLowerCase()}s` : `${label} ${Number(index) + 1}`;
}
