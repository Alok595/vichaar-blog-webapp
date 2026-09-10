import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, Clock, Sparkles } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const fallbackFeaturedPost = {
  id: 1,
  title: "Understanding Next.js 15 Server Components & The Architecture of Modern Flux",
  excerpt:
    "We stand at a critical juncture in the philosophy of the web. Server components do not merely shift compute back to origin machines; they invite us to reconsider the boundaries of state, latency, and the tactile nature of rendering.",
  author: "Dr. Ananya Sharma",
  authorRole: "Principal Systems Architect",
  date: "September 9, 2026",
  readTime: "7 min read",
  category: "Architecture",
  imageUrl:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
};

const fallbackSecondaryPosts = [
  {
    id: 2,
    title: "The Poetics of Tailwind CSS v4: Minimal Syntax as an Aesthetic Choice",
    excerpt:
      "CSS is no longer a set of inert presentation declarations; in its fourth incarnation, Tailwind transforms the stylesheet into an ambient design language governed by native variables.",
    author: "Julian Vance",
    date: "September 5, 2026",
    readTime: "6 min read",
    category: "Design Craft",
    imageUrl:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "The Quiet Elegance of Zustand: Escaping Redux's Ceremony",
    excerpt:
      "Why the developer consciousness gravitates towards lighter weight primitives when building interactive distributed state machines.",
    author: "Marcus Sterling",
    date: "August 28, 2026",
    readTime: "5 min read",
    category: "Frontend",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  },
];

const dispatchPicks = [
  {
    num: "01",
    title: "Why Relational Schemas Still Anchor Distributed Computing",
    author: "Kavita Nair",
    category: "Databases & Prisma",
    date: "Sep 8",
  },
  {
    num: "02",
    title: "The Typography of Solitude: Reading Long-form Text on Screens",
    author: "Elena Rostova",
    category: "Humanities",
    date: "Sep 4",
  },
  {
    num: "03",
    title: "Designing for Permanence in a World of Ephemeral Frameworks",
    author: "Devendra Joshi",
    category: "Philosophy",
    date: "Sep 1",
  },
  {
    num: "04",
    title: "Notes on Computational Aesthetics and Generative Typography",
    author: "Siddharth Sen",
    category: "Art & Code",
    date: "Aug 24",
  },
];

