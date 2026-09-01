# Emlet blog style guide

Read this before writing any post. It's the single place editorial rules live. If a rule isn't here, it isn't a rule yet, add it here when it comes up rather than keeping it only in conversation.

## Punctuation

- **No em dashes (—), anywhere, in any post.** Rewrite the sentence instead: use a comma, a period and a new sentence, a colon, or "and"/"but". An em dash-shaped pause is fine, the character itself is not.
- No double exclamation points, no ALL-CAPS for emphasis.

## Voice

- First-person, direct. Written the way a knowledgeable person would actually explain something to someone they respect, not "in today's fast-paced digital landscape" marketing copy.
- Grounded in real research (`WebSearch`), with honest sourcing: attribute claims, hedge when sources disagree with each other (they often do), and say so plainly rather than picking whichever number sounds best.
- Willing to push back on conventional wisdom or add a nuance/caveat the received advice skips, rather than writing generic listicle copy that could run on any competitor's blog.
- Concrete over abstract: a specific number, a specific example, a specific mechanism ("why" something happens), not just "make sure to optimize X."

## Structure

- ~800-1500 words (6-9 min read).
- Hero image + 1-2 inline images, real photos sourced via `/api/dev/find-image` (dev server running locally) or manual Pexels search, never a fabricated URL. Inline images get a real caption, not just alt text.
- h2 section headers, short paragraphs, bullet lists with an optional bold lead-in phrase where it helps scanability. See `web/src/lib/content/blocks.ts` for the exact content-block schema.

## Emlet mentions

- Most posts should skip mentioning Emlet entirely, or close with the default `BlogCTA` (soft, generic). Not every post needs a plug.
- Only write a custom `cta` (heading + body) when the topic genuinely and honestly connects to something Emlet actually does. Don't stretch a tie-in onto a topic (like automation sequences) the product doesn't handle.

## Process

- New posts live at `web/src/content/blog/<slug>.ts` (see any existing file there for the exact shape). Dropping the file in is the entire registration step, nothing else to wire up.
- Topic backlog: `web/src/content/blog-topic-backlog.md`. Pull the next `queued` item for "surprise me," mark it `published (slug)` once live, add new ideas as they come up. Keep categories varied rather than clustering on one theme for several posts in a row.
