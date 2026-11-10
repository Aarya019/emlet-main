# Emlet colour system

The single source of truth is the `EMLET COLOUR SYSTEM` comment and the theme block at the top of
`web/src/app/globals.css`. This page explains the reasoning and the rules for new UI.

> **Status (2026-11-02): light mode is parked.** The site is dark only and the toggle is hidden. All the light-theme CSS
> below is still in `globals.css`, untouched. To bring it back, set `THEME_SWITCHING_ENABLED = true` in
> `web/src/lib/theme.ts`: that restores the light default, the toggle (header, dashboard sidebar and mobile bar) and
> reading the saved `emlet_theme` choice. Nothing else needs to change.

Two themes share one set of tokens:

- **Light** (default): a designed theme, not an inverted copy of dark. Its brand colour is **orange**.
- **Dark** (`data-theme="dark"`): the original neon-on-black look, with neon **cyan** as its brand colour. It must not change.

The two themes therefore have different brand hues on purpose. Everything that is "the brand colour" is a token
(`primary`, `grad-*`), so each theme supplies its own.

## Design decisions

| Decision | Why |
|---|---|
| **One deep orange primary** (`#bd3d0b`), not a vivid orange | A vivid orange (`#ea580c`) is only 3.4:1 on the page, too weak for text. A burnt orange keeps the hue and clears AA for text, fills and focus rings. |
| **Bright companions** (`-bright`) for tints, glows and soft borders | Contrast is not needed there, and the bright hue (`#f97316`) is what keeps light mode "electric" instead of rusty. |
| **Headline gradient golden orange > orange > red-orange** | A warm path that stays vivid on white. All three stops clear 3:1, the large-text minimum. The neon cyan > lime > magenta path turns muddy on white. |
| **Cool slate neutrals** (hue about 220deg) | Blue-grey is the complement of orange, so the accent pops and the greys feel intentional. |
| **White cards on a tinted page** (`#f8fafc`) | Elevation is a white surface, a faint border and a soft slate shadow, not grey tints. |
| **Deeper status colours** | Red, amber, yellow, green and emerald are remapped so they read at 4.5:1 as text. |
| **Primary-to-green gradients end in red-orange in light** | Burnt orange into green passes through olive. A CSS override in `globals.css` retargets `from-primary to-brand-lime/mint` to `to-grad-3` in light only. |
| **Light ignores the OS preference** | The product decision was "light by default"; the visitor's explicit choice is stored in `localStorage` as `emlet_theme`. |

A known trade-off: the status amber used for warnings (`#92400e`) sits close to the orange primary. When adding a
warning or error state, pair the colour with an icon or a label so it never relies on hue alone.

## Tokens

All are Tailwind colours, so opacity works (`bg-primary/10`, `border-brand-lime/25`).

| Token | Light | Dark | Use |
|---|---|---|---|
| page (`bg-black`) | `#f8fafc` | `#000000` | Page background |
| ink (`text-white`) | `#0b1220` | `#ffffff` | Text, plus `/NN` for hierarchy and faint lines |
| `surface` | `#ffffff` | `#0a0a0a` | Cards, panels, modals |
| `surface-raised` | `#f1f5f9` | `#1a1a1a` | Wells, nested panels, tooltips |
| `primary` | `#bd3d0b` | `#00ffff` | Text, solid fills, borders, focus rings |
| `primary-bright` | `#f97316` | `#00ffff` | Tints, glows, soft borders only |
| `on-primary` | `#ffffff` | `#000000` | Text on a `bg-primary` fill |
| `brand-lime` / `-bright` | `#15803d` / `#22c55e` | `#00ff00` | Success and positive accents |
| `brand-mint` / `-bright` | `#047857` / `#10b981` | `#00ff80` | Secondary positive accents |
| `brand-magenta` / `-bright` | `#a21caf` / `#d946ef` | `#ff00ff` | Highlight accents |
| `grad-1` / `grad-2` / `grad-3` | `#d06a05` / `#e04e0a` / `#d9341f` | `#00ffff` / `#00ff00` / `#ff00ff` | Headline gradient stops |
| `pure-white` / `pure-black` | `#ffffff` / `#000000` | same | Never flip (text on a coloured button, mock inbox, email preview) |

