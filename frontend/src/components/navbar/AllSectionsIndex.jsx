"use client";

import Link from "next/link";
import { X, Search } from "lucide-react";
import { useState } from "react";

export function AllSectionsIndex({ isOpen, onClose, sections }) {
  const [filterQuery, setFilterQuery] = useState("");

  if (!isOpen) return null;

  const filteredSections = sections.filter((s) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    const matchesName = s.name.toLowerCase().includes(q);
    const matchesSubs = s.subcategories?.some(
      (sub) => sub.name.toLowerCase().includes(q) || sub.desc.toLowerCase().includes(q)
    );
    return matchesName || matchesSubs;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-none border-2 border-foreground/90 bg-background p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(28,24,21,0.9)] dark:shadow-[8px_8px_0px_0px_rgba(237,231,220,0.2)] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Broadsheet Index Masthead Header */}
        <div className="flex items-center justify-between border-b-2 border-newspaper-double pb-4 mb-5 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-xl md:text-2xl tracking-wider text-foreground">
                VICHAAR GAZETTE DIRECTORY
              </span>
              <span className="text-[10px] font-sans uppercase font-extrabold px-1.5 py-0.5 bg-amber-700 text-white rounded-xs">
                समग्र अनुक्रमणिका
              </span>
            </div>
            <p className="text-xs font-serif italic text-muted-foreground mt-0.5">
              Complete index of departments, editorial inquiries, and syndicated archives.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary border border-border text-foreground cursor-pointer transition-colors"
            aria-label="Close directory"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search filter within directory */}
        <div className="mb-6 flex items-center gap-2.5 pb-2 border-b border-border/80 shrink-0">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter sections and inquiries by keyword..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-serif focus:outline-none placeholder:text-muted-foreground/70"
            autoFocus
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery("")}
              className="text-xs font-sans text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Newspaper Multi-Column Directory Grid */}
        <div className="overflow-y-auto pr-2 divide-y md:divide-y-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredSections.map((section, idx) => {
            const hasSubs = section.subcategories && section.subcategories.length > 0;

            return (
              <div
                key={section.name}
                className="space-y-2.5 pt-4 md:pt-0 border-t md:border-t-0 md:border-r md:last:border-r-0 border-border/60 md:pr-4"
              >
                {/* Section Title Heading */}
                <div className="flex items-center justify-between pb-1.5 border-b border-foreground/30">
                  <Link
                    href={section.href}
                    onClick={onClose}
                    className="font-serif font-bold text-base text-foreground hover:text-amber-800 dark:hover:text-amber-300 transition-colors flex items-center gap-2"
                  >
                    <span className="font-sans text-[11px] font-black opacity-60">
                      §{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span>{section.name}</span>
                  </Link>

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
                </div>

                {/* Subcategories list */}
                {hasSubs ? (
                  <ul className="space-y-2">
                    {section.subcategories.map((sub) => (
                      <li key={sub.name}>
                        <Link
                          href={sub.href}
                          onClick={onClose}
                          className="group block"
                        >
                          <div className="text-xs font-serif font-semibold text-foreground/90 group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                            &bull; {sub.name}
                          </div>
                          <p className="text-[11px] font-serif text-muted-foreground pl-3 line-clamp-2 leading-relaxed">
                            {sub.desc}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] font-serif italic text-muted-foreground">
                    General department & direct editorial archives.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footnote Colophon */}
        <div className="border-t-2 border-border/80 pt-3 mt-4 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-muted-foreground shrink-0">
          <span>The Vichaar Publishing Syndicate</span>
          <span className="font-serif italic normal-case text-foreground/85">
            Vol. IV &bull; Index of Daily Folios
          </span>
        </div>
      </div>
    </div>
  );
}
