import { Layers, Eye, Clock, Plus, ArrowUp, ArrowDown, Trash2, FileText } from "lucide-react";

function SectionCard({ sec, idx, totalSections, formatRoman, onUpdate, onMove, onRemove }) {
  return (
    <div className="bg-background border-2 border-border/90 rounded-xs p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-foreground/60">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/60">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="font-sans text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-foreground text-background rounded-xs shadow-2xs shrink-0">
            Sec. {formatRoman(idx + 1)}
          </span>
          <input
            type="text"
            value={sec.heading}
            onChange={(e) => onUpdate(sec.id, "heading", e.target.value)}
            placeholder={`Section ${formatRoman(idx + 1)} Title...`}
            className="w-full font-serif font-bold text-sm sm:text-base px-2.5 py-1 bg-secondary/25 border border-border/70 focus:border-foreground focus:outline-none rounded-2xs"
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMove(idx, "up")}
            disabled={idx === 0}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed rounded-2xs border border-border/60 transition-colors"
            title="Move Section Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(idx, "down")}
            disabled={idx === totalSections - 1}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed rounded-2xs border border-border/60 transition-colors"
            title="Move Section Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(sec.id)}
            className="p-1.5 text-muted-foreground hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xs border border-border/60 transition-colors"
            title="Remove this section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <textarea
        rows={5}
        value={sec.body}
        onChange={(e) => onUpdate(sec.id, "body", e.target.value)}
        placeholder={`Elaborate your arguments for Section ${formatRoman(idx + 1)}. Separate multiple paragraphs with a blank line...`}
        className="w-full font-serif text-sm sm:text-base leading-[1.8] p-3.5 bg-secondary/15 border border-border/60 focus:border-foreground focus:outline-none resize-y rounded-2xs"
      />
    </div>
  );
}

function VisualStudio({ introText, setIntroText, visualSections, formatRoman, onAddSection, onUpdateSection, onMoveSection, onRemoveSection }) {
  return (
    <div className="p-4 sm:p-6 bg-secondary/15 space-y-5">
      <div className="bg-background border border-border/80 rounded-xs p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-bold uppercase tracking-widest px-2 py-0.5 bg-amber-800/10 text-amber-800 dark:bg-amber-400/10 dark:text-amber-400 rounded-2xs border border-amber-800/20 dark:border-amber-400/20">
              Lead Paragraph
            </span>
            <span className="text-xs font-serif italic text-muted-foreground hidden sm:inline">
              Opening thesis paragraph (will receive broadsheet drop-cap)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const dateline = "[NEW DELHI / DIGITAL BUREAU] — ";
              if (!introText.startsWith("[NEW DELHI")) {
                setIntroText((prev) => `${dateline}${prev}`);
              }
            }}
            className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Wire Dateline</span>
          </button>
        </div>
        <textarea
          rows={3}
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          placeholder="[NEW DELHI / DIGITAL BUREAU] — Draft the opening thesis hook..."
          className="w-full font-serif text-sm sm:text-base leading-relaxed p-3 bg-secondary/20 border border-border/70 focus:border-foreground focus:outline-none resize-y rounded-2xs"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-sans font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>Numbered Manuscript Sections ({visualSections.length})</span>
          </span>
          <span className="text-[11px] font-serif italic text-muted-foreground">
            Automatically creates Roman badges (§ I, § II) and TOC links
          </span>
        </div>

        {visualSections.map((sec, idx) => (
          <SectionCard
            key={sec.id || idx}
            sec={sec}
            idx={idx}
            totalSections={visualSections.length}
            formatRoman={formatRoman}
            onUpdate={onUpdateSection}
            onMove={onMoveSection}
            onRemove={onRemoveSection}
          />
        ))}

        <button
          type="button"
          onClick={onAddSection}
          className="w-full py-3.5 border-2 border-dashed border-border/90 hover:border-amber-800 dark:hover:border-amber-400 bg-background hover:bg-secondary/40 text-foreground font-sans text-xs uppercase font-bold tracking-widest rounded-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4 text-amber-800 dark:text-amber-400" />
          <span>Add Next Section (&sect; {formatRoman(visualSections.length + 1)})</span>
        </button>
      </div>
    </div>
  );
}

