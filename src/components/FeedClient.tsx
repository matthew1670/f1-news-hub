"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { NewsItem } from "@/lib/types";

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

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");

  // Start with all sources enabled (and keep in sync if source list changes)
  useEffect(() => {
    setSelected(new Set(allSourceIds));
  }, [allSourceIds]);

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

  function toggleSource(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // --- Option C: Dropdown sources ---
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!sourcesOpen) return;
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setSourcesOpen(false);
      }
    }

    function onEsc(e: KeyboardEvent) {
      if (!sourcesOpen) return;
      if (e.key === "Escape") setSourcesOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [sourcesOpen]);

  const selectedCount = selected.size;
  const totalCount = allSourceIds.size;
  const canReset = selectedCount < totalCount;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6 min-h-screen">
      <header className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              F1 News Hub
            </h1>
            <p className="text-sm text-zinc-600">
              Headlines from multiple sources. Always links to the original.
            </p>
          </div>

          <div className="hidden sm:block text-sm text-zinc-500">
            {filtered.length} articles
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
  <input
    className="
      w-full rounded-2xl border bg-white
      pl-9 pr-9 py-2.5 text-sm shadow-sm
      outline-none transition
      focus:border-zinc-400 focus:ring-2 focus:ring-black/10
    "
    placeholder="Search headlines…"
    value={q}
    onChange={(e) => setQ(e.target.value)}
  />

  {/* Search icon */}
  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
    ⌕
  </span>

  {/* Clear button */}
  {q && (
    <button
      type="button"
      onClick={() => setQ("")}
      className="
        absolute right-2 top-1/2 -translate-y-1/2
        rounded-full p-1
        text-zinc-400 hover:text-zinc-700
        hover:bg-zinc-100
        transition
        cursor-pointer
      "
      aria-label="Clear search"
    >
      ✕
    </button>
  )}
</div>


          <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setSourcesOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-2.5 text-sm shadow-sm hover:bg-zinc-50 transition"
                aria-haspopup="menu"
                aria-expanded={sourcesOpen}
              >
                Sources
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                  {selectedCount}/{totalCount}
                </span>
                <span className="text-zinc-400">{sourcesOpen ? "▲" : "▼"}</span>
              </button>

              {sourcesOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-72 rounded-2xl border bg-white shadow-lg overflow-hidden z-10"
                >
                  <div className="p-3 border-b bg-zinc-50">
                    <div className="text-sm font-medium text-zinc-900">
                      Sources
                    </div>
                    <div className="text-xs text-zinc-600">
                      Toggle sources to include/exclude them.
                    </div>
                  </div>

                  <div className="max-h-72 overflow-auto p-2">
                    {sources.map((s) => {
                      const active = selected.has(s.id);
                      return (
                        <label
                          key={s.id}
                          className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-zinc-50 cursor-pointer"
                        >
                          <span className="text-sm text-zinc-800">
                            {s.name}
                          </span>

                          <span
                            className={[
                              "relative inline-flex h-6 w-11 items-center rounded-full transition",
                              active ? "bg-black" : "bg-zinc-200",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "inline-block h-5 w-5 transform rounded-full bg-white transition",
                                active ? "translate-x-5" : "translate-x-1",
                              ].join(" ")}
                            />
                          </span>

                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={active}
                            onChange={() => toggleSource(s.id)}
                          />
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between gap-2 p-3 border-t bg-white">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(new Set(allSourceIds));
                      }}
                      className={[
                        "rounded-xl border px-3 py-2 text-sm transition",
                        canReset
                          ? "bg-white hover:bg-zinc-50"
                          : "bg-zinc-50 text-zinc-400 cursor-not-allowed",
                      ].join(" ")}
                      disabled={!canReset}
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => setSourcesOpen(false)}
                      className="rounded-xl bg-black px-3 py-2 text-sm text-white hover:bg-black/90 transition"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Columns layout (masonry-like) */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5" />
            </div>

            {it.image && (
              <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                <Image
                  src={it.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={(e) => {
                    const wrapper = e.currentTarget.parentElement;
                    if (wrapper) wrapper.style.display = "none";
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />

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
          <p className="text-zinc-600">No results.</p>
        )}
      </section>
    </main>
  );
}
