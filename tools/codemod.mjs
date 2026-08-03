/**
 * Phase 3 — map the Framer-era frontmatter onto the content model.
 *
 * Fills only what can be derived from data already in the repo. Everything it
 * cannot fill is reported rather than guessed: `targetQuery`, `tldr` and
 * `citations` are editorial claims, and inventing them would defeat the point
 * of the schema.
 *
 * Also rewrites internal links through the disposition map, so a link to a
 * merged post follows the same 301 the reader would.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";

const ROOT = new URL("..", import.meta.url).pathname;
const POSTS = `${ROOT}posts/`;
const apply = process.argv.includes("--apply");

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.length > 1);
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const rows = parseCsv(readFileSync(`${ROOT}migration/disposition.csv`, "utf8"));
const slugOf = (url) => url.split("/blog/")[1] ?? null;

/** old slug -> surviving slug (or null when the URL is now 410). */
const redirect = new Map();
/** canonical slug -> old URLs it absorbed. */
const absorbedBy = new Map();

for (const r of rows) {
  const old = slugOf(r.old_url);
  if (!old) continue;
  if (r.bucket === "KILL") redirect.set(old, null);
  else if (r.bucket === "KEEP") redirect.set(old, r.new_slug);
  else if (r.bucket === "MERGE") {
    const target = slugOf(r.canonical_target);
    redirect.set(old, target); // null for /compare/* targets — handled below
    if (target) {
      if (!absorbedBy.has(target)) absorbedBy.set(target, []);
      absorbedBy.get(target).push(r.old_url);
    }
  }
}

const survivors = new Set(
  rows.filter((r) => r.bucket === "KEEP").map((r) => r.new_slug),
);

/** Legacy taxonomy -> the four new categories. A starting point, hand-corrected after. */
const CATEGORY_FROM_LEGACY = {
  "BI Tools": "product",
  Tech: "engineering",
  Business: "data",
  General: "data",
};

/** Fields the model requires that no legacy export can supply. */
const UNFILLABLE = [
  "targetQuery", "intent", "audience", "funnel",
  "tldr", "citations", "statsCount",
];

const gaps = {};
let changed = 0;

for (const file of readdirSync(POSTS).filter((f) => f.endsWith(".md")).sort()) {
  const slug = basename(file, ".md");
  const raw = readFileSync(POSTS + file, "utf8");
  const parsed = matter(raw);
  const fm = { ...parsed.data };
  const missing = [];

  // --- slug: the filename is the contract ---
  fm.slug = slug;

  // --- author.role -> author.title, avatar preserved ---
  if (fm.author && fm.author.role && !fm.author.title) {
    fm.author = {
      name: fm.author.name,
      title: fm.author.role,
      ...(fm.author.avatar ? { avatar: fm.author.avatar } : {}),
    };
  }

  // --- category from the legacy taxonomy ---
  if (fm.category && CATEGORY_FROM_LEGACY[fm.category]) {
    fm.legacyCategory = fm.category;
    fm.category = CATEGORY_FROM_LEGACY[fm.category];
  }

  // --- faq {question,answer} -> {q,a} ---
  if (Array.isArray(fm.faq)) {
    fm.faq = fm.faq.map((f) => (f.q ? f : { q: f.question, a: f.answer }));
  }

  // --- absorbed: fully derivable from the disposition map ---
  const absorbed = absorbedBy.get(slug);
  if (absorbed?.length) fm.absorbed = absorbed;

  // --- internalLinks: related rail + body links, followed through redirects ---
  const bodyTargets = [...parsed.content.matchAll(/\/blog\/([a-z0-9()'-]+)/gi)].map((m) => m[1]);
  const candidates = [...(fm.related ?? []), ...bodyTargets];
  const resolved = new Set();
  for (const c of candidates) {
    const target = survivors.has(c) ? c : redirect.get(c);
    if (target && survivors.has(target) && target !== slug) resolved.add(target);
  }
  if (resolved.size) fm.internalLinks = [...resolved].sort();
  if (!fm.internalLinks || fm.internalLinks.length < 3) {
    missing.push(`internalLinks (have ${fm.internalLinks?.length ?? 0}, need 3)`);
  }

  // --- related: drop dead slugs so the rail cannot point at a 410 ---
  if (Array.isArray(fm.related)) {
    fm.related = fm.related
      .map((r) => (survivors.has(r) ? r : redirect.get(r)))
      .filter((r) => r && survivors.has(r) && r !== slug);
    if (!fm.related.length) delete fm.related;
  }

  // --- report what remains ---
  for (const field of UNFILLABLE) if (fm[field] === undefined) missing.push(field);
  if ((fm.title ?? "").length > 65) missing.push(`title (${fm.title.length} chars, max 65)`);
  const d = (fm.description ?? "").length;
  if (d < 140 || d > 160) missing.push(`description (${d} chars, need 140-160)`);
  if (!Array.isArray(fm.faq) || fm.faq.length < 6) {
    missing.push(`faq (have ${fm.faq?.length ?? 0}, need 6-10)`);
  }

  if (missing.length) gaps[slug] = missing;

  if (apply) {
    writeFileSync(POSTS + file, matter.stringify(parsed.content, fm));
    changed++;
  }
}

const reportPath = `${ROOT}migration/codemod-gaps.json`;
writeFileSync(
  reportPath,
  JSON.stringify(
    {
      note: "Fields the codemod could not fill. These are editorial claims, not data — a post that cannot supply them belongs in KILL or MERGE, not KEEP.",
      postsWithGaps: Object.keys(gaps).length,
      byField: Object.entries(
        Object.values(gaps).flat().reduce((acc, m) => {
          const k = m.split(" ")[0];
          acc[k] = (acc[k] ?? 0) + 1;
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]),
      posts: gaps,
    },
    null,
    2,
  ) + "\n",
);

console.log(apply ? `rewrote ${changed} posts` : "(dry run — pass --apply to write)");
console.log(`posts with unfilled fields: ${Object.keys(gaps).length}`);
console.log(`wrote migration/codemod-gaps.json`);
