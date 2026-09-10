"use client";

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="border-t border-border mt-auto bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-8 md:h-20 md:flex-row md:py-0 px-4 md:px-8">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
            Vichaar (विचार)
          </span>
          <span className="text-xs text-muted-foreground">&bull; Crafting dialogues & shared insights</span>
        </div>
        <p className="text-center text-xs text-muted-foreground md:text-right">
          &copy; {new Date().getFullYear()} Vichaar. Designed with care.
        </p>
      </div>
    </footer>
  );
}
