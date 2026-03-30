"use client";

import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/lib/types";
import Sidebar from "./Sidebar";
import FeedClient from "./FeedClient";
import Header from "./Header";
import NewsArticleSkeleton from "./NewsArticleSkeleton";

export default function FeedPageClient() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [SearchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadItems() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/items", { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        if (!active) return;
        setItems(data.items ?? []);
      } catch (error) {
        if (!active) return;
        if (error instanceof Error && error.name === "AbortError") return;
        setError("Unable to load articles. Please try again.");
      } finally {
        if (!active) return;
        setLoading(false);
      }
    }

    loadItems();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const it of items) map.set(it.sourceId, it.sourceName);
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  useEffect(() => {
    if (!loading && selectedSources.size === 0 && sources.length > 0) {
      setSelectedSources(new Set(sources.map((s) => s.id)));
    }
  }, [loading, selectedSources.size, sources]);

  function toggleSource(id: string) {
    setSelectedSources((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setSelectedSources(new Set(sources.map((s) => s.id)));
  }

  const resultCount = useMemo(() => {
    const query = SearchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const sourceOk = selectedSources.has(it.sourceId);
      const queryOk =
        !query ||
        it.title.toLowerCase().includes(query) ||
        (it.summary?.toLowerCase().includes(query) ?? false);
      return sourceOk && queryOk;
    }).length;
  }, [items, selectedSources, SearchQuery]);

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
      <div className="lg:col-span-2">
        <Header
          query={SearchQuery}
          setQuery={setSearchQuery}
          sources={sources}
          selected={selectedSources}
          toggleSource={toggleSource}
          reset={reset}
        />
      </div>

      <aside className="hidden lg:block">
        <Sidebar sources={sources} selected={selectedSources} onToggleSource={toggleSource} onReset={reset} />
      </aside>

      <div>
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-6">
            <div className="text-sm text-zinc-500">Loading articles…</div>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <NewsArticleSkeleton key={index} />
              ))}
            </section>
          </div>
        ) : (
          <FeedClient
            items={items}
            sources={sources}
            selected={selectedSources}
            SearchQuery={SearchQuery}
            resultCount={resultCount}
          />
        )}
      </div>
    </div>
  );
}
