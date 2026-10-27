# Lightdash

**Data Analytics Index: 81.8** (28 of 39 points, accuracy 71.8%)

| Setup | |
|---|---|
| Model | Claude Sonnet 5.5 |
| Data access | Read-only Postgres role |
| How it was run | One question at a time |
| Timing source | Server timestamps; includes SQL approval waits |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $245,489 · 250 customers | 0 | 101 |
| Q2 | Net revenue retention | 97.4% | 3 | 242 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 48 |
| Q4 | Recognized revenue, Q3 2026 | $2,568,266.89 | 3 | 191 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,628 · 2025 $6,664,837 | 3 | 199 |
| Q6 | Overdue receivables | $305,557.25 | 3 | 225 |
| Q7 | Sales performance, H1 2026 | 7 of 7 reps exact, 7 within 5% | 3 | 182 |
| Q8 | Paying customers missing from the CRM | 216 customers · $61.9K | 2 | 166 |
| Q9 | ARR by industry | Healthcare · 36.5% | 0 | 251 |
| Q10 | Seat utilization | 57.5% uncapped (first run) | 3 | 254 |
| Q11 | Appointments trend | Sep 142,668 (all) | 2 | 133 |
| Q12 | Enterprise support responsiveness | Median 1.68 h · 78.7% | 2 | 180 |
| Q13 | Customer count | 897 | 1 | 71 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

As of the end of 30 September 2026 (UTC), MRR is about $245,500 USD and we have 250 paying customers.

| Billing currency | Paying customers | MRR (local) | Rate to USD | MRR (USD) |
|---|---|---|---|---|
| USD | 143 | $131,485 | 1.0000 | $131,485 |
| GBP | 41 | £48,424 | 1.2902 | $62,478 |
| EUR | 25 | €29,275 | 1.1087 | $32,458 |
| AUD | 41 | A$28,470 | 0.6697 | $19,067 |
| Total | 250 | | | $245,489 |

USD is the biggest slice, at roughly 54% of MRR.

How I calculated it

- Status: Only subscriptions that were active or past due at the end of 30 September count. Trials, paused and canceled subscriptions are out.
- Subscription rows: The subscriptions table keeps a history of changes, so I took each subscription's row that was current at that moment. Some subscriptions had two identical current rows, and I counted each only once.
- Price: Monthly plans are the plan price × seats. Annual plans are the plan price × seats ÷ 12. Prices are stored in cents.
- Custom amounts: 12 enterprise subscriptions have a custom annual amount, which I used in place of seats × list price, divided by 12.
- Discounts: The 15% and 20% forever coupons apply in full. The 50% launch coupon applies only during its 3 months from the coupon start date.
- Exclusions: I left out accounts that are not live, internal Corvia demo accounts, and "Test Clinic" accounts. That removed 4 otherwise-qualifying subscriptions.
- Paying customers: Each customer is counted once. In practice that's 250 subscriptions for 250 customers.
- Currency: The latest exchange rates in the database are from 29 September, so I used those. There's no 30 September rate. The database stores AUD only as USD→AUD, so I inverted it.

My test-account rules were a live/not-live flag, the @corvia.io and @example.com email domains, the "Test" and "Corvia Demo" name prefixes, and the internal flag in the customer metadata. If you have a different way of marking test accounts, tell me and I'll rerun it.

Could you tell me your first and last name so I can address you properly?

### Q2. Net revenue retention

Net revenue retention over the last 12 months was about 97.4%. The customers who were paying on 30 September 2025 had $550.6k of MRR then and $536.3k today, so the cohort lost about 2.6% of its MRR net.

| | Customers | MRR (USD) |
|---|---|---|
| Cohort paying on 30 Sep 2025 | 507 | $550.6k |
| Churned (no paying subscription today) | 100 | –$66.8k |
| Contraction (still paying, but less) | not counted | –$2.5k |
| Expansion (more seats or upgrades) | not counted | +$55.0k |
| Same cohort on 30 Sep 2026 | 407 | $536.3k |

