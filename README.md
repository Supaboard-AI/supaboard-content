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

`case-studies/<slug>.md` renders at `/case-study/<slug>`.

A study opens with three scannable blocks — who the customer is, what was
broken, what changed in numbers — and then tells the story. The first three are
frontmatter, because each is a distinct rendered element. The story is the
markdown body, verbatim: headings, lists, blockquotes, images and videos, with
no `<!-- section: -->` markers of any kind.

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
hero:           OG image + primaryImageOfPage
logo:           dark wordmark, for the story tiles on light surfaces
about:          { body, website? } — the organisation in their own site's terms
problems:       [ "…" ] — the core problems, one per point
outcome:        [{ value, detail }] — metric-led results after the rollout
faq:            optional [{ q, a }] — renders an FAQ block and FAQPage JSON-LD
```

`about.body` is markdown (a block scalar — use `|`), so it can run to more than
one paragraph. `about.website` is `{ label, href }` and renders the Visit Site
link; leave it out entirely if the customer has no site to point at.

### Gaps

A `[[double-bracketed]]` run is a fact the customer still owes us. Keep it to
ten words, write it anywhere — frontmatter string or story — and it renders as a
visible highlight on the page rather than hiding in the YAML. Nothing fails the
build, so check the page before publishing.

### The story

Plain markdown. `##` is the top level (it renders as `<h3>`, below the page's
own headings). Bullets are written `- **Lead-in:** text`. A blockquote renders
as a sunken pull-quote card, and if it has more than one paragraph the last one
is set small as the attribution:

```markdown
> The quote itself.
>
> — Who said it
```

Images and videos are both written with image syntax; a `.webm` or `.mp4` source
renders as a looping muted `<video>` with controls:

```markdown
![What the figure shows](/case-study-media/slug-fig1.png)
![What the clip shows](/case-study-media/slug-demo.webm)
```

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
author:      { name, title, avatar }
cover:       { url, alt, width, height }
ogImage:     absolute URL, 1200×630
sections:    [ { id: content-1, heading: … } ]   # builds the table of contents
featured:    { choice: N|null, trending: N|null } # 1-based slot in each /blog rail
related:     [ slug, … ]                          # "Related Blogs" rail
faq:         [ { q, a } ]                         # becomes FAQPage JSON-LD
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

## Editing in a UI

```bash
bun run ui
```

Opens a local page on 127.0.0.1 with the whole corpus in one screen: every post
and case study on the left, raw frontmatter and body side by side in the middle,
and the tools on the right.

Frontmatter is validated against `schema/frontmatter.ts` as you type, including
the set-level rules — a duplicate `targetQuery` or an internal link that
resolves to nothing shows up without saving first. Note that the set-level rules
only compare documents that already pass the per-document schema, so while most
of the corpus fails on `statsCount` those cross-file checks stay quiet for the
posts that fail. Case studies have no validator, by design, and say so.

The editor splices your text back between the `---` delimiters rather than
re-serializing the YAML, so bytes you did not touch stay byte-identical and a
save produces a one-line diff. `bun run test:ui` asserts exactly that across
every file in the corpus.

Saving writes to disk and nothing else — reviewing, committing and pushing stay
manual, so the UI can never publish to the live site on its own.

The tools panel runs the same scripts this README documents, each with its safe
flag already selected: read-only tools run bare, `toc`/`faq`/`relink`/`codemod`
are dry until you tick **apply**, `rails`/`refresh-faq` ship `--dry` until you
tick **write**, and the four that upload, delete or overwrite without a dry mode
(`covers`, `prune-assets`, `apply-disposition`, `scrape`) stay disabled until you
type the tool's name. One runs at a time.

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

# recompute readMinutes/readLabel from the body; dry unless --apply
node tools/readtime.mjs [--apply]

# render each visible FAQ from its frontmatter faq:, and keep the FAQ second
# to last; dry unless --apply
node tools/faq-sync.mjs [--apply]

# close skipped heading levels, so every post is h2 -> h3 -> h4; dry unless --apply
node tools/headings.mjs [--apply]

# re-read the Supaboard Choice / Trending rails off the live index
node tools/rails.mjs

# migrate the /comparison pages into the site repo as typed TS
node tools/comparisons.mjs [--out <dir>]

# report Spaces objects nothing references; --delete removes them
node tools/prune-assets.mjs [--delete]
```

The three above each carry a `--check` flag that runs their own assertions
without touching the corpus — run it after editing one.

`convert.mjs` holds the Framer-HTML-to-markdown rules and the Spaces mirroring
shared by `scrape.mjs` and `comparisons.mjs`. Comparison pages land in the site
repo rather than here because they are engineer-edited typed data — the split
`docs/ARCHITECTURE.md` describes.

Spaces credentials come from `SPACES_KEY` / `SPACES_SECRET`, falling back to
the landing repo's `.env` (see `tools/env.mjs`). Nothing secret is committed
here.
