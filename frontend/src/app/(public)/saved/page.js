"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, Clock, BookOpen } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

export default function SavedPostsPage() {
  const { isAuthenticated, token, user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If auth is loaded and user is explicitly not authenticated, redirect to login
    if (useAuthStore.persist.hasHydrated() && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!isAuthenticated || !token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/posts/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.posts) {
            const mapped = data.posts.map((p) => ({
              id: p.id,
              title: p.title,
              excerpt: p.subtitle || p.content.slice(0, 160) + "...",
              author: p.author?.name || p.authorName || "Staff Fellow",
              date: new Date(p.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              readTime: p.readTime || "5 min read",
              category: p.category || "Engineering",
              subcategory: p.subcategory || "",
              imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
            }));
            setPosts(mapped);
          }
        }
      } catch (e) {
        console.error("Failed to load saved posts:", e);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSavedPosts();
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated || loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-800 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-10 min-h-[60vh]">
      {/* Page Header */}
      <div className="border-b-2 border-foreground/80 dark:border-border pb-4 mb-10 text-center">
        <div className="w-12 h-12 bg-amber-900/10 dark:bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-800 dark:text-amber-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">
          Reading Ledger
        </h1>
        <p className="font-serif italic text-muted-foreground max-w-lg mx-auto">
          A personal archival collection of your saved dispatches, essays, and inquiries.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border p-8 my-8 space-y-4 max-w-2xl mx-auto">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Your Ledger is Empty
          </h3>
          <p className="font-serif text-sm text-muted-foreground leading-relaxed">
            You haven't saved any dispatches yet. While reading any article, click the "Save" button in the reading toolbar to add it to your personal ledger.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-extrabold px-5 py-2.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors"
            >
              <span>Explore The Front Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col justify-between border border-border/80 p-4 hover:shadow-[4px_4px_0px_0px_rgba(28,24,21,0.8)] dark:hover:shadow-[4px_4px_0px_0px_rgba(237,231,220,0.15)] transition-all bg-background">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-border p-1 bg-background mb-4">
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="mb-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-sans uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-xs border text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border-amber-300/60 dark:border-amber-800/50">
                    {post.category}
                  </span>
                  {post.subcategory && (
                    <span className="text-[10px] font-sans uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-xs border text-muted-foreground bg-secondary/80 border-border">
                      {post.subcategory}
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-xl font-bold tracking-tight text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors mb-3 leading-snug">
                  <Link href={`/post/${post.id}`}>{post.title}</Link>
                </h4>

                <p className="text-sm font-serif text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 text-xs font-sans text-muted-foreground flex items-center justify-between">
                <span>{post.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
