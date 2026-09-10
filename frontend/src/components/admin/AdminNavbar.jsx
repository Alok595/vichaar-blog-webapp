"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Feather,
  Menu,
  X,
  Sun,
  Moon,
  ExternalLink,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight
} from "lucide-react";

export function AdminNavbar({
  user,
  onLogout,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const { theme, setTheme } = useTheme();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-14 bg-background/95 backdrop-blur-md border-b border-border/80 sticky top-0 z-40 shrink-0">
      <div className="w-full h-full px-4 md:px-6 flex items-center justify-between">
        {/* LEFT: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mobile drawer toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/70 rounded-xs transition-colors"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Desktop sidebar toggle button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/70 rounded-xs transition-colors group"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          <div className="hidden sm:block h-4 w-[1px] bg-border/80" />

          {/* Clean Brand Logo */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 select-none group"
          >
            <div className="w-7 h-7 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-400 border border-amber-300 dark:border-amber-800 rounded-xs flex items-center justify-center shadow-2xs">
              <Feather className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-black tracking-tight text-base text-foreground">
                VICHAAR
              </span>
              <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
                Desk
              </span>
            </div>
          </Link>
        </div>

        {/* RIGHT: View Site + Theme Toggle + User Profile */}
        <div className="flex items-center gap-2">
          {/* Public Site Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-sans uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border/80 rounded-xs transition-colors"
            title="Preview Live Broadsheet"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border/80 rounded-xs transition-colors"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          <div className="h-4 w-[1px] bg-border/80 mx-1 hidden sm:block" />

          {/* User Profile Menu */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-secondary border border-transparent hover:border-border/80 rounded-xs transition-all select-none"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-7 h-7 bg-amber-800 dark:bg-amber-700 text-white font-serif font-bold text-xs flex items-center justify-center rounded-xs shadow-2xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-serif font-bold text-xs text-foreground truncate max-w-[110px] leading-tight">
                    {user.name}
                  </span>
                </div>

                <ChevronDown
                  className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Minimal Dropdown Panel */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 rounded-xs">
                  <div className="px-3.5 py-2 border-b border-border/80 bg-secondary/20">
                    <div className="font-serif font-bold text-xs text-foreground truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] font-sans text-muted-foreground truncate uppercase tracking-wider">
                      {user.department || "Editorial Fellow"}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-3.5 py-1.5 text-xs font-sans uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <span>Public Broadsheet</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-border/80">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3.5 py-1.5 text-xs font-sans uppercase font-bold tracking-wider text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
