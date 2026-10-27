# Basedash

**Data Analytics Index: 79.2** (27 of 39 points, accuracy 69.2%)

| Setup | |
|---|---|
| Model | Not shown |
| Data access | Read-only Postgres role |
| How it was run | One question at a time |
| Timing source | Server timestamps |

## Scores

| # | Question | Answer given | Score | Time (s) |
|---|---|---|---|---|
| Q1 | MRR today | MRR $993,892.08 · 864 customers | 2 | 61 |
| Q2 | Net revenue retention | 97.41% | 3 | 79 |
| Q3 | The May cancellation spike | names the consolidation, 16 clinics, 15 May | 3 | 100 |
| Q4 | Recognized revenue, Q3 2026 | $2,569,001.89 | 3 | 70 |
| Q5 | Billings, 2024 against 2025 | 2024 $2,845,627.70 · 2025 $6,665,229.30 | 3 | 62 |
| Q6 | Overdue receivables | $305,557.25 open (headline $649,118.69) | 2 | 49 |
| Q7 | Sales performance, H1 2026 | 7 of 7 reps exact, 7 within 5% | 3 | 82 |
| Q8 | Paying customers missing from the CRM | 263 customers · $123,223.91 | 0 | 62 |
| Q9 | ARR by industry | Healthcare · 14.15% | 0 | 68 |
| Q10 | Seat utilization | 56.6% | 2 | 80 |
| Q11 | Appointments trend | Sep 140,577 | 2 | 73 |
| Q12 | Enterprise support responsiveness | Median 100 min · 78.58% | 2 | 59 |
| Q13 | Customer count | 864 | 2 | 43 |

## Answers

Full answers as the agent gave them (customer email addresses redacted). Questions are shown by title only.

### Q1. MRR today

As of September 30, 2026, end of day UTC:

| Metric | Value |
|---|---|
| MRR, after discounts | $993,892.08 |
| Paying customers | 864 |

The calculation includes active and past-due subscriptions, uses per-seat pricing, and divides annual contracts—including custom Enterprise amounts—by 12. It applies unexpired discounts and excludes trials, paused or canceled subscriptions, non-live test accounts, and accounts marked internal in billing or legacy records. Customers are counted as distinct billing customers with positive MRR, not individual workspaces; a paying customer's sandbox workspace does not exclude their live billing account.

Exchange-rate caveat: The database has no September 30 rates, so this uses the latest available rates, dated September 29: EUR → USD 1.108737, GBP → USD 1.290235, and AUD → USD approximately 0.669714. Thus, the MRR is a latest-available-FX figure rather than an exact September 30 FX valuation.

## Queries Basedash ran

1. Checking rate availability and test account flags | 73 rows
2. Calculating discounted MRR and distinct paying customers | 1 row

## Final SQL shown

```sql
WITH
    states AS (
        SELECT DISTINCT ON (sub_id) *
        FROM billing.subscriptions
        WHERE valid_from < TIMESTAMPTZ '2026-10-01 00:00:00+00'
          AND (valid_to IS NULL OR valid_to >= TIMESTAMPTZ '2026-10-01 00:00:00+00')
        ORDER BY sub_id, valid_from DESC, row_id DESC
    ),
    priced AS (
        SELECT s.sub_id, s.cust_id, p.currency,
            (CASE WHEN p.tier = 'enterprise' THEN s.custom_annual_amount::numeric / 12
                  ELSE p.unit_amount::numeric * s.quantity / CASE WHEN p.billing_interval IN ('annual', 'year') THEN 12 ELSE 1 END
             END) / 100 * (1 - CASE WHEN co.duration = 'forever'
                                   OR (co.duration = 'repeating' AND s.coupon_start <= DATE '2026-09-30'
                                       AND s.coupon_start + make_interval(months => co.duration_in_months) > DATE '2026-09-30')
                              THEN co.pct_off / 100 ELSE 0 END) AS mrr
        FROM states s
        JOIN billing.customers c USING (cust_id)
        JOIN billing.plans p USING (plan_id)
        LEFT JOIN billing.coupons co USING (coupon_id)
        WHERE s.status IN ('active', 'past_due')
          AND c.livemode
          AND COALESCE(c.metadata ->> 'internal', 'false') <> 'true'
          AND NOT EXISTS (SELECT 1 FROM legacy.customers_v1 l
                          WHERE (l.id = c.legacy_id OR l.stripe_ref = c.ext_ref) AND l.acct_type = 'internal')
    ),
    rates AS (
        SELECT 'USD'::text currency, 1::numeric rate, DATE '2026-09-30' rate_date
        UNION ALL
        SELECT base_ccy::text, rate, rate_date FROM billing.fx_rates
        WHERE quote_ccy = 'USD' AND rate_date = (SELECT max(rate_date) FROM billing.fx_rates WHERE rate_date <= DATE '2026-09-30')
        UNION ALL
        SELECT 'AUD', 1 / rate, rate_date FROM billing.fx_rates
        WHERE base_ccy = 'USD' AND quote_ccy = 'AUD' AND rate_date = (SELECT max(rate_date) FROM billing.fx_rates WHERE rate_date <= DATE '2026-09-30')
    )
SELECT count(DISTINCT p.cust_id) FILTER (WHERE p.mrr > 0) paying_customers,
       count(*) subscriptions,
       round(sum(p.mrr * r.rate), 2) mrr_usd,
       count(*) FILTER (WHERE p.mrr IS NULL OR r.rate IS NULL) missing_pricing_or_fx,
       jsonb_object_agg(r.currency, r.rate) fx_rates
FROM priced p
LEFT JOIN rates r ON r.currency = p.currency
-- whitespace condensed from the original; logic unchanged
```

### Q2. Net revenue retention

Analyzed for 51s

Your 12-month net revenue retention was 97.41%, comparing the paying customer cohort at the end of 30 September 2025 with that same cohort at the end of 30 September 2026, in constant US dollars.

| Metric | Result |
|---|---|
| Starting paying customers | 507 |
| Cohort MRR on 30 September 2025 | $550,570.69 |
| Same cohort's MRR on 30 September 2026 | $536,317.11 |
| Net revenue retention | 97.41% |
| Net MRR change | −$14,253.58 |

Calculation: ending cohort MRR ÷ starting cohort MRR × 100. This includes expansion, contraction, and churn within the original cohort, but excludes customers added afterward.

