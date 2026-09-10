"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Feather,
  BookOpen,
  LogOut,
  ArrowLeft,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink
} from "lucide-react";
import { useAdminContext } from "@/lib/adminContext";

export function AdminSidebar({
  user,
  onLogout,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    activeTab,
    myPostsCount,
    selectDraftTab,
    selectMyPostsTab,
  } = useAdminContext();

  const handleSelectDraft = () => {
    selectDraftTab();
    if (pathname !== "/admin") {
      router.push("/admin");
    }
  };

  const handleSelectMyPosts = () => {
    selectMyPostsTab();
    if (pathname !== "/admin") {
      router.push("/admin");
    }
  };

  const isOnAdmin = pathname === "/admin";

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP FIXED MINIMAL SIDEBAR */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col h-full shrink-0 border-r border-border/80 bg-background/50 transition-all duration-300 ease-in-out select-none overflow-hidden ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Author Badge Section */}
        <div className={`p-3.5 border-b border-border/60 shrink-0 ${sidebarCollapsed ? "text-center px-2" : ""}`}>
          {sidebarCollapsed ? (
            <div className="flex justify-center group relative">
              <div
                className="w-9 h-9 bg-amber-800 dark:bg-amber-700 text-white font-serif font-bold text-sm flex items-center justify-center rounded-xs shadow-2xs cursor-pointer"
                title={`${user?.name} (${user?.department || "Author"})`}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-foreground text-background text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md rounded-2xs">
                {user?.name}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-1 py-0.5">
              <div className="w-8 h-8 bg-amber-800 dark:bg-amber-700 text-white flex items-center justify-center font-serif font-bold text-sm shrink-0 rounded-xs shadow-2xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden">
                <div className="font-serif font-bold text-xs truncate text-foreground leading-tight">
                  {user?.name || "Author"}
                </div>
                <div className="text-[10px] font-sans text-muted-foreground uppercase tracking-wider truncate">
                  {user?.department || "Editorial Fellow"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Middle Section */}
        <div className="flex-1 py-4 px-2 space-y-6 overflow-y-auto no-scrollbar">
          {/* Main Actions */}
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <div className="text-[9px] font-sans uppercase tracking-widest font-black text-muted-foreground/70 px-2.5 mb-1.5">
                Workspace
              </div>
            )}

            {/* NEW DISPATCH DRAFT Button */}
            <button
              onClick={handleSelectDraft}
              className={`w-full group relative flex items-center gap-2.5 px-2.5 py-2 text-xs font-sans uppercase font-bold tracking-wider transition-colors rounded-xs cursor-pointer ${
                isOnAdmin && activeTab === "draft"
                  ? "bg-foreground text-background font-black shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
            >
              <Feather className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left text-[11px]">New Draft</span>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-foreground text-background text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md rounded-2xs">
                  New Draft
                </div>
              )}
            </button>

            {/* MY DISPATCHES Button */}
            <button
              onClick={handleSelectMyPosts}
              className={`w-full group relative flex items-center gap-2.5 px-2.5 py-2 text-xs font-sans uppercase font-bold tracking-wider transition-colors rounded-xs cursor-pointer ${
                isOnAdmin && activeTab === "my-posts"
                  ? "bg-foreground text-background font-black shadow-2xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate text-[11px]">My Dispatches</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-2xs ${
                      isOnAdmin && activeTab === "my-posts"
                        ? "bg-background text-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {myPostsCount}
                  </span>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-foreground text-background text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md rounded-2xs">
                  My Dispatches ({myPostsCount})
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-2 border-t border-border/60 space-y-1 bg-background/60 shrink-0">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`group relative w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-sans uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-xs transition-colors cursor-pointer ${
              sidebarCollapsed ? "justify-center px-0" : "justify-between"
            }`}
            title="Toggle Theme"
          >
            <div className="flex items-center gap-2">
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              )}
              {!sidebarCollapsed && <span className="text-[11px]">{theme === "dark" ? "Light" : "Dark"} Mode</span>}
            </div>
            {sidebarCollapsed && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-foreground text-background text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md rounded-2xs">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </div>
            )}
          </button>

          <button
            onClick={onLogout}
            className={`group relative w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-sans uppercase font-bold tracking-wider text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xs transition-colors cursor-pointer ${
              sidebarCollapsed ? "justify-center px-0" : ""
            }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!sidebarCollapsed && <span className="text-[11px]">Sign Out</span>}
            {sidebarCollapsed && (
              <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-red-800 text-white text-[11px] font-sans font-bold uppercase tracking-wider px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-md rounded-2xs">
                Sign Out
              </div>
            )}
          </button>

          {/* Desktop Collapse/Expand Mini Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full pt-1.5 border-t border-border/40 flex items-center justify-center py-1 text-muted-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            ) : (
              <div className="flex items-center gap-1.5 text-[9px] font-sans uppercase font-bold tracking-widest text-muted-foreground hover:text-foreground">
                <PanelLeftClose className="w-3 h-3" />
                <span>Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE RESPONSIVE DRAWER */}
      {/* ========================================================================= */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <aside
            className="fixed inset-y-0 left-0 w-64 bg-background border-r border-border p-4 flex flex-col justify-between shadow-xl z-50 animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-400 border border-amber-300 dark:border-amber-800 rounded-xs flex items-center justify-center">
                    <Feather className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-serif font-bold text-sm text-foreground">
                    VICHAAR DESK
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>

              <div className="my-3 p-2 bg-secondary/40 border border-border/70 rounded-xs flex items-center gap-2.5">
                <div className="w-8 h-8 bg-amber-800 text-white font-serif font-bold text-xs flex items-center justify-center rounded-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="overflow-hidden">
                  <div className="font-serif font-bold text-xs truncate text-foreground">
                    {user?.name}
                  </div>
                  <div className="text-[9px] font-sans uppercase tracking-wider text-muted-foreground truncate">
                    {user?.department || "Author"}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mt-4">
                <button
                  onClick={() => {
                    handleSelectDraft();
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sans uppercase font-bold tracking-wider rounded-xs ${
                    isOnAdmin && activeTab === "draft"
                      ? "bg-foreground text-background font-black"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Feather className="w-3.5 h-3.5" />
                  <span>New Draft</span>
                </button>

                <button
                  onClick={() => {
                    handleSelectMyPosts();
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-sans uppercase font-bold tracking-wider rounded-xs ${
                    isOnAdmin && activeTab === "my-posts"
                      ? "bg-foreground text-background font-black"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>My Dispatches</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-secondary text-muted-foreground rounded-2xs">
                    {myPostsCount}
                  </span>
                </button>

              </div>
            </div>

            <div className="pt-3 border-t border-border space-y-1.5">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-sans uppercase font-bold tracking-wider border border-border/80 rounded-xs text-foreground"
              >
                <span>Theme</span>
                {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-sans uppercase font-bold tracking-wider text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
