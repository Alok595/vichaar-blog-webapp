"use client";

import { Search, X } from "lucide-react";

const CURATED_VOLUMES = [
  "Server Architecture",
  "Philosophy of Craft",
  "State & Flux",
  "Relational Systems",
  "Literary Web",
];

export function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-none border border-border bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 pb-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search the archive of essays, dispatches & ideas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base font-serif focus:outline-none placeholder:text-muted-foreground/70"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-secondary text-muted-foreground cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="pt-4 text-xs font-sans text-muted-foreground">
          <p className="uppercase tracking-widest text-[10px] font-semibold text-foreground/80 mb-2">
            Curated Volumes:
          </p>
          <div className="flex flex-wrap gap-2">
            {CURATED_VOLUMES.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-2.5 py-1 text-xs font-serif bg-secondary hover:bg-foreground hover:text-background transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
