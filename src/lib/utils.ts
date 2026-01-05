import crypto from "crypto";

export function makeId(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

export function stripHtml(html?: string) {
  if (!html) return undefined;
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// very light image extraction from RSS description HTML
export function extractFirstImgSrc(html?: string) {
  if (!html) return undefined;

  let m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (m?.[1]) return m[1];

  m = html.match(/<img[^>]+data-src=["']([^"']+)["']/i);
  if (m?.[1]) return m[1];

  return undefined;
}

export function makeSummary(
  raw?: string,
  maxLength = 300
): string | undefined {
  if (!raw) return undefined;

  const clean = stripHtml(raw);
  if (!clean) return undefined;

  if (clean.length <= maxLength) return clean;

  // Cut at word boundary
  const truncated = clean.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}