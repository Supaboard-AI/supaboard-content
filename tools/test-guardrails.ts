/**
 * Proves the guardrails actually fire.
 *
 * A CI check nobody has seen fail is a check nobody knows works. This writes
 * deliberately bad posts to a scratch directory, runs the same validators the
 * gate uses, and asserts each rule catches its case. Run: npm run test:guardrails
 */
import assert from "node:assert/strict";
import { validateCorpus, slugProblems } from "../schema/frontmatter.ts";
import { analyze } from "./analyze.ts";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed++;
  console.log(`  ok  ${name}`);
};

/** A post that satisfies every rule, used as the baseline to break. */
const GOOD = {
  title: "Retail Business Intelligence: A Practical Guide",
  slug: "good-post",
  category: "data",
  targetQuery: "retail business intelligence",
  intent: "informational",
  audience: "both",
  funnel: "tofu",
  author: { name: "Real Person", title: "Head of Data" },
  publishedAt: "2026-01-01",
  updatedAt: "2026-02-01",
  description:
    "Retail business intelligence turns store, stock and customer data into decisions you can act on, with the metrics and tooling that actually matter here.",
  tldr: [
    "Retail BI joins point-of-sale, inventory and customer data into one view.",
    "Most revenue drops are misdiagnosed as demand when they are execution.",
    "Dashboards only pay off when they are wired to a specific decision.",
  ],
  internalLinks: ["a", "b", "c"],
  citations: [
    { claim: "Retail analytics market size in 2026", source: "McKinsey", url: "https://example.com/1" },
    { claim: "Share of dashboards rarely reused", source: "Gartner", url: "https://example.com/2" },
    { claim: "Time analysts spend maintaining reports", source: "Forrester", url: "https://example.com/3" },
  ],
  statsCount: 4,
  status: "published",
  readMinutes: 9,
  cover: { url: "https://example.com/c.png", alt: "a real description", width: 1200, height: 630 },
  ogImage: "https://example.com/og.png",
};

/**
 * Validates one post in isolation. Sibling stubs a/b/c exist so the
 * internal-link resolution rule has something to resolve against — otherwise
 * every case would also trip that rule and mask what it is testing.
 */
const only = (data: Record<string, unknown>) => {
  const slug = String(data.slug ?? "good-post");
  const siblings = ["a", "b", "c"].map((s, i) => ({
    slug: s,
    data: { ...GOOD, slug: s, targetQuery: `sibling ${i}`, internalLinks: ["a", "b", "c"] },
  }));
  return validateCorpus([{ slug, data }, ...siblings]).issues.filter((i) => i.slug === slug);
};

console.log("\nguardrail tests");

check("a valid post passes", () => {
  assert.equal(only({ ...GOOD }).length, 0);
});

check("frontmatter that does not validate fails", () => {
  const { category, ...noCategory } = GOOD;
  assert.ok(only(noCategory).some((i) => i.path === "category"));
});

check("a duplicate targetQuery anywhere in the corpus fails", () => {
  const issues = validateCorpus([
    { slug: "one", data: { ...GOOD, slug: "one" } },
    { slug: "two", data: { ...GOOD, slug: "two" } },
  ]).issues;
  assert.ok(issues.some((i) => i.path === "targetQuery" && /duplicate/.test(i.message)));
});

check("slug rules: parentheses, years, mangled apostrophes, length, bare number", () => {
  assert.ok(slugProblems("ai-data-analyst-(2026)").some((p) => p.rule === "no-parentheses"));
  assert.ok(slugProblems("best-bi-tools-in-2025").some((p) => p.rule === "no-years"));
  assert.ok(slugProblems("demos-can-t-survive").some((p) => p.rule === "no-mangled-apostrophes"));
  assert.ok(
    slugProblems(
      "the-best-metabase-alternative-a-smarter-bi-option-to-supercharge-supaboard-dashboards",
    ).some((p) => p.rule === "length"),
  );
  assert.ok(slugProblems("supaboard-ai-3").some((p) => p.rule === "meaningful"));
  assert.equal(slugProblems("what-is-a-semantic-layer").length, 0);
});

check("a numeric claim in the body with no matching citation is detected", () => {
  const a = analyze("Executives waste 12 hours per week reconciling reports.", GOOD.citations);
  assert.equal(a.numericClaims.length, 1);
  assert.equal(a.numericClaims[0].sourced, false);
});

check("a numeric claim carrying an inline source is accepted", () => {
  const a = analyze(
    "Executives waste [12 hours per week](https://example.com/study) reconciling reports.",
    GOOD.citations,
  );
  assert.equal(a.numericClaims[0].sourced, true);
});

check("a customer number citing its own case study is accepted", () => {
  const a = analyze(
    "[Jindal Healthcare](/case-study/jindal-healthcare) reduced analytics cost by 90%.",
    GOOD.citations,
  );
  assert.equal(a.numericClaims[0].sourced, true);
});

check("a plain internal link does not source a number", () => {
  const a = analyze("Executives waste [12 hours per week](/blog/data-engineering) reconciling.", GOOD.citations);
  assert.equal(a.numericClaims[0].sourced, false);
});

check("fewer than 4 statistics fails", () => {
  assert.ok(only({ ...GOOD, statsCount: 3 }).some((i) => i.path === "statsCount"));
});

check("fewer than 3 citations fails", () => {
  assert.ok(only({ ...GOOD, citations: GOOD.citations.slice(0, 2) }).some((i) => i.path === "citations"));
});

check("fewer than 3 internal links fails", () => {
  assert.ok(only({ ...GOOD, internalLinks: ["a"] }).some((i) => i.path === "internalLinks"));
});

check("an unattributed quotation is not counted", () => {
  assert.equal(analyze('> "Analytics should be fast."').attributedQuotes.length, 0);
  assert.equal(
    analyze('> "Analytics should be fast."\n> — Subhrajyoti Modak, CTO, Supaboard').attributedQuotes.length,
    1,
  );
});

check("a commercial post with no case study fails", () => {
  assert.ok(
    only({ ...GOOD, intent: "commercial" }).some((i) => i.path === "caseStudies"),
  );
  assert.equal(
    only({ ...GOOD, intent: "commercial", caseStudies: ["/case-study/jindal-healthcare"] }).length,
    0,
  );
});

check("an internal link resolving to a non-existent slug fails", () => {
  const issues = validateCorpus([
    { slug: "one", data: { ...GOOD, slug: "one", internalLinks: ["two", "nope", "three"] } },
    { slug: "two", data: { ...GOOD, slug: "two", targetQuery: "b", internalLinks: ["one", "three", "nope2"] } },
    { slug: "three", data: { ...GOOD, slug: "three", targetQuery: "c", internalLinks: ["one", "two", "x"] } },
  ]).issues;
  assert.ok(issues.some((i) => i.path === "internalLinks" && /resolves to no post/.test(i.message)));
});

check("a description outside 140-160 chars fails", () => {
  assert.ok(only({ ...GOOD, description: "too short" }).some((i) => i.path === "description"));
});

check("a title over 65 chars fails", () => {
  assert.ok(only({ ...GOOD, title: "x".repeat(66) }).some((i) => i.path === "title"));
});

check("an FAQ answer outside 40-80 words fails", () => {
  const short = [{ q: "What is retail BI?", a: "Not enough words here." }];
  assert.ok(only({ ...GOOD, faq: [...Array(6)].map(() => short[0]) }).some((i) => i.path.includes("a")));
});

console.log(`\n${passed} guardrail tests passed\n`);