I counted the customers by group as follows: 100 of the 507 churned, and the other 407 are still paying. I didn't count how many of those 407 expanded or contracted.

Churn cost about 12% of starting MRR. Expansion from the surviving customers almost entirely offset it.

How I calculated it

- Cohort: customers with an active or past-due subscription at the end of 30 Sep 2025. Trialing, paused and canceled customers are excluded because they weren't paying. If past-due customers are left out, NRR is 97.2%, so the choice barely matters.
- MRR: seats × plan price for monthly plans, ÷ 12 for annual plans, and the contracted annual amount ÷ 12 for Enterprise. It is net of any coupon running on that date. Tax is excluded.
- Customers: MRR is summed per customer across all their subscriptions. New customers acquired since September 2025 are excluded.
- Currency: EUR, GBP and AUD are converted to USD at one rate for both dates. The rate table stops at 29 Sep 2026, so I used that day's rate for "today".
- Excluded accounts: test accounts, accounts flagged internal, and Corvia demo or QA accounts (the 24 non-live customers plus a few demo ones).
- Data fixes: I removed 46 exact duplicate rows in the subscription history. Current rows have an empty end date, which I treated as still open. If I hadn't, NRR would have come out at about 35%.

I'm Aurora, and I don't have your name yet. What should I call you?

[Final SQL result: active+past_due: churned 100, mrr_now 536317, nrr_pct 97.41, mrr_then 550571, churn_mrr 66779, expansion 55034, contraction 2509, cohort_customers 507; active only: 104, 534097, 97.24, 549242, 67202, 54536, 2479, 504]

### Q3. The May cancellation spike

May's jump is an accounting artifact, not a real churn spike. On 15 May 2026, Meridian Health consolidated 16 separate clinic accounts into one enterprise account. The 16 old subscriptions were closed as "canceled", but the customer was retained and expanded.

The numbers

- Live-customer cancellations were 46 in May, against 34 in April and 34 in June.
- 16 of the 46 May cancellations carry cancel reason code 4. That code is missing from the cancel-reasons lookup table, and it appears nowhere else in the data.
- All 16 are "Meridian Health – Clinic LLC" Growth monthly USD subscriptions. All were canceled at the same moment, 15 May 2026 00:00 UTC.
- Excluding those 16, May has 30 cancellations. That is in line with the 19–40 range of recent months (Jan–Sep 2026), so there was no underlying surge.
- I excluded 2 additional May cancellations from test accounts (livemode = false). I also counted each subscription once, at its first canceled version.

What replaced them

- A new customer, "Meridian Health Group LLC", was created on 2 May 2026.
- It started an Enterprise annual subscription on 15 May, the same day the clinics were canceled, with 310 seats.
- The 16 clinics together held 270 seats and were billing about $8,220 a month, roughly $98.6k a year. The group contract is a custom annual amount of about $123.7k, so this is a net expansion of roughly 25%.
- Support tickets back this up. From mid-May, Meridian tickets come from the single group email domain instead of per-clinic domains.

What this means for reporting

- Any churn count, logo-churn or MRR-churn metric that reads status = 'canceled' will overstate May and understate net retention.
- Reason code 4 looks like an unlabeled "consolidation / migration" code. I'd confirm that with whoever owns billing, then add it to the cancel-reasons lookup. Churn reporting could then exclude it, or treat it as a migration.
- The 16 old subscription rows also have inconsistent end dates: some are open-ended and some use 9999-12-31. One of them has a duplicated "active" version row. I'd clean these up in the model.
- Excluding the Meridian migration, the real mix in May was mostly "Trial not converted" (14) and a handful of "Too expensive" (4), "Other" (5) and "Missing features" (3). That is normal for this business.

I can build this as a monthly churn chart that excludes migrations, or check whether other consolidations like this have inflated earlier months.

Also, what are your first and last name? I'd like to address you properly.

### Q4. Recognized revenue, Q3 2026

