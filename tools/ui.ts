/**
 * Local content UI — `bun run ui`.
 *
 * Edits posts/ and case-studies/ with live schema errors from schema/frontmatter.ts,
 * and runs the tools/ scripts with their safe flag pre-selected.
 *
 * ponytail: loopback + Origin check only. This process can delete objects from a
 * public bucket, so if it ever needs to bind beyond 127.0.0.1, add a token first.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import matter from "gray-matter";
import { validateCorpus } from "../schema/frontmatter.ts";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const PORT = Number(process.env.PORT ?? 4321);

/* ---------------------------------------------------------------- documents */

/**
 * Split, never re-serialize. gray-matter's stringify would re-fold every `>-`
 * block in the corpus; splicing the raw frontmatter text back means bytes the
 * editor did not touch stay byte-identical. tools/ui.test.ts proves it.
 */
const FM = /^---\n([\s\S]*?)\n---(?:\n|$)/;

export function splitDoc(text: string) {
  const m = FM.exec(text);
  if (!m) return { frontmatter: "", body: text, parsed: false };
  return { frontmatter: m[1], body: text.slice(m[0].length), parsed: true };
}

export function joinDoc(frontmatter: string, body: string) {
  return `---\n${frontmatter}\n---\n${body}`;
}

/** Reject anything outside posts/ and case-studies/, and anything not markdown. */
export function safePath(rel: string): string | null {
  if (!rel || !rel.endsWith(".md")) return null;
  const abs = resolve(ROOT, rel);
  const ok = ["posts", "case-studies"].some((d) => abs.startsWith(resolve(ROOT, d) + "/"));
  return ok ? abs : null;
}

const list = (dir: string) =>
  readdirSync(resolve(ROOT, dir))
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => ({ dir, slug: basename(f, ".md"), path: `${dir}/${f}` }));

/** Parsed frontmatter for every post — the corpus validateCorpus() needs. */
const postDocs = () =>
  list("posts").map((f) => ({
    slug: f.slug,
    data: matter(readFileSync(resolve(ROOT, f.path), "utf8")).data,
  }));

const groupBySlug = (issues: { slug: string; path: string; message: string }[]) => {
  const by: Record<string, { path: string; message: string }[]> = {};
  for (const i of issues) (by[i.slug] ??= []).push({ path: i.path, message: i.message });
  return by;
};

/* ------------------------------------------------------------------- tools */

type Tier = "safe" | "optout" | "optin" | "danger";

/**
 * Commands come from package.json so they are never duplicated here. This table
 * carries only what package.json cannot express: how dangerous each tool is, and
 * which flag switches it between dry and writing.
 */
const TOOLS: Record<string, { tier: Tier; flag?: string; note: string; cmd?: string }> = {
  // Read-only reports.
  validate: { tier: "safe", note: "schema gate over posts/" },
  "content:check": { tier: "safe", note: "full build gate · network" },
  report: { tier: "safe", note: "corpus health dashboard" },
  verify: { tier: "safe", note: "repo vs live sitemap · network" },
  coverage: { tier: "safe", note: "proves no live URL 404s · network" },
  discover: { tier: "safe", note: "crawls for missing posts · network" },
  cluster: { tier: "safe", note: "inspect a merge cluster · try --list" },
  "test:guardrails": { tier: "safe", note: "asserts each CI rule fires" },

  // Regenerate committed artifacts in migration/. Safe to re-run, but they do write.
  inventory: { tier: "safe", note: "writes migration/inventory.json" },
  reconcile: { tier: "safe", note: "writes migration/reconciliation.json · network" },
  disposition: { tier: "safe", note: "writes migration/disposition.csv" },
  redirects: { tier: "safe", note: "writes migration/redirects.json + .next.mjs" },
  sitemap: { tier: "safe", note: "writes migration/sitemap.xml + sitemap.ts" },
  "stats:audit": { tier: "safe", note: "writes migration/stats-audit.csv" },

  // Write to posts/ unless told not to.
  rails: { tier: "optout", flag: "--dry", note: "featured ranks from live index · network" },
  "refresh-faq": { tier: "optout", flag: "--dry", note: "re-derives faq: from prose" },

  // Dry by default; the checkbox writes.
  toc: { tier: "optin", flag: "--apply", note: "rebuilds sections: from markers" },
  faq: { tier: "optin", flag: "--apply", note: "applies migration/faq.config.mjs" },
  relink: { tier: "optin", flag: "--apply", note: "rewrites body links through redirects" },
  codemod: { tier: "optin", flag: "--apply", note: "maps Framer fields onto the model" },
  citations: { tier: "optin", flag: "--apply", note: "drafts citations:", cmd: "node tools/citations.mjs" },
  "apply-editorial": {
    tier: "optin",
    flag: "--apply",
    note: "applies migration/editorial.config.mjs",
    cmd: "node tools/apply-editorial.mjs",
  },

  // Type the name to run. No dry mode, or the blast radius leaves this machine.
  covers: { tier: "danger", flag: "--apply", note: "uploads to Spaces AND rewrites posts/" },
  "prune-assets": { tier: "danger", flag: "--delete", note: "DELETES live objects from Spaces" },
  "apply-disposition": {
    tier: "danger",
    flag: "--apply",
    note: "git rm / git mv across posts/",
    cmd: "node tools/apply-disposition.mjs",
  },
  scrape: { tier: "danger", note: "overwrites posts/ from live site · no dry mode · needs slugs" },
  "scrape:all": { tier: "danger", note: "overwrites EVERY post from live site · no dry mode" },
  comparisons: { tier: "danger", note: "writes into the sibling site repo · no dry mode" },
};

