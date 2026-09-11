import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bookmark, Clock, Sparkles, Heart } from "lucide-react";
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
  likesCount: 14,
  savesCount: 8,
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
    likesCount: 9,
    savesCount: 5,
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
    likesCount: 6,
    savesCount: 3,
  },
];

const dispatchPicks = [
  {
    id: 4,
    num: "01",
    title: "Why Relational Schemas Still Anchor Distributed Computing",
    author: "Kavita Nair",
    category: "Databases & Prisma",
    date: "Sep 8",
    likesCount: 12,
  },
  {
    id: 2,
    num: "02",
    title: "The Typography of Solitude: Reading Long-form Text on Screens",
    author: "Elena Rostova",
    category: "Humanities",
    date: "Sep 4",
    likesCount: 8,
  },
  {
    id: 3,
    num: "03",
    title: "Designing for Permanence in a World of Ephemeral Frameworks",
    author: "Devendra Joshi",
    category: "Philosophy",
    date: "Sep 1",
    likesCount: 5,
  },
  {
    id: 1,
    num: "04",
    title: "Notes on Computational Aesthetics and Generative Typography",
    author: "Siddharth Sen",
    category: "Art & Code",
    date: "Aug 24",
    likesCount: 4,
  },
];

export default async function Home(props) {
  const searchParams = await props?.searchParams;
  const selectedCategory = searchParams?.category || "";
  const selectedSubcategory = searchParams?.subcategory || "";
  const searchQuery = (searchParams?.search || searchParams?.q || "").trim();

  let featuredPost = null;
  let secondaryPosts = [];
  let allMappedPosts = [];

  try {
    const fetchUrl = searchQuery
      ? `${API_BASE_URL}/posts?search=${encodeURIComponent(searchQuery)}`
      : `${API_BASE_URL}/posts`;

    const res = await fetch(fetchUrl, {
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
          likesCount: p._count?.likedBy ?? p.likesCount ?? 0,
          savesCount: p._count?.savedBy ?? p.savesCount ?? 0,
        }));
      }
    }
  } catch (e) {
    console.warn("Backend fetch failed, using fallback articles:", e.message);
  }

  if (allMappedPosts.length === 0 && !searchQuery) {
    allMappedPosts = [fallbackFeaturedPost, ...fallbackSecondaryPosts];
  }

  // Strict category & subcategory filtering
  let filteredPosts = allMappedPosts;

  if (searchQuery) {
    const qLower = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter((p) => {
      const matchTitle = p.title?.toLowerCase().includes(qLower);
      const matchExcerpt = p.excerpt?.toLowerCase().includes(qLower);
      const matchCategory = p.category?.toLowerCase().includes(qLower);
      const matchAuthor = p.author?.toLowerCase().includes(qLower);
      return matchTitle || matchExcerpt || matchCategory || matchAuthor;
    });
  }

  if (selectedCategory) {
    const selCatLower = selectedCategory.trim().toLowerCase();
    filteredPosts = filteredPosts.filter((p) => {
      if (!p.category) return false;
      const catLower = p.category.trim().toLowerCase();
      return (
        catLower === selCatLower ||
        catLower.replace(/\s+/g, "") === selCatLower.replace(/\s+/g, "") ||
        catLower.startsWith(selCatLower) ||
        selCatLower.startsWith(catLower) ||
        catLower.includes(selCatLower) ||
        selCatLower.includes(catLower)
      );
    });
  }

  if (selectedSubcategory) {
    const selSubLower = selectedSubcategory.trim().toLowerCase();
    filteredPosts = filteredPosts.filter((p) => {
      if (!p.subcategory) return false;
      const subLower = p.subcategory.trim().toLowerCase();
      return (
        subLower === selSubLower ||
        subLower.replace(/\s+/g, "") === selSubLower.replace(/\s+/g, "") ||
        subLower.includes(selSubLower) ||
        selSubLower.includes(subLower)
      );
    });
  }

  if (filteredPosts.length > 0) {
    const foundFeatured = filteredPosts.find((m) => m.featured) || filteredPosts[0];
    featuredPost = foundFeatured;
    secondaryPosts = filteredPosts.filter((m) => m.id !== foundFeatured.id);
  }

  // Compute most liked dispatches strictly based on current filter context
  const sourceForFolio = (selectedCategory || selectedSubcategory || searchQuery)
    ? (filteredPosts.length > 0 ? filteredPosts : allMappedPosts)
    : allMappedPosts;

  const mostLikedDispatches = [...sourceForFolio]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 4)
    .map((p, idx) => ({
      id: p.id,
      num: String(idx + 1).padStart(2, "0"),
      title: p.title,
      author: p.author,
      category: p.category || "Engineering",
      date: p.date,
      likesCount: p.likesCount || 0,
    }));

  const folioItemsToDisplay =
    mostLikedDispatches.length > 0 ? mostLikedDispatches : dispatchPicks;

  // Additional grid posts strictly from the filtered set (posts after the top 3 secondary)
  const remainingGridPosts = secondaryPosts.slice(3);

  return (
    <div className="container mx-auto px-4 md:px-8 py-6 md:py-10">
      {/* Front Page Broadsheet Banner */}
      <div className="border-b-2 border-foreground/80 dark:border-border pb-1.5 mb-6 flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.25em] font-extrabold text-foreground">
        <span>
          {searchQuery
            ? `SEARCH ARCHIVES • QUERY: “${searchQuery.toUpperCase()}”`
            : selectedCategory
            ? `${selectedCategory.toUpperCase()}${selectedSubcategory ? ` › ${selectedSubcategory.toUpperCase()}` : ""} • DEPARTMENT FOLIO`
            : "The Front Page • Lead Inquiries"}
        </span>
        <span className="hidden sm:inline font-serif italic font-normal normal-case text-muted-foreground">
          Transmitted via digital telegraph &bull; Edition of Record
        </span>
        <span>Section 1 &bull; Folio A</span>
      </div>

      {/* Search / Category Filter Indicator Banner */}
      {(searchQuery || selectedCategory || selectedSubcategory) && (
        <div className="mb-8 p-3.5 bg-secondary/35 border-2 border-foreground/90 dark:border-border shadow-[3px_3px_0px_0px_rgba(28,24,21,0.8)] dark:shadow-[3px_3px_0px_0px_rgba(237,231,220,0.2)] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-sans font-black uppercase tracking-widest bg-foreground text-background px-2 py-0.5 rounded-2xs">
              {searchQuery ? "Search Query" : selectedSubcategory ? "Subcategory Desk" : "Department Desk"}
            </span>
            <span className="font-serif font-bold text-sm sm:text-base text-foreground">
              {searchQuery
                ? `Search results for “${searchQuery}” (${filteredPosts.length} ${filteredPosts.length === 1 ? "inquiry" : "inquiries"} found)`
                : `Viewing dispatches exclusively under “${selectedCategory}${selectedSubcategory ? ` › ${selectedSubcategory}` : ""}” (${filteredPosts.length} ${filteredPosts.length === 1 ? "inquiry" : "inquiries"} filed)`}
            </span>
          </div>
          <Link
            href="/"
            className="text-xs font-sans uppercase font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>&times; Clear Filter & View All</span>
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
          {/* SECTION I: PRIMARY LEAD STORY */}
          {featuredPost && (
            <section className="pb-10 mb-10 border-b-2 border-foreground/90 dark:border-border">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-widest font-extrabold text-amber-800 dark:text-amber-400">
                    <span className="inline-block w-2 h-2 bg-foreground" />
                    <span>SPECIAL DISPATCH</span>
                    <span>&bull;</span>
                    <span>{featuredPost.category}</span>
                    {featuredPost.subcategory && (
                      <>
                        <span>&bull;</span>
                        <span className="text-muted-foreground font-semibold">{featuredPost.subcategory}</span>
                      </>
                    )}
                  </div>

                  <h1 className="font-serif font-black text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-[1.1] text-foreground tracking-tight">
                    <Link
                      href={`/post/${featuredPost.id}`}
                      className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                    >
                      {featuredPost.title}
                    </Link>
                  </h1>

                  <p className="font-serif text-sm sm:text-base text-foreground/80 leading-relaxed max-w-2xl">
                    <span className="font-sans font-bold uppercase tracking-wider text-[11px] mr-1.5 text-foreground/70">
                      [NEW DELHI] &mdash;
                    </span>
                    {featuredPost.excerpt}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-sans text-muted-foreground">
                    <span className="font-bold text-foreground">
                      By {featuredPost.author}
                    </span>
                    <span>&bull;</span>
                    <span>{featuredPost.date}</span>
                    <span>&bull;</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredPost.readTime}</span>
                    </span>
                    {featuredPost.likesCount > 0 && (
                      <>
                        <span>&bull;</span>
                        <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 font-bold">
                          <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                          <span>{featuredPost.likesCount} Applauds</span>
                        </span>
                      </>
                    )}
                  </div>

                  <div className="pt-3">
                    <Link
                      href={`/post/${featuredPost.id}`}
                      className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-extrabold px-5 py-2.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <span>READ FULL DISPATCH</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full border-2 border-foreground/90 p-1.5 bg-background shadow-[6px_6px_0px_0px_rgba(28,24,21,0.9)] dark:shadow-[6px_6px_0px_0px_rgba(237,231,220,0.2)]">
                    <div className="relative h-full w-full overflow-hidden bg-secondary/30">
                      <Image
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        fill
                        priority
                        className="object-cover grayscale contrast-110 hover:scale-104 transition-transform duration-700"
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

          {/* SECONDARY BROADSHEET 3-COLUMN ROW */}
          {secondaryPosts.length > 0 && (
            <div className="pb-10 mb-10 border-b-2 border-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {secondaryPosts.slice(0, 3).map((post, idx) => (
                <div
                  key={post.id}
                  className={`space-y-3 ${
                    idx !== 0 ? "md:border-l md:border-border md:pl-8" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest font-extrabold text-amber-800 dark:text-amber-400">
                    <span className="inline-block w-1.5 h-1.5 bg-foreground" />
                    <span>{post.category}</span>
                    <span>&bull;</span>
                    <span className="text-muted-foreground font-normal">{post.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold leading-snug text-foreground">
                    <Link
                      href={`/post/${post.id}`}
                      className="hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="font-serif text-xs text-foreground/75 leading-relaxed line-clamp-3">
                    <span className="font-sans font-bold uppercase tracking-wider text-[10px] mr-1 text-foreground/60">
                      [DISPATCH] &mdash;
                    </span>
                    {post.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-sans text-muted-foreground border-t border-border/40">
                    <span className="font-semibold text-foreground/80">By {post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Main Newspaper Grid: Additional Manuscripts + Column 3 (The Folio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left 8 Columns: Remaining Inquiries & Manuscripts */}
        <div className="lg:col-span-8 space-y-10">
          <div className="border-b-2 border-foreground pb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-foreground" />
              <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">
                {selectedCategory
                  ? `${selectedCategory} Department Manuscripts`
                  : "Chronicle Essays & Dispatches"}
              </h2>
            </div>
            <span className="text-xs font-sans uppercase font-bold text-muted-foreground tracking-wider">
              {filteredPosts.length} Total {filteredPosts.length === 1 ? "Piece" : "Pieces"} Filed
            </span>
          </div>

          {remainingGridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {remainingGridPosts.map((post) => (
                <article key={post.id} className="space-y-3 group text-left">
                  <div className="relative aspect-16/10 w-full border-2 border-foreground/80 dark:border-border p-1 bg-background shadow-[4px_4px_0px_0px_rgba(28,24,21,0.85)] dark:shadow-[4px_4px_0px_0px_rgba(237,231,220,0.15)]">
                    <div className="relative h-full w-full overflow-hidden bg-secondary/30">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover grayscale contrast-105 group-hover:scale-104 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest font-extrabold text-amber-800 dark:text-amber-400">
                    <span className="inline-block w-1.5 h-1.5 bg-foreground" />
                    <span>{post.category}</span>
                    <span>&bull;</span>
                    <span className="text-muted-foreground font-normal">{post.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold leading-snug text-foreground group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                    <Link href={`/post/${post.id}`}>{post.title}</Link>
                  </h3>
                  <p className="font-serif text-xs text-foreground/75 leading-relaxed line-clamp-2">
                    <span className="font-sans font-bold uppercase tracking-wider text-[10px] mr-1 text-foreground/60">
                      [DISPATCH] &mdash;
                    </span>
                    {post.excerpt}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-sans text-muted-foreground border-t border-border/50">
                    <span className="font-semibold text-foreground/80">By {post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-6 px-4 border border-dashed border-border text-center space-y-2">
              <p className="font-serif italic text-sm text-muted-foreground">
                {selectedCategory
                  ? `All current dispatches under “${selectedCategory}” are featured above in Section I.`
                  : "All current dispatches are featured above."}
              </p>
            </div>
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

        <div className="lg:col-span-4 lg:border-l-2 lg:border-foreground/80 dark:lg:border-border lg:pl-10">
          <div className="sticky top-24 space-y-8">
            <div>
              <div className="border-b-2 border-foreground pb-2 mb-6 flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
                  {selectedCategory ? `${selectedCategory}: Top Read` : "The Folio: Most Read"}
                </h3>
                <span className="text-[10px] font-sans font-extrabold uppercase px-1.5 py-0.5 bg-red-700 text-white rounded-xs">
                  Most Liked
                </span>
              </div>

              <div className="divide-y divide-border/80">
                {folioItemsToDisplay.map((pick, i) => {
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
                    <div key={pick.id || pick.num || i} className="py-4.5 group">
                      <Link
                        href={pick.id ? `/post/${pick.id}` : "#"}
                        className="flex items-start gap-4 block"
                      >
                        <span className={`font-serif text-3xl font-black ${colors[i % colors.length]} leading-none`}>
                          {pick.num}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase tracking-wider font-sans font-bold ${tagColors[i % tagColors.length]}`}>
                              {pick.category}
                            </span>
                            {pick.likesCount > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-sans font-bold text-red-700 dark:text-red-400">
                                <Heart className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                                <span>{pick.likesCount}</span>
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm sm:text-base font-bold leading-snug group-hover:text-red-800 dark:group-hover:text-red-300 transition-colors">
                            {pick.title}
                          </h4>
                          <p className="text-xs font-sans text-muted-foreground">
                            {pick.author} &bull; {pick.date}
                          </p>
                        </div>
                      </Link>
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
        </div>
      </div>
    </div>
  );
}