Revenue recognized in Q3 2026 (1 July to 30 September) was $2,568,266.89 USD.

| Component | USD |
|---|---|
| Subscription charges, spread daily over the period they cover | 2,708,709.59 |
| Proration lines, spread the same way | 24,348.90 |
| One-off setup fees, counted on the invoice date | 23,028.59 |
| Discount lines, spread over their own periods | −25,931.08 |
| Credit notes issued in Q3, 47 notes | −161,889.12 |
| Total | 2,568,266.89 |

Subscriptions are by far the largest piece. The credit notes took off about 6% of gross revenue. One EUR credit note (marked as a duplicate) made up a large part of that: €116,466 on 19 September.

How I calculated it

- Annual and multi-month invoices: every charge is spread evenly by day, and only the days that fall inside Q3 count. Annual invoices issued before July therefore contribute, and invoices issued in September for October onward only contribute their September days. Period end dates are treated as exclusive, so a 1 July to 1 August charge covers 31 days.
- Excluded invoices and amounts: void and draft invoices, and all tax. Revenue comes from the invoice line amounts, which are net of tax.
- Test and internal accounts: I excluded 30 customers. These are the 24 example.com "Test Clinic" accounts that aren't live, plus 6 "Corvia Demo" accounts on @corvia.io emails. Six credit notes belonged to these accounts and are excluded too.
- Credit notes: each is subtracted on its own issue date at the net-of-tax amount. They apply to invoices of any age.
- Currency conversion: each invoice or credit note is converted at the rate for its own date. EUR and GBP are multiplied by the rate to USD, and AUD is divided by the USD/AUD rate.

Things to be aware of

- Missing 30 September rate: the exchange rate table stops at 29 September, and it has no weekend rows. For any date without a rate I used the most recent earlier rate. On 30 September that means the 29 September rate, so invoices and credit notes dated 30 September use it.
- Uncollectible and open invoices are included: you only asked to exclude void and draft, so I kept them. If you want uncollectible invoices treated as bad debt and excluded, I can re-run it that way.
- Unit mismatch in the billing tables: invoice totals and credit note amounts are stored in cents, while invoice line amounts are in whole currency units. I adjusted for this.

Could you tell me your first and last name, so I can address you properly?

### Q5. Billings, 2024 against 2025

Billings were about $2.85M in 2024 and $6.66M in 2025, which is growth of roughly 134% (2.34×).

| | 2024 | 2025 |
|---|---|---|
| Invoiced, ex-tax | $2,847,120 | $6,727,653 |
| Credit notes | –$2,492 | –$62,815 |
| Billings | $2,845,628 | $6,664,837 |

The 2024 invoiced figure is $2,613,317 from the legacy system plus $234,803 from the new billing system. The $2,492 of 2024 credits are legacy credit memos.

How I built it

- Two sources for 2024. Almost all 2024 invoices are in the legacy invoice table, and the new billing system only holds 29 migrated ones. The 29 migrated invoices appear in both, so I counted them once, from the new system. The 2025 figure comes only from the new system.
- Excluded: Void invoices and drafts (drafts were never issued). Test and internal accounts: 30 customers in the new system and 14 in the legacy system. They are accounts flagged internal or not live, accounts at @corvia.io or @example.com, and "Test Clinic" and "Corvia Demo" names.
- Included: open invoices, and invoices marked uncollectible or written off. They were invoiced, and you only asked me to net out voids and credit notes.
- Ex-tax amounts. I used the pre-tax subtotal. The new system stores amounts in cents, so I divided by 100.
- Currency conversion. I converted GBP, EUR and AUD to USD at the daily rate on the invoice date, or on the credit note's date for credit notes. The rates table only has weekdays, so weekend dates use the previous available rate.
- Period. Years are calendar years in UTC, by issue date. Credit notes fall in the year they were issued, not the year of the invoice they reduce.

Assumptions to check

