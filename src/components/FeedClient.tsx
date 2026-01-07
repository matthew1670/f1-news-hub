"use client";

import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/types";
import NewsArticle from "./NewsArticle";
import SearchBox from "./SearchBox";
import SourcesDropdown from "./SourcesDropdown";


export default function FeedClient({ items }: { items: NewsItem[] }) {
  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const it of items) map.set(it.sourceId, it.sourceName);
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const allSourceIds = useMemo(
    () => new Set(sources.map((s) => s.id)),
    [sources]
  );

  const [selected, setSelected] = useState<Set<string>>(() => new Set(sources.map((s) => s.id)));
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const sourceOk = selected.has(it.sourceId);
      const queryOk =
        !query ||
        it.title.toLowerCase().includes(query) ||
        (it.summary?.toLowerCase().includes(query) ?? false);
      return sourceOk && queryOk;
    });
  }, [items, selected, searchQuery]);

  function toggleSource(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6 min-h-screen">
      <header className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="page-title">
              F1 News Hub
            </h1>
            <p className="page-subtitle">
              Headlines from multiple sources. Always links to the original.
            </p>
          </div>

          <div className="result-count">
            {filtered.length} articles
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBox value={searchQuery} onChange={setSearchQuery} />


          <div className="flex items-center gap-2">
            <SourcesDropdown
              sources={sources}
              selected={selected}
              onToggleSource={toggleSource}
              onReset={() => setSelected(new Set(allSourceIds))}
            />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((it, i) => (
          <NewsArticle key={it.id} article={it} isFeatured={i === 0} />
        ))}

        {filtered.length === 0 && (
          <p className="no-results">No results.</p>
        )}
      </section>
    </main>
  );
}
