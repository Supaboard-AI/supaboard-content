/**
 * The UI writes to the corpus, so the only thing worth testing is that it never
 * damages it: split -> join must be byte-identical for every file we can open,
 * and no path outside posts/ or case-studies/ may ever resolve.
 */
import { expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { joinDoc, safePath, splitDoc } from "./ui.ts";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const files = ["posts", "case-studies"].flatMap((dir) =>
  readdirSync(resolve(ROOT, dir))
    .filter((f) => f.endsWith(".md"))
    .map((f) => `${dir}/${f}`),
);

test("every file in the corpus round-trips byte-identically", () => {
  expect(files.length).toBeGreaterThan(50);
  for (const rel of files) {
    const original = readFileSync(resolve(ROOT, rel), "utf8");
    const { frontmatter, body, parsed } = splitDoc(original);
    expect(parsed, `${rel} has no frontmatter delimiter`).toBe(true);
    expect(joinDoc(frontmatter, body), `${rel} changed on round-trip`).toBe(original);
  }
});

test("splitDoc leaves a file without frontmatter alone", () => {
  const { parsed, frontmatter, body } = splitDoc("# just a body\n");
  expect(parsed).toBe(false);
  expect(frontmatter).toBe("");
  expect(body).toBe("# just a body\n");
});

test("safePath accepts only markdown inside the two content directories", () => {
  expect(safePath("posts/what-is-a-kpi.md")).toContain("/posts/what-is-a-kpi.md");
  expect(safePath("case-studies/jindal-healthcare.md")).toContain("/case-studies/");

  for (const bad of [
    "",
    "posts/x.txt",
    "package.json",
    "../../etc/passwd",
    "posts/../../../etc/passwd.md",
    "/etc/passwd.md",
    "migration/faq.config.mjs",
    "schema/frontmatter.ts",
    "posts",
  ]) {
    expect(safePath(bad), `${bad} should be rejected`).toBeNull();
  }
});
