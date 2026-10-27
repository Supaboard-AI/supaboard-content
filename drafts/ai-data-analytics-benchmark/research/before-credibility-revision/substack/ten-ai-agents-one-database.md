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

## The paying customers your CRM cannot see

Which customers are paying us but missing from the CRM?

That's a useful question for an operations team. Someone needs to find those accounts, work out how much revenue they represent, and decide what to fix. An answer that looks plausible can still send the team after the wrong customers.

In the [Data Analytics Index](https://github.com/Supaboard-AI/data-analytics-index#q8-paying-customers-missing-from-the-crm), the answer key identified 214 customers representing $59,658.33 in monthly recurring revenue. Claude Opus 5.5 and Supaboard (Stella Pro) matched that result and received full credit. Other agents returned figures including 263, 305 and 412 customers, each with a different revenue total.

An operations team acting on those answers would begin with different account lists and different revenue priorities.

We commissioned this benchmark at Supaboard. Claude designed and ran it on our behalf, and both Supaboard and Claude models appear in the results. That relationship matters when reading the rankings. The [public report and full answers](https://github.com/Supaboard-AI/data-analytics-index) let you inspect what each tested configuration produced.

> **What stood out**
>
> - Supaboard and Claude Opus tied at the top of the reported points table.
> - Customer matching and revenue by industry separated the agents more than several revenue calculations did.
> - The published scoring and run-selection details still need reconciliation in a few places.

## A database with enough mess to disagree about

The test business, Corvia Systems, is fictional. It sells scheduling and dispatch software by the seat to clinics and field-service companies. Its Postgres database contains roughly twenty tables across billing, CRM, product usage, support, a legacy billing export and reference data, according to the [benchmark setup](https://github.com/Supaboard-AI/data-analytics-index#the-database).

Records are duplicated or inconsistent. Systems do not share clean keys. The agents received no documentation, hints or semantic layer to settle the definitions for them.

Each task began in a fresh chat with the same short company introduction. The [thirteen questions](https://github.com/Supaboard-AI/data-analytics-index#the-questions) covered familiar work: recurring revenue, retention, overdue invoices, sales performance, usage and support. Some recorded exchanges include a clarification telling the agent to use its judgment and state its assumptions, as shown in the [Supaboard answers](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md).

This setup tests how an agent handles an unfamiliar database. A product running on a carefully maintained semantic model could perform differently. So could the same agent with explicit business definitions.

## The reported results

Supaboard (Stella Pro) and Claude Opus 5.5 each earned 35 of 39 available points in the [published ranking](https://github.com/Supaboard-AI/data-analytics-index#data-analytics-index). The table reproduces the report reviewed on 21 October 2026, with "accuracy" labeled as the share of available points. The scoring questions discussed below remain unresolved.

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

Each response earns up to three points, with partial credit for close answers or a defensible alternative method. The Data Analytics Index adds ten base points to the normalized percentage, giving the joint leaders an index of 99.7 out of 110 under the [scoring formula](https://github.com/Supaboard-AI/data-analytics-index#scoring). Neither number is the percentage of questions answered exactly.

Metabase needs context here. Many of its entries contain SQL that the agent did not execute. Those entries received no credit under the rule requiring an agent-produced result; the [Metabase report](https://github.com/Supaboard-AI/data-analytics-index/blob/main/metabase/README.md) does not establish that every unexecuted query was wrong.

## Revenue by industry was harder than the cancellation spike

Nine agents received full credit for identifying the May cancellation spike as a Meridian Health consolidation involving sixteen clinics on 15 May; nine also received full credit for comparing annual billings, according to the [question results](https://github.com/Supaboard-AI/data-analytics-index#which-questions-tripped-agents-up).

The cancellation answer recovered a specific business event that a team could investigate, and the billings answers met the benchmark's precision rules.

The picture changed when the question was annual recurring revenue (ARR) by industry. The key put healthcare at 31.0%. Only Opus received full credit; the reported healthcare shares ranged from Basedash's 14.15% to Sonnet's 47.2% in the [ARR results](https://github.com/Supaboard-AI/data-analytics-index#q9-arr-by-industry).

All the agents that returned a figure in that table named healthcare. A reader checking only the industry label would miss the disagreement over its share of revenue.

<img src="question-difficulty.png" width="560" height="650" loading="lazy" alt="Selected Data Analytics Index tasks: nine agents earned full credit for cancellations and billings, eight for net retention, two for the CRM gap, one for ARR by industry, and none for enterprise support.">

*Selected tasks, using the [published full-credit counts](https://github.com/Supaboard-AI/data-analytics-index#which-questions-tripped-agents-up). Full credit follows the benchmark's rounding and alternative-answer rules.*

The practical question is whether the result uses the customer population and revenue definition you intended. A percentage on its own cannot tell you that. You need the underlying records and the agent's assumptions to check it.

## Where Supaboard fell short

Supaboard's joint-first total includes misses. It returned a healthcare share of 29.16% against the 31.0% key and received one point for a reasonable alternative method, according to its [ARR result](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q9-arr-by-industry).

It also received two points on the appointments trend and enterprise support questions, rather than full credit, in the [Supaboard score table](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#scores). Its full-credit seat-utilization figure appeared in a sensitivity table, which the rubric allows.

If your weekly review depends on revenue by industry, Supaboard's result on that question needs checking despite its high aggregate score.

## Speed needs a careful comparison

Basedash had the fastest reported average at 68 seconds. Opus averaged 149 seconds and Supaboard 192 seconds in the [timing table](https://github.com/Supaboard-AI/data-analytics-index#average-time-to-answer).

The clocks were not fully comparable. The report uses platform timestamps where available and platform timers otherwise. Human waiting is excluded only where separately recorded, while the [Lightdash setup](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md) says its times include SQL approval waits. Some platforms ran questions concurrently and others ran them sequentially, as the [Supaboard](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md) and [Basedash](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md) setup notes describe.

These numbers describe the recorded sessions. They are not a controlled measure of how long every user will wait, and they do not show that spending longer caused a better answer.

## What still needs checking in the benchmark

The published totals add up, but some grading decisions need an explanation. [Basedash's overdue-receivables answer](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md#q6-overdue-receivables) includes the exact open-invoice total yet earns two points, despite a rubric that accepts exact alternatives. [Sonnet](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md#q13-customer-count) and [Lightdash](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q13-customer-count) receive one point for customer-count answers that include figures inside the stated five-percent band.

Run labels also need reconciliation. [Supaboard's receivables entry](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables) credits a first-run figure while labeling a rerun counted; its listed time matches that rerun. [Lightdash's seat-utilization entry](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q10-seat-utilization) has a similar first-run-versus-rerun distinction. The table above preserves the report's scores rather than assigning new ones.

There are broader limits too. This is one synthetic SaaS database. The exact prompts, answer key and database are not public. Claude and ChatGPT connected through Neon with project-owner access, while the other agents used a shared read-only role; the [report says no agent wrote to the database](https://github.com/Supaboard-AI/data-analytics-index#notes).

The useful next test is one you can check against your own business. Pick a question whose answer you know, decide which records count, and compare the returned figure with its assumptions. Then repeat after changing the data or the definitions.

In Supaboard, [agent definitions, reviewed SQL examples and evaluations](https://supaboard.ai/product/agents) give teams a way to keep doing that. The benchmark's CRM question is a good place to start: which paying customers are missing from your CRM, and can you account for every customer on the list?
