"use client";
type Source = { id: string; name: string };

export default function Sidebar({
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
  const selectedCount = selected.size;
  const totalCount = sources.length;
  const canReset = selectedCount < totalCount;

  return (
    <div className="">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Sources</h3>
          <button
            type="button"
            onClick={onReset}
            disabled={!canReset}
            className={["text-sm px-2 py-1 rounded-xl transition", canReset ? "hover:bg-zinc-50" : "text-zinc-400 pointer-events-none"].join(" ")}
          >
            Reset
          </button>
        </div>

        <div className="text-xs text-zinc-500 mb-3">{selectedCount}/{totalCount} selected</div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto">
          {sources.map((s) => {
            const active = selected.has(s.id);
            return (
              <label key={s.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 hover:bg-zinc-50 cursor-pointer">
                <span className="source-name text-sm">{s.name}</span>

                <span className={["relative inline-flex h-6 w-11 items-center rounded-full transition", active ? "bg-black" : "bg-zinc-200"].join(" ")}>
                  <span className={["inline-block h-5 w-5 transform rounded-full bg-white transition", active ? "translate-x-5" : "translate-x-1"].join(" ")} />
                </span>

                <input type="checkbox" className="sr-only" checked={active} onChange={() => onToggleSource(s.id)} />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
