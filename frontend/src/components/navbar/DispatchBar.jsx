"use client";

import Link from "next/link";
import { Search, PenLine, Sun, Moon, Bookmark, Maximize2, Minimize2 } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";

export function DispatchBar({
  mounted,
  theme,
  setTheme,
  onOpenSearch,
  isFullscreen,
  toggleFullscreen,
}) {
  const { user, isAuthenticated } = useAuthStore();
  return (
    <div className="bg-[#0e2137] dark:bg-[#091422] text-stone-100 text-[11px] font-sans uppercase tracking-wider py-2 px-4 md:px-8 border-b-2 border-red-700">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Dateline */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-stone-200">
            {mounted
              ? new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Wednesday, September 9, 2026"}
          </span>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onOpenSearch}
            className="hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer text-stone-200"
            title="Search the journal"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {mounted && isAuthenticated && (
            <Link
              href="/saved"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-amber-200"
              title="View your saved dispatches"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-300/30 text-amber-300" />
              <span className="hidden sm:inline">Reading Ledger</span>
            </Link>
          )}

          <Link
            href={mounted && isAuthenticated ? "/admin" : "/login"}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>
              {mounted && isAuthenticated && user
                ? `Author Desk (${user.name.split(" ")[0]})`
                : "Submit Essay"}
            </span>
          </Link>

          {/* Fullscreen Zen Reader Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-stone-200 hidden sm:flex items-center gap-1"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Reading Mode"}
            aria-label="Toggle fullscreen mode"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-amber-300" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-stone-200" />
            )}
            <span className="text-[10px] hidden md:inline">
              {isFullscreen ? "Exit Full" : "Full Screen"}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer text-stone-200"
            aria-label="Toggle edition theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-stone-200" />
              )
            ) : (
              <div className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
