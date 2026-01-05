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
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">F1 News Hub</h1>
          <p className="text-sm text-zinc-600">
            Headlines from multiple sources. Always links to the original.
          </p>
        </div>

        <input
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-black/10"
          placeholder="Search headlines…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {sources.map((s) => {
            const active = selected.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSource(s.id)}
                className={[
                  "rounded-full border px-3 py-1 text-sm transition",
                  active
                    ? "bg-black text-white border-black"
                    : "bg-white hover:bg-zinc-50",
                ].join(" ")}
              >
                {s.name}
              </button>
            );
          })}

          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="rounded-full border px-3 py-1 text-sm bg-white hover:bg-zinc-50 transition"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((it) => (
          <article
            key={it.id}
            className="
              break-inside-avoid mb-6
              group relative overflow-hidden rounded-2xl border bg-white
              shadow-sm transition
              hover:shadow-lg hover:border-zinc-200
              focus-within:ring-2 focus-within:ring-black/10
            "
          >
            {it.image && (
              <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                <Image
                  src={it.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                  onError={(e) => {
                    // Hide the whole image wrapper if the image fails
                    const wrapper = e.currentTarget.parentElement;
                    if (wrapper) wrapper.style.display = "none";
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

                {/* Show badge only for default/source images */}
                {it.image.startsWith("/sources/") && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                    {it.sourceName}
                  </span>
                )}
              </div>
            )}

            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full border px-2 py-0.5">
                  {it.sourceName}
                </span>
                <span className="text-zinc-300">•</span>

                {it.publishedAt && it.sourceId !== "f1" ? (
                  <time dateTime={it.publishedAt}>
                    {new Date(it.publishedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                ) : (
                  <span className="text-zinc-400">Undated</span>
                )}
              </div>

              <h2 className="text-base font-semibold leading-snug tracking-tight">
                <a
                  href={it.url}
                  target="_blank"
                  rel="noreferrer"
                  className="outline-none hover:underline focus-visible:underline"
                >
                  {it.title}
                </a>
              </h2>

              {it.summary && (
                <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
                  {it.summary}
                </p>
              )}
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <p className="opacity-70">No results.</p>
        )}
      </section>
    </main>
  );
}
