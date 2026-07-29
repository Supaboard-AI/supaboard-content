import { readFileSync } from "node:fs";

/**
 * Spaces credentials for the migration tools.
 *
 * Resolved in order: the process environment, this repo's `.env`, then the
 * landing repo's `.env` next door — which is where the keys lived before this
 * repo existed, and still does on the machine that ran the first migration.
 *
 * Nothing here is needed to *read* the repo; only to run a migration.
 */
const CANDIDATE_FILES = [
  process.env.SUPABOARD_ENV_FILE,
  new URL("../.env", import.meta.url).pathname,
  new URL("../../supa-landing/.env", import.meta.url).pathname,
].filter(Boolean);

/**
 * Tolerates `KEY=value` and `Some Label: value` alike — the landing repo's file
 * was hand-written and uses the latter for the Spaces keys.
 */
function parseLooseEnv(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return {};
  }

  const out = {};
  for (const line of raw.split("\n")) {
    if (/^\s*#/.test(line)) continue;
    const match = line.match(/^\s*([^=:#]+?)\s*[=:]\s*(.+?)\s*$/);
    if (!match) continue;
    const key = match[1].trim().toUpperCase().replace(/\s+/g, "_");
    out[key] = match[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

// Earlier files win, so a repo-local `.env` overrides the neighbour's.
const file = {};
for (const path of [...CANDIDATE_FILES].reverse()) {
  Object.assign(file, parseLooseEnv(path));
}

export const spaces = {
  endpoint: process.env.SPACES_ENDPOINT ?? file.SPACES_ENDPOINT ?? "https://fra1.digitaloceanspaces.com",
  region: process.env.SPACES_REGION ?? file.SPACES_REGION ?? "fra1",
  bucket: process.env.SPACES_BUCKET ?? file.SPACES_BUCKET ?? "supaboard-landing-content",
  accessKeyId: process.env.SPACES_KEY ?? file.SPACES_KEY ?? file.ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.SPACES_SECRET ?? file.SPACES_SECRET ?? file.SECRET ?? "",
};

export const publicBase =
  process.env.SPACES_PUBLIC_BASE ??
  file.SPACES_PUBLIC_BASE ??
  `https://${spaces.bucket}.${spaces.region}.digitaloceanspaces.com`;

if (!spaces.accessKeyId || !spaces.secretAccessKey) {
  throw new Error(
    "Missing Spaces credentials. Copy .env.example to .env and fill in " +
      "SPACES_KEY / SPACES_SECRET, or set them in the environment.",
  );
}