I treated active and past-due subscriptions as paying subscriptions, excluded test and internal customers, normalized annual contracts to monthly revenue, applied discounts valid at each snapshot, and deduplicated subscription history rows. Paused, canceled, and trial subscriptions contribute no MRR.

Exchange-rate caveat: there are no rates recorded for 30 September 2026. I used the latest available rates, dated 29 September 2026, for both snapshots, so currency movements do not affect the comparison.

If “paying” means active subscriptions only, excluding past-due subscriptions at both dates, NRR is 97.24%: $549,242.00 starting MRR versus $534,096.78 ending MRR across 504 starting customers.

## Queries Basedash ran

1. Inspecting customer exclusions and September exchange rates | 8 rows
2. Checking snapshot statuses and subscription history overlaps | 10 rows
3. Finding latest available exchange rates | 3 rows
4. Investigating overlapping subscription states | 44 rows
5. Calculating constant-currency customer cohort net revenue retention | 2 rows

## Final SQL shown

```sql
WITH dates AS (SELECT * FROM (VALUES ('start','2025-09-30'::date,'2025-10-01 00:00:00+00'::timestamptz),('end','2026-09-30'::date,'2026-10-01 00:00:00+00'::timestamptz)) v (label, day, cutoff)),
fxraw AS (SELECT DISTINCT ON (base_ccy, quote_ccy) base_ccy, quote_ccy, rate FROM billing.fx_rates WHERE rate_date <= '2026-09-30' ORDER BY base_ccy, quote_ccy, rate_date DESC),
fx AS (SELECT base_ccy AS currency, rate FROM fxraw WHERE quote_ccy = 'USD' UNION ALL SELECT 'AUD', 1 / rate FROM fxraw WHERE base_ccy = 'USD' AND quote_ccy = 'AUD' UNION ALL SELECT 'USD', 1),
states AS (SELECT DISTINCT ON (d.label, s.sub_id) d.label, d.day, s.* FROM dates d JOIN billing.subscriptions s ON s.valid_from < d.cutoff AND (s.valid_to IS NULL OR s.valid_to >= d.cutoff) ORDER BY d.label, s.sub_id, s.valid_from DESC, s.updated_at DESC, s.row_id DESC),
amounts AS (SELECT s.label, s.cust_id, s.status,
  (CASE WHEN p.tier = 'enterprise' THEN s.custom_annual_amount::numeric / 12 ELSE p.unit_amount::numeric * s.quantity / CASE WHEN p.billing_interval IN ('annual','year') THEN 12 ELSE 1 END END) / 100
  * (CASE WHEN cp.coupon_id IS NOT NULL AND s.coupon_start <= s.day AND (cp.duration = 'forever' OR s.day < s.coupon_start + cp.duration_in_months * INTERVAL '1 month') THEN 1 - cp.pct_off / 100 ELSE 1 END) * f.rate AS mrr
  FROM states s JOIN billing.customers c ON c.cust_id = s.cust_id JOIN billing.plans p ON p.plan_id = s.plan_id JOIN fx f ON f.currency = p.currency LEFT JOIN billing.coupons cp ON cp.coupon_id = s.coupon_id
  WHERE c.livemode AND COALESCE(c.metadata ->> 'internal', 'false') <> 'true'),
variants AS (SELECT 'active + past_due' AS definition UNION ALL SELECT 'active only'),
customer_mrr AS (SELECT v.definition, a.label, a.cust_id, sum(a.mrr) mrr FROM amounts a CROSS JOIN variants v WHERE a.status = 'active' OR (v.definition = 'active + past_due' AND a.status = 'past_due') GROUP BY 1,2,3),
cohort AS (SELECT s.definition, s.cust_id, s.mrr start_mrr, coalesce(e.mrr, 0) end_mrr FROM customer_mrr s LEFT JOIN customer_mrr e ON e.definition = s.definition AND e.cust_id = s.cust_id AND e.label = 'end' WHERE s.label = 'start' AND s.mrr > 0)
SELECT definition, count(*) customers, round(sum(start_mrr), 2) start_mrr_usd, round(sum(end_mrr), 2) end_mrr_usd, round(100 * sum(end_mrr) / sum(start_mrr), 2) nrr_pct, count(*) FILTER (WHERE end_mrr = 0) churned_customers, round(sum(end_mrr - start_mrr), 2) net_change_usd
FROM cohort GROUP BY definition ORDER BY definition
-- whitespace condensed from the original; logic unchanged
```

### Q3. The May cancellation spike

Analyzed for 1m

May's cancellation spike was mainly a contract consolidation—not a sudden wave of customers leaving. There was also a smaller increase in genuine paid-subscription losses.

Recorded cancellations rose from 34 in April to 48 in May, up 41%. Here is what those counts contain:

| Cancellation category | April | May | Change |
|---|---|---|---|
| Paid-subscription losses, excluding Meridian | 11 | 16 | +5 |
| Meridian clinic contracts consolidated | 0 | 16 | +16 |
| Trial non-conversions | 23 | 14 | −9 |
| Test accounts | 0 | 2 | +2 |
| Total recorded cancellations | 34 | 48 | +14 |

### What happened at Meridian

On 15 May at 00:00 UTC, all 16 Meridian Health clinic subscriptions were canceled, and a new Meridian Health Group enterprise subscription began at exactly the same time.

The CRM's closed-won opportunity explicitly says: "Consolidating 16 Meridian clinic subscriptions into one group contract." This corroborates the billing history: Meridian stayed and expanded rather than churned.

| Meridian contract measure | Before consolidation | After consolidation |
|---|---|---|
| Seats | 270 | 310 |
| Monthly recurring revenue equivalent | $8,220 | $10,307.50 |
| Annual recurring revenue | $98,640 | $123,690 |

That is $25,050 more ARR, up 25.4%. These are contractual recurring amounts, not cash collections. The old contracts were counted once per subscription, avoiding a duplicate historical state row.

### Was there any real deterioration?

Yes, but much less than the headline suggests. Excluding test accounts, trials, and Meridian's consolidation, May had 16 paid-subscription losses versus 11 in April. June had 14; July and September subsequently had 19 and 21, respectively. May was therefore not the peak in genuine losses through 30 September.

The recorded reasons for May's 16 genuine losses were:

