import Link from "next/link";

export function SubcategoryDropdown({ section, onClose }) {
  if (!section.subcategories || section.subcategories.length === 0) return null;

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      <div
        className={`w-[420px] md:w-[520px] rounded-none border-2 border-foreground/80 ${
          section.topBorder || "border-t-4 border-t-foreground"
        } dark:border-border bg-background p-5 shadow-[4px_4px_0px_0px_rgba(28,24,21,0.9)] dark:shadow-[4px_4px_0px_0px_rgba(237,231,220,0.2)] text-left`}
      >
        {/* Broadsheet Section Header */}
        <div className="flex items-center justify-between pb-2 border-b-2 border-foreground/80 dark:border-border mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-extrabold uppercase tracking-widest text-foreground">
              Sec. II &bull; {section.name}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 font-sans font-bold uppercase tracking-wider rounded-xs ${
                section.tagColor || "bg-foreground text-background"
              }`}
            >
              Dispatch
            </span>
          </div>
          <span className="font-serif italic text-xs text-muted-foreground">
            Index of Inquiries
          </span>
        </div>

        {/* Sub-departments List with Newspaper Column Styling */}
        <div className="divide-y divide-border/70">
          {section.subcategories.map((sub, index) => (
            <Link
              key={sub.name}
              href={sub.href}
              onClick={onClose}
              className="block group/item py-2.5 px-2 -mx-2 hover:bg-secondary/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`font-sans text-[11px] font-black transition-colors pt-0.5 ${
                      section.accentColor || "text-foreground"
                    }`}
                  >
                    &sect;0{index + 1}
                  </span>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-foreground group-hover/item:text-amber-900 dark:group-hover/item:text-amber-300 transition-colors normal-case leading-snug">
                      {sub.name}
                    </h4>
                    <p className="text-[11px] font-serif text-muted-foreground leading-relaxed mt-0.5 normal-case">
                      {sub.desc}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-sans uppercase font-bold text-muted-foreground/60 group-hover/item:text-foreground transition-colors shrink-0 pt-0.5 flex items-center gap-0.5">
                  Col. {index + 1} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Broadsheet Footnote Colophon */}
        <div className="border-t border-border/80 pt-2.5 mt-2 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-muted-foreground">
          <span>The Vichaar Chronicle Archive</span>
          <span className="font-serif italic normal-case text-foreground/80">
            Printed on digital rag &bull; Page B1
          </span>
        </div>
      </div>
    </div>
  );
}
