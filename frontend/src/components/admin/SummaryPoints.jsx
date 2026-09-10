import { FileText, Sparkles } from "lucide-react";

export default function SummaryPoints({
  point1,
  point2,
  point3,
  onChange1,
  onChange2,
  onChange3,
  onAutoExtract,
}) {
  return (
    <div className="border border-border/80 bg-secondary/20 p-4 rounded-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-foreground">
            Executive Summary Points (Optional)
          </span>
        </div>
        <button
          type="button"
          onClick={onAutoExtract}
          className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          title="Auto-extract 3 key takeaway bullet points from your manuscript body"
        >
          <Sparkles className="w-3 h-3" />
          <span>Auto-Extract From Body</span>
        </button>
      </div>

      <p className="text-xs font-serif italic text-muted-foreground">
        These 3 bullet points will be highlighted in the Executive Summary box in the article sidebar.
      </p>

      <div className="space-y-2">
        {[
          { num: "01", value: point1, onChange: onChange1, placeholder: "Key takeaway 1 (e.g., Primary thesis or finding)..." },
          { num: "02", value: point2, onChange: onChange2, placeholder: "Key takeaway 2 (e.g., Methodological or architectural insight)..." },
          { num: "03", value: point3, onChange: onChange3, placeholder: "Key takeaway 3 (e.g., Synthesis or future implication)..." },
        ].map(({ num, value, onChange, placeholder }) => (
          <div key={num} className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400 shrink-0">
              {num}.
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full text-xs font-serif p-2 bg-background border border-border focus:border-foreground focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
