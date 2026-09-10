"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Share2,
  Bookmark,
  Check,
  Type,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/authStore";
import { API_BASE_URL } from "@/lib/api";

export function ReadingToolbar({
  category,
  fontSize,
  setFontSize,
  title,
  post,
}) {
  const { isAuthenticated, token } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(post?.hasSaved || false);
  const [savesCount, setSavesCount] = useState(post?._count?.savedBy || 0);
  const [liked, setLiked] = useState(post?.hasLiked || false);
  const [likesCount, setLikesCount] = useState(post?._count?.likedBy || 0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Sync user's like/save state from backend since server component can't read localStorage token
    if (isAuthenticated && token && post?.id) {
      fetch(`${API_BASE_URL}/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.post) {
            setLiked(data.post.hasLiked);
            setBookmarked(data.post.hasSaved);
          }
        })
        .catch((e) => console.error("Failed to sync interactions:", e));
    }
  }, [isAuthenticated, token, post?.id]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please log in to like this dispatch.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1));
      }
    } catch (e) {
      console.error("Failed to toggle like:", e);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert("Please log in to save this dispatch.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/posts/${post.id}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.saved);
        setSavesCount((prev) => (data.saved ? prev + 1 : prev - 1));
      }
    } catch (e) {
      console.error("Failed to toggle bookmark:", e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-border/40">
        <div
          className="h-full bg-red-700 dark:bg-red-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Utility Ribbon */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-3.5 text-xs font-sans">
        {/* Left: Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 uppercase tracking-widest font-bold text-foreground/80 hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>The Archive</span>
          <span className="opacity-40">&bull;</span>
          <span className="text-amber-800 dark:text-amber-400">{category}</span>
        </Link>

        {/* Right: Reading Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Font Sizer */}
          <div className="flex items-center gap-1 border border-border/80 bg-background px-2 py-1 rounded-xs">
            <Type className="w-3 h-3 text-muted-foreground mr-1" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold hidden md:inline mr-1">
              Text:
            </span>
            <button
              onClick={() => setFontSize("normal")}
              className={`px-1.5 py-0.5 text-[11px] font-serif rounded-xs transition-colors cursor-pointer ${
                fontSize === "normal"
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-secondary text-foreground"
              }`}
              title="Standard text size"
            >
              Standard
            </button>
            <button
              onClick={() => setFontSize("large")}
              className={`px-1.5 py-0.5 text-xs font-serif rounded-xs transition-colors cursor-pointer ${
                fontSize === "large"
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-secondary text-foreground"
              }`}
              title="Large text size"
            >
              Large
            </button>
            <button
              onClick={() => setFontSize("xlarge")}
              className={`px-1.5 py-0.5 text-sm font-serif rounded-xs transition-colors cursor-pointer ${
                fontSize === "xlarge"
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-secondary text-foreground"
              }`}
              title="Editorial reading size"
            >
              Editorial
            </button>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-1.5 border border-border/80 rounded-xs hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Print broadsheet dispatch"
            aria-label="Print article"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2 py-1 border border-border/80 rounded-xs hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-[11px] font-sans uppercase tracking-wider"
            title="Copy dispatch link"
            aria-label="Share article"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2 py-1 border rounded-xs transition-colors cursor-pointer text-[11px] font-sans uppercase tracking-wider ${
              liked
                ? "bg-red-50 dark:bg-red-950/70 border-red-300 text-red-700 dark:text-red-400 font-bold"
                : "border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            title={liked ? "Liked" : "Like dispatch"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${liked ? "fill-red-600 text-red-600" : ""}`}
            />
            <span>{likesCount}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 px-2 py-1 border rounded-xs transition-colors cursor-pointer text-[11px] font-sans uppercase tracking-wider ${
              bookmarked
                ? "bg-amber-100 dark:bg-amber-950/70 border-amber-400 text-amber-900 dark:text-amber-200 font-bold"
                : "border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            title={bookmarked ? "Saved to Reading Ledger" : "Save dispatch"}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-600 text-amber-600" : ""}`}
            />
            <span className="hidden sm:inline">
              {bookmarked ? "Saved" : "Save"} ({savesCount})
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
