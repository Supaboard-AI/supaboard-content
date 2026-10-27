# Metabase

**Data Analytics Index: 10.0** (0 of 39 points, accuracy 0.0%)

| Setup | |
|---|---|
| Model | Metabase AI service (not shown) |
| Data access | Read-only Postgres role |
| How it was run | In parallel tabs |
| Timing source | Metabot's own timers |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | SQL only, not run by the agent | 0 | 117 |
| Q2 | Net revenue retention | SQL only, not run by the agent | 0 | 301 |
| Q3 | The May cancellation spike | does not name it | 0 | 114 |
| Q4 | Recognized revenue, Q3 2026 | SQL only, not run by the agent | 0 | 414 |
| Q5 | Billings, 2024 against 2025 | SQL only, not run by the agent | 0 | 411 |
| Q6 | Overdue receivables | SQL only, not run by the agent | 0 | 147 |
| Q7 | Sales performance, H1 2026 | SQL only, not run by the agent | 0 | 85 |
| Q8 | Paying customers missing from the CRM | SQL only, not run by the agent | 0 | 203 |
| Q9 | ARR by industry | SQL only, not run by the agent | 0 | 156 |
| Q10 | Seat utilization | SQL only, not run by the agent | 0 | 243 |
| Q11 | Appointments trend | Sep 146,978 | 0 | 35 |
| Q12 | Enterprise support responsiveness | SQL only, not run by the agent | 0 | 78 |
| Q13 | Customer count | 1,526 | 0 | 31 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

Worked for 71 seconds

Good schema picture. Let me load the SQL skill, then I'll build the query.

Thought for 31 seconds

I have everything I need. Now let me build the query.

Worked for 15 seconds

Here's your MRR & Paying Customers — 30 Sep 2026 query. It returns two numbers in a single row:

Column	What it contains
paying_customers	Distinct cust_id count across qualifying subscriptions
mrr_usd	Net MRR in USD, formatted with commas

How it works, step by step:

Active rows — valid_to IS NULL isolates the current snapshot; status filtered to active and past_due only (trials and paused are excluded).
Customer exclusions — livemode = true drops test accounts; metadata->>'internal' = true drops internal ones.
Plan pricing — monthly plans use unit_amount × quantity; annual/year plans divide by 12; Enterprise plans (where unit_amount = 0) use custom_annual_amount ÷ 12.
Discounts — forever coupons always apply; repeating coupons are only applied while today < coupon_start + duration_in_months, then fall to zero.
FX conversion — rates are pulled from billing.fx_rates where rate_date = '2026-09-30' and quote_ccy = 'USD'; USD-denominated subscriptions default to a rate of 1.0.
All amounts are converted from minor units (cents/pence/etc.) by dividing by 100.

One assumption worth flagging: custom_annual_amount is treated as the total negotiated annual contract value (not per-seat), since the plan's unit_amount description explicitly says "0 for Enterprise — see subscriptions.custom_annual_amount". Let me know if it's actually per-seat and I'll adjust.

[Metabot opened this SQL in a new, unsaved question but did not run it. Result after Claude clicked Run once: paying_customers 614, mrr_usd $777,769.02]

### Q2. Net revenue retention

Worked for 301 seconds

I've got a clear picture of the schema. Here's what I'll build:

Cohort: customers with active/past_due subscriptions on 30 Sep 2025 (live, non-internal accounts)
MRR engine: minor-unit → whole-unit → monthly normalisation, coupon discounts, FX to USD using the most-recent rates in the table (for both dates, so currency moves net to zero)
NRR: END MRR ÷ START MRR × 100 (churned customers contribute $0 end MRR)
Worked briefly

Here's your NRR query: Net Revenue Retention — Sep 2025 cohort vs Sep 2026

What it calculates:

Column	Meaning
cohort_customers	Distinct paying customers on 30 Sep 2025
retained_customers	How many of those still have a paying sub today
start_mrr_usd	Their combined MRR on 30 Sep 2025 — at today's FX rates
end_mrr_usd	Their combined MRR on 30 Sep 2026 — at the same today's rates
nrr_pct	end_mrr ÷ start_mrr × 100

Key methodological choices to be aware of:

