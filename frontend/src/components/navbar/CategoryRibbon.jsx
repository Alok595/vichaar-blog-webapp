"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Menu,
  X,
  Bookmark,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { SubcategoryDropdown } from "./SubcategoryDropdown";
import { MobileMenu } from "./MobileMenu";
import { AllSectionsIndex } from "./AllSectionsIndex";

export function CategoryRibbon({
  scrolled,
  sections,
  pathname,
  openDropdown,
  onMouseEnter,
  onMouseLeave,
  onCloseDropdown,
  mobileMenuOpen,
  setMobileMenuOpen,
  expandedMobileCategory,
  setExpandedMobileCategory,
  mounted,
  theme,
  setTheme,
  onOpenSearch,
}) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category");
  const scrollContainerRef = useRef(null);
  const navContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);
  const [indexOpen, setIndexOpen] = useState(false);

  // Check scroll boundary to show/hide scroll arrows
  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  }, []);

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [checkScrollability, sections]);

  const handleScrollClick = (direction) => {
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -240 : 240;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleItemMouseEnter = (e, sectionName) => {
    if (!navContainerRef.current) return;
    const itemRect = e.currentTarget.getBoundingClientRect();
    const navRect = navContainerRef.current.getBoundingClientRect();

    // Center the dropdown under the category button, clamped inside the nav container
    const center = itemRect.left + itemRect.width / 2 - navRect.left;
    const halfDropdownWidth = 260; // 520px / 2
    const clampedLeft = Math.max(
      halfDropdownWidth + 16,
      Math.min(navRect.width - halfDropdownWidth - 16, center)
    );

    setDropdownPos(clampedLeft);
    onMouseEnter(sectionName);
  };

  const activeSection = sections.find((s) => s.name === openDropdown);

  return (
    <>
      <nav
        ref={navContainerRef}
        className={`w-full transition-all duration-300 bg-background border-b-2 border-newspaper-double relative ${
          scrolled
            ? "py-1 border-t border-border shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
            : "py-1.5"
        }`}
      >
        <div className="container mx-auto px-2 sm:px-4 md:px-8 flex items-center justify-between gap-2 relative">
          {/* Desktop Left Scroll Arrow */}
          {canScrollLeft && (
            <div className="hidden sm:flex absolute left-2 md:left-6 z-20 items-center">
              <button
                onClick={() => handleScrollClick("left")}
                className="p-1 rounded-xs bg-background/95 border border-border shadow-xs hover:bg-secondary text-foreground cursor-pointer transition-colors"
                aria-label="Scroll categories left"
                title="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="w-6 h-7 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            </div>
          )}

          {/* Scrollable Category Ribbon */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollability}
            className="hidden sm:flex items-center gap-5 md:gap-7 text-xs uppercase tracking-[0.14em] font-sans font-bold text-foreground/85 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 flex-1"
          >
            {sections.map((section) => {
              const isActive = currentCategory
                ? section.name.toLowerCase() === currentCategory.toLowerCase()
                : pathname === "/" && section.name === "Latest Essays";
              const hasSubs = section.subcategories && section.subcategories.length > 0;
              const isDropdownOpen = openDropdown === section.name;

              return (
                <div
                  key={section.name}
                  className="relative py-1 shrink-0"
                  onMouseEnter={(e) => hasSubs && handleItemMouseEnter(e, section.name)}
                  onMouseLeave={() => hasSubs && onMouseLeave()}
                >
                  <Link
                    href={section.href}
                    className={`transition-colors py-1 inline-flex items-center gap-1.5 whitespace-nowrap relative ${
                      isActive
                        ? `${section.accentColor || "text-red-700 dark:text-red-400"} font-black`
                        : "text-foreground/75 hover:text-foreground"
                    }`}
                  >
                    {section.accentDot && (
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${section.accentDot}`} />
                    )}
                    <span>{section.name}</span>
                    {hasSubs && (
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180 text-foreground" : "opacity-60"
                        }`}
                      />
                    )}
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[2.5px] ${
                          section.activeBar || "bg-foreground"
                        }`}
                      />
                    )}
                    {section.isSpecial && (
                      <span className="ml-1 text-[9px] font-sans px-1.5 py-0.5 rounded-xs bg-amber-600 text-white font-extrabold uppercase tracking-wider">
                        Author
                      </span>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Desktop Right Scroll Arrow & All Sections Directory Button */}
          <div className="hidden sm:flex items-center gap-1 shrink-0 pl-1">
            {canScrollRight && (
              <div className="flex items-center">
                <div className="w-6 h-7 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                <button
                  onClick={() => handleScrollClick("right")}
                  className="p-1 rounded-xs bg-background/95 border border-border shadow-xs hover:bg-secondary text-foreground cursor-pointer transition-colors"
                  aria-label="Scroll categories right"
                  title="Scroll right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Pinned "All Sections" Gazette Directory Button */}
            <button
              onClick={() => setIndexOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-sans font-bold uppercase tracking-wider bg-secondary/70 hover:bg-foreground hover:text-background border border-border/90 rounded-xs transition-colors cursor-pointer text-foreground/90 shrink-0 ml-1"
              title="Browse all newspaper sections & departments"
            >
              <LayoutGrid className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>All Sections</span>
            </button>
          </div>

          {/* Mobile View Header when unscrolled */}
          {!scrolled && (
            <div className="sm:hidden flex items-center justify-between w-full px-1 py-0.5">
              <button
                onClick={() => setIndexOpen(true)}
                className="flex items-center gap-1.5 text-[11px] uppercase font-sans tracking-wider font-bold text-foreground hover:text-amber-800 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-600" />
                <span>Sections &bull; विभाग</span>
              </button>
              
              <div className="flex items-center gap-2">
                <Link
                  href="/saved"
                  className="flex items-center gap-1 text-[11px] font-sans font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 hover:opacity-80 p-1 transition-colors"
                  title="Reading Ledger"
                >
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500/20" />
                  <span>Ledger</span>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 rounded-xs hover:bg-secondary text-foreground cursor-pointer transition-colors"
                  aria-label="Open menu"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Broadsheet Section Dropdown (Positioned outside overflow-x container to prevent clipping) */}
        {activeSection && activeSection.subcategories?.length > 0 && dropdownPos !== null && (
          <div
            className="hidden sm:block absolute top-full z-50 transition-all duration-150 -mt-1"
            style={{
              left: `${dropdownPos}px`,
              transform: "translateX(-50%)",
            }}
            onMouseEnter={() => onMouseEnter(activeSection.name)}
            onMouseLeave={onMouseLeave}
          >
            <SubcategoryDropdown
              section={activeSection}
              onClose={onCloseDropdown}
            />
          </div>
        )}

        {/* Mobile Menu Drawer */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          sections={sections}
          expandedCategory={expandedMobileCategory}
          onToggleCategory={(name) =>
            setExpandedMobileCategory(expandedMobileCategory === name ? null : name)
          }
          onClose={() => setMobileMenuOpen(false)}
          onOpenSearch={onOpenSearch}
          onOpenIndex={() => setIndexOpen(true)}
          mounted={mounted}
          theme={theme}
          setTheme={setTheme}
        />
      </nav>

      {/* Comprehensive All-Sections Broadsheet Directory Modal */}
      <AllSectionsIndex
        isOpen={indexOpen}
        onClose={() => setIndexOpen(false)}
        sections={sections}
      />
    </>
  );
}
