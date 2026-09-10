import { FileText, Heart, Bookmark } from "lucide-react";

export default function StatsBar({ posts }) {
  const totalLikes = posts.reduce((acc, p) => acc + (p._count?.likedBy || p.likesCount || 0), 0);
  const totalSaves = posts.reduce((acc, p) => acc + (p._count?.savedBy || p.savesCount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="p-4 border border-border bg-background shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-sm bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-900 dark:text-amber-200">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
            Syndicated Dispatches
          </div>
          <div className="font-serif font-bold text-2xl text-foreground">{posts.length}</div>
        </div>
      </div>

      <div className="p-4 border border-border bg-background shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-sm bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 flex items-center justify-center text-red-700 dark:text-red-400">
          <Heart className="w-5 h-5 fill-red-600/30 text-red-600" />
        </div>
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
            Total Reader Applauds
          </div>
          <div className="font-serif font-bold text-2xl text-foreground">{totalLikes}</div>
        </div>
      </div>

      <div className="p-4 border border-border bg-background shadow-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-sm bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-300">
          <Bookmark className="w-5 h-5 fill-amber-500/30 text-amber-600" />
        </div>
        <div>
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
            Total Saved Bookmarks
          </div>
          <div className="font-serif font-bold text-2xl text-foreground">{totalSaves}</div>
        </div>
      </div>
    </div>
  );
}
