import Link from "next/link";
import { Clock, Heart, Bookmark, ExternalLink, Edit3, Trash2, Feather, BookOpen } from "lucide-react";

function PostCard({ post, onEdit, onDelete, deletingId }) {
  return (
    <div className="border border-border bg-background p-5 hover:border-foreground/60 transition-colors shadow-xs">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans uppercase tracking-wider font-extrabold text-amber-800 dark:text-amber-400">
            <span>{post.category}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-muted-foreground font-normal">
              <Clock className="w-3 h-3" />
              {post.readTime || "5 min read"}
            </span>
            <span>&bull;</span>
            <span className="text-muted-foreground font-normal">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground leading-snug">
            {post.title}
          </h3>

          {post.subtitle && (
            <p className="font-serif text-xs italic text-muted-foreground line-clamp-2">
              {post.subtitle}
            </p>
          )}

          <div className="pt-2 flex items-center gap-3 text-xs font-sans">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 font-bold text-[11px]">
              <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>{post._count?.likedBy ?? post.likesCount ?? 0} Likes</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
              <Bookmark className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
              <span>{post._count?.savedBy ?? post.savesCount ?? 0} Saves</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
          <Link
            href={`/post/${post.id}`}
            target="_blank"
            className="p-2 text-xs border border-border hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
            title="View published article"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </Link>

          <button
            onClick={() => onEdit(post)}
            className="p-2 text-xs border border-border hover:bg-secondary text-muted-foreground hover:text-amber-800 transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Edit dispatch manuscript"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => onDelete(post.id)}
            disabled={deletingId === post.id}
            className="p-2 text-xs border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
            title="Permanently retract dispatch"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {deletingId === post.id ? "Deleting..." : "Retract"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyPostsList({ posts, isLoading, deletingId, onEdit, onDelete, onNewDraft }) {
  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground font-serif italic">
        Retrieving your broadsheet dispatches from MySQL...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-border p-12 text-center space-y-3 bg-secondary/10">
        <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/60" />
        <h3 className="font-serif text-lg font-bold text-foreground">No Dispatches Found</h3>
        <p className="font-serif text-xs text-muted-foreground max-w-md mx-auto">
          You have not syndicated any essays yet under this byline. Use the writing desk to publish
          your first broadsheet dispatch.
        </p>
        <button
          onClick={onNewDraft}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-sans uppercase font-bold tracking-wider hover:bg-amber-800 hover:text-white transition-colors cursor-pointer"
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Begin First Dispatch</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEdit}
          onDelete={onDelete}
          deletingId={deletingId}
        />
      ))}
    </div>
  );
}
