# Dot

**Data Analytics Index: 66.4** (22 of 39 points, accuracy 56.4%)

| Setup | |
|---|---|
| Model | Balanced mode |
| Data access | Read-only Postgres role, all 20 tables switched on |
| How it was run | All questions in parallel |
| Timing source | Server timestamps |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993,892 · 864 customers | 2 | 122 |
| Q2 | Net revenue retention | 97.4% | 3 | 146 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 573 |
| Q4 | Recognized revenue, Q3 2026 | $2,567,133 | 3 | 188 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,628 · 2025 $6,663,927 | 3 | 193 |
| Q6 | Overdue receivables | $242,323 | 0 | 54 |
| Q7 | Sales performance, H1 2026 | 0 of 7 reps exact, 3 within 5% | 0 | 46 |
| Q8 | Paying customers missing from the CRM | 306 customers · $162,217 | 0 | 124 |
| Q9 | ARR by industry | Healthcare · 29.5% | 2 | 202 |
| Q10 | Seat utilization | 57.3% | 2 | 121 |
| Q11 | Appointments trend | Sep 81,928 | 0 | 71 |
| Q12 | Enterprise support responsiveness | Median 1.68 h · 78.7% | 2 | 113 |
| Q13 | Customer count | 864 | 2 | 26 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

**Rerun (counted)**

### Turn 1 (only turn): Dot's answer

As of 30 September 2026, you have **864 paying customers** [1]. MRR is approximately **$993,892 using 29 September exchange rates** [1]; the database has no 30 September rates, so exact MRR at today's FX cannot yet be calculated [2].

This includes active and past-due subscriptions after valid discounts, annual contracts at one-twelfth, and excludes trials, paused, internal and test accounts. Duplicate subscription records were counted only once.

I've flagged the missing exchange rates for review. [Track it →](https://app.getdot.ai/proposals?c=ca_subagent_17f0f2d6be49)

