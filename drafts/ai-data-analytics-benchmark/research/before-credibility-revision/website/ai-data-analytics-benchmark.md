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

<!-- section:content-1 -->

## The same customers, different answers

**The Data Analytics Index is an AI data analytics benchmark comparing agents on the same messy SaaS database. Claude Opus and Supaboard share the highest reported score, but the most useful finding is where answers diverge: matching customers across systems and calculating revenue by industry.** [Read the benchmark report](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md).

Which paying customers are missing from the CRM?

An operations team could use the answer to check account coverage, assign owners or repair incomplete records. Before anyone acts, though, the agent has to work out which billing and CRM records refer to the same business.

The benchmark's answer key identifies 214 customers representing $59,658.33 in monthly recurring revenue; only Claude Opus 5.5 and Supaboard, running Stella Pro, received full credit on this question ([CRM-gap results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q8-paying-customers-missing-from-the-crm)).

Other answers would produce very different work lists: Basedash reported 263 customers, ChatGPT reported 305, and Hex reported 191 ([CRM-gap results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q8-paying-customers-missing-from-the-crm)). An account-repair task would start with a different list depending on which answer the team accepted.

**Disclosure:** Claude, from Anthropic, designed and ran this benchmark on behalf of Supaboard. Supaboard and Claude models are among the products tested. This article analyzes the published report; it is not an independent replication ([Benchmark notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes)).

> **Key Takeaways**
>
> - Claude Opus and Supaboard share the lead in the [reported results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1), with different question-level misses.
> - Customer matching and revenue segmentation exposed larger gaps than several headline metrics.
> - Use the results to choose questions for your own evaluation; inspect the scoring and setup before comparing tools.

