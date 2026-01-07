"use client";

import { useMemo } from "react";
import type { NewsItem } from "@/lib/types";
import NewsArticle from "./NewsArticle";


export default function FeedClient({ items, selected: selectedProp, SearchQuery: SearchQueryProp, resultCount, sources }:
  { items: NewsItem[]; sources: { id: string; name: string }[]; selected?: Set<string>; SearchQuery?: string; resultCount?: number }) {

  const SearchQuery = SearchQueryProp ?? "";

  const internalSelected = useMemo(() => new Set(sources.map((s) => s.id)), [sources]);
  const selected = selectedProp ?? internalSelected;



  const filtered = useMemo(() => {
    const query = SearchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const sourceOk = selected.has(it.sourceId);
      const queryOk =
        !query ||
        it.title.toLowerCase().includes(query) ||
        (it.summary?.toLowerCase().includes(query) ?? false);
      return sourceOk && queryOk;
    });
  }, [items, selected, SearchQuery]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6 min-h-screen">
      {SearchQuery && (
        <div className="text-sm text-zinc-500">
          {resultCount !== undefined ? resultCount : filtered.length} result
          {((resultCount !== undefined ? resultCount : filtered.length) !== 1) && "s"} for &quot;{SearchQuery}&quot;
        </div>
      )}
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
