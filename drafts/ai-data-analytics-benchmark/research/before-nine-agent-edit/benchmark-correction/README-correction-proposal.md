# Data Analytics Index: correction draft

Status: local proposal for review. The live repository has not been changed. This document must not be presented as a completed regrade.

We are withdrawing the shared-first result as a settled conclusion while we reconcile our scoring and attempt selection. Claude designed and ran this vendor-sponsored test for Supaboard; Supaboard, Opus and Sonnet are participants. We have not published an independent grading audit.

## Tool selection

We selected tools we could access with our available resources. We could not obtain access to Omni, Snowflake CoWork or Databricks Genie without a sales-led process, so they are absent from this edition. We therefore have no results for those products.

### What changes at 33 points

Two changes alone take Supaboard from 35 to 33 points, or 84.6% of available points and an index of 94.6. That is below Opus's published 35 and above the other published totals. This calculation holds every other grade fixed. A replacement leaderboard requires a review of all selected attempts. ([Published totals and formula](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#data-analytics-index-1))

| Supaboard question | Published grade | Targeted adjustment | Reason |
|---|---:|---:|---|
| Q4: recognized revenue | 3 | 2 | Treat $2.6M as a reported number, without a coarse-rounding bonus |
| Q6: receivables | 3 | 2 | The final recommended debtor list includes uncollectible balances |
| Total, all other grades held fixed | 35 | 33 | A limited adjustment, not a full regrade |

For Q4, $2.6M is about 1.2% above the $2,568,266.89 key. Our original precision clause allowed full credit, and even used this answer as its example. Hex's $2,601,203.52, about 1.3% above the same key, earned two points. Removing the coarse-rounding exception is a change to our rubric, and we need to apply it to every agent. ([Revenue results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q4-recognized-revenue-q3-2026))

