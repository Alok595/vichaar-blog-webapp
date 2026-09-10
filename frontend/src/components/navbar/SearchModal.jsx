"use client";

import { Search, X, Loader2, ArrowRight, BookOpen, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

const CURATED_VOLUMES = [
  "Architecture",
  "Engineering",
  "Design Craft",
  "Tailwind",
  "Next.js",
  "Zustand",
  "Prisma",
  "Frontend",
];

export function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
}) {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setResults([]);
      setHasSearched(false);
      return;
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!isOpen) return;

    const trimmed = (searchQuery || "").trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts?search=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.posts)) {
            setResults(data.posts.slice(0, 6));
          } else {
            setResults([]);
          }
        }
      } catch (err) {
        console.warn("Live search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = (searchQuery || "").trim();
    if (!trimmed) return;
    onClose();
    router.push(`/?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectPost = (postId) => {
    onClose();
    router.push(`/post/${postId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-none border-2 border-foreground/80 dark:border-border bg-background p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(28,24,21,0.85)] dark:shadow-[8px_8px_0px_0px_rgba(237,231,220,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 pb-3.5 border-b-2 border-foreground/80 dark:border-border">
          {loading ? (
            <Loader2 className="h-5 w-5 text-amber-700 dark:text-amber-400 animate-spin shrink-0" />
          ) : (
            <Search className="h-5 w-5 text-foreground/80 shrink-0" />
          )}
          <input
            type="text"
            placeholder="Search the journal for essays, dispatches & topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base md:text-lg font-serif focus:outline-none placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs uppercase font-sans font-bold text-muted-foreground hover:text-foreground px-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        {/* Live Search Results */}
        {hasSearched && (
          <div className="py-4 border-b border-border/70 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-muted-foreground mb-3">
              <span>Matching Dispatches ({results.length})</span>
              {results.length > 0 && (
                <button
                  onClick={handleSubmit}
                  className="text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Filter Front Page &rarr;</span>
                </button>
              )}
            </div>

            {results.length > 0 ? (
              <div className="space-y-2.5">
                {results.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post.id)}
                    className="p-3 border border-border bg-secondary/30 hover:bg-secondary/80 transition-colors cursor-pointer text-left group flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
                        <span className="font-bold text-amber-800 dark:text-amber-400">
                          {post.category || "Engineering"}
                        </span>
                        <span>&bull;</span>
                        <span>{post.authorName || post.author?.name || "Staff Fellow"}</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm md:text-base text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300 leading-snug">
                        {post.title}
                      </h4>
                      {post.subtitle && (
                        <p className="font-serif text-xs text-muted-foreground line-clamp-1 italic">
                          {post.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 pt-1">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <div className="py-8 text-center text-muted-foreground font-serif">
                <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No dispatches found matching &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs font-sans text-muted-foreground/80 mt-1">
                  Try searching for keywords like &ldquo;Next.js&rdquo;, &ldquo;Architecture&rdquo;, or &ldquo;Tailwind&rdquo;.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Curated Volumes / Tags */}
        <div className="pt-4 text-xs font-sans text-muted-foreground">
          <p className="uppercase tracking-widest text-[10px] font-bold text-foreground/80 mb-2">
            Curated Subjects & Archives:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CURATED_VOLUMES.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className={`px-2.5 py-1 text-xs font-serif border border-border/80 transition-colors cursor-pointer ${
                  searchQuery.toLowerCase() === tag.toLowerCase()
                    ? "bg-foreground text-background font-bold"
                    : "bg-secondary/50 hover:bg-foreground hover:text-background"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        {searchQuery.trim() && (
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-sans">
            <span className="text-muted-foreground text-[11px]">
              Press <kbd className="px-1.5 py-0.5 border border-border bg-secondary font-mono text-[10px]">Enter ↵</kbd> to view full results
            </span>
            <button
              onClick={handleSubmit}
              className="px-3.5 py-1.5 bg-foreground text-background hover:bg-amber-800 hover:text-white font-bold uppercase tracking-wider text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search Archives</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
