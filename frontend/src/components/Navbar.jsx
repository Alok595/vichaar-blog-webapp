"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback, useSyncExternalStore, Suspense } from "react";
import {
  NAV_SECTIONS,
  DispatchBar,
  Masthead,
  CompactNav,
  CategoryRibbon,
  SearchModal,
} from "./navbar";
import { API_BASE_URL } from "@/lib/api";

const emptySubscribe = () => () => {};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Hysteresis deadzone: activates when scrolled past 200px, deactivates when back above 130px
      // This mathematically eliminates 100% of shaking / layout oscillations
      setScrolled((prev) => {
        if (!prev && scrollY > 200) return true;
        if (prev && scrollY < 130) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = (name) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const [navSections, setNavSections] = useState(NAV_SECTIONS);

  // Sync custom departments & subcategories from localStorage & backend posts
  useEffect(() => {
    const loadDynamicCategories = async () => {
      try {
        let customCategories = [];
        let customSubsMap = {};

        // 1. From localStorage
        const savedDeps = localStorage.getItem("vichaar_custom_departments");
        if (savedDeps) {
          const parsed = JSON.parse(savedDeps);
          if (Array.isArray(parsed)) {
            customCategories.push(...parsed);
          }
        }

        const savedSubs = localStorage.getItem("vichaar_custom_subcategories");
        if (savedSubs) {
          const parsed = JSON.parse(savedSubs);
          if (parsed && typeof parsed === "object") {
            customSubsMap = { ...parsed };
          }
        }

        // 2. From backend API posts
        try {
          const res = await fetch(`${API_BASE_URL}/posts`);
          if (res.ok) {
            const data = await res.json();
            if (data?.posts) {
              data.posts.forEach((p) => {
                if (p.category) {
                  customCategories.push(p.category);
                  if (p.subcategory) {
                    if (!customSubsMap[p.category]) customSubsMap[p.category] = [];
                    const exists = customSubsMap[p.category].some(
                      (s) => s.name.toLowerCase() === p.subcategory.toLowerCase()
                    );
                    if (!exists) {
                      customSubsMap[p.category].push({
                        name: p.subcategory,
                        desc: p.subcategoryDesc || `Specialized inquiries under ${p.category}`,
                      });
                    }
                  }
                }
              });
            }
          }
        } catch (e) {
          // Backend offline or local fallback
        }

        const defaultNames = NAV_SECTIONS.map((s) => s.name.toLowerCase());
        const uniqueCustom = Array.from(
          new Set(
            customCategories
              .map((c) => c.trim())
              .filter((c) => c && !defaultNames.includes(c.toLowerCase()))
          )
        );

        // Merge custom subcategories into default sections as well
        const updatedBase = NAV_SECTIONS.map((sec) => {
          const extraSubs = customSubsMap[sec.name] || [];
          if (extraSubs.length > 0) {
            const existingSubNames = (sec.subcategories || []).map((s) => s.name.toLowerCase());
            const newSubsToAppend = extraSubs
              .filter((es) => !existingSubNames.includes(es.name.toLowerCase()))
              .map((es) => ({
                name: es.name,
                desc: es.desc || `Specialized inquiry in ${sec.name}`,
                href: `/?category=${encodeURIComponent(sec.name)}&subcategory=${encodeURIComponent(es.name)}`,
              }));

            return {
              ...sec,
              subcategories: [...(sec.subcategories || []), ...newSubsToAppend],
            };
          }
          return sec;
        });

        if (uniqueCustom.length > 0) {
          const customSections = uniqueCustom.map((catName) => {
            const subs = (customSubsMap[catName] || []).map((s) => ({
              name: s.name,
              desc: s.desc || `Specialized topic under ${catName}`,
              href: `/?category=${encodeURIComponent(catName)}&subcategory=${encodeURIComponent(s.name)}`,
            }));

            return {
              name: catName,
              href: `/?category=${encodeURIComponent(catName)}`,
              accentColor: "text-amber-800 dark:text-amber-400",
              activeBar: "bg-amber-800 dark:bg-amber-400",
              topBorder: "border-t-4 border-t-amber-800 dark:border-t-amber-500",
              tagColor: "bg-amber-800 dark:bg-amber-900 text-white",
              isCustom: true,
              subcategories: subs.length > 0 ? subs : undefined,
            };
          });

          // Insert custom sections before "About the Journal" & "Author Desk"
          const base = updatedBase.filter(
            (s) => s.name !== "About the Journal" && s.name !== "Author Desk"
          );
          const tail = updatedBase.filter(
            (s) => s.name === "About the Journal" || s.name === "Author Desk"
          );
          setNavSections([...base, ...customSections, ...tail]);
        } else {
          setNavSections(updatedBase);
        }
      } catch (err) {
        console.warn("Could not load custom nav categories:", err);
      }
    };

    loadDynamicCategories();
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/login") {
    return null;
  }

  return (
    <>
      {/* 1. Static Grand Broadsheet Masthead (Visible when at top of page) */}
      <div className="w-full bg-background border-b border-border/70">
        <DispatchBar
          mounted={mounted}
          theme={theme}
          setTheme={setTheme}
          onOpenSearch={() => setSearchOpen(true)}
        />
        <Masthead />
      </div>

      {/* 2. Sticky Navigation Suite: Compact Nav on top + Category Ribbon underneath */}
      <header className="sticky top-0 z-50 w-full bg-background transition-all duration-300">
        <CompactNav
          scrolled={scrolled}
          mounted={mounted}
          theme={theme}
          setTheme={setTheme}
          onOpenSearch={() => setSearchOpen(true)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <Suspense fallback={<div className="h-8 bg-background border-b-2 border-newspaper-double" />}>
          <CategoryRibbon
            scrolled={scrolled}
            sections={navSections}
            pathname={pathname}
            openDropdown={openDropdown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onCloseDropdown={() => setOpenDropdown(null)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            expandedMobileCategory={expandedMobileCategory}
            setExpandedMobileCategory={setExpandedMobileCategory}
            mounted={mounted}
            theme={theme}
            setTheme={setTheme}
            onOpenSearch={() => setSearchOpen(true)}
          />
        </Suspense>
      </header>

      {/* 3. Literary Search Overlay Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </>
  );
}
