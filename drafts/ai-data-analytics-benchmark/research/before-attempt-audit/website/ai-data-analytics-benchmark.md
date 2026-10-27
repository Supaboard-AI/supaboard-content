---
title: "AI data analytics benchmark: 10 agents, one messy database"
description: "Compare 10 AI data agents on a messy SaaS database. See reported scores, CRM-matching failures, response times, and the limits of the Data Analytics Index."
date: "2026-10-21"
author: "Aritra Ghosh"
canonical: "https://supaboard.ai/blog/ai-data-analytics-benchmark"
slug: "ai-data-analytics-benchmark"
site_name: "Supaboard"
lang: "en"
status: "draft"
og_image_alt: "Original editorial illustration of business records being compared across billing and CRM systems"
tags: ["AI", "Business Intelligence", "SaaS"]
---

<div class="benchmark-disclosure">
<p><strong>Disclosure (V):</strong> We commissioned this benchmark at Supaboard, and we're a participant. Claude designed and ran it for us; its Opus and Sonnet models are participants too. These are vendor-reported results from our own repository. The public report does not document independent grading or an outside audit. (<a href="https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes">Benchmark notes</a>)</p>
</div>

<figure class="hero"><img src="hero.webp" width="1732" height="908" fetchpriority="high" alt="Data Analytics Index: ten agents compared on one messy business database."></figure>

<!-- section:content-1 -->

## The same customers, different answers

The Data Analytics Index compares AI data agents on one messy SaaS database. Its most useful finding is the disagreement over customer identity: which records belong to the same business, which accounts count as paying, and how much revenue they represent. ([Benchmark report](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md))

Which paying customers are missing from the CRM?

An operations team could use the answer to check account coverage, assign owners or repair incomplete records. Before anyone acts, the agent has to match records across billing and CRM.

The answer key identifies 214 customers representing $59,658.33 in monthly recurring revenue. Supaboard (Stella Pro) and Claude Opus 5.5 received full credit. Hex reported 191 customers, Basedash 263, and ChatGPT 305. An account-repair task would begin with a different work list depending on which answer the team accepted. ([CRM-gap results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q8-paying-customers-missing-from-the-crm))

> **What stood out**
>
> - Customer matching and revenue segmentation exposed larger gaps than several headline metrics.
> - Supaboard and Opus tie in the vendor-reported table; counting Supaboard's receivables rerun puts Opus ahead.
> - The score scenarios below make the effect of disputed grades visible.

