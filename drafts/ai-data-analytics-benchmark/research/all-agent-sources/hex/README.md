# Hex

**Data Analytics Index: 58.7** (19 of 39 points, accuracy 48.7%)

| Setup | |
|---|---|
| Model | Default |
| Data access | Read-only Postgres role |
| How it was run | One question at a time |
| Timing source | Hex's saved 'Worked for' timer |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $748,158.50 · 613 customers | 0 | 82 |
| Q2 | Net revenue retention | 97.4% | 3 | 56 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 85 |
| Q4 | Recognized revenue, Q3 2026 | $2,601,203.52 | 2 | 76 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,628 · 2025 $6,665,229 | 3 | 72 |
| Q6 | Overdue receivables | $142,449 | 0 | 47 |
| Q7 | Sales performance, H1 2026 | 7 of 7 reps exact, 7 within 5% | 3 | 48 |
| Q8 | Paying customers missing from the CRM | 191 customers · $73.5K | 0 | 53 |
| Q9 | ARR by industry | Healthcare · 26.2% | 0 | 74 |
| Q10 | Seat utilization | 57.3% | 2 | 96 |
| Q11 | Appointments trend | Sep 90,926 | 1 | 95 |
| Q12 | Enterprise support responsiveness | Median 1.68 h · 78.7% | 2 | 133 |
| Q13 | Customer count | 617 | 0 | 53 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

Worked for 1 minute 22 seconds

MRR today is about $748,159, from 613 paying customers. Each customer has exactly one qualifying subscription.

[Table "MRR today": mrr_usd 748158.50, paying_customers 613, subscriptions 613]

How I got there, including some data problems I had to handle:

- Current state: I used each subscription's current row. 15 subscriptions had their current row stored twice, identically, so I kept one copy of each to avoid counting them twice.
- Statuses: Only active and past due are counted, which leaves out trials, paused and cancelled subscriptions.
- Pricing: Seat price × seats. Annual plans are divided by 12. The plans table labels annual billing two ways ("annual" and "year"), and I treated both as annual. Enterprise plans have a custom annual amount instead of a seat price, also divided by 12.
- Discounts: NONPROFIT20 and PARTNER15 are permanent, so they always apply. LAUNCH50 (50% off for 3 months) only counts while it's still within those 3 months on 30 Sep.
- Excluded accounts: I left out three kinds: test accounts marked as not live; accounts flagged internal in the customer record; any customer with an @corvia.io email. This catches one internal demo account ("Corvia Demo - Clinic 1") that has no internal flag.
- Exchange rates: The latest rate in the data is from 29 Sep; there's none for 30 Sep, so I used 29 Sep as today's rate. AUD is stored as US dollars-to-AUD, so I inverted it.

### Q2. Net revenue retention

Worked for 56 seconds

Net revenue retention over the last 12 months was 97.4%, with currency held at today's rates.

[Table "12-month NRR (constant FX)": cohort_customers 508, start_mrr_usd 551527.69, current_mrr_usd 537216.11, retained_customers 408, nrr 0.9741]

508 customers were paying on 30 Sep 2025, with about $551.5K MRR between them. Those same customers bring in about $537.2K MRR today, which is a net loss of about $14.3K a month. 408 of the 508 are still paying. Expansion from the customers who stayed made up most, but not all, of what was lost to churn and downgrades. New customers since then are excluded.

How I calculated it (any of these choices can move the figure):

- Which subscription record counts on each date: I used the one in effect at the end of each day (UTC). 15 subscriptions have more than one record marked as current, so I took the most recent one.
- Who counts as paying: active and past_due subscriptions only. Trialing, paused and cancelled ones are excluded, and so are the 24 test-mode customers.
- How MRR is worked out: per-seat price × seats, with annual plans divided by 12. The plans table labels annual billing two ways ("year" and "annual"), and I treated both as annual. For Enterprise, I used the custom annual amount divided by 12, assuming it's stored in cents like the other prices.
- Discounts: MRR is after discounts. The NONPROFIT20 and PARTNER15 coupons apply permanently. LAUNCH50 only counts during its 3 months from the coupon's start date, so expiring launch discounts show up as expansion.
- Exchange rates: I converted both dates using the latest rates in the data, from 29 Sep 2026, because there is no 30 September rate yet. For AUD, I divided by the USD→AUD rate.

If you'd count past_due customers as at risk rather than paying, I can rerun it without them, or break the change down into churn, downgrades and expansion.

### Q3. The May cancellation spike

Worked for 1 minute 25 seconds

