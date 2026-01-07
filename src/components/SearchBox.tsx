import React from "react";

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search headlines…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative flex-1">
      <input
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search headlines"
      />

      {/* Search icon */}
      <span className="search-icon">⌕</span>

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="search-clear-button"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
