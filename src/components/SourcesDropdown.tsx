import React, { useEffect, useRef, useState } from "react";

type Source = { id: string; name: string };

export default function SourcesDropdown({
  sources,
  selected,
  onToggleSource,
  onReset,
}: {
  sources: Source[];
  selected: Set<string>;
  onToggleSource: (id: string) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (ref.current && !ref.current.contains(target)) setOpen(false);
    }

    function onEsc(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const selectedCount = selected.size;
  const totalCount = sources.length;
  const canReset = selectedCount < totalCount;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="sources-button"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        Sources
        <span className="sources-badge">{selectedCount}/{totalCount}</span>
        <span className="sources-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-72 rounded-2xl border bg-white shadow-lg overflow-hidden z-10">
          <div className="p-3 border-b bg-zinc-50">
            <div className="dropdown-title">Sources</div>
            <div className="dropdown-desc">Toggle sources to include/exclude them.</div>
          </div>

          <div className="max-h-72 overflow-auto p-2">
            {sources.map((s) => {
              const active = selected.has(s.id);
              return (
                <label key={s.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-zinc-50 cursor-pointer">
                  <span className="source-name">{s.name}</span>

                  <span className={["relative inline-flex h-6 w-11 items-center rounded-full transition", active ? "bg-black" : "bg-zinc-200"].join(" ")}>
                    <span className={["inline-block h-5 w-5 transform rounded-full bg-white transition", active ? "translate-x-5" : "translate-x-1"].join(" ")}/>
                  </span>

                  <input type="checkbox" className="sr-only" checked={active} onChange={() => onToggleSource(s.id)} />
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 p-3 border-t bg-white">
            <button
              type="button"
              onClick={onReset}
              className={["rounded-xl border px-3 py-2 text-sm transition", canReset ? "bg-white hover:bg-zinc-50" : "bg-zinc-50 text-zinc-400 cursor-not-allowed"].join(" ")}
              disabled={!canReset}
            >
              Reset
            </button>

            <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-black px-3 py-2 text-sm text-white hover:bg-black/90 transition">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