The May jump wasn't real churn. It came from one customer, Meridian Health Group, moving 16 separate clinic subscriptions onto a single enterprise contract. That customer actually grew.

What the data shows

- May had 48 cancellations against a usual 25–35 a month. 16 of them have reason code 4, which isn't in the cancel-reasons table, so they look like unexplained churn. Code 4 appears in no other month.
- All 16 happened on 15 May 2026, on consecutive customer IDs (51540–51555). Every one is a "Meridian Health – [X] Clinic LLC" that rolls up to the Meridian Health Group parent account in the CRM.
- Meridian Health Group was set up as a new billing customer on 2 May. On 15 May, the same day the clinics cancelled, it started an active enterprise subscription.

[Table "Cancellations by month and reason": cancel_month, reason, prev_status, cancellations — 66 rows, Oct 2025 onward]

Comparing before and after, Meridian went from 270 to 310 seats. Annual value went from about $98.6k to $123.7k, an expansion of roughly $25k a year (+25%). Revenue wasn't lost.

[Table "Meridian consolidation before vs after": Before: 16 clinic subscriptions, 16 subs, 270 seats, $98,640/yr; After: Meridian Health Group enterprise contract, 1 sub, 310 seats, $123,690/yr]

Excluding Meridian, May had about 32 cancellations: 14 trials that didn't convert and 18 paid. That's in line with the surrounding months (April 34, June 34). The real reasons didn't spike either; "Too expensive" and "Other" are up by only two or three each.

Recommendations

- Add code 4 to the cancel-reasons table, for example as "Migrated / consolidated", and leave it out of churn metrics. Otherwise any churn report will show this spike.
- Check the data quality on these rows. Some of the Meridian cancellations close out with a valid_to of 9999-12-31 and others with NULL. The table defines NULL as the current row, so any logic that checks for NULL will miss the 9999 rows.
- One Meridian clinic, Ironwood, has a duplicate CRM record that was merged into another account, so its parent link is missing. The billing name still ties it to Meridian, but parent-level rollups will leave it out until that's cleaned up.

I counted a cancellation as a subscription changing to "canceled", so a subscription that cancelled more than once counts each time.

### Q4. Recognized revenue, Q3 2026

Worked for 1 minute 16 seconds

Recognized revenue for Q3 2026 comes to about $2.60M ($2,601,203.52).

[Table "Q3 2026 recognized revenue (USD)" by line_type and currency, 20 rows]

Breakdown:

- Subscriptions: $2,709,445
- Prorations: $24,349
- Setup fees: $23,029
- Discounts: –$25,931
- Credit notes: –$129,687

How I calculated it:

- Spreading charges: Subscription, proration and discount lines are spread by day over their billing period. I treated the period end date as exclusive (a monthly line runs from 03-26 to 04-26), so only the July 1 to September 30 share counts. Setup fees count in full on the invoice date.
- Excluded: void and draft invoices, test-mode invoices, and customers that are test-mode or tagged internal: true. That last group is 5 accounts.
- Tax: Revenue comes from the invoice lines before tax. Credit note amounts include tax, so I subtract amount − tax_amount, dated on the day the credit was issued.
- FX: Each invoice and credit note is converted at the rate for its date in UTC. AUD rates are stored as AUD per USD, so I inverted them. Rates stop at 29 Sep, so any 30 Sep item uses the latest earlier rate.

Things to check:

- Line units: The schema describes invoice line amounts as cents, but they are actually in whole currency units. Every invoice's lines add up to exactly its subtotal ÷ 100, so I used them as whole units. If you have code that follows the column description, it will overstate revenue 100×.
- EUR credits: About $102k of the $130k in credits is in EUR. That's worth checking if it looks unusually large.
- Other test accounts: I relied on the test-mode and internal flags only. About 30 customers have "test" or "corvia" in their name or email, but I didn't exclude them by name.

### Q5. Billings, 2024 against 2025

Worked for 1 minute 12 seconds

Billings were $2,845,628 in 2024 and $6,665,229 in 2025. That's growth of $3,819,602, or about 134% (2025 was roughly 2.34 times 2024).

[Table "Billings 2024 vs 2025": 2024 2845627.70; 2025 6665229.30]

How I got there, since some choices affect the totals:

- 2024 comes from the old billing system's export. The system moved in January 2025, and 29 invoices from late 2024 were copied into the new system. I counted those once, from the old system, so they aren't double-counted. That export is already in dollars. Credits there appear as negative invoice lines and are netted in.
- 2025 comes from the current system. Billings are invoice amounts before tax, minus credit notes. Credit notes count in the year they were issued, not the year of the original invoice. Euro, pound and Australian-dollar amounts are converted at the exchange rate on the invoice or credit-note date. The Australian rate is stored the other way round (dollars to AUD), so I inverted it.
- Excluded: void and draft invoices, credit notes against voided invoices, test-mode customers and accounts flagged as internal, in both systems. The old system's void status was spelled in two ways, and both are excluded.
- Still counted: invoices marked uncollectible or written off. They were invoiced, so they're billings. That's about $0.2M in 2025 and less in 2024. If you'd rather count only what was collected, that's a different metric and I can work it out.

The 134% figure partly reflects 2024 being a smaller base built up over the year. If useful, I can split the growth by currency or region, or between new and existing customers.

### Q6. Overdue receivables

Worked for 47 seconds

About $142,449 is more than 30 days overdue as of 30 September 2026. It sits across 13 customers, and each of them has one overdue invoice.

The five customers who owe the most:

1. Old Juniper Urgent Care Ltd (GB): $111,289
2. East Woodvale Smile Studio Ltd (GB): $3,683
3. Valley View Home Cleaning Ltd (IE): $3,375
4. Summit Same-Day Delivery GmbH (DE): $3,313
5. East Queensbury Vets LLC (US): $3,038

Old Juniper is about 78% of the total, so this is really one large overdue account plus a few small balances. That single invoice is worth checking before you act on the figure.

[Table "Overdue >30 days by customer (USD)", 13 rows: Old Juniper 111,288.96; East Woodvale 3,683.36; Valley View 3,375.27; Summit Same-Day 3,313.01; East Queensbury Vets 3,038.00; West Southport Medical 2,891.00; Greater Tidewater Urgent Care 2,811.37; Tidewater Urgent Care 2,717.23; North Newhaven HVAC 2,616.71; Silverlake Smile Studio 2,596.47; Thornbury Medical 1,616.54; Old Danbury Elevator 1,400.89; South Fairview Plumbing 1,099.99]

How I worked it out:

- Amount owed: each invoice's total including tax, minus what's been paid, minus any credit notes issued by today (credit note tax included).
- Overdue: the due date was before 31 August 2026.
- Which invoices count: only real (not test) invoices with status "open". Drafts, voided, paid and test invoices are left out.
- Uncollectible invoices are also left out. These have been written off but still have large unpaid balances. If you count them as overdue money, the figure goes up a lot. I can add them if that's what you need.
- Currency: GBP, EUR and AUD are converted to US dollars at the latest exchange rate available, which is from 29 September 2026.

### Q7. Sales performance, H1 2026

Worked for 48 seconds

I counted 257 won or lost new-business deals across 7 reps that closed between 1 January and 30 June 2026. Overall, 76 were won, a 30% win rate.

| sales_rep | region | closed_deals | won | lost | win_rate | median_cycle_days |
|---|---|---|---|---|---|---|
| Sofia Marin | EMEA | 12 | 6 | 6 | 0.500 | 64.0 |
| Dana Whitfield | NA | 33 | 12 | 21 | 0.364 | 41.0 |
| Priya Raman | NA | 44 | 14 | 30 | 0.318 | 37.5 |
| Tom Okoye | UK&I | 44 | 13 | 31 | 0.295 | 34.0 |
| Marcus Bell | NA | 47 | 12 | 35 | 0.255 | 50.0 |
| Ana Pereira | NA | 28 | 7 | 21 | 0.250 | 51.0 |
| Liam Carter | APAC | 49 | 12 | 37 | 0.245 | 47.0 |

- Win rate: Sofia Marin has the highest, 50%, but that's on only 12 deals, so it's the least reliable number here. Among the reps with 28 or more deals, win rates run from Dana Whitfield at 36% down to Liam Carter at 25%.
- Sales cycle: Medians run from 34 days (Tom Okoye) to 64 days (Sofia Marin). How fast a rep closes doesn't line up with how often they win. Priya and Tom are both fast and above average on win rate. Marcus, Ana and Liam take about 50 days and win the least.

How I got these numbers:

- "New business" deals: the data labels these in four ways (New Business, New Biz, NB, new_business), so I counted all four.
- Won or lost: each outcome is also spelled several ways (for example "Closed Won", "Won", "closed_won", "06 - Closed Won"), and I counted all of them. All disqualified spellings (DQ, Disqualified, 00 - Disqualified) are left out.
- Deleted and duplicate records: I removed deleted deals. I also removed 50 records that were migrated from an older system and are copies of deals already in the data, so they would otherwise be counted twice.
- Sales cycle: the number of days from when the deal was created to its close date.
- Rep: each deal is credited to its current owner.

