import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Feather,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Send,
} from "lucide-react";

export function PostSidebar({ post }) {
  return (
    <aside className="space-y-8">
      {/* 1. At A Glance / Summary Dossier */}
      {post.summaryPoints && post.summaryPoints.length > 0 && (
        <div className="border-2 border-foreground/80 dark:border-border bg-secondary/35 p-5 shadow-[3px_3px_0px_0px_rgba(28,24,21,0.8)] dark:shadow-[3px_3px_0px_0px_rgba(237,231,220,0.15)]">
          <div className="flex items-center gap-2 pb-2.5 border-b border-foreground/30 mb-3.5">
            <FileText className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <h3 className="font-sans text-xs font-black uppercase tracking-widest text-foreground">
              Executive Summary &bull; संक्षेप
            </h3>
          </div>

          <ul className="space-y-3">
            {post.summaryPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs font-serif leading-relaxed text-foreground/90">
                <span className="shrink-0 mt-0.5 font-sans text-[10px] font-black text-amber-800 dark:text-amber-400">
                  0{index + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 2. Table of Contents / Index of Sections */}
      {post.sections && post.sections.length > 0 && (
        <div className="border border-border/80 bg-background p-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border mb-3">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-foreground/85">
              Section Index &bull; अनुभाग
            </h4>
          </div>

          <nav className="space-y-2 font-serif text-xs">
            {post.sections.map((sec, idx) => (
              <a
                key={idx}
                href={`#section-${idx}`}
                className="group flex items-start gap-2 py-1 hover:text-amber-800 dark:hover:text-amber-300 transition-colors text-foreground/80"
              >
                <span className="font-sans text-[10px] font-black opacity-60 shrink-0 pt-0.5">
                  &sect; {sec.roman}.
                </span>
                <span className="group-hover:underline underline-offset-2 leading-snug">
                  {sec.heading}
                </span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* 3. Author Colophon Plaque */}
      <div className="border-t-4 border-t-foreground/90 border border-border bg-background p-5 text-left">
        <div className="flex items-center gap-2 pb-2 border-b border-border/60 mb-3">
          <Feather className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span className="text-[10px] font-sans uppercase tracking-widest font-extrabold text-foreground/80">
            About the Contributor
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {post.author.avatar && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover grayscale"
              />
            </div>
          )}
          <div>
            <h4 className="font-serif text-base font-bold text-foreground">
              {post.author.name}
            </h4>
            <p className="text-[11px] font-sans text-amber-800 dark:text-amber-400 font-semibold">
              {post.author.role}
            </p>
          </div>
        </div>

        <div className="text-[10px] font-sans uppercase font-bold tracking-wider px-2 py-0.5 bg-secondary rounded-xs text-foreground/75 inline-block mb-2.5">
          {post.author.fellowship}
        </div>

        <p className="text-xs font-serif text-muted-foreground leading-relaxed">
          {post.author.bio}
        </p>
      </div>

      {/* 4. Related Dispatches from Bureau */}
      {post.relatedDispatches && post.relatedDispatches.length > 0 && (
        <div className="border border-border/80 bg-secondary/20 p-5">
          <h4 className="text-xs font-sans uppercase tracking-widest font-black text-foreground pb-2 border-b border-border/60 mb-3 flex items-center justify-between">
            <span>Bureau Archives</span>
            <span className="text-[10px] font-serif italic font-normal text-muted-foreground">
              Related
            </span>
          </h4>

          <div className="divide-y divide-border/60">
            {post.relatedDispatches.map((rel) => (
              <Link
                key={rel.id}
                href={`/post/${rel.id}`}
                className="block py-3 first:pt-0 last:pb-0 group"
              >
                <span className="text-[10px] font-sans uppercase tracking-wider font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                  {rel.category}
                </span>
                <h5 className="font-serif text-sm font-bold text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors leading-snug">
                  {rel.title}
                </h5>
                <span className="text-[11px] font-serif italic text-muted-foreground block mt-1">
                  By {rel.author} &bull; {rel.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 5. Morning Gazette Subscription */}
      <div className="border border-dashed border-foreground/40 bg-secondary/30 p-5 text-center">
        <h4 className="font-serif font-bold text-sm text-foreground mb-1">
          Morning Gazette Dispatch
        </h4>
        <p className="text-[11px] font-serif text-muted-foreground mb-3 leading-relaxed">
          Receive selected essays & computational reviews delivered to your digital letterbox.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
          <input
            type="email"
            placeholder="Enter your email..."
            className="w-full text-xs font-serif px-2.5 py-1.5 bg-background border border-border focus:outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="w-full text-[11px] font-sans font-bold uppercase tracking-wider py-1.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors cursor-pointer"
          >
            Join Registry
          </button>
        </form>
      </div>
    </aside>
  );
}
