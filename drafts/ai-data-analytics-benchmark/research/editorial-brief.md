# Data Analytics Index: editorial brief

Prepared 21 October 2026. Status: outline approved; website and Substack drafts completed. No article has been published or added to `posts/`.

## Recommended direction

Website title: **AI data analytics benchmark: 10 agents, one messy database**

Substack title: **We asked 10 AI agents about the same business. They disagreed.**

The story follows a business question through the results: which paying customers are missing from the CRM? The report's answer is 214 customers and $59,658.33 in monthly recurring revenue. Only Claude Opus 5.5 and Supaboard (Stella Pro) received full credit on that question. Use this to introduce the difficulty of reconciling business records, then show the complete ranking and explain its limits.

The supplied report is the primary source. Describe its findings as reported results. Calculations in its summary tables have been independently reconciled to its question-level rows, but neither the database nor the underlying SQL and complete answers have been inspected. Do not claim independent replication or invent causes for individual errors.

The blog-writing skill's `data-research` template informs the structure. Its evidence requirements are not fully satisfied: exact test dates, raw responses, database access, and run-selection policy are absent from the attachment. Until those are supplied, treat the article as analysis of the supplied benchmark report rather than a newly reproduced study. Use a subject-led generic outline instead of claiming all original-research delivery requirements have passed.

## Keyword research

OpenRush research retrieved 21 October 2026, United States, English. Full tool responses and provenance are saved in `openrush-results.json`.

| Query | Reported monthly volume | CPC, USD | Intent | Role |
|---|---:|---:|---|---|
| ai data analytics tools | 110 | 18.82 | Commercial | Main supporting category phrase |
| ai tools for data analytics | 110 | 18.21 | Commercial | Natural variant |
| best ai data analytics tools | 40 | Unavailable | Commercial | Related buyer intent, not a universal-best headline |
| ai business intelligence tools | 210 | 37.99 | Commercial | Secondary phrase and internal-link context |
| ai business intelligence | 2,400 | 1.14 | Commercial | Broad context; not this article's primary target |
| ai data analytics benchmark | Unavailable | Unavailable | Informational | Recommended distinctive target query |
| ai data agent benchmark | Unavailable | Unavailable | Informational | Supporting benchmark terminology |

Unavailable volume is unknown, not zero. These are indexed demand estimates, not first-party traffic measurements. Indexed opportunity facts carried confidence 0.7; observed SERP facts carried confidence 0.95. OpenRush's competition field is not a numerical organic SEO difficulty score.

Broad `ideas` expansions produced unrelated results. The recommendation uses exact-keyword inspection and the narrower `suggestions` expansion instead. No search-volume claim should enter the public article.

OpenRush's live result snapshot placed Supaboard's existing [AI-native BI shortlist](https://supaboard.ai/blog/ai-native-business-intelligence-tools) third for “ai business intelligence tools.” Keep the new page focused on reproducible comparisons and the Data Analytics Index; link it to the shortlist rather than write a second general tool list. This is one US/English snapshot, not a persistent ranking claim.

The sampled Google AI Overview citation map returned YouTube, Reddit, LinkedIn, Wikipedia, IBM and Coursera among its cited domains. This supports keeping definitions and methodology extractable; it does not establish visibility in ChatGPT, Claude, Gemini, Perplexity or Copilot, or predict citations for this article.

## Proposed website outline

1. **Opening:** the CRM-gap question, its answer-key result, and why different answers would lead to different work for an operations team. Explain that this is a comparison of ten tested configurations on one synthetic database.
2. **Disclosure and results:** state that Claude designed and ran the test on behalf of Supaboard, which is included alongside Claude products. Show every agent's reported points, normalized score, index, and average time. Keep the tie explicit.
3. **What the agents were given:** fictional Corvia Systems, roughly twenty tables across billing, CRM, usage, support, legacy billing and reference data; deliberately messy records; no documentation, hints or semantic layer. Explain the connector-permission difference.
4. **Where answers diverged:** CRM matching and ARR by industry. Contrast these with the cancellation-spike and billings tasks. Explain what the figures show without diagnosing uninspected queries.
5. **What Supaboard got right and missed:** joint-first total; exact customer count and CRM-gap result; lower scores for ARR by industry, appointments, and enterprise support. Avoid implying a flawless run.
6. **Speed alongside the score:** Basedash's 68-second reported mean versus the leaders' 149 and 192 seconds. Explain timer differences and human-wait exclusions. Do not claim a causal speed–accuracy relationship.
7. **How scoring works:** 0–3 rubric, partial credit, precision tolerance, alternatives and sensitivity tables; 39-point maximum; index adds ten to normalized points. “89.7%” is a share of available rubric points, not a percentage of correctly answered questions. Use “full credit” rather than “exact” as a blanket label.
8. **Limits and evaluation advice:** one dataset, withheld prompts, sponsorship, setup differences, unresolved rubric questions, and lack of repeatability evidence. Recommend checking one's own business definitions and known-answer questions. Close with a restrained link to Supaboard's agent evaluations.

Use a full HTML/Markdown results table and a question-difficulty chart. A second chart can show score against average response time if labels remain readable. No stock illustration is needed to explain the findings. The cover should be original editorial artwork, not a product screenshot or a misleading chart.

## Substack adaptation

Use the same evidence and disclosure, with a shorter opening and less metadata. Retain the full leaderboard or an accessible table image with a text equivalent, the CRM example, the ARR finding, Supaboard's misses, and scoring caveats. End with the concrete question readers should test on their own data. Link to the website version only after its final public URL exists. Do not invent a founder's personal testing experience.

## Decisions pending

- Narrative approved by the user on 21 October 2026.
- Public report supplied by the user and verified: https://github.com/Supaboard-AI/data-analytics-index. Selected per-agent answers reviewed; see public-source-addendum.md.
- Clarification of the specific scoring cases in `source-audit.md`; otherwise preserve scores as reported and explicitly describe their unresolved status.
- Test date, exact versions, snapshot date for “today,” and run-selection policy.
- Final byline from a real author or reviewer. Do not assign a human author without confirmation.

## Delivery preparation

Both versions must receive the installed humanizer's identify, rewrite, review and finalize pass after drafting and before rendering. Refresh all preview files and bundles afterward. Website content remains under `drafts/` until approved for publication; local asset paths are draft assets and must be mapped to the site's asset storage before deployment.

The default runtime lacked browser/PDF support. An existing local blog runtime and a temporary browser installation supplied rendering and verification. Both final versions have HTML/PDF previews; source-grade reconciliation and publishing metadata remain release tasks.


## Benchmark keyword additions: 21 October 2026

US English OpenRush research; all selected phrases have four words.

| Phrase | Monthly searches | Advertising competition | Placement |
|---|---:|---|---|
| AI data analytics benchmark | Unavailable | Unavailable | Existing primary target and title; added to introduction |
| AI data analysis benchmark | Unavailable | Unavailable | FAQ question |
| AI agent benchmark leaderboard | 20 | Medium | Results heading |

These are relevance targets, not verified high-volume or low-organic-difficulty opportunities. OpenRush's competition field measures advertiser competition. Keep the higher-volume analysis phrases in the broader keyword plan. AI model benchmark comparison (50 searches, Low advertising competition) was excluded because this article compares configured agents and BI products, not isolated models. Business intelligence tools benchmark returned 0 reported monthly searches and was not added.

Evidence: openrush-benchmark-keywords.json.