- Other: 5
- Too expensive: 4
- Missing features: 3
- Business closed: 2
- Switched to competitor: 2

These reason codes do not establish a single shared incident behind those losses. The evidence supports a consolidation-driven headline spike plus a smaller, mixed-reason increase in actual losses—not a demonstrated May product outage or competitor exodus.

[Chart: "Cancellations: actual losses versus trials and consolidation", stacked bars Jan–Sep 2026: Meridian Consolidation, Paid Subscription Losses, Test Accounts, Trial Non-Conversions]

Reporting implication: classify Meridian as a consolidation with expansion, not churn, and separate trial non-conversions and test-account cancellations from paid-customer losses. The CRM also labels the replacement deal "New Business," which could misleadingly present retained, expanded revenue as a new customer win.

Scope: transitions into canceled status, using subscription effective dates in UTC through 30 September 2026. "Paid-subscription losses" means live accounts previously active, past due, or paused; these are counts, not churn rates or parent-company-level customer churn.

## Queries Basedash ran

1. Checking cancellation timing and reasons | 52 rows
2. Identifying May cancellations and customer context | 48 rows
3. Reading consolidation evidence | 1 row
4. Reading support explanations for May cancellations | 0 rows
5. Checking Meridian replacement subscription and prices | 34 rows
6. Calculating Meridian recurring revenue change | 1 row
7. Separating real losses from trials and consolidation | 9 rows
8. Checking actual May loss reasons | 5 rows

## Final SQL shown

```sql
-- query 7 of 8: 'Separating real losses from trials and consolidation' (feeds the chart)
WITH x AS ( SELECT s.*, lag(status) OVER ( PARTITION BY sub_id ORDER BY valid_from, row_id ) prev_status FROM billing.subscriptions s )
SELECT date_trunc('month', x.valid_from AT TIME ZONE 'UTC')::date month, count(*) raw_cancellations, count(*) FILTER ( WHERE NOT c.livemode ) test_cancellations, count(*) FILTER ( WHERE c.livemode AND prev_status = 'trialing' ) trial_cancellations, count(*) FILTER ( WHERE c.livemode AND c.legal_name ILIKE 'Meridian Health - %' ) consolidation, count(*) FILTER ( WHERE c.livemode AND prev_status IN ('active', 'past_due', 'paused') AND c.legal_name NOT ILIKE 'Meridian Health - %' ) paid_losses
FROM x JOIN billing.customers c USING (cust_id)
WHERE x.status = 'canceled' AND prev_status IS DISTINCT FROM 'canceled' AND x.valid_from >= '2026-01-01' AND x.valid_from < '2026-10-01'
GROUP BY 1
ORDER BY 1
```

### Q4. Recognized revenue, Q3 2026

Analyzed for 43s

Q3 2026 recognized revenue was $2,569,001.89, using the latest available exchange rate on or before each document's date where a same-day rate was missing.

| Component | Revenue (USD) |
|---|---|
| Subscription charges | $2,709,444.59 |
| Seat prorations | $24,348.90 |
| Subscription discounts | −$25,931.08 |
| One-off setup fees | $23,028.59 |
| Credit notes issued in Q3 | −$161,889.12 |
| Net recognized revenue | $2,569,001.89 |

The calculation covers July 1–September 30, 2026, UTC, with September 30 treated as today:

- Subscription charges, prorations, and discounts are spread evenly by day over their line-level service periods, treating the period end as exclusive.
- Setup fees are recognized on the invoice date; credit notes are deducted on their issue date.
- Tax, void and draft invoices, non-live customers/invoices, and accounts flagged as internal in billing or legacy records are excluded. Open and uncollectible invoices remain included, as requested.

Two data caveats: Same-day FX rates were unavailable for 417 contributing line/credit entries; the calculation used rates up to two days earlier. Also, invoice-line amounts are actually stored in major currency units despite their "cents" description—I verified that they reconcile to invoice subtotals after multiplying by 100. Credit-note amounts were treated as pre-tax, with the separately recorded tax excluded.

## Queries Basedash ran

1. Reconciling line units with invoice subtotals | 8 rows
2. Validating invoice coverage and credit tax convention | 1 row
3. Calculating Q3 recognized revenue and credit deductions | 6 rows

## Final SQL shown

```sql
WITH eligible AS ( SELECT i.* FROM billing.invoices i JOIN billing.customers c USING (cust_id) WHERE i.livemode AND c.livemode AND i.status NOT IN ('void', 'draft') AND coalesce(c.metadata ->> 'internal', 'false') <> 'true' AND NOT EXISTS ( SELECT 1 FROM legacy.customers_v1 v WHERE ( v.id = c.legacy_id OR v.stripe_ref = c.ext_ref ) AND v.acct_type = 'internal' ) AND i.issued_at < '2026-10-01 00:00:00+00' ),
entries AS ( SELECT i.invoice_id AS id, l.line_type AS kind, (i.issued_at AT TIME ZONE 'UTC')::date AS fx_date, trim(i.currency) AS ccy, l.amount * CASE WHEN l.line_type = 'setup_fee' THEN CASE WHEN i.issued_at >= '2026-07-01 00:00:00+00' THEN 1 ELSE 0 END ELSE greatest( 0, least(l.period_end, DATE '2026-10-01') - greatest(l.period_start, DATE '2026-07-01') )::numeric / nullif(l.period_end - l.period_start, 0) END AS recognized FROM eligible i JOIN billing.invoice_lines l USING (invoice_id) WHERE ( l.line_type = 'setup_fee' AND i.issued_at >= '2026-07-01 00:00:00+00' ) OR ( l.line_type <> 'setup_fee' AND l.period_start < '2026-10-01' AND l.period_end > '2026-07-01' )
  UNION ALL SELECT n.credit_note_id, 'credit_note', (n.issued_at AT TIME ZONE 'UTC')::date, trim(i.currency), - n.amount::numeric / 100 FROM billing.credit_notes n JOIN eligible i USING (invoice_id) WHERE n.issued_at >= '2026-07-01 00:00:00+00' AND n.issued_at < '2026-10-01 00:00:00+00' ),
converted AS ( SELECT e.*, CASE WHEN ccy = 'USD' THEN 1 WHEN ccy = 'AUD' THEN 1 / f.rate ELSE f.rate END AS usd_rate, f.rate_date FROM entries e LEFT JOIN LATERAL ( SELECT rate, rate_date FROM billing.fx_rates WHERE base_ccy = CASE WHEN e.ccy = 'AUD' THEN 'USD' ELSE e.ccy END AND quote_ccy = CASE WHEN e.ccy = 'AUD' THEN 'AUD' ELSE 'USD' END AND rate_date <= e.fx_date ORDER BY rate_date DESC LIMIT 1 ) f ON e.ccy <> 'USD' )
SELECT kind, count(*) AS entries, count(DISTINCT id) AS documents, round(sum(recognized * usd_rate), 2) AS recognized_usd, count(*) FILTER ( WHERE usd_rate IS NULL OR recognized IS NULL ) AS missing_inputs, count(*) FILTER ( WHERE ccy <> 'USD' AND rate_date <> fx_date ) AS prior_date_fx_entries, max(fx_date - rate_date) FILTER ( WHERE ccy <> 'USD' ) AS max_fx_age_days
FROM converted GROUP BY GROUPING SETS ((kind), ()) ORDER BY kind NULLS LAST
```