(Citations: [1] df_mrr_validated, [2] df_fx_availability. Below the answer Dot shows a "PROPOSAL" card "Flag data gap: user needs MRR as of 2026-09-30 end UTC converted with that day's ..." and an "Assumption made" badge. Dot's internal display_to_user call had needs_user_input=false.)

**First run**

[First response]
As of 30 September 2026, end of day UTC, you have 864 paying customers 1. Full USD MRR cannot be calculated at that day's exchange rates: those rates are missing; the latest available are dated 29 September 2.

The USD-denominated portion alone contributes $503,772 MRR 1. This includes active and past-due subscriptions after effective discounts, annual contracts at one-twelfth, and excludes trials, paused, internal and test accounts.

I've flagged the missing exchange rates for review.

Want me to calculate total USD MRR using 29 September's rates instead?

[DATA GAP card: Missing 2026-09-30 FX rates block September-end USD MRR — Open]

[Scripted reply sent 13:33:19Z: "Use your best judgement and tell me what you assumed."]

[Final response]
Your MRR is $993,892, with 864 paying customers, as of 30 September 2026, end of day UTC 1.

I assumed:
• 29 September's exchange rates are the best available proxy for the missing 30 September rates 2.
• A paying customer is a distinct billing customer with positive recurring charges, including active and past-due subscriptions—not necessarily someone whose latest invoice is paid.
• Annual contracts contribute one-twelfth after effective discounts. Enterprise custom annual amounts are whole-contract prices, not per-seat prices.
• MRR measures recurring contractual charges, excluding tax, one-off fees and invoice credits. Trials, paused, canceled, internal and test accounts are excluded.

The USD total is therefore an estimate using prior-day FX, not an exact conversion at 30 September rates.

### Q2. Net revenue retention

Net revenue retention was 97.4% using the latest available exchange rates 1. September 30 rates are missing, so I used September 29, 2026 rates for both snapshots 2.

The fixed paying-customer cohort's MRR went from $550,571 on September 30, 2025 to $536,317 on September 30, 2026 1.

MRR includes active and past-due subscriptions, net of applicable discounts, with annual contracts divided by 12. New customers are excluded; churn counts as zero. Both snapshots are end-of-day UTC, excluding test and internal accounts.

I flagged the missing September 30 FX data for review.

[DATA GAP card: Missing 2026-09-30 FX rates blocks exact constant-currency NRR — Open]

[Full logs: Energy mode Balanced · Total time 2.4 min · Credits 1.17 ACC. Steps: Get Data 'Calculating constant-currency revenue retention'; Thinking; Get Data 'Validating retention calculation'; Get Data 'Checking exchange-rate paths'; Get Data 'Finding latest available exchange rates' (df_fx_latest: EUR/USD, GBP/USD, USD/AUD at 2026-09-29); Get Data 'Calculating retention with latest available rates'; Ask analyst 'Flagging missing September exchange rates'; df_nrr_latest_fx: start_mrr_usd $550,571, end_cohort_mrr_usd $536,317, cohort_count 507, churn_count 100, nrr_percent 97.4%, missing_fx_count 0, snapshot_dedup_audit 34]

### Q3. The May cancellation spike

May's spike was mostly a contract consolidation, not lost customers: 76% of the increase in paid-subscription cancellations came from the Meridian batch [decomp] 1.

At midnight UTC on 15 May, Meridian Health Group consolidated 16 clinic subscriptions into one Enterprise contract [attribution] 2. The CRM opportunity explicitly describes the consolidation; the replacement subscription starts at the same timestamp, its annual invoice is paid, and it remains active through September [attribution] 345.

[Chart: Cancellations: customer exits, consolidation and trials — Source: subscriptions, customers, cancel_reasons; January 2025–September 2026, UTC; Production billing customers; internal accounts excluded]

Meridian's recurring revenue increased rather than disappeared. Counting only the canceled clinic subscriptions would incorrectly classify retained revenue as churn [attribution] 2.

[Chart: Meridian consolidation: recurring revenue retained — Source: customers, invoices, invoice_lines, plans, fx_rates, workspaces, coupons, opps, credit_notes, accts, subscriptions; Verified Meridian clinics and parent contract]

There was also a smaller real increase: excluding consolidation, paid customer exits rose from 11 in April to 16 in May, representing $9,959 in lost monthly recurring revenue [decomp] 6. May's adjusted subscription cancellation rate was 2.2%, versus 1.9% in May 2025; it was not an unprecedented level [shift] 1. Recorded reasons were mixed, and subsequent months do not show a sustained upward trend [shift] 71.

Separate verified consolidations from customer churn and reconcile cancellations to the retained parent contract. Reason code 4 is missing from the reference table, which hid this batch's meaning; I've flagged that classification gap for review.

Counts use subscription status transitions, not history rows; test and explicitly internal accounts are excluded. Data ends 30 September 2026 UTC; money is USD.

[DATA GAP card: Missing cancellation reason 4 and continuity classification for Meridian's 16-subscription batch — Open]
[Full logs: Total time 9.5 min]

### Q4. Recognized revenue, Q3 2026

Q3 2026 recognized revenue is provisionally $2,567,133, using the latest available FX rate on or before each invoice's or credit note's own date 1.

Recognized charges were $2,729,022, less $161,889 in credit notes 1. Subscription charges, prorations and discounts were spread over inclusive coverage dates; one-off fees were counted on invoice dates. Tax, void/draft invoices, and test/internal accounts were excluded.

An exact-date result cannot be finalized: 372 invoices and 10 credit notes lack same-day FX rates 1. Also, line-item amounts reconcile as currency units, not cents, despite their table description 1.

I flagged the FX coverage gap and incorrect amount description for review.

[PROPOSAL card: Correct invoice-line units and flag Q3 exact-date FX coverage gap — Review]
[Full logs: Energy mode Balanced · Total time 3.1 min · Credits 1.38 ACC; 'Assumption made' badge; df_q3_revenue_final: invoices_matching_subtotal_div_100 8,673, invoices_matching_raw_subtotal 0, total_eligible_invoices_reconciled 8,673, gross_recognized_charges_usd $2,729,022]

### Q5. Billings, 2024 against 2025

Billings grew 134.2%, an increase of $3,818,299 1.

2024: $2,845,628 1.
2025: $6,663,927 1.

[Chart: Net billings: 2024 vs 2025 — Source: customers, invoices, customers_v1, fx_rates, credit_notes, invoices_2024; Invoice issue years: 2024 and 2025 (UTC); Excludes tax, void/draft invoices, test/internal accounts and migration duplicates; Credits linked to invoices through 30 September 2026]

Totals exclude tax, void invoices, test/internal accounts and migration duplicates. Credits through 30 September 2026 are attributed to the original invoice year; foreign-currency invoices and credits use issue-date FX, or the latest preceding rate.

[Full logs: Energy mode Balanced · Total time 3.2 min · Credits 1.65 ACC; 'Assumption made' badge]

### Q6. Overdue receivables

$242,323 is overdue by more than 30 days as of 30 September 2026, end of day UTC 1.

These are the five customers owing the most:

[Chart: Largest overdue balances, 30 September 2026 — Old Juniper Urgent Care Ltd (~$111K), North Cedar Ridge Pest Control Ltd (~$45K), Eastgate Smile Studio LLC (~$35K), Greater Lakeside Home Cleaning LLC (~$5K), Greater Harborview Medical Group B.V. (~$5K). Source: customers, invoices, customers_v1, fx_rates, credit_notes; As of 30 September 2026, end of day UTC; Due before 31 August 2026; Production external customers; open and uncollectible invoices]

Balances include tax, less payments and credit notes including credited tax. Includes open and uncollectible invoices due before 31 August; excludes test and internal accounts. Foreign-currency balances use the latest available exchange rates on or before 30 September.

[Full logs: Energy mode Balanced · Total time 0.9 min · Credits 0.72 ACC]

### Q7. Sales performance, H1 2026

Sofia Marin had the highest win rate at 53.3%, based on 15 closed deals 1.

[Chart: New-business win rate, January–June 2026 — Source: users, opps; Closed 1 January–30 June 2026 inclusive; New business; won or lost only; Soft-deleted and disqualified deals excluded.
Data tab: full_name | owner_id | won | lost | total closed | win_rate | median_sales_cycle_days
Sofia Marin | U05 | 8 | 7 | 15 | 53.3% | 56.00
Dana Whitfield | U09 | 13 | 18 | 31 | 41.9% | 44.00
Priya Raman | U01 | 17 | 33 | 50 | 34.0% | 37.50
Tom Okoye | U04 | 15 | 41 | 56 | 26.8% | 29.50
Marcus Bell | U02 | 14 | 43 | 57 | 24.6% | 55.00
Ana Pereira | U07 | 8 | 25 | 33 | 24.2% | 51.00
Liam Carter | U06 | 14 | 44 | 58 | 24.1% | 48.50
Dana Whitfield | U03 | 1 | 6 | 7 | 14.3% | 30.00]

Median sales cycle is calendar days from creation to close, using both won and lost deals.

[Chart: New-business median sales cycle, January–June 2026 (same filters)]

Both charts cover new-business deals closed 1 January–30 June 2026, excluding disqualified and soft-deleted records. Dana Whitfield appears under two CRM owner IDs; these are kept separate 1.

[Full logs: Total time 0.8 min]

### Q8. Paying customers missing from the CRM

As of 30 September 2026 (end of day UTC), 306 paying customers have no linked CRM account, representing $162,217 in MRR 1 — 16.2% of total MRR 1.

"Paying" includes production customers with positive MRR on active or past-due subscriptions, excluding trials and internal accounts. MRR is net of current discounts, with annual contracts spread over 12 months and currencies converted at the latest available September rates. CRM matching checks both billing references and stored Stripe IDs, excluding deleted or merged accounts; accounts without those identifiers may exist but cannot be reliably linked.

Want the customer list, ranked by MRR, to reconcile against the CRM?

[Full logs: Energy mode Balanced · Total time 2.1 min · Credits 0.99 ACC; 'Assumption made' badge; df_crm_missing_paying_final: missing_crm_paying_customers 306, missing_crm_mrr_usd $162,217, missing_crm_paying_customers_percent 35.4%, missing_crm_mrr_percent 16.2%]

### Q9. ARR by industry

Healthcare brings in the most ARR: $3,514,021, or 29.5% of total ARR, as of 30 September 2026 UTC 1. Total ARR is $11,926,705, including customers whose industry is unknown 1.

[Chart: ARR by industry, 30 September 2026 — Healthcare, Field Services, Dental, Home Services, Unknown, Logistics, Veterinary, Other. Source: customers, plans, industry_map, fx_rates, coupons, accts, subscriptions; FX rates through Sep 30, 2026; Non-deleted, non-merged CRM accounts and live, non-internal billing customers; Subscriptions valid on Sep 30, 2026 with an active or past-due status; Only subscriptions linked to a recognized customer, plan and currency conversion rate.]

ARR uses discount-adjusted MRR × 12, includes active and past-due subscriptions, and excludes trials, canceled subscriptions, and test/internal accounts. USD conversion uses the latest available FX rates, from 29 September 2.

[Full logs: Energy mode Balanced · Total time 3.4 min · Credits 1.45 ACC]

### Q10. Seat utilization

57.3% of paid seats were used in September 2026: 16,292 distinct human users were active against 28,452 purchased seats 1.

This uses paid subscriptions active or past due at 30 September, and any product activity during September UTC. It excludes trials, sandboxes, internal accounts, bots, integrations and Corvia staff.

The measure is active users divided by purchased seats, not an average of customer percentages. A few customers had more active users than their month-end seat count; those users are included rather than capped 1.

[Full logs: Energy mode Balanced · Total time 2.0 min · Credits 1.03 ACC]

### Q11. Appointments trend

Customer-created appointments increased every month, with September 12.2% above June 1. Monthly growth accelerated from 2.0% in July to 6.2% in September 1.

[Chart/Data: month | appointment_count | mom_change_percent | change_relative_to_june_2026_percent
2026-06-01 | 73,048 | | 0.0%
2026-07-01 | 74,535 | 2.0% | 2.0%
2026-08-01 | 77,141 | 3.5% | 5.6%
2026-09-01 | 81,928 | 6.2% | 12.2%
Source: users, customers, events, workspaces; June–September 2026, complete UTC months; Sandbox and internal accounts excluded; Bots, API users and support staff excluded]

Counts combine both appointment-creation event names and exclude sandbox/internal accounts, bots, API users and support staff. All four UTC months are complete.

[Full logs: Energy mode Balanced · Total time 1.2 min · Credits 0.82 ACC]

### Q12. Enterprise support responsiveness

For Q3 2026 Enterprise tickets, the median first human reply took 1.68 hours 1, and 78.7% received one within 4 hours 1.

The median includes replied tickets only; all 55 tickets without a reply by September 30 count as missing the target 1. Times are elapsed clock hours, counting only public human-agent replies—not automated acknowledgements or internal notes.

Enterprise status is assessed when the ticket opened. Merged duplicates and test/internal accounts are excluded; customer matching uses exact emails, then uniquely matching customer email domains where needed.

[Full logs: Energy mode Balanced · Total time 1.9 min · Credits 1.09 ACC; df_enterprise_reply_q3_complete: eligible_ticket_count 901, replied_ticket_count 846, no_reply_count 55, median_elapsed_hours 1.68, within_4h_count 709, within_4h_percent 78.7%]

### Q13. Customer count

You have 864 customers as of 30 September 2026, including 7 with past-due subscriptions 1.

I'm counting distinct production billing accounts with an active or past-due subscription, excluding trials, canceled or paused subscriptions, test accounts, and internal accounts.

[Full logs: Energy mode Balanced · Total time 0.4 min · Credits 0.63 ACC; 'Assumption made' badge; df_customer_count: total_paid_customers 864, active_customers 857, past_due_only_customers 7, trial_only_customers 25]