- I treated the credit note amount as ex-tax, since tax is in a separate column. No credit note exceeds its invoice's pre-tax subtotal, which fits that reading.
- The 146 void invoices point to replacement invoice IDs that don't exist in the invoices table. I assumed the replacements were issued as separate normal invoices and are already counted. If they weren't, billings are understated by the replaced amounts.

By the way, what are your first and last name? I'd like to address you properly.

### Q6. Overdue receivables

$305,557.25 is overdue by more than 30 days as of 30 September 2026, across 83 open invoices. That figure is the unpaid balance (total including tax, less payments and credit notes), converted to US dollars.

The five customers who owe the most:

| # | Customer | Overdue (USD) | Detail |
|---|---|---|---|
| 1 | South Tidewater Freight B.V. | $135,649.00 | One EUR invoice, due on receipt, issued 24 May 2025 |
| 2 | Old Juniper Urgent Care Ltd | $111,288.96 | One GBP invoice, due 10 June 2025 |
| 3 | East Woodvale Smile Studio Ltd | $3,683.36 | One GBP invoice, due 21 January 2026 |
| 4 | Valley View Home Cleaning Ltd | $3,375.27 | One EUR invoice, due 13 January 2026 |
| 5 | Summit Same-Day Delivery GmbH | $3,313.01 | One EUR invoice, due 27 April 2026 |

The top two customers account for about 81% of the overdue amount. Both are enterprise accounts with a single unpaid subscription invoice that is well over a year old, so those are worth chasing first.

How I calculated it

- Invoices counted: I included only live, open invoices and excluded drafts, voided invoices and test-mode records.
- Written-off invoices: I left out the 94 live invoices marked uncollectible, since they are written off rather than overdue. I can add them back if you want them counted.
- Unpaid amount: This is total including tax, minus amount paid, minus credit notes (credit amount plus credit tax). Only invoices with a balance above zero count.
- Overdue test: An invoice counts if its due date is more than 30 days before 30 September 2026, so due on or before 30 August.
- Missing due dates: Many open invoices have no due date. For those I used the customer's terms: net 30 and net 45 add 30 and 45 days to the issue date, and due on receipt or card means due on the issue date. Only 13 of the 83 overdue invoices have a stored due date, including both of the top two. Treat this derivation as an assumption, because the total depends on it.
- Currency conversion: Amounts are stored in cents in each customer's currency. I converted them at the latest exchange rate on or before 30 September, which is 29 September.
- Legacy invoices: I ignored the 2024 legacy invoice table. Its open invoices are already in the billing table, and most show as paid there.

Another $174,824.91 is unpaid but only 30 days or less past due, so it isn't in the total.

What are your first and last name, so I can address you properly?

### Q7. Sales performance, H1 2026

Across 257 won or lost new-business deals closed January to June 2026, the overall win rate was 29.6% (76 won, 181 lost). The median sales cycle was 46 days. Sales cycle is close date minus created date. Win rate is won ÷ (won + lost).

By rep

- Sofia Marin: 50.0% win rate (6 won, 6 lost), 64 days. This is the highest win rate and the longest cycle, but it rests on only 12 deals.
- Dana Whitfield: 36.4% (12 won, 21 lost), 41 days.
- Priya Raman: 31.8% (14 won, 30 lost), 37.5 days.
- Tom Okoye: 29.5% (13 won, 31 lost), 34 days. This is the shortest cycle.
- Marcus Bell: 25.5% (12 won, 35 lost), 50 days.
- Ana Pereira: 25.0% (7 won, 21 lost), 51 days.
- Liam Carter: 24.5% (12 won, 37 lost), 47 days.

How I cleaned the data