FX: uses the most-recent date in billing.fx_rates for both ends — the sample data runs to 29 Sep so that's the rate applied; there's no 30 Sep rate yet (let me know if you want a specific rate used instead).
"Paying" definition: status IN ('active', 'past_due'). If you want to exclude past_due from the cohort definition, that's a one-word change.
Discounts: coupon discount applied at each date independently — a repeating coupon that expired between the two dates will correctly show no discount at t1.
Scope: excludes livemode = false test accounts and metadata.internal = true accounts.
Enterprise plans (unit_amount = 0): annualised using custom_annual_amount / 12.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once: cohort_customers 507, retained_customers 407, start_mrr_usd 559,583, end_mrr_usd 540,313, nrr_pct 96.6]

### Q3. The May cancellation spike

Worked for 101 seconds

Good schema picture — I can see that billing.subscriptions is a slowly-changing dimension with one row per state change, ref.cancel_reasons holds the reason labels, and customers carry country + segment. I'll now build three diagnostic charts in parallel: cancel reasons by month, country by month, and segment by month.

Worked for 13 seconds

Here are three diagnostic cuts on the May 2026 cancellation spike:

1. 📊 Cancellations by Month & Reason

The most direct answer — each bar is stacked by cancellation reason. Look for which reason(s) are disproportionately tall in May vs. neighbouring months (e.g. a surge in "Too expensive", "Switched to competitor", "Missing features", etc.).

2. 🌍 Cancellations by Month & Country

Shows whether a specific geography (US, GB, AU, DE, …) drove the spike — or if it was broad-based across all markets.

3. 🏷️ Cancellations by Month & Segment

Breaks it down by customer tier (starter / growth / scale / enterprise). A spike concentrated in one tier often points to a pricing change, product decision, or a competitor move that hit that cohort.

How to read these together:

If May's spike is dominated by one reason → follow that thread (pricing complaint? feature gap? a specific competitor?).
If it's concentrated in one country → check for a regional price change, regulatory event, or a local competitor launch in that market.
If it's concentrated in one segment → look at whether a plan change, support issue, or contract renewal cycle hit that tier in Q1/Q2 2026.

Let me know what the charts show and I can drill deeper — e.g. plan-level breakdown, ticket volume correlation, or cohort analysis of which customers left.

### Q4. Recognized revenue, Q3 2026

Worked for 414 seconds

Good. I have everything I need. The metadata → segment values are legitimate billing tiers (enterprise/growth/scale/starter) — no "test" segment — so test accounts are covered by livemode = FALSE. Let me build the revenue-recognition query now.

Worked briefly

Here's the Q3 2026 Recognised Revenue (USD) query. It returns a single dollar figure for the quarter.

How it works:

Requirement	What the query does
Subscription lines	Clips each line's coverage period to 1 Jul–30 Sep and takes a proportional share of the line amount: amount × (days_in_Q3 / total_days_in_period)
One-off fees (setup_fee, proration, discount, …)	Full line amount, only if the invoice's issue date falls in Q3
FX conversion	LEFT JOINs billing.fx_rates on base_ccy = invoice_currency, quote_ccy = 'USD', rate_date = invoice_issue_date; USD invoices coalesce to 1.0
Credit notes	Subtracts amount − tax_amount (ex-tax) converted at the credit note's own issue date
Exclusions	status NOT IN ('void','draft'), livemode = TRUE (test accounts), metadata->>'internal' = TRUE (internal accounts)
Minor units	All amounts divided by 100 at the end to convert cents → dollars

A couple of things to be aware of:

Credit note amount field: I've treated it as inclusive of tax (subtracting tax_amount to get the net), mirroring how invoices.total vs invoices.subtotal work. If your credit notes store amount already net of tax, the credit figure will be slightly understated.
Missing FX rates: If any non-USD invoice or credit note lacks a rate row for that exact date, its contribution will be NULL and silently dropped from the sum (Postgres SUM ignores NULLs). Check for unexpected gaps in billing.fx_rates if the number looks light — especially for AUD, which wasn't in the sample rates I saw.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once: -7,170.02]

### Q5. Billings, 2024 against 2025

Worked for 8 seconds

Let me dig into the Corvia billing tables to understand their schema before building the query.

Worked for 14 seconds

Now let me check sample values for key filter fields and look for a customers/accounts table.

Worked for 193 seconds

Let me check the legacy amount format and look for FX rate tables and any additional relevant tables.