For Q6, Supaboard's first conversation ends with a $649.1K headline and a debtor list containing uncollectible balances, while retaining the exact $305,557.25 open-invoice alternative. Basedash received two points for the same pattern. A final-answer completeness rule would give both two points. Supaboard's earlier response had the open-only list, so the rule must explicitly prevent a superseded answer from supplying the missing credit. ([Supaboard Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables), [Basedash Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md#q6-overdue-receivables))

Opus's support answer includes a replied-only median of about 101 minutes that appears eligible for two points under the alternative-answer rule, versus its published one. Sonnet's and Lightdash's customer-count alternatives also fall inside the stated five-percent band. A consistent review could therefore change Opus to 36, Sonnet to 32 and Lightdash to 29, all else fixed. We still need to grade Supaboard's first recorded appointments answer. We will publish a replacement leaderboard only after the same rules have been applied across the selected attempts. ([Opus Q12](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-opus-5-5/README.md#q12-enterprise-support-responsiveness), [customer-count results](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#q13-customer-count))

## Proposed grading and attempt policy

This specification is a draft for a complete regrade, not a description of how the original scores were produced.

1. Freeze the full prompt, accepted interpretations, required outputs, population and period, full-precision answer key, and comparison units before recomputing totals.
2. Select the first completed recorded conversation per agent-question pair. Include standardized clarification turns in that attempt. Score the final response and final supporting tables; explicitly superseded earlier recommendations do not rescue it. A completed failure or unexecuted-SQL response counts, so this is not a first-successful-attempt rule. Document any incomplete run separately; the published records do not establish that no unrecorded runs occurred.
3. Award three points when every required output matches: counts exact, money and rates within relative 0.1%, and list membership, snapshot and population as specified. Remove the exception that rewards a coarsely rounded number merely for matching the key at its written precision.
4. Award two points for the predefined partial-success cases: required numeric outputs within relative five percent, or a matching aggregate with an incorrect required list. Evaluate all parts of a multi-output answer as a coherent set, rather than taking unrelated best-case numbers from different scenarios.
5. Award one point only when a reasonable alternative method and its result are checked against the database. A plausible method statement is insufficient. Without that check, mark the grade pending instead of inventing one.
6. Accept an alternative only when it matches an interpretation allowed by the frozen prompt. A matching number from another date does not establish a correct answer to the requested snapshot.
7. Keep all subsequent attempts in the record, irrespective of score or why they were launched. Use selected-attempt timestamps for speed summaries; leave unavailable timings blank rather than using rerun timers.

Relative error is abs(answer - key) / abs(key). Convert units first; distinguish a percent relative error from percentage points. This proposed policy may change grades beyond the narrow 33-point Supaboard adjustment.

## One attempt-selection rule for every agent

For the regrade, we select the first completed recorded conversation for each question. Standardized clarification turns stay within that attempt. The final response and its supporting tables determine the score; an explicitly superseded earlier recommendation cannot rescue the final answer. A completed interaction that returns unexecuted SQL still counts as an attempt. Later attempts stay visible but cannot replace the selected one because they score better.

The published records contain 136 attempts across 130 agent-question pairs: six pairs have two attempts. These counts describe the published record, not a complete platform event log. ([Full answer records](https://github.com/Supaboard-AI/data-analytics-index/blob/main/README.md#notes))

| Agent | Recorded attempts | Questions with a second attempt |
|---|---:|---|
| Claude Opus 5.5 | 13 | None recorded |
| Supaboard (Stella Pro) | 16 | Q6, Q11, Q13 |
| Claude Sonnet 5.5 | 13 | None recorded |
| Lightdash | 14 | Q10 |
| Basedash | 13 | None recorded |
| ChatGPT (GPT-6) | 13 | None recorded |
| Dot | 14 | Q1 |
| Hex | 13 | None recorded |
| Sigma | 14 | Q7 |
| Metabase | 13 | None recorded |

Supaboard has second attempts on Q6, Q11 and Q13. Under this rule, its first conversations are selected in all three cases, including Q13's 863-customer answer. Dot Q1, Lightdash Q10 and Sigma Q7 also select their first conversations.  ([Supaboard records](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md), [Dot records](https://github.com/Supaboard-AI/data-analytics-index/blob/main/dot/README.md), [Lightdash records](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md), [Sigma records](https://github.com/Supaboard-AI/data-analytics-index/blob/main/sigma/README.md))

We cannot carry Supaboard's Q11 grade across automatically. Its first conversation states 80,467 human appointments and separately 10,459 Zapier appointments for September; the credited 142,668 total is explicit in the rerun. The first conversation references a chart whose full payload is absent from the README. We need that payload or a database check before assigning its replacement grade. We must also match timings to the selected attempts before publishing revised speed averages. ([Supaboard Q11](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q11-appointments-trend))

## Decisions needed before a replacement leaderboard

- Supaboard Q11: recover the first-attempt chart payload or validate its alternative method against the database. Do not carry over the rerun's two points or timer.
- Supaboard Q10: confirm whether the prompt permits the September 15 uncapped sensitivity scenario. The 57.52% match is not the month-end headline; retain it only if the frozen specification permits it.
- Opus Q12: adjudicate the replied-only 101-minute median and 78.7% response-rate pair consistently with all other alternative-answer cases.
- Sonnet and Lightdash Q13: apply the same five-percent partial-credit and customer-definition rules as every other agent.
- Q6 across all agents: specify aggregate and debtor-list completeness consistently; assess the final answer, including whether it supersedes earlier lists.
- Recover selected-conversation timings and complete attempt provenance where possible. The recorded count is a lower bound on what may have happened outside the public transcript.

The accompanying attempt-ledger.csv applies the selection policy to all 130 published agent-question records and distinguishes historical scores from pending regrade decisions. No replacement aggregate is asserted until these decisions are resolved.

## Historical leaderboard

The table below is retained as historical evidence, not the corrected result. It matches the public README, including Opus appearing before Supaboard.

| Rank | Agent | Points (of 39) | Accuracy | Data Analytics Index |
|---|---|---|---|---|
| 1 | [Claude Opus 5.5](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-opus-5-5/README.md) | 35 | 89.7% | **99.7** |
| 1 | [Supaboard (Stella Pro)](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md) | 35 | 89.7% | **99.7** |
| 3 | [Claude Sonnet 5.5](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md) | 31 | 79.5% | **89.5** |
| 4 | [Lightdash](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md) | 28 | 71.8% | **81.8** |
| 5 | [Basedash](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md) | 27 | 69.2% | **79.2** |
| 6 | [ChatGPT (GPT-6)](https://github.com/Supaboard-AI/data-analytics-index/blob/main/chatgpt-gpt-6/README.md) | 26 | 66.7% | **76.7** |
| 7 | [Dot](https://github.com/Supaboard-AI/data-analytics-index/blob/main/dot/README.md) | 22 | 56.4% | **66.4** |
| 8 | [Hex](https://github.com/Supaboard-AI/data-analytics-index/blob/main/hex/README.md) | 19 | 48.7% | **58.7** |
| 9 | [Sigma](https://github.com/Supaboard-AI/data-analytics-index/blob/main/sigma/README.md) | 17 | 43.6% | **53.6** |
| 10 | [Metabase](https://github.com/Supaboard-AI/data-analytics-index/blob/main/metabase/README.md) | 0 | 0.0% | **10.0** |

