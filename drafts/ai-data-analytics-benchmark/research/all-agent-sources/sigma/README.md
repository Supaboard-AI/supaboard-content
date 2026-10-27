# Sigma

**Data Analytics Index: 53.6** (17 of 39 points, accuracy 43.6%)

| Setup | |
|---|---|
| Model | Not shown |
| Data access | Read-only Postgres role, all 20 tables attached per chat |
| How it was run | In parallel batches |
| Timing source | Sigma's 'Worked for' timer |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993,892 · 864 customers | 2 | 270 |
| Q2 | Net revenue retention | 96.5% | 2 | 168 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 144 |
| Q4 | Recognized revenue, Q3 2026 | –$134,580.21 | 0 | 444 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,628 · 2025 $6,665,229 | 3 | 402 |
| Q6 | Overdue receivables | $242,322.53 | 0 | 114 |
| Q7 | Sales performance, H1 2026 | 0 of 7 reps exact, 4 within 5% | 0 | 55 |
| Q8 | Paying customers missing from the CRM | 412 customers · $514,419 | 0 | 138 |
| Q9 | ARR by industry | Healthcare · 27.1% | 0 | 474 |
| Q10 | Seat utilization | 59.8% | 2 | 282 |
| Q11 | Appointments trend | Sep 142668 | 2 | 54 |
| Q12 | Enterprise support responsiveness | Median 1.69 h · 79.0% | 2 | 258 |
| Q13 | Customer count | 1,531 | 1 | 126 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

MRR today (Sept 30, 2026) is $993,892 across 864 paying customers.

This covers subscriptions currently active or past_due (excluding trialing, paused, and canceled), for customers that are live (Livemode = true) and not flagged internal in metadata.

A few notes on how I calculated it:

Current state per subscription: the subscriptions table is a slowly-changing-dimension (each Sub Id has multiple rows over time). I took the row with the latest Valid From ≤ today whose Valid To is null or still in the future — that's the subscription's state as of today.
Annualization: plan billing interval is stored inconsistently as either "year" or "annual" for yearly contracts — I treated both the same way, dividing the per-seat annual price (× quantity) by 12. Enterprise plans carry Unit Amount = 0 and instead use Custom Annual Amount, which is already a total contract value (not per-seat), so I divided that by 12 directly.
Discounts: coupons with forever duration apply in full; repeating coupons only count if today is still within Coupon Start + Duration in Months. Expired repeating coupons were excluded.
FX conversion: there's no FX rate recorded for Sept 30, 2026 itself, so I used the most recent prior rate, from Sept 29, 2026 (GBP→USD 1.290235, EUR→USD 1.108737, USD→AUD 1.493174).

Want me to break this MRR down by plan tier or by country/region next?

Sources: subscriptions, coupons, plans, customers, fx_rates

### Q2. Net revenue retention

Worked for 2.8m

Net revenue retention over the trailing 12 months was approximately 96.5%.

Using the cohort of 517 customers who had an active (paying) subscription on 30 September 2025, their combined MRR has moved from $573,263 then to $553,203 today (30 September 2026) — a net contraction of about 3.5%, all measured in USD.

cohort_customer_count	mrr_then_usd	mrr_now_usd	nrr_ratio
517	573262.6313757526	553202.7318956868	0.9650074880479742
Open in workbook

Assumptions I used to resolve ambiguity in the question:

"Paying" = subscription status active at the relevant date (trialing, past_due, paused, and canceled subscriptions are excluded from both the cohort selection and the MRR sums).
MRR per subscription = seat quantity × plan unit price, normalized to a monthly amount (annual/"year" plans ÷ 12); enterprise contracts use the subscription's custom annual amount ÷ 12 (per the plan table's guidance that unit price is 0 and not seat-multiplied for enterprise).
FX: no rate is recorded for 30 Sep 2026 itself, so I used the most recent available rate, dated 29 Sep 2026 (USD/AUD 1.493174, EUR/USD 1.108737, GBP/USD 1.290235), applied uniformly to both the 2025 and 2026 MRR figures so currency moves don't affect the result, as you asked.
MRR-now only sums these same 517 customers' current active subscriptions (0 if they've since churned) — new customers acquired after Sep 2025 are correctly excluded, keeping this a true like-for-like retention measure.

Want to see this broken down by expansion vs. contraction vs. churn within the cohort, or compared against the prior 12-month period to see the trend?

Sources: subscriptions, plans, fx_rates, customers

