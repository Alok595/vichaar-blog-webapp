"use client";

import Image from "next/image";
import Link from "next/link";
import { Copy, Check, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

export function ArticleContent({ post, fontSize }) {
  const [codeCopied, setCodeCopied] = useState(false);

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case "large":
        return "text-xl sm:text-2xl leading-[2.0]";
      case "xlarge":
        return "text-2xl sm:text-3xl leading-[2.15]";
      default:
        return "text-lg sm:text-xl leading-[1.85]";
    }
  };

  const handleCopyCode = () => {
    if (post.codeSnippet?.code) {
      navigator.clipboard.writeText(post.codeSnippet.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  return (
    <article className="space-y-10">
      {/* 1. Broadsheet Folio Line */}
      <div className="border-b border-border/80 pb-2.5 flex flex-wrap items-center justify-between text-[11px] font-sans uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2 font-bold">
          <span className={`px-2 py-0.5 rounded-xs ${post.themeColor?.badgeBg || "bg-foreground text-background"}`}>
            {post.category}
          </span>
          {post.subcategory && (
            <>
              <span className="opacity-40">&bull;</span>
              <span className="text-foreground/90 font-extrabold">{post.subcategory}</span>
            </>
          )}
          <span className="opacity-40">&bull;</span>
          <span className="text-foreground/80">{post.bureau || "Vichaar Bureau"}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{post.issueNo || "Dispatch No. 042"}</span>
          <span className="opacity-40">&bull;</span>
          <span className="font-serif italic font-normal">{post.folioPage || "Page B1"}</span>
        </div>
      </div>

      {/* 2. Article Title & Deck */}
      <header className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black tracking-tight text-foreground leading-[1.14]">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-foreground/75 leading-relaxed border-l-2 border-amber-800/60 dark:border-amber-400/60 pl-4 py-1">
            {post.subtitle}
          </p>
        )}

        {/* Newspaper Byline Strip */}
        <div className="pt-3 pb-3 border-y border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs font-sans text-muted-foreground">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-foreground font-bold">{post.author.name}</span>
            <span className="opacity-40">&bull;</span>
            <span className="italic font-serif">{post.author.role}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>{post.date}</span>
            <span className="opacity-40">&bull;</span>
            <span className="font-bold text-foreground/80">{post.readTime}</span>
            <span className="opacity-40">&bull;</span>
            <span>{post.wordCount}</span>
          </div>
        </div>
      </header>

      {/* 3. Framed Monochrome News Photograph */}
      {post.imageUrl && (
        <div className="space-y-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden border-2 border-foreground/85 dark:border-border bg-background p-1.5 shadow-[4px_4px_0px_0px_rgba(28,24,21,0.8)] dark:shadow-[4px_4px_0px_0px_rgba(237,231,220,0.15)]">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover grayscale contrast-105 hover:grayscale-0 transition-all duration-700"
                priority
              />
            </div>
          </div>
          {post.caption && (
            <p className="text-[11px] font-serif italic text-muted-foreground text-center border-b border-border/60 pb-2">
              {post.caption}
            </p>
          )}
        </div>
      )}

      {/* 4. Article Sections Body with Drop Cap & Wire Dateline */}
      <div className={`font-serif text-foreground ${getFontSizeClasses()} space-y-8`}>
        {post.sections && post.sections.length > 0 ? (
          post.sections.map((sec, secIdx) => (
            <section key={sec.heading} id={`section-${secIdx}`} className="space-y-5">
              {/* Section Roman Numerals & Title */}
              <div className="flex items-center gap-3 pt-4 border-b border-border/70 pb-2">
                <span className={`font-sans text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-xs ${post.themeColor?.badgeBg || "bg-foreground text-background"}`}>
                  Sec. {sec.roman}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {sec.heading}
                </h2>
              </div>

              {/* Paragraphs with dateline and drop-cap on the very first paragraph */}
              {sec.paragraphs.map((p, pIdx) => {
                const isVeryFirst = secIdx === 0 && pIdx === 0;

                return (
                  <p
                    key={pIdx}
                    className={
                      isVeryFirst
                        ? "drop-cap text-foreground/95"
                        : "text-foreground/90 leading-relaxed"
                    }
                  >
                    {isVeryFirst && post.dateline && (
                      <strong className="font-sans text-xs uppercase tracking-widest font-black text-amber-900 dark:text-amber-300 mr-2 not-italic">
                        [{post.dateline}] &mdash;
                      </strong>
                    )}
                    {p}
                  </p>
                );
              })}

              {/* Insert Pull Quote after Section I */}
              {secIdx === 0 && post.pullQuote && (
                <div className={`my-8 p-6 md:p-8 border-l-4 ${post.themeColor?.quoteSpine || "border-l-red-700 bg-secondary/40"} not-italic`}>
                  <Quote className="w-8 h-8 text-amber-800/40 dark:text-amber-400/40 mb-2" />
                  <blockquote className="font-serif italic text-xl sm:text-2xl text-foreground font-semibold leading-relaxed">
                    &ldquo;{post.pullQuote.text}&rdquo;
                  </blockquote>
                  {post.pullQuote.author && (
                    <cite className="block font-sans text-xs uppercase tracking-wider font-bold text-muted-foreground mt-3 not-italic">
                      &mdash; {post.pullQuote.author}
                    </cite>
                  )}
                </div>
              )}

              {/* Insert Code/Architecture Snippet after Section II */}
              {secIdx === 1 && post.codeSnippet && (
                <div className="my-8 border border-border bg-[#181614] text-stone-200 rounded-none shadow-md overflow-hidden text-left not-prose">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-stone-800 bg-[#12100e] text-xs font-mono">
                    <span className="text-amber-400 font-bold">
                      {post.codeSnippet.filename}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 text-[11px] font-sans text-stone-400 hover:text-stone-100 cursor-pointer transition-colors"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-stone-300">
                    <code>{post.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))
        ) : (
          <div className="space-y-6">
            {(post.content || "").split(/\n\s*\n/).filter(Boolean).map((para, idx) => (
              <p
                key={idx}
                className={idx === 0 ? "drop-cap text-foreground/95" : "text-foreground/90 leading-relaxed"}
              >
                {idx === 0 && post.dateline && (
                  <strong className="font-sans text-xs uppercase tracking-widest font-black text-amber-900 dark:text-amber-300 mr-2 not-italic">
                    [{post.dateline}] &mdash;
                  </strong>
                )}
                {para}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* 5. Editor's Dossier Box */}
      {post.editorDossier && (
        <div className="my-10 border-2 border-dashed border-border p-6 bg-secondary/25">
          <div className="text-xs font-sans uppercase font-extrabold tracking-widest text-amber-800 dark:text-amber-400 pb-2 border-b border-border/60 mb-2.5">
            &sect; {post.editorDossier.title}
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground/90 leading-relaxed italic">
            {post.editorDossier.content}
          </p>
        </div>
      )}

      {/* 6. Broadsheet Sign-off & Finial */}
      <div className="pt-10 border-t-2 border-newspaper-double text-center space-y-3">
        <div className="font-sans text-[11px] uppercase tracking-[0.25em] font-extrabold text-muted-foreground">
          [ &#9632; VICHAAR DISPATCH CONCLUDED &#9632; ]
        </div>
        <p className="font-serif italic text-xs text-muted-foreground">
          Filed under the {post.category} Ledger &bull; New Delhi Central Archives &bull; {post.date}
        </p>
      </div>

      {/* 7. Next & Previous Story Broadsheet Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border/80">
        <Link
          href="/"
          className="p-4 border border-border hover:bg-secondary/40 transition-colors group flex items-center justify-between"
        >
          <div>
            <span className="text-[10px] font-sans uppercase tracking-widest text-muted-foreground block mb-1">
              &larr; Front Page
            </span>
            <span className="font-serif font-bold text-sm text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300">
              Return to Late City Edition
            </span>
          </div>
        </Link>

        {post.relatedDispatches?.[0] && (
          <Link
            href={`/post/${post.relatedDispatches[0].id}`}
            className="p-4 border border-border hover:bg-secondary/40 transition-colors group flex items-center justify-between text-right"
          >
            <div className="w-full">
              <span className="text-[10px] font-sans uppercase tracking-widest text-amber-800 dark:text-amber-400 font-bold block mb-1">
                Next Dispatch &rarr;
              </span>
              <span className="font-serif font-bold text-sm text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300 line-clamp-1">
                {post.relatedDispatches[0].title}
              </span>
            </div>
          </Link>
        )}
      </div>
    </article>
  );
}
