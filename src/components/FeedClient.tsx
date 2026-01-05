"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { NewsItem } from "@/lib/types";

export default function FeedClient({ items }: { items: NewsItem[] }) {
  const sources = useMemo(() => {
    const map = new Map<string, string>();
    for (const it of items) map.set(it.sourceId, it.sourceName);
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return items.filter((it) => {
      const sourceOk = selected.size === 0 || selected.has(it.sourceId);
      const queryOk =
        !query ||
        it.title.toLowerCase().includes(query) ||
        (it.summary?.toLowerCase().includes(query) ?? false);
      return sourceOk && queryOk;
    });
  }, [items, selected, q]);

  function toggleSource(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6 p-4">
      <header className="space-y-3">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Search headlines…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSource(s.id)}
              className={`rounded border px-3 py-1 text-sm ${selected.has(s.id) ? "bg-black text-white" : ""
                }`}
            >
              {s.name}
            </button>
          ))}
          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="rounded border px-3 py-1 text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((it) => (
          <article key={it.id} className="rounded border p-3 space-y-2">
            {it.image && (
              <div className="relative">
                <Image
                  src={it.image}
                  alt=""
                  width={500}
                  height={300}
                  className="w-full max-h-64 object-cover rounded"
                  loading="lazy"
                />

                {(
                  <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                    {it.sourceName}
                  </span>
                )}
              </div>
            )}

            <div className="text-xs opacity-70 flex gap-2">
              <span>{it.sourceName}</span>
              <span>•</span>
              <time dateTime={it.publishedAt}>
                {new Date(it.publishedAt).toLocaleString()}
              </time>
            </div>

            <a className="text-lg font-medium underline" href={it.url} target="_blank" rel="noreferrer">
              {it.title}
            </a>

            {it.summary && <p className="text-sm opacity-90">{it.summary}</p>}
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="opacity-70">No results.</p>
        )}
      </section>
      </div>
  );
}