export default async function Home(props) {
  const searchParams = await props?.searchParams;
  const selectedCategory = searchParams?.category || "";
  const selectedSubcategory = searchParams?.subcategory || "";

  let featuredPost = null;
  let secondaryPosts = [];
  let allMappedPosts = [];

  try {
    const res = await fetch(`${API_BASE_URL}/posts`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.posts && data.posts.length > 0) {
        allMappedPosts = data.posts.map((p) => ({
          id: p.id,
          title: p.title,
          excerpt: p.subtitle || p.content.slice(0, 160) + "...",
          author: p.author?.name || p.authorName || "Staff Fellow",
          authorRole: p.author?.role || p.authorRole || "Editorial Fellow",
          date: new Date(p.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          readTime: p.readTime || "5 min read",
          category: p.category || "Engineering",
          subcategory: p.subcategory || "",
          subcategoryDesc: p.subcategoryDesc || "",
          imageUrl: p.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        }));
      }
    }
  } catch (e) {
    console.warn("Backend fetch failed, using fallback articles:", e.message);
  }

  if (allMappedPosts.length === 0) {
    allMappedPosts = [fallbackFeaturedPost, ...fallbackSecondaryPosts];
  }

  // Filter posts by category and subcategory if requested in searchParams
  let filteredPosts = allMappedPosts;
  if (selectedCategory) {
    filteredPosts = filteredPosts.filter((p) => {
      if (!p.category) return false;
      return p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    });
  }
  if (selectedSubcategory) {
    filteredPosts = filteredPosts.filter((p) => {
      if (!p.subcategory) return false;
      return p.subcategory.trim().toLowerCase() === selectedSubcategory.trim().toLowerCase();
    });
  }

  if (filteredPosts.length > 0) {
    const foundFeatured = filteredPosts.find((m) => m.featured) || filteredPosts[0];
    featuredPost = foundFeatured;
    secondaryPosts = filteredPosts.filter((m) => m.id !== foundFeatured.id);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Front Page Broadsheet Banner */}
      <div className="border-b-2 border-foreground/80 dark:border-border pb-1.5 mb-6 flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.25em] font-extrabold text-foreground">
        <span>
          {selectedCategory ? `${selectedCategory.toUpperCase()}${selectedSubcategory ? ` › ${selectedSubcategory.toUpperCase()}` : ""} • SECTION ARCHIVE` : "The Front Page • Lead Inquiries"}
        </span>
        <span className="hidden sm:inline font-serif italic font-normal normal-case text-muted-foreground">
          Transmitted via digital telegraph &bull; Edition of Record
        </span>
        <span>Section 1 &bull; Folio A</span>
      </div>

      {/* Category / Subcategory Filter Indicator Banner */}
      {(selectedCategory || selectedSubcategory) && (
        <div className="mb-8 p-3.5 bg-secondary/35 border-2 border-foreground/90 dark:border-border shadow-[3px_3px_0px_0px_rgba(28,24,21,0.8)] dark:shadow-[3px_3px_0px_0px_rgba(237,231,220,0.2)] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-sans font-black uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded-2xs">
              {selectedSubcategory ? "Subcategory Desk" : "Department Folio"}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-foreground">
              Showing dispatches under &ldquo;{selectedCategory}{selectedSubcategory ? ` › ${selectedSubcategory}` : ""}&rdquo; ({filteredPosts.length} {filteredPosts.length === 1 ? "inquiry" : "inquiries"} found)
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-sans uppercase font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>&times; Clear Filter (View All)</span>
          </Link>
        </div>
      )}

      {/* If No Posts Found for this Category/Subcategory */}
      {filteredPosts.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border p-8 my-8 space-y-4">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground font-serif text-lg">
            §
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground">
            No Dispatches Currently Filed Under &ldquo;{selectedCategory}{selectedSubcategory ? ` › ${selectedSubcategory}` : ""}&rdquo;
          </h3>
          <p className="font-serif text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Our syndicated fellows have not published an inquiry under this department or subcategory yet. Switch to another department or clear the filter to read all dispatches.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-extrabold px-5 py-2.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors"
            >
              <span>View All Latest Essays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Editorial Lead Feature (Cover Story) */}
          {featuredPost && (
            <section className="border-b-4 border-double border-border/90 pb-10 md:pb-14 mb-10 md:mb-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] font-sans text-amber-900 dark:text-amber-300 font-bold">
                    <span className="inline-block w-2.5 h-2.5 bg-foreground" />
                    <span>Special Dispatch &bull; {featuredPost.category}</span>
                    {featuredPost.subcategory && (
                      <>
                        <span className="text-foreground/40 font-normal">&bull;</span>
                        <span className="text-foreground font-extrabold">{featuredPost.subcategory}</span>
                      </>
                    )}
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                    <Link
                      href={`/post/${featuredPost.id}`}
                      className="hover:underline decoration-1 underline-offset-4 transition-all"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="text-base sm:text-lg text-foreground/90 font-serif leading-relaxed line-clamp-3">
                    <span className="font-sans font-bold uppercase tracking-wider text-xs mr-2 text-foreground/70">
                      [NEW DELHI] &mdash;
                    </span>
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-sans text-muted-foreground">
                    <span className="font-bold text-foreground">
                      By {featuredPost.author}
                    </span>
                    <span>&bull;</span>
                    <span>{featuredPost.date}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/post/${featuredPost.id}`}
                      className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-extrabold px-5 py-2.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors"
                    >
                      <span>Read Full Dispatch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full border-2 border-foreground/90 p-1.5 bg-background shadow-[6px_6px_0px_0px_rgba(28,24,21,0.9)]">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        fill
                        priority
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] font-serif italic text-muted-foreground mt-2 text-center">
                    Plate I: Primary syndicated inquiry &bull; Broadside illustration
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Two Column Broadsheet Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Secondary Articles */}
            <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between border-b border-border/80 pb-2">
                <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight">
                  {selectedCategory ? `More from ${selectedCategory}` : "Selected Inquiries"}
                </h3>
                <span className="text-xs uppercase tracking-widest font-sans text-muted-foreground">
                  Vol. 2026
                </span>
              </div>

              {secondaryPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {secondaryPosts.map((post) => (
                    <article key={post.id} className="group flex flex-col justify-between">
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

                        <h4 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors mb-3 leading-snug">
                          <Link href={`/post/${post.id}`}>{post.title}</Link>
                        </h4>

                        <p className="text-sm font-serif text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 text-xs font-sans text-muted-foreground flex items-center justify-between">
                        <span>{post.author}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="font-serif italic text-muted-foreground text-sm py-4">
                  All available dispatches under this department are shown above.
                </p>
              )}

          {/* Literary Quote Break with E-Newspaper Crimson Spine */}
          <div className="border-l-4 border-red-700 dark:border-red-500 bg-red-950/5 dark:bg-red-950/20 border-y border-r border-border p-6 sm:p-8 my-6 text-left">
            <blockquote className="font-serif italic text-lg sm:text-xl text-foreground font-medium leading-relaxed">
              &ldquo;सत्य के अन्वेषण में विचार ही प्रथम सोपान है।&rdquo;
            </blockquote>
            <p className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-red-800 dark:text-red-400 mt-2">
              &mdash; Thoughts are the first threshold to the discovery of truth
            </p>
          </div>
        </div>

        {/* Right Sidebar: Curated Numbered Dispatches */}
        <div className="lg:col-span-4 lg:border-l-2 lg:border-foreground/80 dark:lg:border-border lg:pl-10 space-y-8">
          <div>
            <div className="border-b-2 border-foreground pb-2 mb-6 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
                The Folio: Most Read
              </h3>
              <span className="text-[10px] font-sans font-extrabold uppercase px-1.5 py-0.5 bg-red-700 text-white rounded-xs">
                Popular
              </span>
            </div>

            <div className="divide-y divide-border/80">
              {dispatchPicks.map((pick, i) => {
                const colors = [
                  "text-red-700 dark:text-red-400",
                  "text-blue-800 dark:text-blue-400",
                  "text-amber-800 dark:text-amber-400",
                  "text-emerald-800 dark:text-emerald-400",
                ];
                const tagColors = [
                  "text-red-800 dark:text-red-300",
                  "text-blue-800 dark:text-blue-300",
                  "text-amber-800 dark:text-amber-300",
                  "text-emerald-800 dark:text-emerald-300",
                ];

                return (
                  <div key={pick.num} className="py-4.5 group">
                    <div className="flex items-start gap-4">
                      <span className={`font-serif text-3xl font-black ${colors[i % colors.length]} leading-none`}>
                        {pick.num}
                      </span>
                      <div className="space-y-1">
                        <span className={`text-[10px] uppercase tracking-wider font-sans font-bold ${tagColors[i % tagColors.length]}`}>
                          {pick.category}
                        </span>
                        <h4 className="font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-red-800 dark:group-hover:text-red-300 transition-colors cursor-pointer">
                          {pick.title}
                        </h4>
                        <p className="text-xs font-sans text-muted-foreground">
                          {pick.author} &bull; {pick.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* E-Newspaper Subscription Box */}
          <div className="border-2 border-foreground bg-[#0f233a] dark:bg-[#0c1828] text-stone-100 p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(28,24,21,1)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-bold text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Morning Correspondence</span>
            </div>
            <p className="text-xs font-serif text-stone-300 leading-relaxed">
              Delivered daily to your terminal &bull; Critical perspectives, system blueprints, and philosophical treatises.
            </p>
            <form action="#" className="space-y-2">
              <input
                type="email"
                placeholder="reader@domain.com"
                className="w-full text-xs font-serif bg-white/10 border border-white/20 text-white placeholder:text-stone-400 px-3 py-2 focus:outline-none focus:border-amber-300"
              />
              <button
                type="submit"
                className="w-full text-xs uppercase tracking-widest font-sans font-bold bg-amber-400 text-stone-950 py-2 hover:bg-amber-300 transition-colors cursor-pointer shadow-sm"
              >
                Dispatch to My Inbox
              </button>
              </form>
            </div>
          </div>
        </section>
      </>
    )}
  </div>
  );
}
