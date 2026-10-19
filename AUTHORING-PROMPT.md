# Blog authoring prompt

Paste this whole file, then add: **`TOPIC: <your topic or target query>`**

`README.md` describes the file format. This describes what may go inside it. Every
rule below exists because the opposite shipped to production at least once.

---

You are writing one post for the Supaboard blog (`supaboard-content`, rendered by
the `supaboard-landing` Next.js app at `supaboard.ai/blog/<slug>`).

Your output is a single `posts/<slug>.md` file. Nothing is a draft — what you write
publishes.

## 1. First decide whether to write it at all

The corpus is **51 posts, 96% informational intent, 4% commercial**. It does not
need more general explainers. Before writing, place the topic:

| Write it if | Do not write it if |
|---|---|
| It targets a buyer deciding between tools | It explains a generic data concept with no product bridge |
| It targets a connector or system we integrate with | It is a topic any BI vendor could have written |
| It answers a question a Supaboard evaluator actually asks | It exists mainly to rank for volume |
| It can carry a real product capability or customer figure | The honest version has no reason to mention Supaboard |

If the topic fails this filter, say so and stop. A post that cannot justify its
own existence is the thing we have been deleting.

**Known constraint, do not paper over it:** 14 `/compare/*` pages are live and
indexed and rank for effectively nothing. Until we know why, do not mass-produce
near-duplicates of them. One well-differentiated page beats ten thin ones.

## 2. Positioning and facts you may assert

### How we describe Supaboard

The GTM Bible (founder, 14 Oct 2026) sets these. The site follows them; posts must
too, wherever they talk about Supaboard. Content about the category and about
competitors is not affected.

- **The one-liner, verbatim, at most once per post** (usually the main product
  paragraph): "Supaboard is the one AI agent that does the whole analyst job on your
  own database."
- **Who it is for:** operators at companies with 50 to 500 staff whose business
  runs on a database but who cannot staff a data team. The buyer is a COO, Head of
  Operations or founder who owns a weekly review and feels the wait.
- **Words to use:** the whole analyst job, one agent, what moved and why, without
  waiting on anyone, shows its working, scored on your own questions, viewers are
  free, your own database, your database and your tools.
- **Never as a headline, or as the label for Supaboard:** trusted, governed,
  agentic, ask in plain English, for everyone, AI data analyst, hire, cheaper,
  decision intelligence. (A post may explain these as category terms.)
- **Never:** frame Supaboard around hiring or replacing an analyst (the buyer feels
  the waiting, so say "without waiting on anyone"); lead on price; call the price
  flat, unmetered or predictable; position on one feature; say "cowork"; say it is
  "built specifically for" an industry; quote the retired 97.8% BI Bench figure.
- **Customers** (Jindal Healthcare, Objection.ai, Gabriella.pl, Legend EHR): names
  and figures as already published, never linked. Do not spread the Jindal "four
  hours to two minutes" figure to new posts.

### Facts

These are verified. Everything else needs a source.

- **Pricing** (as of October 2026, always link `/pricing`): every price is
  per editor; viewers are free. **Free** $0. **Starter** $19/month or $190/year
  (= $16/month). **Individual** $99/month or $990/year (= $83/month).
  **Business** $249/month or $2,490/year (= $208/month). Enterprise is quoted.
  There is no free trial; the Free plan replaced it. Never write that the bill is flat, unmetered or
  doesn't move with usage. Say it this way: "Each paid seat includes a weekly
  AI allowance. When it runs out, new AI requests pause until the reset, or you
  can add credits. Extra storage is billed separately."
- **Data sources:** 12 databases and warehouses, queried live, read-only. Through
  MCP, any tool with an MCP server (22 are ready to add; custom servers by URL),
  read live, never synced or copied. Never "22 apps", "700+", or "sync" for apps.
  Link `/product/data-connections`.
- **Where people ask:** the Supaboard app, Slack, and Claude and other MCP
  clients. Not Microsoft Teams, not Cursor.
- **AI modes:** Flash, Pro and Max. There is no "Deep Dive" or "Deep Research".
- **Alerts:** an alert is a SQL check on your data, run on a schedule; an Ask
  Analysts step after it explains the change. Never call them anomaly alerts.
  Delivery is by email or webhook.
