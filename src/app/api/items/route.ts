import Parser from "rss-parser";
import { NextResponse } from "next/server";
import { FEED_DEFAULT_IMAGES, FEEDS } from "@/lib/feeds";
import type { NewsItem } from "@/lib/types";
import { extractFirstImgSrc, makeId, makeSummary } from "@/lib/utils";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

// Simple in-memory cache (works great locally; in serverless it may reset)
let CACHE: { at: number; items: NewsItem[] } | null = null;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickImage(item: any): string | undefined {
  // Helper: normalize to array
  const asArray = <T,>(v: T | T[] | undefined): T[] => (Array.isArray(v) ? v : v ? [v] : []);

  // 1) media:content (can be array)
  for (const mc of asArray(item?.mediaContent)) {
    const url = mc?.$?.url ?? mc?.url;
    if (typeof url === "string" && url) return url;
  }

  // 2) media:thumbnail (can be array)
  for (const mt of asArray(item?.mediaThumbnail)) {
    const url = mt?.$?.url ?? mt?.url;
    if (typeof url === "string" && url) return url;
  }

  // 3) enclosure (can be array, type sometimes missing)
  for (const enc of asArray(item?.enclosure)) {
    const url = enc?.url;
    const type = enc?.type;
    if (typeof url === "string" && url) {
      if (typeof type !== "string" || type.startsWith("image/")) return url;
    }
  }

  // 4) Common RSS fields used by some publishers
  if (typeof item?.image?.url === "string") return item.image.url;
  if (typeof item?.image === "string") return item.image;

  // 5) Fallback: scrape from HTML fields (try more than one)
  return extractFirstImgSrc(
    item?.contentEncoded ||
      item?.content ||
      item?.contentSnippet ||
      item?.summary ||
      item?.description
  );
}


export async function GET() {
  // Serve from cache if fresh
  if (CACHE && Date.now() - CACHE.at < TTL_MS) {
    const age = Date.now() - CACHE.at;
    console.log(`[api/items] cache hit — age=${age}ms, ttl=${TTL_MS}ms, items=${CACHE.items.length}`);
    return NextResponse.json(
      { items: CACHE.items, cached: true },
      { headers: { "Cache-Control": `public, max-age=0, s-maxage=${Math.floor(TTL_MS / 1000)}` } }
    );
  }

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        // Next.js fetch caching hint (may be ignored depending on runtime)
        next: { revalidate: Math.floor(TTL_MS / 1000) },
        headers: { "user-agent": "f1-news-hub/1.0 (+local project)" },
      });

      if (!res.ok) throw new Error(`${feed.name} fetch failed: ${res.status}`);
      const xml = await res.text();
      const parsed = await parser.parseString(xml);

      const items: NewsItem[] = (parsed.items || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((it: any) => {
          const url = it.link || it.guid;
          if (!url) return null;

          const published =
            it.isoDate ||
            it.pubDate ||
            it.published ||
            new Date().toISOString();

          const title = (it.title || "").trim();
          if (!title) return null;

          const summaryRaw = it.contentSnippet || it.content || it.summary || it.description;
          const summary = makeSummary(summaryRaw, 300);

          const image = pickImage(it) ?? FEED_DEFAULT_IMAGES[feed.id];

          return {
            id: makeId(`${feed.id}:${url}`),
            sourceId: feed.id,
            sourceName: feed.name,
            title,
            url,
            publishedAt: new Date(published).toISOString(),
            summary,
            image: image,
          } satisfies NewsItem;
        })
        .filter(Boolean) as NewsItem[];

      return items;
    })
  );

  const merged: NewsItem[] = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  // Optional: dedupe by identical URL
  const seen = new Set<string>();
  const deduped = merged.filter((x) => {
    if (seen.has(x.url)) return false;
    seen.add(x.url);
    return true;
  });

  CACHE = { at: Date.now(), items: deduped };

  console.log(`[api/items] cache miss — fetched=${merged.length}, deduped=${deduped.length}, cache updated at ${new Date(CACHE.at).toISOString()}`);

  return NextResponse.json(
    { items: deduped, cached: false },
    { headers: { "Cache-Control": `public, max-age=0, s-maxage=${Math.floor(TTL_MS / 1000)}` } }
  );
}
