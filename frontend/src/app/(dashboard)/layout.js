"use client";

import { useAuthStore } from "@/lib/authStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminProvider } from "@/lib/adminContext";

export default function DashboardLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load saved sidebar preference from localStorage
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("vichaar_admin_sidebar_collapsed");
      if (saved !== null) {
        setSidebarCollapsed(saved === "true");
      }
    } catch (e) {
      console.warn("Could not read sidebar preference:", e);
    }
  }, []);

  const handleToggleSidebar = (value) => {
    setSidebarCollapsed(value);
    try {
      localStorage.setItem("vichaar_admin_sidebar_collapsed", String(value));
    } catch (e) {
      console.warn("Could not persist sidebar preference:", e);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <div className="font-serif italic text-muted-foreground animate-pulse">
          Opening Author Bureau Desk...
        </div>
      </div>
    );
  }

  // If not logged in, render children directly (which displays login gate)
  if (!isAuthenticated || !user) {
    return <main className="flex-1 min-h-screen">{children}</main>;
  }

  return (
    <AdminProvider>
      <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden selection:bg-amber-200 selection:text-stone-900 dark:selection:bg-stone-800 dark:selection:text-amber-100">
        {/* 1. Full-Width Fixed Top Navbar */}
        <AdminNavbar
          user={user}
          onLogout={handleLogout}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={handleToggleSidebar}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* 2. Workspace Area: Fixed Sidebar + Scrollable Right Content */}
        <div className="flex flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Fixed Collapsible Sidebar */}
          <AdminSidebar
            user={user}
            onLogout={handleLogout}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={handleToggleSidebar}
            mobileSidebarOpen={mobileSidebarOpen}
            setMobileSidebarOpen={setMobileSidebarOpen}
          />

          {/* ONLY Right-side scrollable main viewport */}
          <main className="flex-1 h-full min-w-0 overflow-y-auto bg-background/60">
            <div className="w-full pb-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