### Q5. Billings, 2024 against 2025

Analyzed for 39s

Total billings grew 134.23% in 2025, increasing by $3,819,601.60 from 2024.

| Calendar year | Invoiced, excluding tax | Credit notes, excluding tax | Net billings |
|---|---|---|---|
| 2024 | $2,848,120.08 | −$2,492.38 | $2,845,627.70 |
| 2025 | $6,728,044.59 | −$62,815.29 | $6,665,229.30 |

Calculation notes:

- Excluded void invoices, test accounts, and accounts marked internal. Included open and uncollectible invoices because billings measures invoicing, not cash collected.
- Used the 2024 legacy export and avoided double-counting its migrated copies in the current billing system. Legacy USD amounts already exclude tax; credit-note amounts also have tax recorded separately.
- Assigned invoices and credit notes to their respective issue years, using UTC dates.
- Preserved the legacy export's USD values. Converted current-system foreign-currency amounts using the latest available exchange rate on or before the invoice or credit-note date, including the inverse USD/AUD rate for Australian dollars. No required exchange rates were missing.

## Queries Basedash ran

1. Inspecting exclusions and foreign exchange coverage | 19 rows
2. Verifying tax conventions and legacy exclusions | 10 rows
3. Checking test accounts and credit-note tax treatment | 30 rows
4. Calculating annual net billings and growth | 2 rows

## Final SQL shown

```sql
WITH eligible AS ( SELECT c.cust_id FROM billing.customers c WHERE c.livemode AND coalesce(c.metadata ->> 'internal', 'false') <> 'true' AND NOT EXISTS ( SELECT 1 FROM legacy.customers_v1 l WHERE l.id = c.legacy_id AND l.acct_type = 'internal' ) ),
entries AS ( SELECT 2024 yr, CASE WHEN l.memo = 'Credit' THEN 'credit' ELSE 'invoice' END kind, replace(l.amount_usd, ',', '')::numeric usd FROM legacy.invoices_2024 l JOIN legacy.customers_v1 lc ON lc.id = l.cust WHERE lower(l.status) <> 'void' AND lc.acct_type <> 'internal' AND NOT EXISTS ( SELECT 1 FROM billing.customers c WHERE c.legacy_id = lc.id AND ( NOT c.livemode OR c.metadata ->> 'internal' = 'true' ) )
  UNION ALL SELECT extract( year from i.issued_at AT TIME ZONE 'UTC' )::int, 'invoice', i.subtotal / 100.0 * CASE WHEN i.currency = 'USD' THEN 1 WHEN i.currency = 'AUD' THEN 1 / f.rate ELSE f.rate END FROM billing.invoices i JOIN eligible e USING (cust_id) LEFT JOIN LATERAL ( SELECT rate FROM billing.fx_rates WHERE base_ccy = CASE WHEN i.currency = 'AUD' THEN 'USD' ELSE i.currency END AND quote_ccy = CASE WHEN i.currency = 'AUD' THEN 'AUD' ELSE 'USD' END AND rate_date <= (i.issued_at AT TIME ZONE 'UTC')::date ORDER BY rate_date DESC LIMIT 1 ) f ON true WHERE i.livemode AND i.status IN ('paid', 'open', 'uncollectible') AND i.issued_at >= '2024-01-01' AND i.issued_at < '2026-01-01' AND NOT EXISTS ( SELECT 1 FROM legacy.invoices_2024 l WHERE i.migrated_from = 'legacy:' || l.inv_no )
  UNION ALL SELECT extract( year from cn.issued_at AT TIME ZONE 'UTC' )::int, 'credit', - cn.amount / 100.0 * CASE WHEN i.currency = 'USD' THEN 1 WHEN i.currency = 'AUD' THEN 1 / f.rate ELSE f.rate END FROM billing.credit_notes cn JOIN billing.invoices i USING (invoice_id) JOIN eligible e USING (cust_id) LEFT JOIN LATERAL ( SELECT rate FROM billing.fx_rates WHERE base_ccy = CASE WHEN i.currency = 'AUD' THEN 'USD' ELSE i.currency END AND quote_ccy = CASE WHEN i.currency = 'AUD' THEN 'AUD' ELSE 'USD' END AND rate_date <= (cn.issued_at AT TIME ZONE 'UTC')::date ORDER BY rate_date DESC LIMIT 1 ) f ON true WHERE i.livemode AND i.status IN ('paid', 'open', 'uncollectible') AND cn.issued_at >= '2024-01-01' AND cn.issued_at < '2026-01-01' ),
totals AS ( SELECT yr, sum(usd) net, sum(usd) FILTER ( WHERE kind = 'invoice' ) invoiced, sum(usd) FILTER ( WHERE kind = 'credit' ) credits, count(*) FILTER ( WHERE usd IS NULL ) missing_fx FROM entries GROUP BY yr )
SELECT yr, round(invoiced, 2) invoiced_usd, round(credits, 2) credits_usd, round(net, 2) net_billings_usd, missing_fx, round( net - lag(net) OVER ( ORDER BY yr ), 2 ) growth_usd, round( 100 * ( net / nullif( lag(net) OVER ( ORDER BY yr ), 0 ) -1 ), 2 ) growth_pct
FROM totals ORDER BY yr
```

### Q6. Overdue receivables

Analyzed for 24s

