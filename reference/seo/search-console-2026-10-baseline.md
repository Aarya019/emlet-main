# Search Console baseline: 31 Jul to 30 Oct 2026

Source: Search Console exports (web search, last 3 months), supplied 2026-11-02. Use this as the "before" when
comparing a later export. The sample is small (31 clicks), so read the patterns, not the decimals.

## Totals

| Measure | Value |
|---|---|
| Clicks | 31 |
| Impressions | 2,357 |
| CTR | about 1.3% |
| First impressions | 24 Aug 2026 (nothing before that) |
| Typical day, Sep to Oct | 20 to 70 impressions, about one click every two days |

## What the data says

1. **Half the clicks are the brand name.** The query "emlet" gave 15 of 31 clicks (position 2.3). The homepage took 17
   clicks. People who already know the name find us; almost nobody finds us by topic yet.
2. **Blog posts gave 13 clicks and most of the impressions.** The fonts cluster does best: `web-fonts-in-email-what-actually-renders`
   (4 clicks, 127 impressions, position 7.3), `email-fonts-guide` (438 impressions, position 10.9, CTR 0.46%),
   `html-email-font-family-stacks` (83 impressions, position 6.5).
3. **Pages ranking 5 to 8 with no clicks** (snippet or title problem, not a ranking problem): `email-preview-text-guide`
   (119 impressions, position 6.9), `copywriting-frameworks-aida-pas-bab` (67, position 6.8).
4. **Long-tail clusters at positions 20 to 60** (a better page or a more specific page could move these):
   product launch email samples and templates (about 10 variants), event invitation emails (about 10 variants),
   Gmail Promotions tab (about 8 variants), preview text character limit, "react html email".
5. **Queries that rank 2 to 4 but get no clicks** are definition queries ("pas copywriting problem agitate solution
   definition"); the answer is probably shown in the result itself. Low value.
6. **Countries:** India 8 clicks (149 impressions), UK 4 (161), US 3 (944 impressions, position 12, CTR 0.3%). The US is
   where most impressions are and where we sit at the bottom of page 1 or top of page 2.
7. **Devices:** mobile ranks better (position 5.4, CTR 2.1%) than desktop (position 11.2, CTR 1.0%).

## Technical issues found (fixed or open)

| Issue | Status |
|---|---|
| Every page without its own canonical (about 45 registry posts, 5 older posts, the blog index, alternatives, legal pages, sign-up) declared the homepage as its canonical, because the root layout set `canonical: 'https://www.emlet.app'`. | **Fixed 2026-11-02**: the layout now uses `canonical: './'`, which resolves to each page's own URL. |
| Blog posts were plain text, so none could link to other posts or tools. | **Fixed 2026-11-02**: `[anchor](/path)` links now work in post text; existing "our post on X" mentions were linked. |
| `emlet.app` (without www) has impressions of its own (`/`, `/blog/email-fonts-guide`, `/lander`). | **Open, needs the Vercel dashboard**: make `emlet.app` redirect permanently to `www.emlet.app`. |
| `https://emlet.app/lander` appears in results but the route does not exist (404). | **Open**: add a permanent redirect to `/` if it used to be the old landing page. |
| `/blog?category=...` URLs are indexed. | Now canonicalised to `/blog` by the layout fix. |
| Slug `web-fonts-in-email-what-actually-renders-and-what-silently` has 1 impression. | **Open**: an old, longer slug; add a redirect to the current one if it ever existed. |

## What to compare next time

- Clicks and impressions on the four posts added on 2026-11-02 (see `src/content/blog-topic-backlog.md`).
- Whether the posts that sat at "canonical = homepage" gain impressions and position over the next 4 to 8 weeks.
  Indexing changes take weeks, so judge after about 6 weeks, not 6 days.
- Non-brand clicks (every query except "emlet" and its typos). That is the number blog work should move.

## Data that would sharpen the next round

1. Search Console, **Indexing > Pages**: counts for "Duplicate, Google chose different canonical than user" and
   "Crawled - currently not indexed", plus the URL Inspection result for 3 posts (user-declared vs Google-selected canonical).
2. Search Console, **Performance**, one page at a time (top 5 pages): the Queries tab for that page.
3. **Keyword volume and difficulty** for target topics (Ahrefs Webmaster Tools is free for a verified site; Google
   Keyword Planner also works), or a list of 5 to 10 competitor blogs you consider peers.
4. **Signups by landing page or source**, to see which posts lead to accounts, not just visits.
5. Whether **Bing Webmaster Tools** is set up (Bing also feeds DuckDuckGo and several AI search tools).
6. Backlinks: the Search Console **Links** report.