- Deal type: New business is recorded four ways (New Business, new_business, NB, New Biz). I treated all four as the same.
- Stage: Won and lost each appear in four spellings, such as Closed Won, 06 - Closed Won, Won and closed_won. I normalised them. All three disqualified variants (Disqualified, DQ, 00 - Disqualified) and open stages were excluded.
- Deleted deals: I excluded soft-deleted deals (is_deleted is true).
- Duplicates: The 50 rows with source import_2026q1 are exact copies of existing deals, pointing back to them through legacy_opp_id. I excluded them to avoid double-counting.
- Dana Whitfield: She has two CRM user records, one inactive (U03) and one active (U09), with the same region and manager. I treated them as one person. If they are different people, I can split them.
- Close date: I filtered on close date from 1 January to 30 June 2026, inclusive.
- Currency: Win rate and cycle length don't use deal amounts, so no currency conversion was needed.

Most reps have 28 to 49 decided deals, so their win rates will move noticeably with a few deals either way. Sofia's 50% is the least reliable.

What are your first and last names? I'd like to address you properly.

### Q8. Paying customers missing from the CRM

216 paying customers have no CRM account. They represent about $61.9K of MRR in US dollars.

That is about 25% of the 860 paying customers by count, but only about 6% of total MRR ($993.7K). The unmatched customers are mostly small accounts. Customers with an account in the CRM average much more MRR.

| Definition of "paying" | Customers without a CRM account | Their MRR (USD) | Customers with a CRM account | Their MRR (USD) |
|---|---|---|---|---|
| Active subscriptions only (my headline) | 216 | $61,933 | 644 | $931,805 |
| Active or past due | 218 | $62,454 | 649 | $933,989 |

How I defined it

- As-of date: subscriptions in force at the end of 30 Sep 2026.
- Paying: a customer with at least one subscription with status active. Trialing, paused and canceled subscriptions are excluded. Past-due subscriptions are excluded from the headline. If you count them as paying, the figures are the second row above.
- Test customers: I excluded the customers flagged as not live (test mode).
- Matching to the CRM: a billing customer counts as having an account if its Stripe reference matches either the account's billing reference or the Stripe ID stored in the account's external IDs. I trimmed whitespace and ignored case. 67 CRM references have stray whitespace and 25 differ in case, so exact matching would have wrongly flagged those customers as unmatched. Customers matched only to a deleted account still count as having one. Every merged account points to a live account. I also tried matching through the legacy customer table. It found no extra matches. I counted any CRM account type, including Prospect and Churned accounts. Tell me if you want only Customer-type accounts to count.
- MRR: each subscription is normalised to a monthly amount. Monthly plans are seats × unit price. Annual plans are seats × unit price ÷ 12. Enterprise subscriptions use the custom annual amount ÷ 12, not multiplied by seats. Coupons are applied, with repeating coupons only while they are still running at the as-of date. Amounts are converted to USD at the latest available rate (29 Sep 2026). The rate table holds USD→AUD, so I inverted it for AUD.
- Duplicate subscription rows: 22 subscriptions had overlapping versions in force at the as-of date. I kept the most recent version of each.

I assumed that plan prices and custom amounts are stored in cents in the customer's own currency. The 6% share doesn't change much under other reasonable choices, but the dollar figure would.

I can list the 216 customers (name, country, plan, MRR) for the CRM team to work through if that would help. Also, what are your first and last names, so I can address you properly?

### Q9. ARR by industry

Healthcare brings in the most ARR: about $4.73M, or 36.5% of total ARR. Total ARR is about $12.96M as of 30 Sep 2026. Field Services is second at 14.2%, so Healthcare's lead is large.

| Industry | Customers | ARR (USD) | Share of total |
|---|---|---|---|
| Healthcare | 239 | $4,730,391 | 36.5% |
| Field Services | 95 | $1,845,099 | 14.2% |
| Home Services | 128 | $1,709,781 | 13.2% |
| Dental | 97 | $1,701,834 | 13.1% |
| Logistics | 56 | $898,172 | 6.9% |
| Veterinary | 58 | $743,674 | 5.7% |
| No CRM match | 215 | $718,840 | 5.5% |
| Other | 36 | $615,060 | 4.7% |

How I calculated it

