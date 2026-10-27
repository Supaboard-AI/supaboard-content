# Public-source follow-up

The user approved the evidence-led outline and supplied https://github.com/Supaboard-AI/data-analytics-index. Its README fetched through the GitHub connector matches the pasted report. README blob SHA: `0792c550f8c9a0fb68339aba596d2af3e03707fd`. Retrieved 21 October 2026. Public per-agent files now provide full responses, superseding the initial source-availability gap in the brief.

Selected full answers were reviewed by a separate research agent:

- [Basedash Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/basedash/README.md#q6-overdue-receivables) separates $343,561.44 uncollectible from $305,557.25 open. The top-five list includes uncollectible debtors. A completeness rule could explain the score of 2, but no such rule is stated.
- [Sonnet Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/claude-sonnet-5-5/README.md#q13-customer-count) includes 897 current customers and an alternative of 872. Both are within 5% of 863, yet the reported score is 1.
- [Lightdash Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q13-customer-count) includes 897, an active-or-past-due alternative of 867, and 860 active only. The reported score is 1.
- [Supaboard Q6](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q6-overdue-receivables) labels a $307.5K rerun counted, while the score table credits first-run $305.6K. The listed 312 seconds matches the rerun's 5m12s. Clarify which attempt supplies the score and time.
- [Lightdash Q10](https://github.com/Supaboard-AI/data-analytics-index/blob/main/lightdash/README.md#q10-seat-utilization) labels a 57.7% rerun counted, while its score credits first-run 57.5% uncapped.
- [Supaboard Q13](https://github.com/Supaboard-AI/data-analytics-index/blob/main/supaboard-stella-pro/README.md#q13-customer-count) does explicitly say the first run counted and a later accidental rerun was disregarded. This one case is explained.

Supaboard Q6, Q11 and Q13 include a clarification instruction to use best judgment and disclose assumptions. Do not imply that each task involved exactly one user message. Lightdash setup says its timings include SQL approval waits. Sonnet and Supaboard ran questions in parallel, whereas Basedash and Lightdash ran them one at a time. Timing comparisons need this qualification.

The article may accurately report the published ranking with these limitations. It must not call the grading independently validated. These source questions remain for the benchmark owner to reconcile before the ranking is promoted as final.

The user did not supply corrections or authorize changes to the benchmark repository. No remote files were edited.