$649,118.69 was overdue by more than 30 days as of September 30, 2026, across 167 invoices for 146 customers.

The five customers with the largest overdue balances were:

| Customer | Overdue balance (USD) |
|---|---|
| East Foxhall Fitness LLC | $175,838.00 |
| South Tidewater Freight B.V. | $135,649.00 |
| Old Juniper Urgent Care Ltd | $111,288.96 |
| North Cedar Ridge Pest Control Ltd | $45,412.76 |
| Bellmont Medical Group LLC | $39,373.00 |

Calculated as invoice total including tax − payments − credit notes including their tax, with negative balances capped at zero.

- Used invoices due before August 31, 2026, based on UTC calendar-day aging. Missing due dates were inferred from customer payment terms; card and due-on-receipt invoices were treated as due on issuance.
- Included open and uncollectible invoices; excluded test/internal customers, drafts, voids, and replaced invoices. $343,561.44 of the total is marked uncollectible; the remaining $305,557.25 is open.
- Converted foreign-currency balances using the latest available rates on or before September 30—dated September 29, 2026.

Historical limitation: payments and invoice statuses have no dated history in these tables, so this uses their stored values rather than a separately reconstructed September 30 snapshot. Invoices and credit notes issued after September 30 were excluded.

## Queries Basedash ran

1. Checking overdue invoice rules and exchange rates | 4 rows
2. Calculating aged balances and five largest debtors | 8 rows

## Final SQL shown

```sql
WITH credits AS ( SELECT invoice_id, SUM(amount + tax_amount) AS credit FROM billing.credit_notes WHERE issued_at < TIMESTAMPTZ '2026-10-01 00:00:00+00' GROUP BY 1 ),
fx AS ( SELECT DISTINCT ON (base_ccy, quote_ccy) base_ccy, quote_ccy, rate FROM billing.fx_rates WHERE rate_date <= DATE '2026-09-30' ORDER BY base_ccy, quote_ccy, rate_date DESC ),
balances AS ( SELECT i.invoice_id, c.cust_id, c.legal_name, i.status, i.currency, GREATEST( i.total - i.amount_paid - COALESCE(cr.credit, 0), 0 ) / 100.0 AS balance, COALESCE( i.due_at, i.issued_at + CASE WHEN regexp_replace(lower(c.terms), '[^a-z0-9]', '', 'g') = 'net30' THEN INTERVAL '30 days' WHEN regexp_replace(lower(c.terms), '[^a-z0-9]', '', 'g') = 'net45' THEN INTERVAL '45 days' ELSE INTERVAL '0 days' END ) AS due_at FROM billing.invoices i JOIN billing.customers c USING (cust_id) LEFT JOIN credits cr USING (invoice_id) WHERE i.livemode AND c.livemode AND COALESCE((c.metadata ->> 'internal')::boolean, false) = false AND i.status IN ('open', 'uncollectible') AND i.voided_replaced_by IS NULL AND i.issued_at < TIMESTAMPTZ '2026-10-01 00:00:00+00' ),
aged AS ( SELECT b.*, balance * CASE WHEN currency = 'USD' THEN 1 WHEN currency = 'AUD' THEN 1 / ( SELECT rate FROM fx WHERE base_ccy = 'USD' AND quote_ccy = 'AUD' ) ELSE ( SELECT rate FROM fx WHERE base_ccy = b.currency AND quote_ccy = 'USD' ) END AS usd FROM balances b WHERE (due_at AT TIME ZONE 'UTC')::date < DATE '2026-08-31' AND balance > 0 ),
customers AS ( SELECT cust_id, legal_name, SUM(usd) AS usd, COUNT(*) AS invoices FROM aged GROUP BY 1, 2 )
SELECT 'total' AS result, NULL::text AS customer, ROUND(SUM(usd), 2) AS overdue_usd, COUNT(*) AS invoice_count, COUNT(DISTINCT cust_id) AS customer_count FROM aged
UNION ALL SELECT 'top_five', legal_name, ROUND(usd, 2), invoices, NULL::bigint FROM ( SELECT * FROM customers ORDER BY usd DESC, cust_id LIMIT 5 ) t
UNION ALL SELECT 'by_status', status, ROUND(SUM(usd), 2), COUNT(*), COUNT(DISTINCT cust_id) FROM aged GROUP BY status
ORDER BY result, overdue_usd DESC
```

### Q7. Sales performance, H1 2026

Analyzed for 1m 1s

For new-business deals closed from January 1 through June 30, 2026, counting only wins and losses:

| Sales rep | Wins | Losses | Win rate | Median sales cycle |
|---|---|---|---|---|
| Sofia Marin | 6 | 6 | 50.00% | 64 days |
| Dana Whitfield | 12 | 21 | 36.36% | 41 days |
| Priya Raman | 14 | 30 | 31.82% | 37.5 days |
| Tom Okoye | 13 | 31 | 29.55% | 34 days |
| Marcus Bell | 12 | 35 | 25.53% | 50 days |
| Ana Pereira | 7 | 21 | 25.00% | 51 days |
| Liam Carter | 12 | 37 | 24.49% | 47 days |

Definitions and handling

- Win rate: wins ÷ (wins + losses).
- Sales cycle: calendar days from deal creation to close, with the median calculated across both won and lost deals, not wins alone.
- Included all four new-business labels and equivalent won/lost stage labels; excluded disqualified and deleted deals.
- Removed linked imported duplicates, retaining the Salesforce records.
- Dana Whitfield's two CRM accounts were combined, assuming the inactive and active accounts with that exact name represent the same rep. Inactive reps were otherwise retained for historical reporting.

## Queries Basedash ran

1. Calculating deduplicated sales performance by rep | 8 rows
2. Resolving duplicate sales rep identities | 10 rows
3. Calculating final metrics with Dana accounts combined | 7 rows

## Final SQL shown