- Which subscriptions count: the version of each subscription in effect at the end of 30 Sep 2026, with status active or past due. I excluded canceled, paused and trialing subscriptions. I also dropped 22 subscriptions that appeared twice as identical rows.
- MRR: seats × plan price, with annual plans divided by 12. Enterprise subscriptions use their custom annual amount divided by 12. Prices are stored in cents, so I divided by 100.
- Coupons: I netted off the discount for coupons that are still running. Forever coupons always apply, and the 3-month LAUNCH50 coupon applies only while it hasn't expired. ARR is MRR × 12.
- Currency: GBP, EUR and AUD are converted to USD at the latest FX rate on or before 30 Sep (the data ends 29 Sep).
- Excluded customers: test-mode customers and customers flagged internal.

Industry assignment

- Industry source: industry comes from the CRM account linked to each billing customer. For merged accounts I used the surviving account's industry.
- Industry names: I normalised the messy CRM labels using the reference industry map. That map doesn't cover every label, so I mapped 8 myself, for example "HC" and "Medical Practice" to Healthcare and "Vet clinic" to Veterinary.
- Dental, Veterinary and Healthcare: the reference map keeps these as separate industries, so I did the same. Folding Dental into Healthcare would only widen Healthcare's lead.
- Unmatched customers: 215 customers (5.5% of ARR) have no CRM account I could match on any key. That is too small to change which industry ranks first.
- Fallback matches: the customer-to-account link used the billing reference first. For about 70 customers I fell back to the Stripe ID in the CRM, the legacy customer table, or the workspace name.

I can also break this down by region or plan tier, or show how the ranking changes if trialing subscriptions are included.

By the way, what are your first and last name? I'd like to address you properly.

### Q10. Seat utilization

**Rerun (counted)**

### Turn 1 (only turn): Aurora's answer

I'll start by looking at what's in the warehouse.

**About 58% of paid seats were used in September 2026: 16,325 of 28,312, or 57.7%.**

- **Paying customers:** 860 live customers had an active subscription at the end of 30 September. They paid for 28,312 seats in total. I excluded trialing, paused and canceled subscriptions, test (non-live) customers and Corvia's internal workspace.
- **Used seats:** a seat counts as used if a real person in the customer's production workspace had at least one event in the month (1–30 Sept, UTC). Any event type counts, including logins and views.
- **Who I excluded:**
  - Bots, flagged by the bot field or a Corvia bot email address.
  - Integration users with the `api` role, such as the Zapier ones. Some of these have no bot flag at all, so the flag alone would have missed them.
  - Corvia staff [email redacted] emails and the `support_admin` role).
  - All sandbox workspaces. Every customer has at most one sandbox alongside its production workspace.
- **Cap per customer:** 29 customers had more active people than paid seats. I capped each customer at its paid seats, since you can't use more seats than you pay for. Without the cap the figure is 57.8%.

**Judgement calls:**
- **Past-due subscriptions:** counting them as paying barely changes the result (57.7% on 28,383 seats).
- **Seat count date:** I used each subscription's seat count as it stood on 30 September. Customers who changed seat counts or canceled earlier in the month are measured at their end-of-month position.
- **Duplicate rows:** I collapsed a few exact duplicate subscription history rows. I also treated events logged under both `appointment.created` and `appointment_created` as ordinary activity, so the naming difference has no effect.

Seat counts are not money, so currency conversion didn't apply here.

If you tell me your first and last name, I'll address you properly from here on.

**First run**

About 57.4% of the seats our paying customers pay for were used in September 2026. That is 16,205 used seats out of 28,245 paid, across 857 active customers.

Treat this as my best estimate. It rests on the assumptions below, and the first batch of figures I ran would have been wrong because of them.

What I assumed

