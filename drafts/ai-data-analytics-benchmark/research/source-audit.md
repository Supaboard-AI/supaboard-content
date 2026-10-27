# Benchmark source audit

Source: the user's supplied Data Analytics Index report, preserved unchanged as `source-report.md`. Checked 21 October 2026. No database queries or full response transcripts were available for this audit. No scores have been changed.

## Reconciled

All ten per-agent point totals equal the sum of their thirteen question scores. All normalized percentages and index values round correctly. All reported question means and full-credit counts reconcile. All mean and median answer times reconcile with the individual timings after rounding.

## Clarifications needed before calling the ranking final

1. **Basedash, Q6:** the displayed response includes $305,557.25, exactly the open-invoice key, but earns 2 points. The stated rubric allows 3 when the exact answer appears as an alternative. The task also mentions top-five debtors, so an omitted component might explain the score; the table does not show it. Check the complete answer and grading rationale.
2. **Sonnet and Lightdash, Q13:** each gives 897 customers against 863 and earns 1 point. The difference is 3.94%, within the stated 5% band for 2 points. Clarify whether a method or population criterion overrides the numeric threshold.
3. **Sigma, Q4:** the answer is printed as negative $134,580.21. If that sign is intentional, signed relative error against positive $2,568,266.89 is about -105.24%, not the printed -94.8%. If the dash is punctuation, make that clear in the source.
4. **Multiple components:** Q8's error column follows customer count rather than MRR; Q12's follows the response-rate component rather than median response time. State whether all components must meet a band and show the relevant errors separately. Opus Q12's 106-minute median is about 5.8% above the displayed 1.67-hour key even though its response-rate error is small.
5. **Precision:** Supaboard Q4's $2.6M receives full credit under the written precision rule despite a displayed 1.2% difference. Metabase Q11's displayed +5.0% is about +5.027% from the printed counts, which is outside 5%. These are explainable by rounding, but readers need that explanation.
6. **Run selection:** “first run” appears for Supaboard Q6 and Lightdash Q10. Document attempts, retries, selection policy and whether timings correspond to the scored responses. Fresh chats alone do not establish a single-attempt protocol.

## Interpretation constraints

- The benchmark covers ten named configurations on one fictional SaaS database. It does not cover every AI-enabled BI product.
- Claude designed and ran it for Supaboard; Supaboard, Opus and Sonnet are all participants. Disclose this before the leaderboard.
- Claude and ChatGPT used Neon connectors with project-owner access; other agents shared a read-only role. The report says no writes occurred. Do not describe the permissions as identical.
- Removing documentation and a semantic layer is a particular evaluation condition, not a measurement of every product's performance after normal configuration.
- Metabase's zero mostly reflects SQL returned without execution in this setup. The report does not establish that those unexecuted queries were wrong.
- The timing method uses platform timestamps where available and otherwise platform timers; human waiting is excluded only where separately recorded. Avoid an equal end-to-end effort claim.
- The index maximum is 110. Its ten base points add no discriminatory information. Accuracy is normalized rubric points, not exact-answer rate.
- Full question texts, the key and database are withheld from the public report; the attachment's per-agent relative links do not include the target files. Public reproducibility is limited.
- Do not attribute an individual miss to a particular join, filter, timezone, bot policy, deduplication rule, currency rule or product limitation without the relevant SQL or full answer.

## Requested source material

Public report and answer URLs; test dates; precise product/model versions and settings; frozen snapshot and date used for “today”; task-level scoring and multi-component rules; flagged grading decisions; retry policy; scored response transcripts and SQL; timer provenance; human-review status of the answer key.