### Q8. Paying customers missing from the CRM

Worked for 53 seconds

191 of our 617 paying customers (31%) have no live account in the CRM. Together they bring in about $73.5K of MRR, which is roughly 10% of the $751K total.

[Table "Paying customers missing from CRM": paying_customers 617, customers_without_crm_account 191, mrr_usd_without_crm 73538.21, total_mrr_usd 750954.50]

How I counted:

- Paying customer: a live (non-test) billing customer with at least one current subscription that is active or past_due and has MRR above zero. Trials, paused and canceled subscriptions don't count.
- Duplicate records: 15 subscriptions had more than one "current" row. I kept only the latest one for each.
- MRR: seat price × quantity, with annual plans divided by 12; Enterprise plans use their custom annual amount ÷ 12; coupons are applied only if they are still running on 30 Sep 2026; amounts are converted to USD at the latest available rate, which is from 29 Sep. (AUD rates are stored as AUD per USD, so I inverted them.)
- Has a CRM account: the customer's Stripe ID matches either the CRM's billing customer reference or the Stripe ID stored in its external-IDs field. I ignored case and stray spaces, because 92 CRM references have that kind of formatting noise. CRM accounts flagged as deleted don't count as a match.

Two things to keep in mind. Some of the 191 could be real customers that were entered in the CRM under a different ID, so matching on name or email might bring the number down. And 31% missing is high enough that it's worth checking a handful by hand before treating it as a CRM hygiene problem. I can pull the list of the largest unmatched customers by MRR for that.

### Q9. ARR by industry

Worked for 1 minute 14 seconds

Healthcare brings in the most ARR: about $2.36M, or 26.2% of total ARR (about $9.01M).

| industry | subs | arr_usd | arr_share |
|---|---|---|---|
| Healthcare | 113 | 2,364,126 | 0.2623 |
| Home Services | 88 | 1,412,265 | 0.1567 |
| Field Services | 65 | 1,254,709 | 0.1392 |
| Unknown | 190 | 1,224,774 | 0.1359 |
| Dental | 61 | 1,145,393 | 0.1271 |
| Logistics | 39 | 576,984 | 0.0640 |
| Other | 24 | 539,664 | 0.0599 |
| Veterinary | 37 | 493,539 | 0.0548 |

Home Services is second at 15.7%, and Field Services third at 13.9%.

How I calculated it:

- Which subscriptions count: only the current version of each subscription, where status is active or past_due. I left out trialing, paused and canceled subscriptions, and test-mode customers. Where a subscription had more than one current row (15 did), I used the latest one.
- MRR: seat price × seats. Annual plans are divided by 12. Enterprise plans use the custom annual amount divided by 12.
- Coupons: "forever" coupons are always deducted. LAUNCH50 (50% off for 3 months) is deducted only while it's still running on 30 Sept 2026.
- Currency: EUR, GBP and AUD are converted to USD at the latest rate on file, which is from 29 Sept. The AUD rate is stored the other way round (AUD per USD), so I inverted it.
- Linking subscriptions to industries: subscriptions are matched to CRM accounts by billing ID. Many accounts only hold that ID in a secondary ID field, so I matched on both.
- Grouping industry labels: the CRM's industry labels are inconsistent, so I used the mapping table. Eight labels aren't in it, and I grouped those by hand (e.g. "HC" and "Medical Practice" → Healthcare, "dental clinic" → Dental, "FSM" → Field Services).

About 13.6% of ARR ($1.22M, 190 subscriptions) has no industry, either because there's no matching CRM account or the account's industry field is blank. That's more than Healthcare's $0.95M lead over Home Services, so the ranking could in theory change if those were classified. In practice it would only flip if nearly all of the unclassified ARR were Home Services, which is unlikely. The shares above are of total ARR including that unclassified slice.

### Q10. Seat utilization

Worked for 1 minute 36 seconds

In September 2026, about 57.3% of paid seats were used: 16,334 of the 28,519 seats that 867 paying customers pay for.

[Table "Sept 2026 seat utilization": paying_customers 867, paid_seats 28519, used_seats_capped 16334, active_humans_raw 16378, seat_utilization 0.5727]

How I worked it out:

- Paid seats: Seat counts on subscriptions that were active or past due at the end of 30 September. I only counted live customers on a priced plan, or Enterprise contracts with a custom amount. I left out trialing, paused and cancelled subscriptions and free plans.
- Used seats: Different people with at least one product event between 1 and 30 September (UTC), in that customer's non-sandbox workspaces. I removed bot users, API/integration accounts (including Zapier hooks, which aren't flagged as bots) and Corvia staff (corvia.io support admins). I capped each customer at the number of seats they pay for. The cap only removes 44 extra active people, so it barely changes the result.
- Linking workspaces to customers: Workspaces store the billing customer ID in two different formats. My first pass only caught one of them, which missed a large share of customers and put usage at about 24%. Once I matched both formats, it rose to 57%. If any workspaces are linked some third way, the true figure would be slightly higher.

One judgement call: I counted past-due customers as paying (seven subscriptions, 71 seats). Leaving them out would barely move the number.

### Q11. Appointments trend

Worked for 1 minute 35 seconds

Appointment creation grew steadily from June to September 2026, from about 81.4k to 90.9k a month. That's roughly 12% over the four months, and growth sped up each month.

| Month (UTC) | Appointments created | Change on prior month |
|---|---|---|
| June 2026 | 81,382 | – |
| July 2026 | 83,303 | +2.4% |
| August 2026 | 86,078 | +3.3% |
| September 2026 | 90,926 | +5.6% |

[Chart "Monthly appointments created": Loading visualization...]

That notebook table didn't finish running in this session, so it may show no results until you re-run it. I got the figures above by running the same query directly; that version also returned the bot and sandbox counts below.

How I counted, using the app event log:

- Two event names: the event was renamed on 1 August. It's appointment_created through July and appointment.created from August on. I combined both; counting only one name would make it look like appointments stopped or suddenly started.
- Duplicates removed: about 3% of event rows were exact repeats of the same event, so I counted each event once.
- Bots excluded: bot users created about 46–51k appointments a month, roughly 36% of all events, so these aren't real customer actions. They're growing at about the same pace, so leaving them in would give similar trend percentages but inflate the totals by about 55%.
- Sandbox workspaces excluded: about 240–280 a month, which makes no real difference.

If you'd rather count appointments when they're actually booked than when the event was recorded, or split the trend by country or segment, I can do that next.

### Q12. Enterprise support responsiveness

Worked for 2 minutes 13 seconds

For Enterprise tickets opened in Q3 2026, the median time to the first human reply was about 1.68 hours (around 1 hour 41 minutes), and 78.7% got a reply within 4 hours.

- Tickets counted: 901 Enterprise tickets were opened between 1 July and 30 September 2026 (UTC). 846 of them have had a human reply.
- The median only covers the 846 tickets that have a reply, because the other 55 have no reply time to measure.
- The 4-hour share uses all 901 tickets, and the 55 with no reply count as misses, as you asked.

The cell below holds the query. It was still running when I wrote this, so these figures come from the same query run separately.

[Cell "Enterprise Q3 first reply": Loading visualization...]

How I defined things:

- Enterprise customer: the database has no direct link between a ticket and a customer account. I matched tickets to billing customers by email domain (lower-cased and trimmed). A ticket counts as Enterprise if that customer had an active, past-due or trialing Enterprise plan at the moment the ticket was opened. I left out test-mode customers.
- Merged tickets: I left out the 212 tickets that were merged into another ticket, so the same request isn't counted twice.
- First human reply: the earliest public message from a support agent. I ignored system messages, internal notes and messages from the customer. No replies were dated before their ticket was opened.

Matching by domain is the weakest part: if a customer's billing email uses a different domain from the people who send tickets, their tickets would be missed.

### Q13. Customer count

Worked for 53 seconds

You have 617 paying customers as of 30 September 2026.

I counted distinct real (non-test) billing customers whose current subscription is either active (614) or past due (3). Past-due accounts are still under contract, so I included them.

[Cell "Customer counts": Loading visualization...]

What's left out, and what changes if you count it:

- Paused: 2 more customers. Counting them gives 619.
- Trialing: 17 accounts. They haven't converted yet, so they aren't customers.
- Test-mode accounts: 24 records are flagged as test data. 13 of them have an active subscription, so leaving them out matters.
- No current subscription: about 900 live billing records have either cancelled or never subscribed.

I counted from the billing system, not the CRM, because the CRM account table also has prospects and merged or deleted accounts. Each billing customer is counted as one customer; I didn't merge parent and child companies. If you count customers at the parent-company level, the number will be a bit lower.

