# supaboard-content

Source of truth for Supaboard's blog and case-study prose. The marketing site
(`supa-landing`) reads these files at build/ISR time and renders them at
`https://supaboard.ai/blog/<slug>` and `https://supaboard.ai/case-study/<slug>`.

```
posts/<slug>.md          one post — YAML frontmatter + markdown body
case-studies/<slug>.md   one customer story — same shape, different frontmatter
tools/                   migration + authoring scripts
```

`tools/` and the zod schema in `schema/` cover `posts/` only. Case studies are
four hand-maintained files gated by the site build, which fails loudly rather
than dropping a study, so they do not yet carry their own validator.

## URLs are the contract

`posts/<slug>.md` renders at `/blog/<slug>`. The filename **is** the URL, so
renaming a file is a redirect you have to write by hand. The slugs came from
the live sitemap verbatim, punctuation included —
`ai-data-analyst-how-it-works-and-best-tools-(2026).md` is intentional.

In-page anchors follow the same rule. Each `<!-- section:content-N -->` marker
in the body becomes `id="content-N"` on the rendered section, matching the
anchors the Framer build shipped, so existing deep links keep resolving.

## Case studies

`case-studies/<slug>.md` renders at `/case-study/<slug>`, and uses the same
`<!-- section:id -->` markers to split the body.

The split between frontmatter and body follows what the page renders. Prose —
a section's intro paragraph and its bulleted list — lives in the body. Anything
that is a distinct rendered element stays in frontmatter: the numbered eyebrow,
the heading, the figure, and the pull quote, because a markdown blockquote
cannot carry the attribution line or the sunken card it renders into.

```yaml
slug:           must equal the filename
status:         published | draft | scheduled
company:        the customer
title:          <h1> and the base of the <title> tag
headlineMetric: the one-line result, used on tiles and the homepage strip
summary:        meta description + the hero paragraph
industry:       shown in the hero kicker
featured:       optional — position in the featured row on /case-study
publishedAt:    YYYY-MM-DD
updatedAt:      YYYY-MM-DD — drives dateModified and sitemap lastmod
art:            { bed, person?, logo } — layered square story art
hero, mark, stripPhoto, stripLogo, logo
stats:          [{ value, detail }] — the three-up band under the hero
glance:         { quote, facts[], website?, callout? }
sections:       [{ id, eyebrow, heading, image?, quote?, attribution? }]
faq:            optional [{ q, a }] — renders an FAQ block and FAQPage JSON-LD
```

`sections` is the running order: the numbering a reader sees ("3. THE SHIFT")
comes from this list, and bodies are matched to it by `id`. The body needs one
`<!-- section:glance -->` block for the At-a-glance prose, then one block per
declared section. Bullets are written `- **Lead-in:** text`.

Figures live in the site repo under `public/case-study-media/`, referenced by
absolute path — unlike blog images, they are design-system art rather than
content.

## Frontmatter

```yaml
slug:        must equal the filename
status:      published | draft | scheduled
title:       <h1> and the base of the <title> tag
description: meta description + og:description
category:    BI Tools | General | Business | Tech
tags:        [ … ]
publishedAt: YYYY-MM-DD          # drives ordering and datePublished
updatedAt:   YYYY-MM-DD          # drives dateModified
readMinutes: 9
readLabel:   "9 mins"            # rendered verbatim in the byline pill
author:      { name, role, avatar }
cover:       { url, alt, width, height }
ogImage:     absolute URL, 1200×630
sections:    [ { id: content-1, heading: … } ]   # builds the table of contents
featured:    { choice: N|null, trending: N|null } # 1-based slot in each /blog rail
related:     [ slug, … ]                          # "Related Blogs" rail
faq:         [ { question, answer } ]             # becomes FAQPage JSON-LD
source:      { url, migratedAt }                  # provenance, not rendered
```

`sections`, `faq` and `related` are derived data — regenerating a post
overwrites them. Everything else is safe to hand-edit.

### featured

Position in each index rail, or `null`. `choice: 1` is the large lead card in
"Supaboard Choice"; `trending: 3` is third in the Trending list. A rank rather
than a flag, because which post leads a rail is an editorial decision and the
lead card renders at twice the size.

Set by `tools/rails.mjs`, which reads the live index — but safe to hand-edit,
and preserved across a re-scrape.

### status

Only `published` renders. `draft` is hidden outright; `scheduled` appears once
`publishedAt` arrives. A `published` post is never date-gated, so a typo'd year
cannot take a live URL off the site.

## Verifying

```bash
node tools/verify.mjs
```

Asserts that the set of `posts/*.md` filenames equals the set of `/blog/<slug>`
URLs in the live sitemap — exactly — and then checks required frontmatter, that
no asset still points at `framerusercontent.com`, that section markers exist,
and that every `related` slug resolves. Run it after any bulk change.

## Images

Every image lives in DigitalOcean Spaces at
`https://supaboard-landing-content.fra1.digitaloceanspaces.com/blog/…`, never
in this repo and never hotlinked from Framer. Keys are content-addressed
(sha256 prefix), so re-uploading an unchanged file is a no-op and a published
URL never breaks.

## Tools

```bash
npm install

# migrate specific posts from the live Framer site
node tools/scrape.mjs <slug> [<slug> …]

# migrate everything in supaboard.ai/sitemap.xml
node tools/scrape.mjs --all

# assert URL parity with the live sitemap, plus content hygiene
node tools/verify.mjs

# find live posts the sitemap does not list (currently: none)
node tools/discover.mjs

# re-derive the faq: block after changing the parser in faq.mjs
node tools/refresh-faq.mjs

# re-read the Supaboard Choice / Trending rails off the live index
node tools/rails.mjs

# migrate the /comparison pages into the site repo as typed TS
node tools/comparisons.mjs [--out <dir>]

# report Spaces objects nothing references; --delete removes them
node tools/prune-assets.mjs [--delete]
```

`convert.mjs` holds the Framer-HTML-to-markdown rules and the Spaces mirroring
shared by `scrape.mjs` and `comparisons.mjs`. Comparison pages land in the site
repo rather than here because they are engineer-edited typed data — the split
`docs/ARCHITECTURE.md` describes.

Spaces credentials come from `SPACES_KEY` / `SPACES_SECRET`, falling back to
the landing repo's `.env` (see `tools/env.mjs`). Nothing secret is committed
here.