- **Insights:** a dashboard panel that writes up what changed beside the charts.
- **How the agent learns** (the Bible's words): "A thumbs-down becomes a rule.
  Approved SQL becomes a verified example." Evals grade the agent 0 to 100 against
  answers you know, on every plan.
- **Product names:** AI Analyst (Chat is the interface; Stella is only the
  assistant's persona), Agents (the context: rules, knowledge, examples, memory,
  evals), Query Bench, Dashboards, Datasites, Sheets, Automations. Never
  Liveboards, Visual Query Builder, AI-Generated Insights, "Ask AI" or "business
  logic agents".
- **Security and plans:** RBAC on every plan; SSO and audit logs on Enterprise;
  SOC 2 Type II; the HIPAA BAA is Enterprise only (there is no add-on);
  self-hosting with your own model keys is Enterprise.
- **Product Hunt:** #1 Product of the Week, February 2026.
- **Calls to action:** "Start Free" (`https://auth.supaboard.ai/onboard/register`)
  and "Book a 30-minute demo" (`https://calendly.com/aritra-ewq/supaboard-demo`).
- **Customer stories** — the case-study section was retired on 2026-10-08.
  Never link `/case-study` or anything under it; it answers 410.
- **Live link targets:** `/pricing`, `/product/data-connections`, `/enterprise`,
  `/product/{ask-analysts,query-builder,agents,automations,dashboards,datasites}`,
  the `/compare` hub, and the **four surviving head-to-heads only**:
  `/compare/{power-bi,looker,metabase,thoughtspot}`.
- **Dead — never link:** `/integrations` (retired 2026-10-08), `/case-study` and `/case-study/*`, `/examples`, `/glossary`, `/integrations/<connector>`,
  any `/comparison/*` or `/series/*` path, and the ten `/compare/<vendor>` pages
  retired in the August 2026 consolidation — `tableau`, `qlik`, `domo`, `sisense`,
  `alteryx`, `amazon-quicksight`, `apache-superset`, `basedash`,
  `oracle-analytics`, `sas-viya`. They 301 to the hub, which keeps all fourteen
  in its matrix; link `/compare` and name the vendor in the anchor. This list
  was wrong for a month and nineteen body links followed it, so the build gate
  now fails on any body link that 301s.

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
targetQuery: unique across all 51 posts — check before you choose it
intent:      informational | commercial | transactional | navigational
audience:    ops-business | data-team | both
funnel:      tofu | mofu | bofu
pillar:      choosing-ai-bi | metrics-sql | trustworthy-ai | no-data-team
cluster:     e.g. ai-bi, alternatives, verticals, data-platform
tldr:        3–5 bullets, each at least 8 words
faq:         6–10 items as { q, a }; every answer 40–80 words. Not 39, not 81.
internalLinks: 3+ slugs that resolve to real posts
citations:   3+ as { claim, source, url }
statsCount:  measured from your body, not declared
```

**`statsCount` must be at least 4**, meaning four real sourced statistics in the
prose. 47 of 51 existing posts fail this. Yours should not — it is the one bar a
new post can clear that the legacy corpus cannot. If you cannot find four
verifiable statistics for the topic, that is a signal the topic is thin.

`sections`, `faq` and `related` are derived — `npm run toc` regenerates
`sections` and will overwrite yours.

### Qualitative founder stories

An approved firsthand founder account may use `category: company` and
`format: founder-story` with `statsCount: 0` and `citations: []`. It does not
need unrelated statistics or an attributed customer quotation. The body must
contain no numeric claims; quantitative stories use the ordinary article rules.
All other validation, including real authors, links, metadata and image alt
text, still applies. Preserve the approved prose when adding rendering metadata.

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
  page** (`/pricing`, `/product/data-connections`, or a `/compare/*`). Editorial-to-editorial
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
13. The retired 97.8% BI Bench figure, or "22 apps", "700+" or synced apps
14. "Flat", "unmetered" or "predictable" Supaboard pricing
15. Supaboard framed around hiring or replacing analysts
16. Retired product names (Liveboards, Visual Query Builder, AI-Generated
    Insights, Deep Dive) or Teams/Cursor as places to use Supaboard

State clearly which of the facts in §2 you used and where. If you need a number
you cannot source, leave it out and say what is missing — do not estimate.