Paying customers:
A paying customer is a live billing customer with a subscription whose status was active at the end of 30 September 2026.
I excluded trialing, paused and canceled subscriptions.
I excluded the 17 non-live customers in the billing data (test mode) and the 3 customers flagged as internal.
Seats paid for: this is the subscription seat quantity in force at the end of 30 September. The subscription history has repeated version rows, so I kept one row per subscription, the latest version.
Linking usage to billing: I matched each workspace to its billing customer through the Stripe customer ID in the workspace metadata. Sandbox workspaces are excluded, because they share a customer ID with the real workspace.
A used seat: one distinct person with any event in the product between 1 and 30 September (UTC). I counted all event types, including logins. Duplicate event rows don't matter, because I counted distinct people.
Who isn't a real person:
Users flagged as bots or with the api role. This includes the Zapier webhook accounts.
108 "API Sync" accounts with an admin role and no bot flag. These were the main catch. Counting them would have overstated usage by about 80 seats.
Corvia staff and demo accounts: support_admin users and emails at corvia.io or the corviademo* domains.
Capping: I capped each customer's used seats at the seats they paid for. 20 customers had more active people than paid seats. Without the cap the figure is 57.5% (16,237 used).

How much the judgement calls matter

Scenario	Customers	Seats paid	Used seats	Share used
Active only (headline)	857	28,245	16,205	57.4%
Active plus past_due	864	28,316	16,251	57.4%
All non-canceled, including trial and paused	894	28,858	16,290	56.5%

The answer holds at roughly 56–58% whichever way you define paying.

Caveats

I did not adjust for coupons or discounted seats. I counted every paid seat the same.
Deactivated users still count as used if they were active during September.
If your definition of "staff" is wider than Corvia email domains, tell me and I'll rerun it.

What are your first and last name? I'd like to address you properly.

[Final result panel]
scenario | customers | pct_capped | seats_paid | used_capped | pct_uncapped | used_uncapped | customers_over_seats
A active only | 857 | 57.37 | 28245 | 16205 | 57.49 | 16237 | 20
B active+past_due | 864 | 57.39 | 28316 | 16251 | 57.51 | 16284 | 21
C all non-canceled | 894 | 56.45 | 28858 | 16290 | 56.56 | 16323 | 21

### Q11. Appointments trend

I'll start by looking at which tables the warehouse has.

Appointments probably live in the events table, so I'll check its columns.

Customers created about 81,400 appointments in June and about 90,900 in September, which is growth of roughly 12% over the four months.

Appointments created per month
Month	Customer appointments	Change vs prior month
Jun 2026	81,382	n/a
Jul 2026	83,303	+2.4%
Aug 2026	86,078	+3.3%
Sep 2026	90,926	+5.6%

Trend: Volume rose every month, and the growth got faster each month. Per day, July dipped slightly (about 2,690 a day, against 2,710 in June) because it has 31 days. After that, daily volume climbed to about 2,780 in August and about 3,030 in September.

How I counted
Two event names: The app logs appointment creation as appointment_created through July and as appointment.created from August. Counting only one name would have shown volume falling to zero in August (or not existing before it), so I combined both.
Duplicates: About 3% of events were repeats of the same event ID. I counted each event ID once, which removed roughly 4,000 events a month.
Bots and sandbox workspaces: I excluded events from bot users and from sandbox workspaces, since those aren't customers creating appointments.
Bot events: These were large, about 46,000 to 51,000 a month, or roughly 36% of the deduplicated events. That share is high, so it's worth checking how is_bot gets set.
Sandbox events: These were small, about 240 to 280 a month.
Time window: Months are calendar months in UTC, based on when the event occurred. September covers the full month through 30 September.

If you count bot users as real usage, the deduplicated totals are 127,826 for June, 131,177 for July, 134,305 for August and 142,668 for September. The upward trend is the same.

I can break this down by workspace, or by region or plan if you want to see where the September increase came from. Also, what are your first and last names, so I can address you properly?

[Final result panel]
month | deduped | bot_events | raw_events | sandbox_events | customer_appointments
2026-06 | 127826 | 46207 | 131673 | 237 | 81382
2026-07 | 131177 | 47613 | 135163 | 261 | 83303
2026-08 | 134305 | 47983 | 138456 | 244 | 86078
2026-09 | 142668 | 51463 | 146978 | 279 | 90926

