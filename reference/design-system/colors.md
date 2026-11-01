# Emlet colour system

The single source of truth is the `EMLET COLOUR SYSTEM` comment and the theme block at the top of
`web/src/app/globals.css`. This page explains the reasoning and the rules for new UI.

Two themes share one set of tokens:

- **Light** (default): a designed theme, not an inverted copy of dark.
- **Dark** (`data-theme="dark"`): the original neon-on-black look. It must not change.

## Design decisions

| Decision | Why |
|---|---|
| **One deep teal primary** (`#0c6a82`), not neon cyan | Neon cyan on white is 1.3:1, unreadable. This teal keeps the brand hue and clears AA for text, fills and focus rings. |
| **Bright companions** (`-bright`) for tints, glows and soft borders | Contrast is not needed there, and bright hues are what keep light mode "electric" instead of grey and corporate. |
| **Headline gradient teal > indigo > fuchsia** | A smooth walk around the cool side of the wheel, echoing the logo. The neon cyan > lime > magenta path turns muddy green-brown in the middle on white. |
| **Cool slate neutrals** (hue about 220deg) | Greys with a hint of blue sit comfortably next to teal. Pure greys look unconsidered beside it. |
| **White cards on a tinted page** (`#f8fafc`) | Light themes show elevation with a white surface, a faint border and a soft slate shadow, not with grey tints. |
| **Deeper status colours** | Red, amber, yellow, green and emerald are remapped so they read at 4.5:1 as text. |
| **Light ignores the OS preference** | The product decision was "light by default"; the visitor's explicit choice is stored in `localStorage` as `emlet_theme`. |

## Tokens

All are Tailwind colours, so opacity works (`bg-primary/10`, `border-brand-lime/25`).

| Token | Light | Dark | Use |
|---|---|---|---|
| page (`bg-black`) | `#f8fafc` | `#000000` | Page background |
| ink (`text-white`) | `#0b1220` | `#ffffff` | Text, plus `/NN` for hierarchy and faint lines |
| `surface` | `#ffffff` | `#0a0a0a` | Cards, panels, modals |
| `surface-raised` | `#f1f5f9` | `#1a1a1a` | Wells, nested panels, tooltips |
| `primary` | `#0c6a82` | `#00ffff` | Text, solid fills, borders, focus rings |
| `primary-bright` | `#06b6d4` | `#00ffff` | Tints, glows, soft borders only |
| `on-primary` | `#ffffff` | `#000000` | Text on a `bg-primary` fill |
| `brand-lime` / `-bright` | `#15803d` / `#22c55e` | `#00ff00` | Success and positive accents |
| `brand-mint` / `-bright` | `#047857` / `#10b981` | `#00ff80` | Secondary positive accents |
| `brand-magenta` / `-bright` | `#a21caf` / `#d946ef` | `#ff00ff` | Highlight accents |
| `grad-1` / `grad-2` / `grad-3` | `#0891b2` / `#4f46e5` / `#c026d3` | `#00ffff` / `#00ff00` / `#ff00ff` | Headline gradient stops |
| `pure-white` / `pure-black` | `#ffffff` / `#000000` | same | Never flip (text on a coloured button, mock inbox, email preview) |

## Contrast (WCAG, light theme)

Measured against the page `#f8fafc` unless noted. Text needs 4.5:1 (3:1 if large, 24px or 18.7px bold).

| Pair | Ratio |
|---|---|
| Ink `#0b1220` on page | 17.9 |
| Primary `#0c6a82` on page | 5.9 |
| White on primary fill | 6.2 |
| Primary on a tinted chip | 4.8 |
| Lime `#15803d` on page / white on lime | 4.8 / 5.0 |
| Mint `#047857` on page / white on mint | 5.2 / 5.5 |
| Magenta `#a21caf` on page / white on magenta | 6.0 / 6.3 |
| Red `#b91c1c` on page / white on red | 6.2 / 6.5 |
| Amber `#92400e` on page | 6.8 |
| Green `#166534` on page | 6.8 |
| Ink at 62% (the floor for copy) | 5.2 |
| Ink at 72% (secondary) | 7.4 |
| Ink at 86% (strong) | 12.3 |

Gradient stops are for large headline text only (3:1): grad-1 is 3.5, grad-2 is 6.0, grad-3 is 4.5.
`primary-bright` (2.3:1) must never carry text.

## Rules for new UI

1. Use the semantic classes: `bg-black` (page), `text-white` (ink), `border-white/10` (faint line),
   `bg-surface` / `bg-surface-raised` (panels). They are correct in both themes.
2. **Solid uses are the deep colour, opacity uses are `-bright`.** Text and fills: `text-primary`,
   `bg-primary`. Tints, glows, soft borders: `bg-primary-bright/10`, `shadow-primary-bright/30`.
3. Text on a coloured fill is `text-on-primary` (or `text-pure-white` on a red or other fixed fill).
4. A colour that must not flip uses `pure-white` / `pure-black`. Modal scrims use `bg-pure-black/NN`.
5. Headline gradients: `bg-gradient-to-r from-grad-1 via-grad-2 to-grad-3 bg-clip-text text-transparent`.
6. Copy never goes below `text-white/30` in the class names, which resolves to the 62% floor in light.
   Anything fainter (`/5`, `/10`, `/20`) is decoration or icons only.
7. Never write a raw neon hex (`#00ffff`, `#00ff00`, `#ff00ff`) or a hard-coded dark colour in a component.
8. A device mock-up that stays dark on a light page gets `data-theme="dark"` on its container.
9. Decorative sparkles get the class `theme-stars` (hidden in light). New pages with their own header get `ThemeToggle`.
10. Check every new page in both themes (set `localStorage emlet_theme` to `dark`).

## Do and don't

- Do keep one accent per view. Teal leads; lime, mint and magenta are for status and small highlights.
- Do put the strongest contrast where the user acts (primary button: white on `#0c6a82`, 6.2:1).
- Don't use `primary-bright` or any `-bright` colour for text, or a status colour for decoration.
- Don't stack more than two card levels; nested cards step down to `surface-raised`.
- Don't add a new hue without adding both its light and dark values and checking contrast.