```sql
WITH d AS ( SELECT o.*, stage_nm IN ( '06 - Closed Won', 'Closed Won', 'Won', 'closed_won' ) AS won FROM crm.opps o WHERE close_dt >= DATE '2026-01-01' AND close_dt < DATE '2026-07-01' AND opp_type IN ('NB', 'New Biz', 'New Business', 'new_business') AND stage_nm IN ( '06 - Closed Won', 'Closed Won', 'Won', 'closed_won', '07 - Closed Lost', 'Closed Lost', 'Lost', 'closed_lost' ) AND NOT COALESCE(is_deleted, false) AND NOT EXISTS ( SELECT 1 FROM crm.opps s WHERE s.opp_id = o.legacy_opp_id AND s.src = 'sfdc' ) )
SELECT u.full_name AS sales_rep, count(*) FILTER ( WHERE won ) AS wins, count(*) FILTER ( WHERE NOT won ) AS losses, round( 100.0 * count(*) FILTER ( WHERE won ) / count(*), 2 ) AS win_rate_pct, percentile_cont(0.5) WITHIN GROUP ( ORDER BY close_dt - created_dt ) AS median_cycle_days
FROM d LEFT JOIN crm.users u ON u.user_id = d.owner_id
GROUP BY u.full_name
ORDER BY win_rate_pct DESC, u.full_name
```

### Q8. Paying customers missing from the CRM

Analyzed for 30s

As of 30 September 2026, end of day UTC, 263 paying customers have no linked, non-deleted CRM account, representing $123,223.91 in MRR.

I defined paying customers as live, non-internal billing customers with positive MRR from active or past-due subscriptions; trials, paused and canceled subscriptions are excluded.

- CRM matching: Checked both the billing customer reference and the Stripe ID stored in CRM external identifiers, following merged accounts to their surviving account. CRM account type was not used as an exclusion.
- MRR: Seat-based recurring charges, annual contracts divided by 12, enterprise custom pricing, and applicable discounts; excludes tax and one-off fees.
- Currency conversion: Used the latest available FX rates on or before the cutoff—29 September 2026.

If you exclude customers whose only subscriptions are past due, the answer is 260 customers and $122,657.94 MRR.

The CRM lacks historical deletion/merge timestamps, so the matching uses its recorded account state, excluding accounts created after September 30.

## Queries Basedash ran

1. Calculating unmatched paying customers and discounted dollar MRR | 4 rows

## Final SQL shown

```sql
WITH RECURSIVE links AS ( SELECT a.acct_id origin, a.acct_id, a.merged_into, a.is_deleted, a.billing_cust_ref ref, a.ext_ids ->> 'stripe' alt, ARRAY[a.acct_id] path FROM crm.accts a WHERE a.created_dt < timestamp '2026-10-01' UNION ALL SELECT l.origin, a.acct_id, a.merged_into, a.is_deleted, l.ref, l.alt, l.path || a.acct_id FROM links l JOIN crm.accts a ON a.acct_id = l.merged_into WHERE NOT a.acct_id = ANY (l.path) AND a.created_dt < timestamp '2026-10-01' ),
refs AS ( SELECT ref, alt FROM links WHERE NOT is_deleted AND merged_into IS NULL ),
fx AS ( SELECT DISTINCT ON (base_ccy, quote_ccy) base_ccy, quote_ccy, rate FROM billing.fx_rates WHERE rate_date <= '2026-09-30' ORDER BY base_ccy, quote_ccy, rate_date DESC ),
amounts AS ( SELECT c.cust_id, c.ext_ref, c.legal_name, s.status, ( CASE WHEN p.tier = 'enterprise' THEN s.custom_annual_amount::numeric / 12 ELSE p.unit_amount::numeric * s.quantity / CASE WHEN p.billing_interval IN ('annual', 'year') THEN 12 ELSE 1 END END ) / 100 * ( 1 - CASE WHEN cp.duration = 'forever' OR ( cp.duration = 'repeating' AND s.coupon_start <= date '2026-09-30' AND s.coupon_start + cp.duration_in_months * interval '1 month' > date '2026-09-30' ) THEN cp.pct_off / 100 ELSE 0 END ) * CASE WHEN p.currency = 'USD' THEN 1 WHEN p.currency = 'AUD' THEN 1 / ( SELECT rate FROM fx WHERE base_ccy = 'USD' AND quote_ccy = 'AUD' ) ELSE ( SELECT rate FROM fx WHERE base_ccy = p.currency AND quote_ccy = 'USD' ) END mrr FROM billing.subscriptions s JOIN billing.customers c ON c.cust_id = s.cust_id JOIN billing.plans p ON p.plan_id = s.plan_id LEFT JOIN billing.coupons cp ON cp.coupon_id = s.coupon_id WHERE s.valid_from < timestamptz '2026-10-01 00:00:00+00' AND ( s.valid_to IS NULL OR s.valid_to >= timestamptz '2026-10-01 00:00:00+00' ) AND s.status IN ('active', 'past_due') AND c.livemode AND COALESCE((c.metadata ->> 'internal')::boolean, false) = false AND c.created_at < timestamptz '2026-10-01 00:00:00+00' ),
customers AS ( SELECT cust_id, ext_ref, legal_name, sum(mrr) mrr, bool_or(status = 'active') has_active FROM amounts GROUP BY 1, 2, 3 HAVING sum(mrr) > 0 ),
classified AS ( SELECT c.*, EXISTS ( SELECT 1 FROM refs r WHERE r.ref = c.ext_ref OR r.alt = c.ext_ref ) matched FROM customers c )
SELECT CASE WHEN has_active THEN 'active' ELSE 'past_due_only' END cohort, matched, count(*) customers, round(sum(mrr), 2) mrr_usd FROM classified GROUP BY 1, 2 ORDER BY 1, 2
```

### Q9. ARR by industry

Analyzed for 52s

Healthcare leads among identified industries, with $1,696,064.51 in ARR—14.15% of total ARR of $11,982,640.50 as of September 30, 2026, end of day UTC.

However, $5,523,691.84 (46.10%) of ARR has no mapped industry, so Healthcare cannot be confirmed as the overall leader until that mapping gap is resolved.

Calculation: September 30 MRR × 12, including active and past-due subscriptions, net of applicable discounts; excluding trials, paused/canceled subscriptions, test billing customers, and internal accounts. Annual plans are monthly-normalized, and currencies are converted using September 29 rates—the latest available on or before the snapshot date.

## Queries Basedash ran

1. Calculating discounted USD ARR by normalized industry | 8 rows

## Final SQL shown

