---
title: "We asked 10 AI agents about the same business. They disagreed."
description: "The Data Analytics Index compares ten agents on one messy SaaS database. Customer matching proved difficult, even when the answers looked close enough."
date: "2026-10-21"
author: "Aritra Ghosh"
canonical: "https://supaboard.ai/blog/ai-data-analytics-benchmark"
slug: "ten-ai-agents-one-database"
site_name: "Supaboard"
lang: "en"
status: "draft"
kicker: "Data Analytics Index"
og_image_alt: "Data Analytics Index cover showing business records connected to a comparison table."
tags: ["AI analytics", "Business intelligence", "Benchmarks"]
---

<div class="benchmark-disclosure">
<p><strong>Disclosure (V):</strong> We commissioned this benchmark at Supaboard, and we're a participant. Claude designed and ran it for us; its Opus and Sonnet models are participants too. These are vendor-reported results from our own repository. The public report does not document independent grading or an outside audit. (<a href="https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes">Benchmark notes</a>)</p>
</div>

<figure class="hero"><img src="hero.webp" width="1732" height="908" fetchpriority="high" alt="Data Analytics Index: ten agents compared on one messy business database."></figure>

## The paying customers your CRM cannot see

Which customers are paying us but missing from the CRM?

That's a useful question for an operations team. Someone needs to find those accounts, work out how much revenue they represent, and decide what to fix. An answer that looks plausible can still send the team after the wrong customers.

In the Data Analytics Index, the answer key identified 214 customers representing $59,658.33 in monthly recurring revenue. Claude Opus 5.5 and Supaboard (Stella Pro) matched that result and received full credit. Hex reported 191 customers, Basedash 263, and ChatGPT 305, each with a different revenue total. ([CRM-gap results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q8-paying-customers-missing-from-the-crm))

An operations team acting on those answers would begin with different account lists and different revenue priorities.

> **What stood out**
>
> - Supaboard and Opus tie in the vendor-reported table; counting Supaboard's receivables rerun puts Opus ahead.
> - Customer matching and revenue by industry separated the agents more than several revenue calculations did.
> - The score scenarios below show what changes when the disputed grades are adjusted.

## A database with enough mess to disagree about

This edition combines general-purpose assistants connected to the database with AI-enabled BI products. The report does not document how these ten configurations were chosen. Omni, Snowflake CoWork and Databricks Genie were not included; their absence is not a performance result. Treat this as a comparison of the tested configurations, not a complete market ranking. ([Tested configurations](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1))

The test business, Corvia Systems, is fictional. It sells scheduling and dispatch software by the seat to clinics and field-service companies. Its Postgres database contains roughly twenty tables across billing, CRM, product usage, support, a legacy billing export and reference data. ([Benchmark setup](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-database))

Records are duplicated or inconsistent. Systems do not share clean keys. The agents received no documentation, hints or semantic layer to settle the definitions for them.

Each task began in a fresh chat with the same short company introduction. The thirteen questions covered familiar work: recurring revenue, retention, overdue invoices, sales performance, usage and support. Some recorded exchanges include a clarification telling the agent to use its judgment and state its assumptions. ([Question protocol](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-questions), [Supaboard answers](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md))

This setup tests investigation of unfamiliar data. An evaluation with approved definitions or a curated semantic model would test a different workflow.

## The reported results

Supaboard (Stella Pro) and Claude Opus 5.5 each earned 35 of 39 available points. ([Published ranking](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1)) The table reproduces the report reviewed on 21 October 2026, with "accuracy" labeled as the share of available points. All results are vendor-reported (V); the scenario below makes the grading sensitivity explicit.

| Agent | Points / 39 | Share of available points |
|---|---:|---:|
| Supaboard (Stella Pro) | 35 | 89.7% |
| Claude Opus 5.5 | 35 | 89.7% |
| Claude Sonnet 5.5 | 31 | 79.5% |
| Lightdash | 28 | 71.8% |
| Basedash | 27 | 69.2% |
| ChatGPT (GPT-6) | 26 | 66.7% |
| Dot | 22 | 56.4% |
| Hex | 19 | 48.7% |
| Sigma | 17 | 43.6% |
| Metabase | 0 | 0.0% |

Metabase's zero reflects a workflow in which many answers contained SQL that the agent did not execute; those queries were not tested for correctness. ([Metabase results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/metabase/README.md))