const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));

const catalogue = Object.entries(TOOLS).map(([name, t]) => ({
  name,
  cmd: t.cmd ?? pkg.scripts[name],
  tier: t.tier,
  flag: t.flag ?? null,
  note: t.note,
}));

/* --------------------------------------------------------------- execution */

// ponytail: one run at a time, so two --apply runs can never race on posts/.
let running: { name: string; proc: Bun.Subprocess } | null = null;

function run(name: string, cmd: string): Response {
  const proc = Bun.spawn(["sh", "-c", `${cmd} 2>&1`], {
    cwd: ROOT,
    stdout: "pipe",
    stderr: "inherit",
    env: process.env,
  });
  running = { name, proc };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        for await (const chunk of proc.stdout as ReadableStream<Uint8Array>) controller.enqueue(chunk);
        const code = await proc.exited;
        controller.enqueue(enc.encode(`\n[exit ${code}]\n`));
      } catch (err) {
        controller.enqueue(enc.encode(`\n[ui error] ${err}\n`));
      } finally {
        running = null;
        controller.close();
      }
    },
    cancel() {
      proc.kill();
      running = null;
    },
  });

  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

/* ------------------------------------------------------------------ server */

const json = (data: unknown, status = 200) => Response.json(data, { status });

/** A page in your browser can POST to localhost. Same-origin only. */
const sameOrigin = (req: Request) => {
  const origin = req.headers.get("origin");
  return !origin || new URL(origin).port === String(PORT);
};

// ponytail: importable for tools/ui.test.ts; only listens when run directly.
if (import.meta.main) {
    const server = Bun.serve({
    port: PORT,
    hostname: "127.0.0.1",
    idleTimeout: 0,

    async fetch(req) {
      const url = new URL(req.url);
      const p = url.pathname;

      if (req.method !== "GET" && !sameOrigin(req)) return json({ error: "cross-origin" }, 403);

      if (p === "/") return new Response(Bun.file(resolve(ROOT, "tools/ui.html")));

      if (p === "/api/tree") {
        const issues = groupBySlug(validateCorpus(postDocs()).issues);
        return json({
          files: [...list("posts"), ...list("case-studies")].map((f) => ({
            ...f,
            issues: f.dir === "posts" ? (issues[f.slug]?.length ?? 0) : null,
          })),
        });
      }

      if (p === "/api/scripts") return json({ scripts: catalogue });

      if (p === "/api/file") {
        const abs = safePath(url.searchParams.get("path") ?? "");
        if (!abs) return json({ error: "path outside posts/ or case-studies/" }, 400);

        if (req.method === "GET") {
          const doc = splitDoc(readFileSync(abs, "utf8"));
          return json(doc);
        }
        if (req.method === "PUT") {
          const { frontmatter, body } = (await req.json()) as { frontmatter: string; body: string };
          if (typeof frontmatter !== "string" || typeof body !== "string")
            return json({ error: "frontmatter and body must be strings" }, 400);
          writeFileSync(abs, joinDoc(frontmatter, body));
          return json({ ok: true });
        }
      }

      if (p === "/api/validate" && req.method === "POST") {
        const { path, frontmatter } = (await req.json()) as { path: string; frontmatter: string };
        if (!safePath(path)) return json({ error: "bad path" }, 400);
        if (!path.startsWith("posts/")) return json({ issues: [], schema: false });

        let data: unknown;
        try {
          data = matter(joinDoc(frontmatter, "")).data;
        } catch (err) {
          return json({ issues: [{ path: "(yaml)", message: String((err as Error).message).split("\n")[0] }], schema: true });
        }

        // Substitute the edit into the corpus so set-level rules stay live.
        const slug = basename(path, ".md");
        const docs = postDocs().map((d) => (d.slug === slug ? { slug, data } : d));
        const issues = validateCorpus(docs).issues.filter((i) => i.slug === slug);
        return json({ issues: issues.map(({ path, message }) => ({ path, message })), schema: true });
      }

      if (p === "/api/run" && req.method === "POST") {
        const { name, flag, args } = (await req.json()) as { name: string; flag: boolean; args?: string };
        const tool = catalogue.find((t) => t.name === name);
        if (!tool) return json({ error: `unknown tool ${name}` }, 400);
        if (running) return json({ error: `"${running.name}" is already running` }, 409);

        // optout ships its dry flag unless you ask to write; everything else opts in.
        const extra = tool.tier === "optout" ? (flag ? "" : tool.flag) : flag ? tool.flag : "";
        const cmd = [tool.cmd, extra, args?.trim()].filter(Boolean).join(" ");

        return run(name, cmd);
      }

      return new Response("not found", { status: 404 });
    },
  });

  console.log(`content ui  ->  http://localhost:${server.port}`);
}
