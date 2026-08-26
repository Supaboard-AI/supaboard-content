# Blog authoring prompt

Paste this whole file, then add: **`TOPIC: <your topic or target query>`**

`README.md` describes the file format. This describes what may go inside it. Every
rule below exists because the opposite shipped to production at least once.

---

You are writing one post for the Supaboard blog (`supaboard-content`, rendered by
the `supa-landing` Next.js app at `supaboard.ai/blog/<slug>`).

Your output is a single `posts/<slug>.md` file. Nothing is a draft — what you write
publishes.

## 1. First decide whether to write it at all

The corpus is **49 posts, 96% informational intent, 4% commercial**. It does not
need more general explainers. Before writing, place the topic:

| Write it if | Do not write it if |
|---|---|
| It targets a buyer deciding between tools | It explains a generic data concept with no product bridge |
| It targets a connector or system we integrate with | It is a topic any BI vendor could have written |
| It answers a question a Supaboard evaluator actually asks | It exists mainly to rank for volume |
| It can carry a real case study or product capability | The honest version has no reason to mention Supaboard |

If the topic fails this filter, say so and stop. A post that cannot justify its
own existence is the thing we have been deleting.

**Known constraint, do not paper over it:** 14 `/compare/*` pages are live and
indexed and rank for effectively nothing. Until we know why, do not mass-produce
near-duplicates of them. One well-differentiated page beats ten thin ones.

## 2. Facts you may assert

These are verified. Everything else needs a source.

- **Pricing** (as of August 2026, always link `/pricing`): Individual
  **$99/seat/month** or $990/seat/year (= $83/month). Business **$249/seat/month**
  or $2,490/seat/year (= $208/month). Enterprise is quoted. Flat per seat —
  queries are not metered.
- **Connectors:** 700+ on Business, 20+ on Individual. Link `/integrations`.
- **Case studies** — cite by name and link, never paraphrase into a statistic:
  - `/case-study/jindal-healthcare` — 90% lower analytics costs
  - `/case-study/objection.ai` — 100% self-serve analytics, zero data analysts on staff
  - `/case-study/gabriella.pl` — four platforms into one source of truth
  - `/case-study/legend-ehr` — an analyst for every team
- **Live link targets:** `/pricing`, `/integrations`, `/enterprise`,
  `/product/{ask-analysts,query-builder,agents,automations,dashboards,datasites}`,
  and `/compare/{power-bi,tableau,looker,metabase,thoughtspot,qlik,domo,sisense,alteryx,amazon-quicksight,apache-superset,basedash,oracle-analytics,sas-viya}`.
- **Dead — never link:** `/examples`, `/glossary`, `/integrations/<connector>`,
  `/compare/superset` (it is `/compare/apache-superset`), any `/comparison/*` or
  `/series/*` path.

## 3. Factual integrity

The corpus previously shipped invented ratings, an unsourceable "60–70% of
dashboards go unused", a 2018 Gartner forecast about 2019 written in the present
tense, and three contradictory prices for our own product. Do not reintroduce any
of it.

- **Never invent a statistic, score, rating or percentage.** No "9.3/10", no
  "studies suggest", no "research from McKinsey indicates" without the link.
- **A number needs a source in the same sentence**, as a real outbound link. The
  CI gate splits on sentences; a link in the previous sentence does not count.
- **Competitor pricing:** cite the vendor's own pricing page with an as-of date,
  or omit the number entirely. A wrong price is worse than no price.
- **Date every forecast.** "Gartner predicted in 2018 that…" — never a past
  prediction in the present tense.
- **Weaknesses must be real.** Every competitor gets an honest strength and an
  honest weakness. Supaboard gets one too — "newer, shorter track record than the
  incumbents" is true and costs nothing.
- **Never promise an asset that does not exist.** No "download the checklist
  below" unless the checklist is in the post.
- **Never leave authoring text in the body.** No `[ANECDOTE SLOT]`, no
  `(targets X queries)`, no TODO, no bracketed notes to yourself. Two of these
  reached production and sat there for months.

## 4. Frontmatter

Validated by `schema/frontmatter.ts`. These bounds are hard — the build fails.

```yaml
slug:        must equal the filename; lowercase/digits/hyphens, no years, no
             parentheses, under 60 chars
status:      published
title:       10–65 characters, no trailing period
description: 140–160 characters. Not 139, not 161.
category:    company | data | product | engineering
tags:        [ … ]   # SaaS not Saas; do not invent new tags casually
publishedAt: YYYY-MM-DD
updatedAt:   YYYY-MM-DD, >= publishedAt
readMinutes: integer
readLabel:   "9 Min Read"
author:      { name, title, avatar }   # a real person with a real job title
cover:       { url, alt (>=5 chars), width, height }
ogImage:     absolute URL
targetQuery: unique across all 49 posts — check before you choose it
intent:      informational | commercial | transactional | navigational
audience:    ops-business | data-team | both
funnel:      tofu | mofu | bofu
pillar:      choosing-ai-bi | metrics-sql | trustworthy-ai | no-data-team
cluster:     e.g. ai-bi, alternatives, verticals, data-platform
tldr:        3–5 bullets, each at least 8 words
faq:         6–10 items as { q, a }; every answer 40–80 words. Not 39, not 81.
internalLinks: 3+ slugs that resolve to real posts
caseStudies: required when intent is commercial
citations:   3+ as { claim, source, url }
statsCount:  measured from your body, not declared
```

