# Blog cleanup — status against the acceptance criteria

Branch `blog-cleanup-migration`, local only. Each commit is independently revertible.

## Where the work landed

All work is in **this** repo, `supaboard-content`. No other repository was
modified.

The brief assumed "a Next.js app where posts are authored as MDX in this
repository." Posts are `.md` here and are consumed by a separate site repo;
there is no MDX and no blog routing in this repo to change. Everything Phase 4
and Phase 6 produce for the app side is therefore emitted as a **portable
artifact** — `migration/redirects.next.mjs`, `migration/sitemap.ts`,
`migration/redirects.json`, `migration/410-gone.txt` — for whoever wires up the
routes, rather than written into an app.

## Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | Post count ~45, from 131 | **Met. 47 posts.** The audit's 131 was stale — the live site had **145** at migration. Split: 24 KILL, 74 MERGE, 47 KEEP. |
| 2 | Zero duplicate `targetQuery` | **Met. 47 unique across 47 posts.** Authored in `migration/editorial.config.mjs`; the generator refuses to write on a collision. |
| 3 | Zero unsourced statistics | **Partially met.** Every named offender is gone, plus 12 more found in the same pattern. 43 of 88 numeric claims remain typed but unadjudicated. CI fails on each, so none can ship silently. |
| 4 | KILL 410s + file deleted; MERGE 301s in one hop | **Met.** 24 files deleted, 25 URLs 410. 129 redirects, generator refuses to emit on a chain, loop or duplicate source. |
| 5 | Every live Framer URL accounted for | **Met.** 174 live URLs: 31 resolve, 119 redirect, 24 410, **0 uncovered.** |
| 6 | Sitemap has lastmod, no 404s, excludes `/old-home-2` and `/404` | **Met in the generator.** 70 entries, all with lastmod. Those two paths are excluded — note neither was ever in the live sitemap. |
| 7 | Every slug passes the slug rules | **Met. All 47.** |
| 8 | Top 15 meet the editorial spec | **Not met.** Measured against all eight thresholds in `spec-compliance.json`; statistics, quotations and readability are far off corpus-wide. |
| 9 | Every commercial post cites a case study | **Met.** All 20 commercial-intent posts carry a `caseStudies` entry; the schema rejects one that does not. |
| 10 | Pillar↔cluster links resolve both ways | **Partially met.** Every post now has a `pillar` and `cluster`, and internal links are filled from them rather than at random. Rendering the pillar pages is app-repo work. |
| 11 | CI guardrails demonstrably fail on a bad post | **Met.** `npm run test:guardrails` — 15 rules, all asserted to fire. |

## What is not done

Measured, not estimated — `migration/spec-compliance.json` has the per-post table.

**The corpus now fails on exactly one field: `statsCount`.** 45 of 47 posts
carry fewer than four sourced statistics; the average is 0.5 per post. Every
other schema rule passes — title, description, slug, category, pillar, cluster,
targetQuery, intent, audience, funnel, author, dates, tldr, faq, internalLinks,
citations, caseStudies.

Closing it means finding roughly 180 real, verifiable statistics and citing them
inline. That is research, not configuration. `statsCount` is measured from each
body rather than declared, precisely so this gap cannot be closed by editing a
number — which is the failure mode the whole exercise exists to prevent.

**Two further editorial thresholds are unmet corpus-wide:**

| Threshold | Posts failing |
|---|---|
| 4+ sourced statistics | **45 / 47** |
| 1+ named attributed quotation | **47 / 47** |
| Readability grade 9–10 | 44 / 47 (median 13.8) |
| ~12 sections | 37 / 47 |
| 6–10 FAQ answers at 40–80 words | **0 / 47 — met** |
| 3+ external citations | **0 / 47 — met** |
| 3+ internal links | **0 / 47 — met** |

Named quotations need real people saying real things; the case studies supply
quotable material but attributing it to a named individual requires knowing who
said it, and inventing an attribution would be the same failure as inventing a
statistic. Readability at grade 13.8 against a 9–10 target is a rewrite of every
post, not a pass.

**Phase 5b/5c/5d.** No top-15 retrofit pass. Case studies are cited from all 20
commercial-intent posts via `caseStudies` and woven into the prose of nine, but
there was no systematic sweep. No mid-article CTAs. The "Rigged Demo Checklist"
promised by `how-to-evaluate-ai-bi-tools` still does not exist and the promise is
still in the text.

**App-repo work**, deferred by decision and emitted as portable artifacts here:
category hubs, `/blog/page/N` pagination, pillar pages, the 14 `/compare/` routes
the redirects point at, Article/FAQPage/BreadcrumbList/Organization schema, RSS,
canonical tags, and the `nosnippet`/`max-snippet` audit.

**66 unsourced numeric claims** remain in bodies, typed in `stats-audit.csv`,
including 18 competitor prices needing verification against vendor pages with an
as-of date. CI fails on each, so none can ship silently.

## The unadjudicated statistics

`migration/stats-audit.csv` types all 88 numeric claims. The 45 marked
`UNCLASSIFIED` are bare assertions that match no pattern — for example
`enterprise-business-intelligence` carries seven percentages (66/53/34/20/58/80/42)
with no source, and `healthcare-analytics` claims "over 70% of large hospitals".
Each needs a real source or deletion. The CI gate already fails on every one of
them, so they cannot reach production unresolved.

18 claims are competitor pricing. These were left alone deliberately: they need
verifying against each vendor's current pricing page and citing with an as-of
date, and a wrong price is worse than no price.

## Reproducing any of it

```bash
npm run inventory      # posts -> migration/inventory.json
npm run reconcile      # live sitemap vs repo
npm run disposition    # config -> disposition.csv (refuses on gaps)
npm run redirects      # disposition -> redirect map (refuses on chains/loops)
npm run coverage       # asserts no live URL 404s after cutover
npm run relink         # follow body links through the redirect map
npm run stats:audit    # every numeric claim, typed
npm run validate       # schema state
npm run content:check  # the build gate
npm run content:report # corpus health
npm run test:guardrails
```
