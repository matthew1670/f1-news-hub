"use client";

import SearchBox from "./SearchBox";
import SourcesDropdown from "./SourcesDropdown";

export default function Header({
  q,
  setQ,
  sources,
  selected,
  toggleSource,
  reset,
}: {
  q: string;
  setQ: (v: string) => void;
  sources: { id: string; name: string }[];
  selected: Set<string>;
  toggleSource: (id: string) => void;
  reset: () => void;
}) {
  return (
    <header className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="page-title">F1 News Hub</h1>
          <p className="page-subtitle">Headlines from multiple sources. Always links to the original.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBox value={q} onChange={setQ} />

        <div className="lg:hidden flex items-center gap-2">
          <SourcesDropdown
            sources={sources}
            selected={selected}
            onToggleSource={toggleSource}
            onReset={reset}
          />
        </div>
      </div>
    </header>
  );
}