Jump to [results](#results), [test setup](#setup), [question difficulty](#difficulty), or [scoring and errata](#scoring).

<!-- section:content-2 -->

<a id="results"></a>

## The reported leaderboard

V means vendor-reported: these figures reproduce our public README reviewed on 21 October 2026. The scenario table immediately below shows how the flagged grades affect the ranking.

Supaboard and Claude Opus 5.5 each earned 35 of 39 available points, followed by Claude Sonnet 5.5 with 31 points. ([Reported leaderboard](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1)) The table includes every tested configuration.

| Rank | Agent or tested configuration | Points / 39 | Normalized score | Data Analytics Index | Mean time |
|---|---|---:|---:|---:|---:|
| 1= | Supaboard (Stella Pro) | 35 | 89.7% | 99.7 | 192 s |
| 1= | Claude Opus 5.5 | 35 | 89.7% | 99.7 | 149 s |
| 3 | Claude Sonnet 5.5 | 31 | 79.5% | 89.5 | 98 s |
| 4 | Lightdash | 28 | 71.8% | 81.8 | 173 s |
| 5 | Basedash | 27 | 69.2% | 79.2 | 68 s |
| 6 | ChatGPT (GPT-6) | 26 | 66.7% | 76.7 | 196 s |
| 7 | Dot | 22 | 56.4% | 66.4 | 152 s |
| 8 | Hex | 19 | 48.7% | 58.7 | 75 s |
| 9 | Sigma | 17 | 43.6% | 53.6 | 225 s |
| 10 | Metabase | 0 | 0.0% | 10.0 | 180 s |

Metabase's zero reflects the tested workflow: many answers contained SQL that the agent did not execute, which earned no credit; it does not show that those queries were wrong. ([Metabase results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/metabase/README.md))

All values in this table are V, including the timing figures. The normalized score is the share of rubric points, including partial credit. ([Reported scores](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1), [response times](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer))

### What the disputed grades change

Applying the published numeric rules to the flagged answers would add one point each to Basedash's receivables result and Sonnet's and Lightdash's customer counts. The table below shows that scenario separately from the vendor's reported totals. It is a recalculation from the published answers, not a fresh database test. ([Scoring rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring), [receivables](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q6-overdue-receivables), [customer count](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count))

| Agent | Reported points | With those three grading changes | If Supaboard's receivables rerun also counts |
|---|---:|---:|---:|
| Supaboard (Stella Pro) | 35 | 35 | 34 |
| Claude Opus 5.5 | 35 | 35 | 35 |
| Claude Sonnet 5.5 | 31 | 32 | 32 |
| Lightdash | 28 | 29 | 29 |
| Basedash | 27 | 28 | 28 |

The three increases leave the order unchanged. Sonnet's normalized score becomes 82.1% (index 92.1), Lightdash's 74.4% (84.4), and Basedash's 71.8% (81.8), using the same calculation. ([Scoring formula](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

**The lead depends on which Supaboard run counts.** The first run contains the key figure and retains three points, leaving Supaboard and Opus tied at 35. The rerun lists $307,535 against the $305,557.25 key, about 0.65% higher. Under the numeric rule it earns two points: Supaboard falls to 34/39, or 87.2% (index 97.2), and Opus leads alone at 35/39. The repository labels that rerun "counted" while its score table credits the first run. ([Supaboard's two attempts](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables))

These scenarios hold every other grade fixed. The [errata note](#errata) covers the remaining run-selection and rounding questions, including Lightdash's seat-utilization result.

For a broader view of product workflows, see the [AI-native business intelligence tools shortlist](https://supaboard.ai/blog/ai-native-business-intelligence-tools).

<!-- section:content-3 -->

<a id="setup"></a>

## Which tools were tested, and on what data

This edition combines general-purpose assistants connected to the database with AI-enabled BI products. The report does not document how these ten configurations were chosen. Omni, Snowflake CoWork and Databricks Genie were not included; their absence is not a performance result. Treat this as a comparison of the tested configurations, not a complete market ranking. ([Tested configurations](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1))

Corvia Systems is a fictional company selling scheduling and dispatch software to clinics and field-service businesses. Its Postgres database contains roughly 20 tables covering billing, CRM, product usage, support, legacy billing and reference data. ([Database description](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-database))

The records are deliberately messy. Systems lack clean shared keys, some records are duplicated or inconsistent, and definitions must be inferred from the data. Agents received database access without documentation, hints or a semantic layer. ([Database description](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-database))

This tests how an agent investigates unfamiliar data. An evaluation with approved metric definitions and curated models would test a different workflow.

Each agent answered the same 13 questions, with each question in a fresh chat and the same short company introduction. ([Question protocol](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-questions)) The questions covered recurring revenue, retention, receivables, sales, customer identity, usage and support. Some exchanges included a clarification instructing the agent to use its judgment and explain its assumptions. ([recorded Supaboard answers](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md))

Access was not identical. Claude and ChatGPT used Neon connectors with owner access restricted to the benchmark project; the other agents shared a read-only database role. The report says no agent wrote to the database. ([Access notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes)) 

<!-- section:content-4 -->

<a id="difficulty"></a>

## Customer identity was harder than several headline metrics

Annual recurring revenue (ARR) by industry had the lowest average score: 0.60 out of 3, with only Claude Opus receiving full credit. The CRM-gap question averaged 1.00, with full credit for only Opus and Supaboard. ([Question difficulty](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#which-questions-tripped-agents-up))

By comparison, the cancellation-spike and annual-billings questions each earned full credit for 9 of the 10 agents, while net revenue retention earned full credit for 8. ([Question difficulty](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#which-questions-tripped-agents-up)) Success on retention or billings did not guarantee success on customer reconciliation.

<figure>
<img src="question-difficulty.png" width="560" height="650" loading="lazy" alt="Selected Data Analytics Index tasks: nine agents earned full credit for cancellations and billings, eight for net retention, two for the CRM gap, one for ARR by industry, and none for enterprise support.">
<figcaption>Selected tasks. Full credit follows the benchmark’s rounding and alternative-answer rules. Vendor-reported (V). (<a href="https://github.com/Supaboard-AI/data-analytics-index#which-questions-tripped-agents-up">Data Analytics Index</a>)</figcaption>
</figure>

For ARR by industry, the answer key puts Healthcare at 31.0%; the reported answers include 14.15% from Basedash, 29.16% from Supaboard, 36.5% from Lightdash and 47.2% from Claude Sonnet. ([ARR-by-industry results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q9-arr-by-industry)) Agreement on the industry label concealed substantial disagreement about its share of revenue. The published comparison does not isolate the cause of each mismatch, so the figures alone cannot tell us which join or definition went wrong.

Even the simple-sounding customer-count question was difficult: Supaboard alone received full credit for the answer-key count of 863 paying customers. ([Customer-count results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count)) A buyer evaluating AI data analytics tools should include questions about who counts as a customer, alongside questions about how much revenue those customers generate.

<!-- section:content-5 -->

## Supaboard's strongest answers and its misses

Supaboard matched the CRM-gap answer and received full credit on customer count. Its misses matter just as much when those questions are part of your weekly review. ([CRM-gap results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q8-paying-customers-missing-from-the-crm), [customer-count results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count))

Its weakest result was ARR by industry: 29.16% against the answer key's 31.0%, earning 1 point for a reasonable, correctly calculated interpretation under the rubric. ([ARR-by-industry results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q9-arr-by-industry)) The rubric credits the method while recording the mismatch.

For appointments, Supaboard reported 142,668 in September against the all-appointments key of 139,943 and received 2 points. ([Appointments results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q11-appointments-trend)) It also received 2 points for enterprise support responsiveness, a question on which no agent received full credit. ([Support results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q12-enterprise-support-responsiveness))

Supaboard and Opus have different strengths in the reported runs. Opus received full credit on ARR by industry and appointments; Supaboard received full credit on customer count and seat utilization. ([Question-level results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#results-by-question)) Compare the questions closest to your weekly review before using the aggregate score to choose a tool.

<!-- section:content-6 -->

## Faster answers did not settle the comparison

Basedash had the shortest reported mean response time at 68 seconds, compared with 149 seconds for Claude Opus and 192 seconds for Supaboard. ([Response-time results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer)) Basedash also received full credit on retention, the cancellation spike, recognized revenue, annual billings and sales performance. ([Question-level results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#results-by-question)) Its speed deserves consideration alongside its misses on customer reconciliation and industry ARR.

The timing method has limits. Measurements run from receipt of the question to the finished answer, using platform server timestamps where available and the platform's timer otherwise. Human waiting time, such as SQL approval, is excluded where the platform records it separately. ([Timing method](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer))

The per-agent notes further complicate timing: Lightdash includes SQL-approval waits, and questions ran in parallel for Sonnet and Supaboard but serially for Basedash and Lightdash. ([Lightdash notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md), [Sonnet notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md), [Supaboard notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md), [Basedash notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md)) These times describe the reported runs, not a controlled latency test. Measure the full path to an answer your team can check and use.

<!-- section:content-7 -->

<a id="scoring"></a>

## How the scoring works

Each answer earns up to three points: three when the key figure appears, including in an alternative or sensitivity table; two for a figure within five percent; one for a reasonable stated method with a result checked against the database; and zero otherwise. Counts must match for full credit. Money and rates can be within 0.1% or match at the precision used in the answer. ([Scoring and precision rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

The maximum is 39 points. Divide the total by 39 and multiply by 100 for the normalized score, then add ten for the Data Analytics Index, whose maximum is 110. A score of 89.7% therefore means 89.7% of available rubric points, not that 89.7% of questions were answered exactly. ([Index calculation](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

The report publishes answer summaries and full agent responses. Full prompts, the database and the answer key are available to reviewers on request; repeated-run variability is not reported. This is a vendor-run evaluation on one synthetic database, with the conflicts of interest disclosed above. ([Protocol and access notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes))

<a id="errata"></a>

### Errata and run-selection note

Basedash's receivables answer includes the exact open-invoice total, but its top-five list includes uncollectible debtors. The scenario above follows the rubric's allowance for exact alternatives; the report needs to explain whether a separate completeness criterion caused the lower grade. Sonnet's and Lightdash's customer-count answers include figures within the stated five-percent band. ([Basedash Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md#q6-overdue-receivables), [Sonnet Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md#q13-customer-count), [Lightdash Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q13-customer-count))

Lightdash's seat-utilization score credits a first-run 57.5% figure, while its rerun is labeled counted. Grading the rerun's precise 57.7% at two points would subtract one point, taking Lightdash from the scenario's 29 to 28 and tying the adjusted Basedash total. Its coarser "about 58%" headline also makes the report's rounding rule relevant. Run selection and precision treatment need to be explicit before declaring a corrected score. ([Lightdash Q10](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q10-seat-utilization), [precision rule](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

Supaboard's listed 312 seconds for receivables matches its rerun timer, although the score credits its first run. The timing table therefore also needs reconciliation. These calculations show the effects of the flagged issues; they do not replace an audit of every response. ([Supaboard Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables))

<!-- section:content-8 -->

## Questions to ask before using the benchmark

### What does the Opus tie tell us?

It compares answer quality under the reported setup. Building a live dashboard, producing the weekly report and delivering it on schedule are separate jobs. The benchmark did not score those workflows. Evaluate them separately before treating similar answer scores as evidence that two products do the same work. ([Question list](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-questions))

### Why compare general-purpose assistants with BI products?

Both can answer business questions from a connected database. The useful comparison is the evidence each returns for the same question. When choosing a product, also test the work around that answer: configuration, collaboration, recurring reporting and the effort required to keep it useful as your data changes.

### Does full credit mean the headline answer matched?

Full credit can come from an alternative answer or a sensitivity table. For a team that reads only the summary, that distinction matters. Check where the matching result appears, which definition the agent recommends, and whether a reader can understand that recommendation without inspecting every table. ([Scoring rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

### Can I reproduce the results?

Request the full prompts, database and answer key from the benchmark owner, then agree on a run-selection rule before testing. The public repository supplies the recorded responses and scores. Reproduction also needs comparable permissions, execution settings and timing boundaries, with repeated runs to measure consistency. ([Access notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes))

### What would make the Metabase result more informative?

A follow-up should first verify that the agent can execute queries in the intended configuration, then rerun the same questions and record the setup. Keep that result separate from this SQL-only workflow. The existing zero measures completed answers under the stated rubric; unexecuted SQL remains untested. ([Metabase responses](https://github.com/Supaboard-AI/data-analytics-index/blob/main/metabase/README.md))

### Should I supply my business definitions?

Use the configuration you intend to rely on. A test with no documentation measures investigation of unfamiliar data. A test with approved definitions measures whether the agent applies your rules consistently. Record the definitions, permissions and accepted answers before running either test, so a later correction does not quietly change the comparison.

<!-- section:content-9 -->

## Test the whole weekly review

Supaboard is the one AI agent that does the whole analyst job on your own database. After an answer, the same agent can build a dashboard, prepare a report or deck, and run the recurring analysis on a schedule. Those capabilities are separate from the answer-quality results above. ([Dashboards](https://supaboard.ai/product/dashboards), [Automations](https://supaboard.ai/product/automations))

Give it seven days with one weekly review you already run. Bring twenty questions whose answers you know, teach the agent your definitions, and score its answers with [evaluations](https://supaboard.ai/product/agents). Then check whether it can produce and deliver the review you need. That tests both the answers and the work that follows them.

[Start Free](https://auth.supaboard.ai/onboard/register), or [book a 30-minute demo](https://calendly.com/aritra-ewq/supaboard-demo) to scope that evaluation. Seven days is the suggested evaluation window; access and AI allowances follow the [current plan](https://supaboard.ai/pricing).
