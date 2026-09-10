"use client";

import Link from "next/link";
import { Search, PenLine, Sun, Moon, Menu, X, Bookmark } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";

export function CompactNav({
  scrolled,
  mounted,
  theme,
  setTheme,
  onOpenSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  isFullscreen,
  toggleFullscreen,
}) {
  const { user, isAuthenticated } = useAuthStore();
  return (
    <div
      className={`w-full bg-background border-b border-border transition-all duration-300 overflow-hidden ${
        scrolled
          ? "max-h-12 opacity-100 py-1.5"
          : "max-h-0 opacity-0 py-0 border-b-0 pointer-events-none"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Left: Compact Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-serif font-bold text-lg md:text-xl tracking-wider text-foreground">
            VICHAAR
          </span>
          <span className="text-[9px] uppercase font-sans font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/40">
            विचार
          </span>
        </Link>

        {/* Right: Quick Utility Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenSearch}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Search the archives"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {mounted && isAuthenticated && (
            <Link
              href="/saved"
              className="p-1.5 rounded hover:bg-secondary text-amber-800 dark:text-amber-300 hover:text-foreground transition-colors cursor-pointer"
              title="Reading Ledger (Saved Posts)"
            >
              <Bookmark className="w-3.5 h-3.5 fill-amber-500/20" />
            </Link>
          )}

          <Link
            href={mounted && isAuthenticated ? "/admin" : "/login"}
            className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-wider font-sans font-bold text-foreground hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
          >
            <PenLine className="w-3 h-3 text-amber-800 dark:text-amber-400" />
            <span>{mounted && isAuthenticated && user ? `Desk` : "Write"}</span>
          </Link>



          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle edition theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-stone-700" />
              )
            ) : (
              <div className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1 text-foreground cursor-pointer"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