### Q12. Enterprise support responsiveness

I'll start by looking at which tables hold support tickets and customers.

For Enterprise customers' tickets opened in Q3 2026, the median time to first human reply was about 1 hour 41 minutes (1.68 hours). 78.7% of tickets got a reply within 4 hours.

Tickets: 901 tickets from 59 Enterprise customers.
Replied within 4 hours: 709 tickets.
Replied after 4 hours: 137 tickets.
No reply yet: 55 tickets. These count as missing the target in the 78.7%.
Median: calculated only over the 846 tickets that have a reply.
Share among replied tickets only: 83.8% got a reply within 4 hours. That figure leaves out the 55 unanswered tickets, so it is not the headline number.

How I defined it

Quarter: tickets created from 1 July to 30 September 2026 (UTC).
Enterprise: the requester's email domain maps to exactly one billing customer, and that customer had an Enterprise-tier subscription in effect when the ticket was opened. Test customers are excluded.
First human reply: the earliest public message from a support agent. Automated system messages, customer messages and internal notes don't count.
Merged tickets: I excluded 34 tickets that were merged into another ticket, because they are duplicates. Including them gives the same median (1.68 hours) and the same 78.7%.
Alternative definitions: counting only active or past-due subscriptions, or any customer who was ever on Enterprise, moves the share by under half a point and the median by about a minute.
Linking tickets to customers: I matched by email domain. Matching through the app's user and workspace records covered only about 44% of requesters, because many workspaces have no Stripe ID. Each requester domain mapped to exactly one customer.

Could I get your first and last name so I can address you properly?

[Final result panel]
replied | tickets | variant | no_reply | customers | within_4h | median_hrs | median_mins | pct_within_4h_of_all | pct_within_4h_of_replied
846 | 901 | A: ent at ticket time, livemode, excl merged | 55 | 59 | 709 | 1.68 | 101 | 78.7 | 83.8
876 | 935 | B: A but incl merged | 59 | 59 | 736 | 1.68 | 100.9 | 78.7 | 84
846 | 901 | C: ent active/past_due at ticket time, excl merged | 55 | 59 | 709 | 1.68 | 101 | 78.7 | 83.8
855 | 911 | D: ever enterprise, excl merged | 56 | 59 | 713 | 1.69 | 101.3 | 78.3 | 83.4

### Q13. Customer count

I'll start by looking at what's in the warehouse.

We have 897 customers right now. That counts live (non-test) billing customers with a subscription in force at the end of 30 Sep 2026 that is active, past due, paused or trialing.

"Customer" can mean a few different things, so here are the other counts:

Definition	Count
Billing customer records ever created	1,555
Excluding 24 test-mode records	1,531
With a subscription in force that is active, past due, paused or trialing (the headline figure)	897
Of those, active or past due only (excluding trialing and paused)	867
Of those, active only	860
Live records whose subscriptions are all canceled, or that have none	634

Source: I used the billing customer and subscription tables, because billing is the system of record for who is paying.
Overlapping subscriptions: 45 customers have more than one subscription version in force on that date. I counted each customer once, but those rows may be overlaps in the subscription history.
Legacy customers: The 436 legacy customer records all link to a billing customer, so I haven't added them on top.
CRM disagrees: The CRM has 2,303 accounts. About 685 are typed as a current customer, and the labels are inconsistent: "Customer", "customer" and "Active Customer". The CRM is a different source and not directly comparable.

If you'd rather count trialing or paused customers differently, or want a different definition such as customers who have ever paid an invoice, I can re-run it. I can also break the count down by country or plan.

Also, what are your first and last names, so I can address you properly?

[Final result panel]
n | metric
1555 | all_customer_records
45 | customers_with_multiple_current_rows
0 | dup_ext_ref
1531 | livemode_only
634 | livemode_only_canceled_or_none
860 | livemode_with_active
867 | livemode_with_active_or_past_due
897 | livemode_with_sub_active_pastdue_paused_trialing

