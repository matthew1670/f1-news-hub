"use client";

import SearchBox from "./SearchBox";
import SourcesDropdown from "./SourcesDropdown";

export default function Header({
  query,
  setQuery,
  sources,
  selected,
  toggleSource,
  reset,
}: {
  query: string;
  setQuery: (v: string) => void;
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
        <SearchBox value={query} onChange={setQuery} />

        <div className="lg:hidden flex items-center gap-2 sm:width-full justify-end">
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
