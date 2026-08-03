# Blog cleanup — status against the acceptance criteria

Branch `blog-cleanup-migration`. Eight commits, each independently revertible.

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
| 2 | Zero duplicate `targetQuery` | **Enforced, not yet satisfied.** `targetQuery` is authored, and is unwritten on all 47. The rule is implemented and tested; it cannot pass until the field is filled. |
| 3 | Zero unsourced statistics | **Partially met.** Every named offender is gone, plus 12 more found in the same pattern. 45 of 88 remaining numeric claims still need adjudication — see below. |
| 4 | KILL 410s + file deleted; MERGE 301s in one hop | **Met.** 24 files deleted, 25 URLs 410. 129 redirects, generator refuses to emit on a chain, loop or duplicate source. |
| 5 | Every live Framer URL accounted for | **Met.** 174 live URLs: 31 resolve, 119 redirect, 24 410, **0 uncovered.** |
| 6 | Sitemap has lastmod, no 404s, excludes `/old-home-2` and `/404` | **Met in the generator.** 70 entries, all with lastmod. Those two paths are excluded — note neither was ever in the live sitemap. |
| 7 | Every slug passes the slug rules | **Met. All 47.** |
| 8 | Top 15 meet the editorial spec | **Not met.** Not started. |
| 9 | Every commercial post cites a case study | **Enforced, not yet satisfied.** Rule implemented and tested; `intent` is unwritten. |
| 10 | Pillar↔cluster links resolve both ways | **Not met.** `pillar` is unwritten on all 47. |
| 11 | CI guardrails demonstrably fail on a bad post | **Met.** `npm run test:guardrails` — 15 rules, all asserted to fire. |

## What is not done

**Authored frontmatter (blocks criteria 2, 9, 10).** The codemod filled what the
repo knows: slug, `author.title`, category, faq shape, `absorbed`, internal
links. Seven fields per post cannot be derived and are unwritten across all 47:
`targetQuery`, `intent`, `audience`, `funnel`, `tldr`, `citations`,
`statsCount` — plus `pillar`/`cluster`. 29 descriptions are outside 140–160
chars and 22 titles exceed 65. `npm run validate` reports 577 issues.

**Merged bodies — 2 of 27 done.** The 74 MERGE members were deleted and their
URLs redirected; the canonicals are now being rewritten to absorb them.

- `what-is-a-semantic-layer` — absorbed `what-is-a-semantic-data-model` with a
  new section distinguishing the model (the artefact) from the layer (the system
  that governs it), which is the query those 38 inbound links were pointing at.
- `best-ai-bi-tools` — absorbed selection criteria, deployment trade-offs and an
  agentic-analytics definition from the 7 listicles it replaced; 2,296 → 2,886
  words.

The remaining 25 still contain only their original text. Use
`node tools/cluster.mjs <id>` to see a cluster's canonical against every member
it absorbed (pulled from git), and `--section "heading"` to read one section's
full text. `node tools/cluster.mjs --list` names all 27.

**Phase 5b/5c/5d.** No retrofits, no systematic case-study wiring (three were
added opportunistically while removing invented stats), no mid-article CTAs. The
"Rigged Demo Checklist" promised by `how-to-evaluate-ai-bi-tools` still does not
exist and the promise is still in the text.

**App-repo work.** Category hubs, `/blog/page/N` pagination, pillar pages,
`/compare/[competitor]` (14 routes the redirects now point at), Article/FAQPage/
BreadcrumbList/Organization schema, RSS, canonical tags, and the
`nosnippet`/`max-snippet` audit. All deferred by decision; `redirects.next.mjs`
and `sitemap.ts` are ready to drop in.

## The 45 unadjudicated statistics

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