```sql
WITH fx AS ( SELECT DISTINCT ON (base_ccy, quote_ccy) * FROM billing.fx_rates WHERE rate_date <= '2026-09-30' ORDER BY base_ccy, quote_ccy, rate_date DESC ),
revenue AS ( SELECT s.sub_id, s.status, c.legal_name, coalesce(m.industry, 'Unknown / unmapped') industry, ( CASE WHEN p.tier = 'enterprise' THEN s.custom_annual_amount::numeric / 12 ELSE p.unit_amount::numeric * s.quantity / CASE WHEN p.billing_interval IN ('annual', 'year') THEN 12 ELSE 1 END END ) / 100 * ( 1 - CASE WHEN cp.duration = 'forever' OR ( cp.duration = 'repeating' AND s.coupon_start <= '2026-09-30'::date AND s.coupon_start + cp.duration_in_months * INTERVAL '1 month' > '2026-09-30'::date ) THEN cp.pct_off / 100 ELSE 0 END ) * CASE WHEN p.currency = 'USD' THEN 1 WHEN p.currency = 'AUD' THEN 1 / ( SELECT rate FROM fx WHERE base_ccy = 'USD' AND quote_ccy = 'AUD' ) ELSE ( SELECT rate FROM fx WHERE base_ccy = p.currency AND quote_ccy = 'USD' ) END mrr FROM billing.subscriptions s JOIN billing.customers c ON c.cust_id = s.cust_id JOIN billing.plans p ON p.plan_id = s.plan_id LEFT JOIN billing.coupons cp ON cp.coupon_id = s.coupon_id LEFT JOIN crm.accts a ON coalesce(a.billing_cust_ref, a.ext_ids ->> 'stripe') = c.ext_ref AND NOT a.is_deleted AND a.merged_into IS NULL LEFT JOIN ref.industry_map m ON m.raw_value = a.indstry WHERE s.valid_from < '2026-10-01'::timestamptz AND ( s.valid_to IS NULL OR s.valid_to >= '2026-10-01'::timestamptz ) AND s.status IN ('active', 'past_due') AND c.livemode AND NOT coalesce((c.metadata ->> 'internal')::boolean, false) )
SELECT industry, count(*) subscriptions, round(sum(mrr) * 12, 2) arr_usd, round(100 * sum(mrr) / sum(sum(mrr)) OVER (), 2) share_pct, round(sum(sum(mrr)) OVER () * 12, 2) total_arr_usd, round( sum(mrr) FILTER ( WHERE status = 'past_due' ) * 12, 2 ) past_due_arr_usd, count(*) FILTER ( WHERE mrr IS NULL ) missing_pricing
FROM revenue GROUP BY industry ORDER BY sum(mrr) DESC
```

### Q10. Seat utilization

Analyzed for 59s

56.6% of paid seats were used in September 2026: 16,106 active people ÷ 28,452 purchased seats, across 864 paying customers.

I used:

- Paid seats: subscription quantities at the end of September 30, UTC, for live, non-internal customers with active or past-due paid subscriptions. Trials, paused and canceled subscriptions were excluded.
- Used seats: distinct people per customer with at least one product event during September, across non-sandbox workspaces. Any recorded action counted, including login.
- Person exclusions: bots, API/integration accounts, support-admin accounts, and accounts on Corvia's corvia.io and corvia.app domains. People who used the product during September still counted even if subsequently deactivated.

Overage caveat: 30 customers had more active people than purchased seats—47 excess people in total. If "share of purchased seats used" is capped at each customer's purchased quantity, the result is 56.4%, or 16,059 used purchased seats, leaving 12,393 unused.

This is September activity compared with month-end seat capacity, not a time-weighted measure of seats purchased throughout the month.

## Queries Basedash ran

1. Calculating paid-seat utilization at September month end | 1 row
2. Separating purchased-seat usage from customer overages | 1 row

## Final SQL shown

```sql
-- second of two queries (the capped variant); the first computed the headline 56.6% the same way without the cap
WITH seats AS ( SELECT s.cust_id, sum(quantity) AS seats FROM billing.subscriptions s JOIN billing.customers c USING (cust_id) JOIN billing.plans p USING (plan_id) WHERE valid_from < timestamptz '2026-10-01 00:00+00' AND ( valid_to IS NULL OR valid_to >= timestamptz '2026-10-01 00:00+00' ) AND status IN ('active', 'past_due') AND c.livemode AND coalesce(c.metadata ->> 'internal', 'false') <> 'true' AND ( p.unit_amount > 0 OR custom_annual_amount > 0 ) GROUP BY 1 ),
active AS ( SELECT c.cust_id, count(DISTINCT lower(trim(u.email))) AS used FROM app.events e JOIN app.workspaces w USING (workspace_id) JOIN billing.customers c ON c.ext_ref = coalesce( w.meta ->> 'stripe_customer_id', w.meta #>> '{billing,customer}' ) JOIN app.users u ON u.user_id = e.user_id AND u.workspace_id = e.workspace_id WHERE NOT w.is_sandbox AND e.occurred_at >= timestamptz '2026-09-01 00:00+00' AND e.occurred_at < timestamptz '2026-10-01 00:00+00' AND u.is_bot IS NOT TRUE AND u.role NOT IN ('api', 'support_admin') AND split_part(lower(u.email), [email redacted] 2) NOT IN ('corvia.io', 'corvia.app') AND u.created_at < timestamptz '2026-10-01 00:00+00' GROUP BY 1 )
SELECT sum(least(seats, coalesce(used, 0))) AS used_purchased_seats, sum(seats - least(seats, coalesce(used, 0))) AS unused_purchased_seats, sum(greatest(coalesce(used, 0) - seats, 0)) AS excess_active_people, round( 100.0 * sum(least(seats, coalesce(used, 0))) / sum(seats), 2 ) AS capped_utilization_pct
FROM seats LEFT JOIN active USING (cust_id)
```

### Q11. Appointments trend

Analyzed for 45s

Customer appointment creation increased every month, with growth accelerating in September.

| Month | Appointments created | Month-over-month growth |
|---|---|---|
| June 2026 | 125,528 | — |
| July 2026 | 128,673 | 2.51% |
| August 2026 | 131,790 | 2.42% |
| September 2026 | 140,577 | 6.67% |

September was the strongest month, following relatively steady growth in July and August.

[Chart: "Customer appointment creations, June–September 2026", bar chart Jun–Sep]

Counting method: Counted unique appointment-creation event IDs across both event names (appointment.created and appointment_created), removing repeated deliveries. Included non-sandbox workspaces linked to live billing customers, including API-created appointments. Months use the event's occurrence time in UTC, through September 30, 2026.