Jump to [results](#results), [test setup](#setup), [question difficulty](#difficulty), or [scoring and limitations](#scoring).

<!-- section:content-2 -->

<a id="results"></a>

## The reported leaderboard

These figures reproduce the public report reviewed on 21 October 2026. The scoring and run-selection questions discussed below remain unresolved.

Claude Opus 5.5 and Supaboard each earned 35 of 39 available points, followed by Claude Sonnet 5.5 with 31 points ([Reported leaderboard](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1)). The table includes every tested configuration, including the tie.

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

Source: Data Analytics Index [scores](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1) and [reported response times](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer). Product and model names are reproduced as reported.

The normalized score measures the share of available rubric points, including partial credit. It cannot be read as the percentage of questions answered correctly.

Metabase's result needs particular context. Many of its entries contain SQL that the agent did not execute, and the rubric gives no credit for a figure the agent did not produce itself ([Question-level results and scoring](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md)). That is a limitation of the tested workflow under these rules, not evidence that the product cannot support useful analysis in another setup.

For a broader view of product workflows, see the [AI-native business intelligence tools shortlist](https://supaboard.ai/blog/ai-native-business-intelligence-tools).

<!-- section:content-3 -->

<a id="setup"></a>

## What the agents had to work with

Corvia Systems is a fictional company selling scheduling and dispatch software to clinics and field-service businesses. Its Postgres database contains roughly 20 tables covering billing, CRM, product usage, support, legacy billing and reference data ([Database description](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-database)).

The records are deliberately messy. Systems lack clean shared keys, some records are duplicated or inconsistent, and definitions must be inferred from the data. Agents received database access without documentation, hints or a semantic layer ([Database description](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-database)).

That makes the setup useful for examining an unfamiliar-data problem: can an agent investigate the business records well enough to answer a question? It does not establish how each product performs after a team supplies approved metric definitions and curated models.

Each agent answered the same 13 questions, with each question in a fresh chat and the same short company introduction ([Question protocol](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#the-questions)). The questions covered recurring revenue, retention, receivables, sales, customer identity, usage and support. Some exchanges included a clarification instructing the agent to use its judgment and explain its assumptions ([recorded Supaboard answers](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md)).

Access was not identical. Claude and ChatGPT used Neon connectors with owner access restricted to the benchmark project; the other agents shared a read-only database role. The report says no agent wrote to the database ([Access notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes)). 

<!-- section:content-4 -->

<a id="difficulty"></a>

## Customer identity was harder than several headline metrics

Annual recurring revenue (ARR) by industry had the lowest average score: 0.60 out of 3, with only Claude Opus receiving full credit. The CRM-gap question averaged 1.00, with full credit for only Opus and Supaboard ([Question difficulty](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#which-questions-tripped-agents-up)).

By comparison, the cancellation-spike and annual-billings questions each earned full credit for 9 of the 10 agents, while net revenue retention earned full credit for 8 ([Question difficulty](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#which-questions-tripped-agents-up)). Success on retention or billings did not guarantee success on customer reconciliation.

<figure>
<img src="question-difficulty.png" width="560" height="650" loading="lazy" alt="Selected Data Analytics Index tasks: nine agents earned full credit for cancellations and billings, eight for net retention, two for the CRM gap, one for ARR by industry, and none for enterprise support.">
<figcaption>Selected tasks. Full credit follows the benchmark’s rounding and alternative-answer rules. Source: <a href="https://github.com/Supaboard-AI/data-analytics-index#which-questions-tripped-agents-up">Data Analytics Index</a>.</figcaption>
</figure>

For ARR by industry, the answer key puts Healthcare at 31.0%; the reported answers include 14.15% from Basedash, 29.16% from Supaboard, 36.5% from Lightdash and 47.2% from Claude Sonnet ([ARR-by-industry results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q9-arr-by-industry)). Agreement on the industry label concealed substantial disagreement about its share of revenue.

The report does not establish a single cause for those differences. Without reviewing the underlying queries and complete reasoning, it would be speculation to attribute a result to a particular join, currency conversion or treatment of duplicate records. What the figures do establish is that a plausible category label can accompany a materially different calculation.

Even the simple-sounding customer-count question was difficult: Supaboard alone received full credit for the answer-key count of 863 paying customers ([Customer-count results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count)). A buyer evaluating AI data analytics tools should include questions about who counts as a customer, alongside questions about how much revenue those customers generate.

<!-- section:content-5 -->

## Supaboard's strongest answers and its misses

Supaboard matched the CRM-gap answer and received full credit on customer count, but its shared lead does not mean it answered everything correctly. [CRM-gap results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q8-paying-customers-missing-from-the-crm); [customer-count results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count).

Its weakest result was ARR by industry: 29.16% against the answer key's 31.0%, earning 1 point for a reasonable, correctly calculated interpretation under the rubric ([ARR-by-industry results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q9-arr-by-industry)). Partial credit acknowledges the method; it does not make that answer equal to the key.

For appointments, Supaboard reported 142,668 in September against the all-appointments key of 139,943 and received 2 points ([Appointments results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q11-appointments-trend)). It also received 2 points for enterprise support responsiveness, a question on which no agent received full credit ([Support results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q12-enterprise-support-responsiveness)).

The tied leaders therefore have different strengths in this run. Opus received full credit on ARR by industry and appointments; Supaboard received full credit on customer count and seat utilization ([Question-level results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#results-by-question)). Compare the questions closest to your weekly review before using the aggregate score to choose a tool.

<!-- section:content-6 -->

## Faster answers did not settle the comparison

Basedash had the shortest reported mean response time at 68 seconds, compared with 149 seconds for Claude Opus and 192 seconds for Supaboard ([Response-time results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer)). Basedash also received full credit on retention, the cancellation spike, recognized revenue, annual billings and sales performance ([Question-level results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#results-by-question)). Its speed deserves consideration alongside its misses on customer reconciliation and industry ARR.

The timing method has limits. Measurements run from receipt of the question to the finished answer, using platform server timestamps where available and the platform's timer otherwise. Human waiting time, such as SQL approval, is excluded where the platform records it separately ([Timing method](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#average-time-to-answer)).

The per-agent notes further complicate timing: Lightdash includes SQL-approval waits, and questions ran in parallel for Sonnet and Supaboard but serially for Basedash and Lightdash. [Lightdash notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md); [Sonnet notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md); [Supaboard notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md); [Basedash notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md). These times describe the reported runs, not a controlled latency test. Measure the full path to an answer your team can check and use.

<!-- section:content-7 -->

<a id="scoring"></a>

## How the scoring works, including unresolved cases

The rubric awards 3 points when the answer-key figure appears, including as an alternative or in a sensitivity table; 2 for a figure within 5%; 1 for a reasonable stated method whose result was checked against the database; and 0 otherwise ([Scoring rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring)).

"Exact" has a specific meaning here: counts must match, while money and rates may fall within 0.1% or match at the precision used in the answer ([Precision rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring)). Full credit therefore does not always mean an identical number of decimal places, or that the matching figure was the headline answer.

With 13 questions and a maximum of 3 points each, the normalized score is points divided by 39, multiplied by 100; the Data Analytics Index adds 10 base points, making its maximum 110 ([Index calculation](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring)). That normalized score is not a measured probability that the next answer will be correct.

Some published grades need clarification. Basedash's overdue-receivables entry includes the exact key figure as an alternative but receives 2 points, although the rule permits full credit for alternatives ([Receivables results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q6-overdue-receivables)). Claude Sonnet and Lightdash each receive 1 point on customer count despite reported errors of 3.9%, which appear to meet the stated 2-point tolerance ([Customer-count results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count)). This article preserves the reported scores rather than silently changing the ranking.

Run labels also need reconciliation. Supaboard's receivables notes mark a rerun as counted, while the score table credits the first-run figure; Lightdash's seat-utilization notes have a similar discrepancy. [Supaboard receivables](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables); [Lightdash seat utilization](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q10-seat-utilization). The 312 seconds listed for Supaboard's receivables answer matches the rerun's timer, even though the score credits the first-run figure ([recorded attempts](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables)).

The public report also withholds full prompts to discourage tuning, offers the database and answer key to reviewers on request, and does not report repeated-run variability ([Protocol and notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md)). These gaps, the synthetic dataset and the sponsor relationship limit how broadly the results can be applied.

<!-- section:content-8 -->

## Questions to ask before using the benchmark

### Does this identify the best AI data analytics tool?

It identifies the highest reported scores under this benchmark's setup. That is useful evidence for a shortlist, but it cannot establish the best tool for every company. Your database structure, business definitions, permissions and review process may differ substantially. Read the question-level results alongside the leaderboard, then test the questions your team actually needs answered.

### Why compare general-purpose assistants with BI products?

Both can be used to answer business questions from a database, so comparing their outputs can help an evaluator. Their surrounding workflows still differ. A score does not describe dashboard management, collaboration, deployment or the work required to configure each product. Treat the benchmark as an answer-quality comparison within the reported setup, rather than a complete product review.

### Does full credit mean the headline answer was correct?

Not necessarily. The published rubric accepts the key figure in an alternative answer or sensitivity table, as well as the headline. It also allows defined rounding and precision tolerances ([Scoring rules](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#scoring)). If your team relies on summaries without reading the supporting analysis, inspect where the matching result appears and whether the agent explains which definition it recommends.

### Can someone reproduce the results from the public repository?

The repository publishes question titles, scores and answer summaries, with full answers in the agent folders. However, full question texts, the complete answer key and the database are offered to reviewers on request rather than published ([Repository and access notes](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes)). Reproduction therefore requires additional material, along with clarification of test conditions and how runs were selected.

### Should an evaluation include business definitions?

It should reflect the workflow you intend to use. A test without documentation examines how an agent handles unfamiliar data. A separate test with approved definitions can examine whether it applies your business rules consistently. Keep those conditions distinct, and avoid comparing an unconfigured tool with another that has already received extensive examples and corrections.

### What should a team test on its own database?

Start with questions whose answers someone can verify: the paying-customer population, customers missing from another system, a revenue breakdown and an operational exception. Record the accepted definition and the evidence behind each answer. Review the result, its explanation and the time needed to check it. Repeat important questions to see whether the answer remains consistent.

<!-- section:content-9 -->

## Bring the difficult questions to your own data

The CRM example is a useful place to start. Ask an agent to identify paying customers missing from your CRM, then inspect the records behind the answer. A clean total is helpful only when your team can understand who was included and why.

[Supaboard Agents](https://supaboard.ai/product/agents) can retain business definitions and reviewed SQL examples, while evaluations test important questions against answers you already know. The misses in this benchmark are a reason to use that process. For the broader product decision, explore the [BI comparison hub](https://supaboard.ai/compare), then bring a known-answer question from your own business to the evaluation.
