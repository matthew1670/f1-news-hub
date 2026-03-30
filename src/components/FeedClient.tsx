"use client";

import { useMemo } from "react";
import type { NewsItem } from "@/lib/types";
import NewsArticle from "./NewsArticle";

export default function FeedClient({
  items,
  selected: selectedProp,
  SearchQuery: SearchQueryProp,
  resultCount,
  sources,
}: {
  items: NewsItem[];
  sources: { id: string; name: string }[];
  selected?: Set<string>;
  SearchQuery?: string;
  resultCount?: number;
}) {
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
    <div className="space-y-6">
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
          <div className="col-span-full rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center text-zinc-700 shadow-sm">
            <p className="text-xl font-semibold text-zinc-900 mb-2">Nothing matched your search or filters.</p>
            <p className="max-w-md mx-auto text-sm leading-6">
              Try clearing your search query or selecting more sources to see the latest F1 headlines.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
