"use client";

import { useMemo } from "react";
import type { NewsItem } from "@/lib/types";
import NewsArticle from "./NewsArticle";


export default function FeedClient({ items, selected: selectedProp, q: qProp, 
          resultCount }: { items: NewsItem[]; selected?: Set<string>; q?: string; resultCount?: number }) {
  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const it of items) map.set(it.sourceId, it.sourceName);
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const q = qProp ?? "";

  const internalSelected = useMemo(() => new Set(sources.map((s) => s.id)), [sources]);
  const selected = selectedProp ?? internalSelected;



  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((it) => {
      const sourceOk = selected.has(it.sourceId);
      const queryOk =
        !query ||
        it.title.toLowerCase().includes(query) ||
        (it.summary?.toLowerCase().includes(query) ?? false);
      return sourceOk && queryOk;
    });
  }, [items, selected, q]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6 min-h-screen">
      <section>
        <p className="text-black/80 text-right">{resultCount} articles</p>
      </section>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it) => (
          <NewsArticle key={it.id} article={it} />
        ))}

        {filtered.length === 0 && (
          <p className="no-results">No results.</p>
        )}
      </section>
    </main>
  );
}