## Contrast (WCAG, light theme)

Measured against the page `#f8fafc` unless noted. Text needs 4.5:1 (3:1 if large, 24px or 18.7px bold).

| Pair | Ratio |
|---|---|
| Ink `#0b1220` on page | 17.9 |
| Primary `#bd3d0b` on page | 5.2 |
| Primary on a white card | 5.5 |
| White on primary fill | 5.5 |
| Primary on a tinted chip (10% bright over the page) | 4.75 |
| Inline code chip text `#ad3509` on the ink-tinted chip | 4.8 |
| White on red-orange `#d9341f` (end of button gradients) | 4.7 |
| Lime `#15803d` on page / white on lime | 4.8 / 5.0 |
| Mint `#047857` on page / white on mint | 5.2 / 5.5 |
| Magenta `#a21caf` on page / white on magenta | 6.0 / 6.3 |
| Red `#b91c1c` on page / white on red | 6.2 / 6.5 |
| Amber `#92400e` on page | 6.8 |
| Green `#166534` on page | 6.8 |
| Ink at 62% (the floor for copy) | 5.2 |
| Ink at 72% (secondary) | 7.4 |
| Ink at 86% (strong) | 12.3 |

Gradient stops are for large headline text only (3:1): `grad-1` is 3.5, `grad-2` is 3.8, `grad-3` is 4.5.
`primary-bright` (2.7:1) must never carry text. On a `primary-bright` fill, use dark ink (`#0b1220`, 6.7:1), never white.

The full-page audit (`contrast_audit.cjs`, 20 page states) leaves only decorative ghost numerals, a hidden tooltip and
disabled or fading controls below AA.

## Rules for new UI

1. Use the semantic classes: `bg-black` (page), `text-white` (ink), `border-white/10` (faint line),
   `bg-surface` / `bg-surface-raised` (panels). They are correct in both themes.
2. **Solid uses are the deep colour, opacity uses are `-bright`.** Text and fills: `text-primary`,
   `bg-primary`. Tints, glows, soft borders: `bg-primary-bright/10`, `shadow-primary-bright/30`.
3. Text on a coloured fill is `text-on-primary` (or `text-pure-white` on a red or other fixed fill).
4. A colour that must not flip uses `pure-white` / `pure-black`. Modal scrims use `bg-pure-black/NN`.
5. Headline gradients: `bg-gradient-to-r from-grad-1 via-grad-2 to-grad-3 bg-clip-text text-transparent`.
6. Button gradients: `from-primary to-brand-lime` (or `to-brand-mint`) is fine; light mode turns it into
   orange to red-orange automatically. Do not pair `primary` with another hue by hand.
7. Copy never goes below `text-white/30` in the class names, which resolves to the 62% floor in light.
   Anything fainter (`/5`, `/10`, `/20`) is decoration or icons only.
8. Never write a raw neon hex (`#00ffff`, `#00ff00`, `#ff00ff`) or a hard-coded dark colour in a component. Spinners,
   glows and overlays use `primary-bright` so they follow the theme (the generating overlay does).
9. A device mock-up that stays dark on a light page gets `data-theme="dark"` on its container.
10. Decorative sparkles get the class `theme-stars` (hidden in light). New pages with their own header get `ThemeToggle`.
11. Check every new page in both themes (set `localStorage emlet_theme` to `dark`).

Content colours are not theme colours and stay as they are: the "cyberpunk" email style swatch, the email preview itself,
the editor's block-type stripes, and the editor's always-dark selection outline.

## Do and don't

- Do keep one accent per view. Orange leads; lime, mint and magenta are for status and small highlights.
- Do put the strongest contrast where the user acts (primary button: white on `#bd3d0b`, 5.5:1).
- Don't use `primary-bright` or any `-bright` colour for text, or a status colour for decoration.
- Don't stack more than two card levels; nested cards step down to `surface-raised`.
- Don't add a new hue without adding both its light and dark values and checking contrast.