Each response earns up to three points, including partial credit. Divide total points by 39 and multiply by 100 for the normalized percentage; the Data Analytics Index adds ten, so its maximum is 110. The reported joint leaders have an index of 99.7. ([Scoring formula](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

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

## Revenue by industry was harder than the cancellation spike

Nine agents received full credit for identifying the May cancellation spike as a Meridian Health consolidation involving sixteen clinics on 15 May; nine also received full credit for comparing annual billings. ([Question results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#which-questions-tripped-agents-up))

The picture changed when the question was annual recurring revenue (ARR) by industry. The key put healthcare at 31.0%. Only Opus received full credit; the reported healthcare shares ranged from Basedash's 14.15% to Sonnet's 47.2%. ([ARR results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q9-arr-by-industry))

All the agents that returned a figure in that table named healthcare. A reader checking only the industry label would miss the disagreement over its share of revenue.

<img src="question-difficulty.png" width="560" height="650" loading="lazy" alt="Selected Data Analytics Index tasks: nine agents earned full credit for cancellations and billings, eight for net retention, two for the CRM gap, one for ARR by industry, and none for enterprise support.">

*Selected tasks, vendor-reported (V). Full credit follows the benchmark's rounding and alternative-answer rules. ([Published full-credit counts](https://github.com/Supaboard-AI/data-analytics-index#which-questions-tripped-agents-up))*

The practical question is whether the result uses the customer population and revenue definition you intended. A percentage on its own cannot tell you that. You need the underlying records and the agent's assumptions to check it.

## Where Supaboard fell short

Supaboard's joint-first total includes misses. It returned a healthcare share of 29.16% against the 31.0% key and received one point for a reasonable alternative method. ([Supaboard ARR result](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q9-arr-by-industry))

It also received two points on the appointments trend and enterprise support questions, rather than full credit. ([Supaboard scores](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#scores)) Its full-credit seat-utilization figure appeared in a sensitivity table, which the rubric allows. ([Supaboard seat utilization](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q10-seat-utilization))

If your weekly review depends on revenue by industry, Supaboard's result on that question needs checking despite its high aggregate score.

## Speed needs a careful comparison

Basedash had the fastest reported average at 68 seconds. Opus averaged 149 seconds and Supaboard 192 seconds. ([Response times](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer))

The report uses platform timestamps where available and platform timers otherwise. Lightdash's time includes SQL approval waits. Supaboard ran questions concurrently, while Basedash ran them sequentially. These are times from the recorded sessions, not a controlled latency comparison. ([Timing method](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer), [Lightdash setup](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md), [Supaboard setup](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md), [Basedash setup](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md))

## Scoring notes and limits

The rubric accepts the key figure as a headline, alternative or sensitivity-table result. Counts must match for full credit; money and rates can fall within 0.1% or match at the written precision. Close answers within five percent earn two points. ([Scoring rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

This is one synthetic SaaS database. Full prompts, the answer key and the database are available to reviewers on request. Claude and ChatGPT used Neon project-owner access; the other agents used a shared read-only role. The report says no agent wrote to the database, and it does not report repeated-run variability. ([Protocol and access notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes))

<a id="errata"></a>

### Errata and run-selection note

Basedash's receivables answer includes the exact open-invoice total, but its top-five list includes uncollectible debtors. The scenario above follows the rubric's allowance for exact alternatives; the report needs to explain whether a separate completeness criterion caused the lower grade. Sonnet's and Lightdash's customer-count answers include figures within the stated five-percent band. ([Basedash Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md#q6-overdue-receivables), [Sonnet Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md#q13-customer-count), [Lightdash Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q13-customer-count))

Lightdash's seat-utilization score credits a first-run 57.5% figure, while its rerun is labeled counted. Grading the rerun's precise 57.7% at two points would subtract one point, taking Lightdash from the scenario's 29 to 28 and tying the adjusted Basedash total. Its coarser "about 58%" headline also makes the report's rounding rule relevant. Run selection and precision treatment need to be explicit before declaring a corrected score. ([Lightdash Q10](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q10-seat-utilization), [precision rule](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring))

Supaboard's listed 312 seconds for receivables matches its rerun timer, although the score credits its first run. The timing table therefore also needs reconciliation. These calculations show the effects of the flagged issues; they do not replace an audit of every response. ([Supaboard Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables))

## The work after the answer

The benchmark measures answers to business questions. It did not score building dashboards, preparing a weekly deck or sending the recurring report. Similar answer scores leave those parts of the product decision open.

Supaboard is the one AI agent that does the whole analyst job on your own database. After an answer, the same agent can build a dashboard, prepare a report or deck, and run the recurring analysis on a schedule. ([Dashboards](https://supaboard.ai/product/dashboards), [Automations](https://supaboard.ai/product/automations))

Give it seven days with one weekly review you already run. Bring twenty questions whose answers you know, teach the agent your definitions, and score its answers with [evaluations](https://supaboard.ai/product/agents). Then check whether it can produce and deliver the review you need. That tests both the answers and the work that follows them.

[Start Free](https://auth.supaboard.ai/onboard/register), or [book a 30-minute demo](https://calendly.com/aritra-ewq/supaboard-demo) to scope that evaluation. Seven days is the suggested evaluation window; access and AI allowances follow the [current plan](https://supaboard.ai/pricing).
