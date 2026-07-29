import { readFileSync } from "node:fs";

/**
 * Spaces credentials.
 *
 * Preferred source is the process environment. As a fallback we parse the
 * landing repo's `.env`, which is hand-maintained and uses a loose
 * `LABEL: value` shape rather than strict dotenv `KEY=value`.
 */
const FALLBACK_ENV_FILE =
  process.env.SUPABOARD_ENV_FILE ??
  new URL("../../supa-landing/.env", import.meta.url).pathname;

function parseLooseEnv(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return {};
  }

  const out = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([^=:#]+?)\s*[=:]\s*(.+?)\s*$/);
    if (!match) continue;
    const key = match[1].trim().toUpperCase().replace(/\s+/g, "_");
    out[key] = match[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const file = parseLooseEnv(FALLBACK_ENV_FILE);

export const spaces = {
  endpoint: process.env.SPACES_ENDPOINT ?? "https://fra1.digitaloceanspaces.com",
  region: process.env.SPACES_REGION ?? "fra1",
  bucket: process.env.SPACES_BUCKET ?? "supaboard-landing-content",
  accessKeyId:
    process.env.SPACES_KEY ?? file.ACCESS_KEY_ID ?? file.SPACES_KEY ?? "",
  secretAccessKey:
    process.env.SPACES_SECRET ?? file.SECRET ?? file.SPACES_SECRET ?? "",
};

export const publicBase =
  process.env.SPACES_PUBLIC_BASE ??
  `https://${spaces.bucket}.${spaces.region}.digitaloceanspaces.com`;

if (!spaces.accessKeyId || !spaces.secretAccessKey) {
  throw new Error(
    `Missing Spaces credentials. Set SPACES_KEY/SPACES_SECRET or add them to ${FALLBACK_ENV_FILE}`,
  );
}