These are unique creation events; the payload does not contain an appointment ID to independently verify unique appointments.

## Queries Basedash ran

1. Counting unique customer appointment creations by month | 4 rows

## Final SQL shown

```sql
WITH monthly AS ( SELECT date_trunc('month', e.occurred_at AT TIME ZONE 'UTC')::date AS month, count(DISTINCT e.event_id) AS appointments FROM app.events e JOIN app.workspaces w ON w.workspace_id = e.workspace_id WHERE e.event_name IN ('appointment.created', 'appointment_created') AND e.occurred_at >= '2026-06-01 00:00:00+00'::timestamptz AND e.occurred_at < '2026-10-01 00:00:00+00'::timestamptz AND w.is_sandbox = false AND EXISTS ( SELECT 1 FROM billing.customers c WHERE c.ext_ref = coalesce( w.meta ->> 'stripe_customer_id', w.meta #>> '{billing,customer}' ) AND c.livemode = true ) GROUP BY 1 )
SELECT month, appointments, round( 100.0 * ( appointments - lag(appointments) OVER ( ORDER BY month ) ) / nullif( lag(appointments) OVER ( ORDER BY month ), 0 ), 2 ) AS mom_growth_pct
FROM monthly ORDER BY month
```

### Q12. Enterprise support responsiveness

Analyzed for 31s

For Enterprise customer tickets opened in Q3 2026 (July 1–September 30, UTC):

| Metric | Result |
|---|---|
| Median time to first human reply | 1 hour 40 minutes |
| Share receiving a human reply within 4 hours | 78.58% — 697 of 887 tickets |
| No human reply by September 30 | 56 tickets |

The median is calculated among the 831 tickets with a reply. Unanswered tickets count as missing the 4-hour target.

A human reply means the first public agent response, excluding automated acknowledgements and internal notes. Enterprise status is evaluated when the ticket opened, using live, non-internal customers with active, past-due, or paused Enterprise subscriptions. Merged tickets are included as separate opened tickets; elapsed time is measured in calendar hours, not business hours.

## Queries Basedash ran

1. Calculating Enterprise ticket response times and target attainment | 1 row

## Final SQL shown

```sql
WITH email_links AS ( SELECT lower(trim(email)) email, cust_id FROM billing.customers UNION SELECT lower(trim(u.email)), c.cust_id FROM app.users u JOIN app.workspaces w ON w.workspace_id = u.workspace_id JOIN billing.customers c ON c.ext_ref = COALESCE( w.meta ->> 'stripe_customer_id', w.meta #>> '{billing,customer}' ) ),
q3 AS ( SELECT t.*, to_timestamp(created_ms / 1000.0) opened_at FROM support.tickets t WHERE created_ms >= extract( epoch FROM timestamptz '2026-07-01 00:00:00+00' ) * 1000 AND created_ms < extract( epoch FROM timestamptz '2026-10-01 00:00:00+00' ) * 1000 ),
ent AS ( SELECT t.* FROM q3 t WHERE EXISTS ( SELECT 1 FROM email_links l JOIN billing.customers c ON c.cust_id = l.cust_id JOIN billing.subscriptions s ON s.cust_id = c.cust_id JOIN billing.plans p ON p.plan_id = s.plan_id WHERE l.email = lower(trim(t.requester_email)) AND c.livemode AND COALESCE((c.metadata ->> 'internal')::boolean, false) = false AND p.tier = 'enterprise' AND s.status IN ('active', 'past_due', 'paused') AND s.valid_from <= t.opened_at AND ( s.valid_to IS NULL OR s.valid_to > t.opened_at ) ) ),
replies AS ( SELECT t.*, ( SELECT min(e.created_at) FROM support.ticket_events e WHERE e.ticket_id = t.ticket_id AND e.author_type = 'agent' AND e.is_public AND e.created_at >= t.opened_at AND e.created_at < timestamptz '2026-10-01 00:00:00+00' ) first_reply FROM ent t )
SELECT count(*) tickets, count(first_reply) replied, count(*) FILTER ( WHERE first_reply IS NULL ) no_reply, percentile_cont(0.5) WITHIN GROUP ( ORDER BY extract( epoch FROM first_reply - opened_at ) / 3600.0 ) median_hours, count(*) FILTER ( WHERE first_reply <= opened_at + interval '4 hours' ) within_4h, round( 100.0 * count(*) FILTER ( WHERE first_reply <= opened_at + interval '4 hours' ) / NULLIF(count(*), 0), 2 ) within_4h_pct, count(*) FILTER ( WHERE merged_into IS NOT NULL ) merged_tickets
FROM replies
```

### Q13. Customer count

Analyzed for 27s

Corvia has 864 current customers as of 30 September 2026 (end of day UTC).

I defined a current customer as a distinct billing customer with at least one active or past-due subscription, excluding test-mode and internal accounts.

- 857 have an active subscription.
- 7 have past-due subscriptions only.

If you mean all billing customer records, including former customers, trials, paused accounts and those without a current subscription, the count is 1,526, with the same test/internal exclusions.

These counts are billing customers—not seats, subscriptions, or consolidated parent-company groups.

## Queries Basedash ran

1. Counting distinct production customers at September month-end | 1 row

## Final SQL shown

```sql
WITH customer_states AS ( SELECT c.cust_id, bool_or(s.status = 'active') AS active, bool_or(s.status IN ('active', 'past_due')) AS active_or_past_due FROM billing.customers c LEFT JOIN billing.subscriptions s ON s.cust_id = c.cust_id AND s.valid_from < TIMESTAMPTZ '2026-10-01 00:00:00+00' AND ( s.valid_to IS NULL OR s.valid_to >= TIMESTAMPTZ '2026-10-01 00:00:00+00' ) WHERE c.created_at < TIMESTAMPTZ '2026-10-01 00:00:00+00' AND c.livemode = true AND COALESCE(c.metadata ->> 'internal', 'false') <> 'true' GROUP BY c.cust_id )
SELECT COUNT(*) FILTER ( WHERE active_or_past_due ) AS current_customers, COUNT(*) FILTER ( WHERE active ) AS active_customers, COUNT(*) FILTER ( WHERE active_or_past_due AND NOT active ) AS past_due_only_customers, COUNT(*) AS all_billing_customers
FROM customer_states
```

