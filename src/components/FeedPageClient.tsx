"use client";

import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/types";
import Sidebar from "./Sidebar";
import FeedClient from "./FeedClient";
import Header from "./Header";

export default function FeedPageClient({ items }: { items: NewsItem[] }) {
  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const it of items) map.set(it.sourceId, it.sourceName);
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set(sources.map((s) => s.id)));
  const [SearchQuery, setSearchQuery] = useState("");

  function toggleSource(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setSelected(new Set(sources.map((s) => s.id)));
  }

  const resultCount = useMemo(() => {
    const query = SearchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const sourceOk = selected.has(it.sourceId);
      const queryOk =
        !query ||
        it.title.toLowerCase().includes(query) ||
        (it.summary?.toLowerCase().includes(query) ?? false);
      return sourceOk && queryOk;
    }).length;
  }, [items, selected, SearchQuery]);

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
      <div className="lg:col-span-2">
        <Header
          q={SearchQuery}
          setQ={setSearchQuery}
          sources={sources}
          selected={selected}
          toggleSource={toggleSource}
          reset={reset}
        />
      </div>

      <aside className="hidden lg:block">
        <Sidebar sources={sources} selected={selected} onToggleSource={toggleSource} onReset={reset} />
      </aside>

      <div>
        <FeedClient items={items} selected={selected} SearchQuery={SearchQuery} resultCount={resultCount} />
      </div>
    </div>
  );
}