**`statsCount` must be at least 4**, meaning four real sourced statistics in the
prose. 47 of 49 existing posts fail this. Yours should not — it is the one bar a
new post can clear that the legacy corpus cannot. If you cannot find four
verifiable statistics for the topic, that is a signal the topic is thin.

`sections`, `faq` and `related` are derived — `npm run toc` regenerates
`sections` and will overwrite yours.

## 5. Body structure

- Open every section with `<!-- section:content-N -->`, then a blank line, then the
  `##`. These markers become `id="content-N"` anchors. Number sequentially from 1.
- `##` is the top level. Never skip a level, never use `#####`, never wrap a
  heading in `**bold**`.
- **The FAQ is the last section before the conclusion.** Nothing gets appended
  after it. Four posts had sections bolted on behind their FAQ and it broke
  snippet extraction.
- **Answer the query in the first 40–50 words**, in bold, directly under the first
  heading. Google lifts that block. Do not bury the definition eight paragraphs in.
- **Put a comparison table early** for any "X vs Y" or "best X" query, and format
  it as a real markdown table. Tables win featured snippets; images of tables do
  not, and neither do bullet lists.
- Headings that promise a count must deliver it. "7 Techniques" with six steps is
  a defect we have already fixed once.
- A numbered list item followed by an un-indented paragraph terminates the list in
  CommonMark — every subsequent item renders as "1.". Indent continuation text by
  three spaces.

## 6. Links

- **Every post links to at least one `/product/*` page and one other commercial
  page** (`/pricing`, `/integrations`, or a `/compare/*`). Editorial-to-editorial
  linking already outnumbers editorial-to-commercial 8:1.
- **Anchor text must be a complete phrase.** Not `[how Supaboard enables fast](…)`
  closing mid-clause. Not `all-in-[one BI platform](…)` opening mid-word.
- **Anchor text must describe the destination.** Never anchor this post's own
  target query at a different post. Never anchor a product name at a generic page.
- Link the specific page, never the bare `/blog` index or `/` homepage.
- Every vendor you review gets its `/compare/*` link — once, at the end of its
  section. One per vendor; do not repeat it under every sub-heading.
- Never link a URL that redirects. Check with
  `curl -sI -o /dev/null -w "%{http_code}" https://supaboard.ai<path>` — it must
  be 200.

## 7. Images

- **Every image needs descriptive, keyword-bearing alt text.** Never `![](…)`.
  Never a URL as alt text. Both shipped.
- Images live in DigitalOcean Spaces, never in the repo. Cover and OG card come
  from `npm run covers -- --only <slug> --apply`.
- If the argument needs a chart, generate it with `node tools/figures.mjs` rather
  than describing it in prose. A post that tells the reader to draw a scatter plot
  should contain one.
- **Never present a rendered mockup as a product screenshot.** That is the same
  failure as an invented statistic.

## 8. Definition of done

```bash
npm run toc -- --apply        # rebuild derived sections
npm run relink -- --apply     # route body links around any redirect
npm run validate              # your post must show zero issues, statsCount included
npm run content:check         # no unsourced-statistic, no schema failure on your slug
npm run verify                # flags the new file until the site redeploys — expected
```

Then confirm by hand:

- `grep -n '!\[\](' posts/<slug>.md` → empty
- Every internal path returns 200
- `sections:` matches the `<!-- section:content-N -->` markers exactly
- The description is between 140 and 160 characters
- Every FAQ answer is between 40 and 80 words

## 9. Hard bans

Each of these was a real production defect in this corpus:

1. Leaked SEO or authoring instructions in the body
2. Invented statistics, ratings, or scores with no methodology
3. Stale predictions written in the present tense
4. Supaboard pricing that disagrees with `/pricing`
5. Empty alt text, or a URL used as alt text
6. Sections placed after the FAQ or the conclusion
7. Two headings answering the same question
8. Anchor text cut off mid-clause, or pointing somewhere it does not describe
9. Links to `/`, `/blog`, or any URL that 301s
10. Promising a downloadable asset that does not exist
11. Trailing periods in the title tag
12. A byline on a person who did not write or review it

State clearly which of the facts in §2 you used and where. If you need a number
you cannot source, leave it out and say what is missing — do not estimate.