### Q3. The May cancellation spike

Worked for 2.4m

This confirms it: the May spike isn't churn — it's a contract consolidation.

What happened: 16 of the 48 cancellations in May 2026 (one-third of the month's total) were 16 separate Meridian Health clinic-location subscriptions — all on the Growth plan — that were cancelled within the same five-minute window on May 15, 2026, each tagged with cancel-reason code 4, a code that has no label in the cancel_reasons table (which is why it initially shows up as "unexplained"). Cross-referencing the CRM confirms the story: a Closed-Won opportunity, "Meridian Health Group – New Business," closed the same day for $123,690, with the note "Consolidating 16 Meridian clinic subscriptions into one group contract." A new active enterprise annual subscription (310 seats, $123,690/year) was created the same day for the new "Meridian Health Group" account.

So this wasn't lost revenue — it was a single multi-location customer being migrated from 16 fragmented monthly Growth subscriptions (worth ~$8,220/month combined, ~270 seats) into one consolidated enterprise annual contract worth more. Excluding this consolidation, May's organic cancellations (32) were actually in line with the surrounding months (27-41/month) and the normal mix of reasons (trial-not-converted, too expensive, etc.) — no underlying churn problem.

One data-quality note: cancel-reason code 4 is missing from the cancel_reasons lookup table, so any reporting that joins on that table will silently miscategorize these as blank/unexplained reasons going forward — worth adding a label for it (e.g. "Consolidated into parent contract").

Want me to check whether other multi-location accounts have similar unlabeled consolidation cancellations hiding in the historical cancellation trend?

Sources: subscriptions, cancel_reasons, plans, customers, accts, opps, tickets

### Q4. Recognized revenue, Q3 2026

Worked for 7.4m

Corvia recognized –$134,580.21 in net revenue in Q3 2026 (July 1 – Sept 30, 2026) — a loss, driven by one outsized credit note.

gross_recognized_revenue_usd	credit_notes_usd	net_recognized_revenue_usd
27308.910028736755	161889.11506433992	-134580.20503560317
Open in workbook

Component	Amount (USD)
Gross recognized revenue (subscription, proration, discount, setup fees)	$27,308.91
Less: credit notes issued in the period	$161,889.12
Net recognized revenue	–$134,580.21

Why it's negative: one credit note (cn_00260_7ssneh, reason "duplicate") issued Sept 19, 2026 reversed a full €116,466 annual enterprise invoice — ≈$127,476 at that day's EUR/USD rate — issued Sept 14, 2026 for a 1-year term. Credit notes are recognized in full on their issue date per your rule, while the subscription charge they came from is spread evenly over its full 1-year period, so only a small slice (~16 of 365 days) of that invoice's revenue falls into Q3 even though the entire credit hits Q3. Excluding that one credit note, net Q3 revenue would be positive (≈$127,476 – $34,413 in other credits + gross ≈ +$20k, directionally).

Methodology used:

Scope: invoices with status paid, open, or uncollectible (excluded void and draft); Livemode = true; customers excluded if non-live (test) or flagged "internal": true in metadata (5 demo/QA accounts).
Subscription, proration, and discount invoice lines were spread evenly (by elapsed time) across their stated period, and the share of each line falling inside Jul 1–Sep 30, 2026 was recognized; setup_fee lines (one-off, zero-length period) were recognized in full on their invoice date if that date falls in Q3.
Credit notes (tax excluded via the separate Tax Amount field) were recognized in full on their issue date if that date falls in Q3, tied to their original invoice's currency.
Each invoice/credit note was converted to USD using the FX rate for its own issue date; since the FX table has no rate for Sept 30, 2026 (data ends Sept 29), invoices/credit notes issued on Sept 30 used the most recent prior available rate (Sept 29) as a fallback — judgment call since no exact-date rate exists.

Want to see Q3 revenue with that one anomalous credit note excluded, or broken down by month/currency instead?

Sources: invoices, invoice_lines, customers, fx_rates, credit_notes

### Q5. Billings, 2024 against 2025

Worked for 6.7m

Total billings grew from $2.85M in 2024 to $6.67M in 2025 — a +134.2% increase (+$3.82M).

Year	Billings (USD)
2024	$2,845,628
2025	$6,665,229

yr	billings_usd	yoy_change	yoy_growth_pct
2024	2845627.7059721216	null	null
2025	6665229.2980147265	3819601.592042605	1.3422703131637366
Open in workbook

How I computed this:

Billings = invoice subtotal (excl. tax), net of void invoices and credit notes, excluding test/internal accounts, converted to USD.
Corvia runs two billing systems: a legacy ledger (invoices_2024, all of 2024) and the current system (invoices, March 2024 onward). 29 legacy 2024 invoices were migrated into the current system — I counted each such invoice only once (from the current system, not the legacy one) to avoid double-counting.
Test accounts were excluded via each customer's live-mode flag, and internal/demo accounts (e.g. "Corvia Demo", "Test Clinic" entries) via the internal flag on the customer record (or internal account type in the legacy customer table).
Non-USD invoices (AUD, EUR, GBP) were converted to USD using the daily FX rate on (or the most recent rate before) the invoice's issue date, since the FX table only has business-day rates.
Credit notes were netted against billings in the year the credit note was issued (all observed credit notes fall in 2025–2026, so none affect 2024).
No draft invoices fell in 2024 or 2025, so the "void/credit-note only" exclusion rule didn't need further judgment calls there.

Want me to break this down by region or by new-vs-expansion billings to see what's driving the 2025 jump?

Sources: invoices, invoices_2024, customers, customers_v1, fx_rates, credit_notes

### Q6. Overdue receivables

Worked for 1.9m

Total overdue by more than 30 days: $242,322.53 (22 live invoices, 30 Sept 2026 cutoff), after subtracting payments and credit notes, tax included, converted to USD.

customer	Country Code	owed_usd
Old Juniper Urgent Care Ltd	GB	111288.961878
North Cedar Ridge Pest Control Ltd	IE	45412.758783
Eastgate Smile Studio LLC	US	35294
Greater Lakeside Home Cleaning LLC	US	5409.19
Greater Harborview Medical Group B.V.	NL	4829.658372
Open in workbook

Customer	Country	Owed (USD)
Old Juniper Urgent Care Ltd	GB	$111,288.96
North Cedar Ridge Pest Control Ltd	IE	$45,412.76
Eastgate Smile Studio LLC	US	$35,294.00
Greater Lakeside Home Cleaning LLC	US	$5,409.19
Greater Harborview Medical Group B.V.	NL	$4,829.66

These five account for $202.2K of the $242.3K total, with Old Juniper Urgent Care alone making up almost half.

Assumptions used:

Scope: the main invoices table (live-mode only, excluding test-mode records), statuses open and uncollectible — paid, void, and draft invoices are excluded since they carry no outstanding, due balance. The separate legacy invoices_2024 table has no due-date field and isn't used for this aging calc.
"Overdue by more than 30 days" = due date before 31 Aug 2026 (i.e., more than 30 days before 30 Sept 2026).
Unpaid amount per invoice = Total (incl. tax) − Amount Paid − credit notes (amount + tax) applied to that invoice.
Non-USD invoices (AUD, EUR, GBP) were converted using the most recent FX rate on or before 30 Sept 2026 (29 Sept 2026 rates, since no rate is recorded for the 30th).

Want this broken down by currency or by how long each balance has been overdue (31–60 / 61–90 / 90+ days)?

Sources: invoices, invoices_2024, fx_rates, credit_notes, customers

### Q7. Sales performance, H1 2026

**Rerun (counted)**

### Turn 1 (only turn): Sigma Assistant's answer

For new-business deals (Opp Type variants of "NB"/"New Biz"/"New Business"/"new_business") that closed between **1 Jan 2026 and 30 Jun 2026**, I excluded disqualified opportunities and any non-closed deals, counting only those with a stage mapping to Won or Lost (covering the various stage-label formats like "06 - Closed Won", "closed_won", "Won", etc.).

| rep | decided_deals | won_deals | win_rate | median_cycle_days |
|---|---|---|---|---|
| Sofia Marin | 15 | 8 | 0.5333 | 56 |
| Dana Whitfield | 38 | 14 | 0.3684 | 41 |
| Priya Raman | 50 | 17 | 0.34 | 37.5 |
| Tom Okoye | 56 | 15 | 0.2679 | 29.5 |
| Marcus Bell | 57 | 14 | 0.2456 | 55 |
| Ana Pereira | 33 | 8 | 0.2424 | 51 |
| Liam Carter | 58 | 14 | 0.2414 | 48.5 |

Open in workbook

**Sofia Marin** has the highest win rate at **53.3%** (8 of 15 decided deals), though her median sales cycle is one of the longer ones at 56 days. **Tom Okoye** closes fastest at a median of **29.5 days** but wins only 26.8% of his decided deals. Across the team, win rates range from 24–53% and median cycles from 29.5–56 days.

A couple of notes on scope:

- "Decided deals" = Closed Won + Closed Lost only; disqualified opps were excluded entirely as instructed, and open-stage opps (Discovery/Demo/Proposal/Negotiation) were likewise excluded since they aren't won or lost.
- Sales cycle = Close Date minus Created Date, in days, computed only over won/lost deals per rep.

Want this broken down by region or compared against expansion/upsell deal cycles?

(Work steps shown under "Worked for 55s": Reviewed data sources opps, accts; Reviewed data sources users; Gathered data from opps and users for 4.1s; "Now let me compute win rate and median sales cycle per rep for new-business deals closed Jan–Jun 2026." → element "Win rate and median cycle by rep NB Jan-Jun 2026 (7 rows)". Sources cited: opps, users.)

**First run**

[First response — Worked for 1.4m]
Good — that confirms the only excluded rows are the disqualified ones, as intended.

Win rate and median sales cycle by rep — new-business deals closed Jan–Jun 2026 (won/lost only)
Rep | Decided deals | Won | Win rate | Median cycle (days)
Sofia Marin | 15 | 8 | 53.3% | 56
Dana Whitfield (active, U09) | 31 | 13 | 41.9% | 44
Priya Raman | 50 | 17 | 34.0% | 37.5
Tom Okoye | 56 | 15 | 26.8% | 29.5
Marcus Bell | 57 | 14 | 24.6% | 55
Ana Pereira | 33 | 8 | 24.2% | 51
Liam Carter | 58 | 14 | 24.1% | 48.5
Dana Whitfield (inactive, U03) | 7 | 1 | 14.3% | 30

Sofia Marin had the highest win rate (53.3%), while Marcus Bell had the longest median sales cycle among top performers (55 days).

Notes on how I scoped this: "New business" opps were identified by normalizing Opp Type values (NB, New Biz, New Business, new_business all map to new business); Expansion/Upsell were excluded. "Closed between January and June 2026" was read as Close Dt in 2026-01-01 through 2026-06-30 inclusive. Stage names were normalized across inconsistent formats (e.g. 06 - Closed Won, Closed Won, Won, closed_won → Won); disqualified-stage deals and soft-deleted opps (Is Deleted = True) were excluded, per your instruction. Sales cycle = Close Dt − Created Dt in days, computed per deal then medianed per rep across all won+lost deals. There are two distinct rep records both named "Dana Whitfield" in the owner data (one inactive, one active, different emails) — I kept them separate since the underlying system treats them as different owners; they may be the same person re-added to the CRM.

Want me to merge the two Dana Whitfield records into one (assuming they're the same person), or break this down by region instead?

[Scripted reply sent 13:44:26Z: "Use your best judgement and tell me what you assumed."]

[Final response — Worked for 16s]
I merged the two Dana Whitfield owner records (U03/inactive and U09/active) into one rep, since same name is far more likely a CRM re-add/duplicate than two different people — treating them as separate would arbitrarily split one rep's performance across two rows.

Win rate and median sales cycle by rep — new-business deals closed Jan–Jun 2026 (won/lost only)
Rep | Decided deals | Won | Win rate | Median cycle (days)
Sofia Marin | 15 | 8 | 53.3% | 56
Dana Whitfield | 38 | 14 | 36.8% | 41
Priya Raman | 50 | 17 | 34.0% | 37.5
Tom Okoye | 56 | 15 | 26.8% | 29.5
Marcus Bell | 57 | 14 | 24.6% | 55
Ana Pereira | 33 | 8 | 24.2% | 51
Liam Carter | 58 | 14 | 24.1% | 48.5
Open in workbook

What I assumed, in full:
Dana Whitfield merge: combined the two owner-id records into one rep (38 decided deals, 14 won, 36.8% win rate, 41-day median cycle) rather than reporting them separately.
"New business": normalized inconsistent Opp Type labels (NB, New Biz, New Business, new_business) into one bucket; excluded Expansion/Upsell.
Close window: Close Dt from 2026-01-01 through 2026-06-30 inclusive.
Won/Lost normalization: collapsed inconsistent stage labels (06 - Closed Won, Closed Won, Won, closed_won → Won; similarly for Lost) and excluded all disqualified-stage variants and soft-deleted opps (Is Deleted = True).
Sales cycle: Close Dt − Created Dt in days, median taken per rep across their won+lost deals.

Want this broken out by region instead, or restricted to just active reps?

### Q8. Paying customers missing from the CRM

Worked for 2.3m

412 of our 1,130 paying customers (36%) have no account in the CRM, representing roughly $514,419 in MRR out of $2,154,476 total MRR (about 24% of MRR).

Methodology and assumptions:

Paying customer = a customer (customers table) with at least one subscription in subscriptions with Status = 'active' as of 30 Sep 2026.
MRR computed per active subscription (Unit Amount × Quantity for standard plans, or Custom Annual Amount for enterprise plans with Unit Amount = 0), normalized to a monthly figure (annual plans ÷ 12), then converted to USD using the most recent available FX rates (29 Sep 2026, since no rate was posted for the 30th).
"Has an account in the CRM" = the customer's Stripe ref (customers.Ext Ref) matches an accts.Billing Cust Ref on a CRM account that is not deleted and not merged into another account. Deleted/merged accounts were treated as not representing a current CRM account.

A couple of judgment calls worth flagging: I excluded trialing and past_due subscriptions from "paying" (not revenue-confirmed), and I excluded deleted/merged accts rows from counting as a valid CRM account.

Want me to re-run this including past_due subscriptions as paying, or see a breakdown of these 412 customers by country or plan tier?

Sources: customers, accts, subscriptions, plans, fx_rates

### Q9. ARR by industry

Worked for 7.9m

Healthcare brings in the most ARR — $3.30M, which is 27.1% of Corvia's total ARR (~$12.15M).

ARR by Industry [bar chart]
industry	arr_usd	share_of_total_arr
Healthcare	3295652.9454921577	0.2711922185525642
Unknown	2470577.7224858473	0.20329854652441967
Field Services	1672007.9976548622	0.13758595514186905
Home Services	1522618.0842220122	0.12529297929662878
Dental	1399893.0772514148	0.11519420146331384
Logistics	723739.3416245483	0.059554959504276014
Veterinary	539908.6292391827	0.044427924117228984
Other	528063.5192538355	0.04345321539969875
Open in workbook

Runners-up: Field Services ($1.67M, 13.8%), Home Services ($1.52M, 12.5%), and Dental ($1.40M, 11.5%).

A few assumptions behind this number, worth flagging:

ARR = active-subscription MRR × 12 as of Sep 30, 2026 — I counted only subscriptions whose current status is active on that date (trialing, paused, past_due, and canceled subscriptions are excluded from "today's MRR").
Enterprise contracts use Custom Annual Amount ÷ 12 for MRR; all other plans use Quantity × Unit Amount (annualized where the plan bills yearly). Active coupon discounts (forever, or repeating ones still inside their window) are applied.
Non-USD amounts (GBP, EUR, AUD) are converted at the latest FX rate on or before Sep 30, 2026 (Sep 29, 2026, since no rate was recorded for the 30th itself).
Industry comes from the CRM accts table (linked to billing customers via the Stripe customer ref), normalized through the industry_map lookup. That lookup didn't cover 8 raw values that are obvious synonyms of existing categories (e.g. "HC"/"Medical Practice"→Healthcare, "FSM"→Field Services, "Vet clinic"/"Animal Health"→Veterinary, "dental clinic"→Dental, "home svc"→Home Services, "Last-mile delivery"→Logistics), so I folded those in rather than dropping that revenue.
318 of 877 active customers (~20.3% of total ARR, $2.47M) have no matching CRM account at all and are bucketed as "Unknown" — they're included in the total-ARR denominator (since they're real revenue) but can't be attributed to a named industry. If you exclude that unattributed slice entirely, Healthcare's share of identified ARR rises to about 34%.

Want me to redo the ranking excluding the "Unknown" bucket, or break this ARR down by region/country instead?

Sources: subscriptions, customers, plans, industry_map, accts, coupons, fx_rates

### Q10. Seat utilization

Worked for 4.7m

About 59.8% of the seats Corvia's paying customers paid for in September 2026 were actually used by a real person.

Seats used (numerator): 16,571 — distinct humans (excluding bots/integrations and Corvia staff) who logged an event in September 2026, inside a paying customer's production workspace.
Seats paid for (denominator): ≈27,724 — summed from each live, non-internal customer's subscription Quantity, time-weighted across however many days in September each quantity was in effect (to handle mid-month plan/seat changes), for subscriptions in active or past_due status.
Share: 16,571 / 27,724.3 ≈ 0.598 (59.8%)

Methodology notes / assumptions:

"Paying customer" = a customer with Livemode = true, not flagged internal in metadata (this excludes ~24 test clinics and 5 Corvia demo/sandbox accounts), and holding a subscription with status active or past_due overlapping any part of September 2026. Trialing, paused, and canceled subscription periods were not counted as "paying."
Workspaces were matched to customers via the Stripe customer ID embedded in each workspace's metadata; only each customer's production workspace (not its paired sandbox copy) was used to count usage.
"Real person" excludes users flagged Is Bot = true, accounts with Role = 'api' (covers both Corvia's own integration bots and third-party ones like Zapier), and anyone on the corvia.io staff domain (covers both support-impersonation accounts and internal admin accounts).
For reference, these paying customers had 23,845 real human user accounts provisioned in total — so usage also represents about 69% of created accounts, but only 59.8% of the seats actually being paid for, meaning customers are paying for meaningfully more capacity than they're using.

Want me to break this down by customer, plan tier, or region to see where unused seats are concentrated?

Sources: workspaces, customers, users, subscriptions, events

### Q11. Appointments trend

Worked for 54s

Appointment creation has risen steadily each month, from 127,826 in June to 142,668 in September 2026 — a gain of roughly 11.6% over the four months.

month	appointments_created
2026-06	127826
2026-07	131177
2026-08	134305
2026-09	142668
Open in workbook

[Line chart: Appointments Created, Jun-Sep 2026]

A few notes on how I computed this: I used the app.events table, filtering to appointment-creation events. The product logs this event under two different names depending on when it happened — appointment_created (used June–July) and appointment.created (used August–September onward) — so I combined both to get a continuous series, and deduplicated by event ID since a small share of events (~3%) were logged more than once (likely delivery retries).

The trend is consistently upward — a steady month-over-month increase of roughly 2.6%, 2.4%, and 6.2% respectively, with no dips, suggesting growing usage/adoption rather than seasonal noise.

Want me to break this down by workspace or customer segment to see who's driving the growth?

Sources: events

### Q12. Enterprise support responsiveness

Worked for 4.3m

Enterprise support tickets opened in Q3 2026 (Jul 1 – Sep 30, UTC): 818 tickets.

Median time to first human reply: ≈1.69 hours (~101 minutes) — computed over the 768 tickets (94%) that did receive a human reply.
Share answered within 4 hours: ≈79.0% (646 of 818) — this treats the 50 tickets with no reply yet as missing the target, per your instruction.

Assumptions I used to get here, since none of these are spelled out directly in the schema:

Enterprise = customers whose customers.Metadata segment tag is "enterprise" (this matches the same tier naming used in the plans table). I traced each ticket's requester email → app user → workspace → Stripe customer id (falling back to the accts table's billing reference when a workspace's own metadata lacked it) → customer segment, excluding sandbox workspaces to avoid double-counting.
First human reply = the first ticket event from an agent author type that is marked public (Is Public = true) — this excludes internal notes and the automated "we've received your request" system message.
Median is computed only across tickets that actually got a reply, since "time to reply" is undefined for a ticket that never got one; the no-reply tickets are folded into the 4-hour miss rate instead, per your framing.

One data note: Enterprise workspaces are disproportionately large (averaging ~184 users each vs. 3–27 for other tiers), which is why Enterprise tickets are ~40% of all Q3 tickets despite Enterprise being only ~3% of workspaces — that's expected for per-seat software sold to larger accounts, not a join error.

Want me to break this down by priority level or channel (web/chat/email) to see where response times lag?

Sources: tickets, users, workspaces, accts, customers_v1, plans, customers, subscriptions, ticket_events

### Q13. Customer count

Worked for 2.1m

You have 1,531 customers.

This counts live (non-test) records in the billing-customer table — I excluded 24 records flagged Livemode = false as test/demo data. I used the customers table rather than accts (CRM accounts, which includes prospects without a billing relationship — only 1,013 of its 2,228 active accounts even have a billing reference) or customers_v1 (436 legacy records, all of which are already migrated into and fully represented within customers). Every one of these 1,555 total billing customers (1,531 live + 24 test) also has at least one non-canceled subscription, so there's no separate population of fully-churned customer records to exclude.

Want a breakdown of these customers by country or by subscription plan?

Sources: customers, customers_v1, accts, subscriptions