function BroadsheetPreview({ title, subtitle, category, user, introText, visualSections, summaryPoint1, summaryPoint2, summaryPoint3, formatRoman, wordCount }) {
  return (
    <div className="p-6 md:p-8 bg-background border-t border-border/80 space-y-8 animate-in fade-in duration-200">
      <div className="border-b border-border/80 pb-2.5 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-muted-foreground">
        <span className="font-bold text-foreground">
          {category.toUpperCase()} PREVIEW
        </span>
        <span className="font-mono">{wordCount} Words</span>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-[1.15]">
          {title || "Untitled Broadsheet Headline"}
        </h2>
        {subtitle && (
          <p className="font-serif italic text-lg text-foreground/80 leading-relaxed border-l-2 border-amber-800 dark:border-amber-400 pl-3">
            {subtitle}
          </p>
        )}
        <div className="pt-2 pb-2 border-y border-border/60 text-xs font-sans text-muted-foreground flex items-center justify-between">
          <span>By {user.name} &bull; {category} Fellow</span>
          <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
        </div>
      </div>

      {(summaryPoint1 || summaryPoint2 || summaryPoint3) && (
        <div className="border-2 border-foreground/80 dark:border-border bg-secondary/35 p-5 shadow-[3px_3px_0px_0px_rgba(28,24,21,0.8)] dark:shadow-[3px_3px_0px_0px_rgba(237,231,220,0.15)]">
          <div className="flex items-center gap-2 pb-2 border-b border-foreground/30 mb-3">
            <FileText className="w-4 h-4 text-amber-800 dark:text-amber-400" />
            <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-foreground">
              Executive Summary
            </h4>
          </div>
          <ul className="space-y-2 text-xs font-serif leading-relaxed">
            {[summaryPoint1, summaryPoint2, summaryPoint3].filter(Boolean).map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-sans font-black text-amber-800 dark:text-amber-400">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-8 font-serif text-lg sm:text-xl leading-[1.85] text-foreground">
        {introText.trim() && (
          <div className="space-y-4">
            {introText.split(/\n\s*\n/).map((p, i) => (
              <p key={i} className={i === 0 ? "drop-cap text-foreground/95" : "text-foreground/90 leading-relaxed"}>
                {p}
              </p>
            ))}
          </div>
        )}

        {visualSections.filter((s) => s.heading?.trim() || s.body?.trim()).length > 0 ? (
          visualSections
            .filter((s) => s.heading?.trim() || s.body?.trim())
            .map((sec, secIdx) => (
              <section key={sec.id || secIdx} className="space-y-4">
                {sec.heading?.trim() && (
                  <div className="flex items-center gap-3 pt-4 border-b border-border/70 pb-2">
                    <span className="font-sans text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-xs bg-foreground text-background">
                      Sec. {formatRoman(secIdx + 1)}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                      {sec.heading.trim()}
                    </h3>
                  </div>
                )}
                {sec.body
                  .split(/\n\s*\n/)
                  .filter(Boolean)
                  .map((p, pIdx) => {
                    const isFirst = !introText.trim() && secIdx === 0 && pIdx === 0;
                    return (
                      <p key={pIdx} className={isFirst ? "drop-cap text-foreground/95" : "text-foreground/90 leading-relaxed"}>
                        {p}
                      </p>
                    );
                  })}
              </section>
            ))
        ) : !introText.trim() ? (
          <div className="py-12 text-center text-muted-foreground italic font-serif text-sm">
            No manuscript text entered yet. Switch to &quot;Visual Studio&quot; to draft your essay.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ManuscriptEditor({
  editorMode,
  setEditorMode,
  introText,
  setIntroText,
  visualSections,
  formatRoman,
  onAddSection,
  onUpdateSection,
  onMoveSection,
  onRemoveSection,
  // preview props
  title,
  subtitle,
  category,
  user,
  summaryPoint1,
  summaryPoint2,
  summaryPoint3,
  compileVisualToMarkdown,
  setContent,
}) {
  const compiledText = compileVisualToMarkdown(introText, visualSections);
  const wordCount = compiledText.trim() ? compiledText.trim().split(/\s+/).length : 0;

  return (
    <div className="border border-border/80 bg-background rounded-xs overflow-hidden shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-secondary/30 border-b border-border/80">
        <div className="flex items-center gap-1 bg-background p-0.5 border border-border/70 rounded-xs">
          <button
            type="button"
            onClick={() => setEditorMode("visual")}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-sans uppercase font-bold tracking-wider rounded-2xs transition-colors cursor-pointer ${
              editorMode === "visual"
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visual Studio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setContent(compiledText);
              setEditorMode("preview");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-sans uppercase font-bold tracking-wider rounded-2xs transition-colors cursor-pointer ${
              editorMode === "preview"
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Broadsheet Reading</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
          <span>{wordCount} words</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Math.max(1, Math.ceil(wordCount / 200))} min read
          </span>
        </div>
      </div>

      {editorMode === "visual" && (
        <VisualStudio
          introText={introText}
          setIntroText={setIntroText}
          visualSections={visualSections}
          formatRoman={formatRoman}
          onAddSection={onAddSection}
          onUpdateSection={onUpdateSection}
          onMoveSection={onMoveSection}
          onRemoveSection={onRemoveSection}
        />
      )}

      {editorMode === "preview" && (
        <BroadsheetPreview
          title={title}
          subtitle={subtitle}
          category={category}
          user={user}
          introText={introText}
          visualSections={visualSections}
          summaryPoint1={summaryPoint1}
          summaryPoint2={summaryPoint2}
          summaryPoint3={summaryPoint3}
          formatRoman={formatRoman}
          wordCount={wordCount}
        />
      )}
    </div>
  );
}
