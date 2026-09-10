import Link from "next/link";

export function Masthead() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-5 md:py-8">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Central Masthead Title */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-muted-foreground font-sans font-semibold mb-1 group-hover:text-foreground transition-colors">
              The Daily Chronicle of Ideas &amp; Computation
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.12em] text-foreground transition-transform duration-300">
              VICHAAR
            </h1>
            <div className="flex items-center justify-center gap-3 mt-1 text-xs text-muted-foreground font-serif italic">
              <span className="h-[1px] w-6 md:w-12 bg-border" />
              <span>विचार • सत्य, संवाद, और समीक्षा</span>
              <span className="h-[1px] w-6 md:w-12 bg-border" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