Worked for 196 seconds

Good picture. Now I have everything I need:

billing.invoices covers March 2024 onwards (new system), multi-currency (USD/GBP/EUR/AUD), with migrated_from flagging records ported from the old system
legacy.invoices_2024 is the old system's export (USD, pre-converted, text with commas)
billing.credit_notes links to modern invoices via invoice_id
billing.fx_rates has daily rates (base_ccy → quote_ccy, units of quote per 1 base)
billing.customers has metadata→'internal' boolean and livemode + legacy_id for matching the old system
Worked briefly

Here's the query: Total Billings 2024 vs 2025 – YoY Growth

It returns two rows — one per year — with total net billings in USD and the YoY growth rate. Here's how it was constructed:

Two data sources, stitched together to avoid double-counting:

2024 (legacy system) — legacy.invoices_2024, excluding VOID and WRITTEN OFF statuses; amount_usd is already pre-tax USD so no conversion needed. Negative rows (credit memos in the old system) are included as they reduce the total.
2024 (new system, native records only) — billing.invoices where migrated_from IS NULL, so migrated legacy invoices aren't counted twice.
2025 — all of billing.invoices dated in 2025.

Filters applied throughout:

livemode = TRUE on invoices (test accounts excluded)
status NOT IN ('void', 'draft') — only live, issued invoices
customers.metadata->>'internal' IS NOT TRUE — internal accounts excluded

Credit notes: billing.credit_notes amounts are aggregated per invoice and deducted from the invoice's subtotal before FX conversion.

FX conversion: For GBP, EUR, and AUD invoices in the modern system, the most recent available daily rate from billing.fx_rates on or before the invoice date is used (handles weekends/holidays gracefully).

One caveat to be aware of: Legacy customers with no match in billing.customers (missing legacy_id) cannot be checked for internal/test status and are included by default. If there are known internal account IDs in the old system not yet linked, those would need to be added as an explicit exclusion list.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once: 2024 2,844,377; 2025 5,430,884; YoY growth 90.9%]

### Q6. Overdue receivables

Worked for 131 seconds

Good, I have everything I need. The invoices table stores amounts in minor units (cents), credit notes need to be subtracted, and multi-currency amounts need converting via fx_rates. Let me build the query.

Worked for 16 seconds

Here's the 30+ Day Overdue AR query — each row shows one of the top-5 owing customers alongside the grand total across all overdue accounts.

How it works:

Step	Detail
Overdue threshold	due_at < 2026-08-31 — invoices due more than 30 days before Sep 30
Net balance	total − amount_paid − Σ(credit_note.amount + credit_note.tax_amount) — all in minor units (cents), so the result is divided by 100
Status filter	Excludes void, draft, and paid; includes open and uncollectible
FX conversion	Uses the most recent rate on or before 2026-09-30 from billing.fx_rates (base → USD); COALESCE(rate, 1.0) handles USD-denominated invoices with no conversion needed
Live data only	livemode = true excludes test accounts

The "Grand Total Overdue (USD)" column is a window function — it's the same value on every row and gives you the full AR exposure, not just the top 5's share. Let me know if you'd like this broken out by currency, aging bucket, or region.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once:
customer | Overdue (USD) | Grand Total Overdue (USD)
Old Juniper Urgent Care Ltd | 111,288.96 | 246,817.15
North Cedar Ridge Pest Control Ltd | 45,412.76 | 246,817.15
Eastgate Smile Studio LLC | 35,294 | 246,817.15
North Highland HVAC Pty Ltd | 6,756.2 | 246,817.15
Greater Lakeside Home Cleaning LLC | 5,409.19 | 246,817.15]

### Q7. Sales performance, H1 2026

Worked for 85 seconds

Here's your analysis: New-Business Win Rate & Median Sales Cycle by Rep — H1 2026

The query joins crm.opps to crm.users, filters for new-business opp_type variants and a close_dt in Jan–Jun 2026, then excludes disqualified deals. Results are sorted by win rate descending, with total_deals as a tiebreaker.

A couple of things worth knowing:

Messy enum values — both opp_type and stage_nm contain multiple legacy formats (e.g. NB, New Biz, new_business; Won, closed_won, 06 - Closed Won). The query normalises all known variants via LOWER(). If there are any further one-off values in the data not present in the samples, those deals would silently fall outside the scope — worth a spot-check if totals look low.
Sales cycle is computed as close_dt − created_dt (integer days in Postgres), so it reflects elapsed calendar days from opportunity creation to close.
The is_deleted flag was not applied, per your framing — if soft-deleted opps exist in the window they'll be included. Let me know if you'd like to exclude them.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once:
sales_rep | total_deals | won_deals | win_rate_pct | median_cycle_days
Sofia Marin | 16 | 9 | 56.3 | 64
Dana Whitfield | 39 | 14 | 35.9 | 41
Priya Raman | 53 | 18 | 34 | 38
Tom Okoye | 56 | 15 | 26.8 | 30
Marcus Bell | 58 | 14 | 24.1 | 54
Liam Carter | 58 | 14 | 24.1 | 48
Ana Pereira | 34 | 8 | 23.5 | 51]

### Q8. Paying customers missing from the CRM

Worked for 183 seconds

Good — I now have enough schema context. The join key between billing and CRM is billing.customers.ext_ref (Stripe cus_...) ↔ crm.accts.billing_cust_ref. MRR needs interval-aware calculation (month / annual / year) and FX conversion for EUR, GBP, AUD → USD. Let me build the SQL.

Worked for 20 seconds

Here's the query: Paying Customers with No CRM Account — Count & MRR

It returns a single row with two numbers — customer count and total MRR in USD. A few decisions worth flagging:

Choice	Rationale
"Paying" = status = 'active'	Excludes trialing, paused, past_due, and canceled. If you want past_due included (late payers are still revenue-bearing), let me know.
CRM gap logic	A customer is "missing from CRM" if billing.customers.ext_ref doesn't appear in crm.accts.billing_cust_ref among non-deleted CRM accounts. Soft-deleted CRM records are treated as absent.
MRR formula	Monthly plans → quantity × unit_amount ÷ 100; annual/year plans → same ÷ 12; Enterprise (unit_amount = 0) → custom_annual_amount ÷ 100 ÷ 12.
FX	EUR & GBP converted via direct → USD rates; AUD via inversion of the USD → AUD rate — both at the most recent date ≤ 30 Sep 2026.
Excluded	Test-mode customers (livemode = false) and internal accounts (metadata.internal = true).

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once: customers_without_crm 235, mrr_usd 173,682]

### Q9. ARR by industry

Worked for 111 seconds

Good — I have the full picture now. Let me load the SQL skill and build the query.

Thought for 36 seconds

Now I have everything I need. The join chain is: active subscriptions → plans (for pricing/currency) → customers → CRM accounts → industry_map for clean names, plus FX rates for USD conversion. Let me build it.

Worked for 9 seconds

Here's the ARR by Industry chart — the top row is your answer. The table also shows the pct_of_total_arr column so you can read both the ARR dollar amount and the share in one glance.

How it was built:

Active subscriptions only (valid_to IS NULL + status = 'active' as of 30 Sep 2026)
MRR per subscription = seats × unit price ÷ 100 (minor units), annualised for yearly plans; Enterprise deals use custom_annual_amount ÷ 100 ÷ 12
ARR = MRR × 12, all converted to USD via the 30 Sep 2026 spot rates
Industry is the clean label from ref.industry_map, which maps the messy raw CRM values (e.g. "Dental", "Dentistry", "dental clinic") to a single canonical name

One thing to flag: the FX rate sample only confirmed EUR, GBP, and USD entries — if AUD-denominated subscriptions have no corresponding row in billing.fx_rates, those amounts will fall back to face value (i.e. AUD treated as 1:1 with USD). You'd see a slightly inflated number for any AUD-heavy industry if that's the case.

[Metabot opened a bar chart in a new, unsaved question, unrun. Result after Claude clicked Run once (table view):
industry | arr_usd | pct_of_total_arr
Unknown | 2,427,734 | 31.9
Healthcare | 1,303,123 | 17.1
Field Services | 1,208,455 | 15.9
Home Services | 1,014,378 | 13.3
Dental | 606,190 | 8
Other | 561,687 | 7.4
(8 rows)]

### Q10. Seat utilization

Worked for 243 seconds

I have all I need. Here's the approach:

Denominator (paid seats): billing.subscriptions quantity for active/past_due subscriptions snapshotted at 2026-09-30 23:59:59, for live non-internal customers
Numerator (used seats): distinct users with events in September 2026, from paying-customer workspaces, excluding bots (is_bot IS NOT TRUE), integration accounts (role = 'api'), and Corvia-internal workspaces
Link: app.workspaces.meta → billing → customer ↔ billing.customers.ext_ref ↔ billing.subscriptions.cust_id
Worked briefly

Here's the query: September 2026 – Seat Utilisation Rate

It returns three columns — used_seats, paid_seats, and utilization_pct — computed as follows:

Layer	What it does
paid_seats	SCD-2 snapshot at 2026-09-30 23:59:59 UTC: sums quantity across all active or past_due subscription states for live, non-internal customers
used_seats	Distinct user_ids that fired ≥1 event in September 2026, scoped to paying-customer workspaces, with is_bot IS NOT TRUE and role ≠ 'api' to strip bots and API integration accounts
utilization_pct	100 × used / paid, rounded to one decimal

A few judgment calls to be aware of:

past_due included in "paying" — these customers still have contracted seats; I included them since they haven't cancelled. Drop them from the IN ('active', 'past_due') list if you only want current-pay customers.
Corvia staff exclusion — applied via billing.customers.metadata → internal = true (and the matching workspace flag). trialing and paused subscriptions are excluded from the denominator.
is_bot IS NOT TRUE — the ~0.7% of users with a NULL is_bot are treated as non-confirmed-human and excluded conservatively; flip to u.is_bot = FALSE if you'd rather include them.
Sandbox workspaces excluded from used-seat counting; paying-seat count is still at the customer level regardless of workspace count.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once: used_seats 9,670; paid_seats 28,452; utilization_pct 34]

### Q11. Appointments trend

Worked for 35 seconds

Here's your trend line: Appointments Created per Month (Jun–Sep 2026)

The query counts events from the app.events table where event_name is either appointment.created or appointment_created (both formats appear in the data), filtered to June–September 2026 and grouped by month.

A couple of things to note:

Two event name variants exist in the data — I've included both to avoid undercounting.
The line chart makes it easy to read the direction of the trend month-over-month across the four months. If you'd like a bar chart instead, just ask!

[Metabot opened a GUI (not SQL) question as a line chart. Values, read from the table view:
June 2026 131,673 | July 2026 135,163 | August 2026 138,456 | September 2026 146,978]

### Q12. Enterprise support responsiveness

Worked for 78 seconds

I have everything I need. I'll now write the SQL query:

Enterprise identification: billing.customers.metadata->>'segment' = 'enterprise'
Ticket creation time: created_ms is epoch milliseconds → to_timestamp(created_ms / 1000.0)
Human reply: first ticket_events row where author_type = 'agent'
Q3 2026: July 1 – September 30, 2026
Worked briefly

Here's your SLA analysis: Enterprise Q3 2026 – First Human Reply SLA

The query returns three numbers in one row:

Column	What it answers
total_tickets	Enterprise tickets opened Jul 1 – Sep 30 2026
median_hours_to_first_reply	Median time (hours) to the first agent response, computed only over tickets that have received a reply
pct_within_4_hours	% of all Enterprise Q3 tickets with a first human reply ≤ 4 h — unreplied tickets count against this target

A couple of things to be aware of:

Enterprise identification is via billing.customers.metadata->>'segment' = 'enterprise'. If a requester's email doesn't exist in billing.customers, their ticket is excluded. Let me know if you need to cast a wider net (e.g. also matching on a subscription tier or a legacy customer table).
Median vs. no-reply tickets: PERCENTILE_CONT natively excludes NULLs, so the median is the median among tickets that have a reply. If you'd like a version that treats unreplied tickets as infinity (which would push the median up), just say the word.

[Metabot opened the SQL in a new, unsaved question, unrun. Result after Claude clicked Run once: total_tickets 0; median_hours_to_first_reply and pct_within_4_hours empty]

### Q13. Customer count

Worked for 31 seconds

Here's the count: Total Customers

This counts all rows in billing.customers where livemode = true (excluding test-mode records) and metadata → internal is not flagged as true (excluding internal/system accounts). Those two filters together represent your real, paying customer base.

[Metabot opened a GUI question: Count of billing.customers, filters Livemode is true; Metadata → Internal is empty or false. Result: 1,526]

