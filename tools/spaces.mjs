import { createHash } from "node:crypto";
import { extname } from "node:path";

import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { publicBase, spaces } from "./env.mjs";

const s3 = new S3Client({
  endpoint: spaces.endpoint,
  region: spaces.region,
  credentials: {
    accessKeyId: spaces.accessKeyId,
    secretAccessKey: spaces.secretAccessKey,
  },
});

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** `foo.png` -> `.png`, tolerating Framer's `?width=…` query strings. */
export function extensionFor(url, contentType) {
  const clean = extname(new URL(url).pathname).toLowerCase();
  if (MIME[clean]) return clean;
  const fromType = Object.entries(MIME).find(([, v]) => v === contentType);
  return fromType ? fromType[0] : ".png";
}

/**
 * Upload a buffer once. The key is content-addressed, so re-running the
 * migration never duplicates an asset and never invalidates a live URL.
 */
export async function uploadOnce(prefix, buffer, { ext, contentType }) {
  const digest = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
  const key = `${prefix}/${digest}${ext}`;
  const url = `${publicBase}/${key}`;

  try {
    await s3.send(new HeadObjectCommand({ Bucket: spaces.bucket, Key: key }));
    return { url, key, skipped: true };
  } catch {
    // Not there yet — fall through and upload.
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: spaces.bucket,
      Key: key,
      Body: buffer,
      ACL: "public-read",
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return { url, key, skipped: false };
}

export { publicBase, spaces };
