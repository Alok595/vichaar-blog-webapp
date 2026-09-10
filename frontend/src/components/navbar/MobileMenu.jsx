"use client";

import Link from "next/link";
import {
  BookOpen,
  ChevronDown,
  Bookmark,
  Search,
  PenLine,
  Sun,
  Moon,
  LayoutGrid,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";

export function MobileMenu({
  isOpen,
  sections,
  expandedCategory,
  onToggleCategory,
  onClose,
  onOpenSearch,
  onOpenIndex,
  mounted,
  theme,
  setTheme,
}) {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div className="sm:hidden border-t-2 border-newspaper-double bg-background/98 backdrop-blur-lg px-4 py-5 animate-in fade-in duration-200 max-h-[80vh] overflow-y-auto shadow-2xl">
      {/* 1. User Status & Quick Action Bar */}
      <div className="mb-4 pb-4 border-b border-border/80">
        {mounted && isAuthenticated && user ? (
          <div className="flex items-center justify-between bg-secondary/70 p-3 rounded-xs border border-border mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-white flex items-center justify-center font-serif font-bold text-xs shrink-0">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-serif font-bold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-[10px] font-sans text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="mb-3">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-secondary hover:bg-secondary/80 border border-border rounded-xs text-xs font-sans uppercase font-bold tracking-wider text-foreground transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Sign In &bull; प्रवेश करें</span>
            </Link>
          </div>
        )}

        {/* Primary Action Buttons (Saved Posts, Author Desk, Search, Theme) */}
        <div className="grid grid-cols-2 gap-2">
          {/* Saved Posts Link */}
          <Link
            href={mounted && isAuthenticated ? "/saved" : "/login"}
            onClick={onClose}
            className="flex items-center gap-2 p-2.5 rounded-xs bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/50 text-amber-900 dark:text-amber-200 transition-colors"
          >
            <Bookmark className="w-4 h-4 fill-amber-600/30 text-amber-700 dark:text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="block text-[11px] font-sans font-bold uppercase tracking-wider leading-none">
                Saved Posts
              </span>
              <span className="block text-[9px] font-serif italic text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                सहेजे गए लेख
              </span>
            </div>
          </Link>

          {/* Author Desk / Submit */}
          <Link
            href={mounted && isAuthenticated ? "/admin" : "/login"}
            onClick={onClose}
            className="flex items-center gap-2 p-2.5 rounded-xs bg-secondary/80 border border-border hover:bg-secondary text-foreground transition-colors"
          >
            <PenLine className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <div className="text-left">
              <span className="block text-[11px] font-sans font-bold uppercase tracking-wider leading-none">
                {mounted && isAuthenticated ? "Author Desk" : "Submit Essay"}
              </span>
              <span className="block text-[9px] font-serif italic text-muted-foreground mt-0.5">
                लेखक कक्ष
              </span>
            </div>
          </Link>

          {/* Search Trigger */}
          <button
            onClick={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            className="flex items-center gap-2 p-2.5 rounded-xs bg-secondary/80 border border-border hover:bg-secondary text-foreground transition-colors text-left cursor-pointer"
          >
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <span className="block text-[11px] font-sans font-bold uppercase tracking-wider leading-none">
                Search
              </span>
              <span className="block text-[9px] font-serif italic text-muted-foreground mt-0.5">
                खोजें
              </span>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme && setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-2 p-2.5 rounded-xs bg-secondary/80 border border-border hover:bg-secondary text-foreground transition-colors text-left cursor-pointer"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700 dark:text-stone-300 shrink-0" />
            )}
            <div>
              <span className="block text-[11px] font-sans font-bold uppercase tracking-wider leading-none">
                {mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
              <span className="block text-[9px] font-serif italic text-muted-foreground mt-0.5">
                संस्करण थीम
              </span>
            </div>
          </button>
        </div>

        {/* All Sections Index Trigger */}
        {onOpenIndex && (
          <button
            onClick={() => {
              onClose();
              onOpenIndex();
            }}
            className="w-full mt-2 flex items-center justify-between p-2 rounded-xs bg-background border border-border/90 hover:bg-secondary text-foreground transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider">
                All Sections Directory
              </span>
            </div>
            <span className="text-[10px] font-sans text-muted-foreground">
              समग्र अनुक्रमणिका &rarr;
            </span>
          </button>
        )}
      </div>

      {/* 2. Departments & Editorial Categories */}
      <div className="mb-2">
        <div className="text-[10px] font-sans uppercase tracking-[0.2em] font-extrabold text-muted-foreground mb-2">
          Departments &amp; Folios &bull; विभाग
        </div>
        <nav className="flex flex-col gap-1 font-serif">
          {sections.map((section) => {
            const hasSubs = section.subcategories && section.subcategories.length > 0;
            const isExpanded = expandedCategory === section.name;

            return (
              <div key={section.name} className="border-b border-border/40 pb-1.5 last:border-b-0">
                <div className="flex items-center justify-between py-1.5">
                  <Link
                    href={section.href}
                    onClick={() => !hasSubs && onClose()}
                    className="text-sm text-foreground/90 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-2 font-bold tracking-tight"
                  >
                    <span>{section.name}</span>
                    {section.isSpecial && (
                      <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-xs bg-amber-600 text-white font-extrabold uppercase tracking-wider">
                        Author
                      </span>
                    )}
                    {section.isCustom && (
                      <span className="text-[9px] font-sans px-1.5 py-0.5 rounded-xs bg-amber-800 dark:bg-amber-700 text-white font-extrabold uppercase tracking-wider">
                        Custom
                      </span>
                    )}
                  </Link>

                  {hasSubs ? (
                    <button
                      onClick={() => onToggleCategory(section.name)}
                      className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label={`Toggle ${section.name} subcategories`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 opacity-40 text-muted-foreground" />
                  )}
                </div>

                {/* Mobile Subcategory Accordion Items */}
                {hasSubs && isExpanded && (
                  <div className="pl-3 pt-1 pb-1.5 space-y-1.5 border-l-2 border-amber-800/40 dark:border-amber-500/40 ml-1 bg-secondary/30 rounded-r-xs">
                    {section.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={onClose}
                        className="block py-1 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xs transition-colors"
                      >
                        <span className="font-semibold text-foreground block">
                          &bull; {sub.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground block line-clamp-1">
                          {sub.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

