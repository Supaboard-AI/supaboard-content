/**
 * Phrases that were each a real production defect, or that state something
 * about Supaboard the product does not do. The gate fails on any match in a
 * post body (`ci.ts`, check 9); `test-guardrails.ts` proves each one fires.
 *
 * The 2026-10-16 additions follow the GTM Bible and the product as of that
 * date (AUTHORING-PROMPT.md §2): the 97.8% figure is retired, apps are read
 * live through MCP, the price is per editor with a weekly AI allowance, and
 * the AI modes are Flash, Pro and Max.
 */
export const BANNED: [RegExp, string][] = [
  [/dashboards[ -]as[ -]code/i, "Supaboard has no such feature"],
  [/600\+\s*data sources/i, "say: 12 databases and warehouses, and any tool with an MCP server"],
  [/\bStarter, Pro\b/, "the plans are Free, Starter, Individual, Business and Enterprise"],
  [/Not verified —/, "editorial placeholder left in the body"],
  [/97\.8\s*%/, "the BI Bench figure is retired until its method is published"],
  [/\b22 apps\b/, "say: any tool with an MCP server (22 are ready to add)"],
  [/flat[- ]per[- ](?:seat|editor)/i, "a seat price is not a flat bill: say per editor, with a weekly AI allowance"],
  [/\bunmetered\b/i, "AI requests draw on a weekly allowance; never call the price unmetered"],
  [/see beyond dashboards/i, "retired positioning line"],
  [/\bDeep (?:Dive|Research)\b/, "the AI modes are Flash, Pro and Max"],
];
