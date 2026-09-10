export const POSTS_DATA = [
  {
    id: 1,
    title: "Understanding Next.js 15 Server Components & The Architecture of Modern Flux",
    subtitle: "On compute locality, latency physics, and the return to declarative rendering at the edge.",
    category: "Engineering",
    bureau: "Systems & Architecture Bureau",
    issueNo: "Dispatch No. 042",
    folioPage: "Page B1 &bull; Sec. II",
    date: "September 9, 2026",
    dateline: "NEW DELHI / DIGITAL BUREAU",
    readTime: "7 min read",
    wordCount: "1,420 words",
    themeColor: {
      badgeBg: "bg-blue-800 dark:bg-blue-900 text-white",
      borderAccent: "border-blue-800 dark:border-blue-500",
      textColor: "text-blue-800 dark:text-blue-400",
      quoteSpine: "border-l-blue-800 dark:border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
    },
    author: {
      name: "Dr. Ananya Sharma",
      role: "Principal Systems Architect",
      fellowship: "Vichaar Senior Engineering Fellow",
      bio: "Researches compute topology, compiler optimizations, and distributed state machines. Previously led systems infrastructure at several foundational open-source foundations.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    caption:
      "Fig. 1.0 &bull; The Terminal Workspace in Delhi Studio &bull; Architectural dissection of server-rendered pipelines.",
    summaryPoints: [
      "Server Components execute exclusively at build or request time, leaving zero runtime JavaScript weight in the user's browser bundle.",
      "Compute locality shifts data-fetching adjacent to relational databases, eliminating the notorious waterfalls of REST client architectures.",
      "The browser returns to its foundational purpose: an ultra-fast, accessible rendering canvas unencumbered by megabytes of framework hydration.",
    ],
    sections: [
      {
        roman: "I",
        heading: "The Weight of the Client-Side Sandbox",
        paragraphs: [
          "We stand at a critical juncture in the philosophy of the open web. For over a decade, single-page application architectures slowly transformed the browser from a resilient document reader into an overburdened execution sandbox. Every interaction required shipping megabytes of compiled JavaScript over cellular networks merely to paint static text and wire event listeners to empty boxes.",
          "This paradigm imposed a heavy cognitive and computational tax. Users on mid-tier hardware suffered under prolonged hydration pauses, battery drainage, and erratic layout shifts. The promise of the modern web was eclipsed by the ceremonial weight of the client runtime.",
        ],
      },
      {
        roman: "II",
        heading: "Compute Locality & Hydration Physics",
        paragraphs: [
          "Next.js Server Components fundamentally invert this dynamic. By executing on the origin machine or regional edge by default, they preserve precious device memory and eliminate hydration penalties entirely. Components stream rendered HTML directly to the browser, while interactive islands are hydrated with surgical precision.",
          "When a component needs to query a database via Prisma or read from a key-value cache, it does so within sub-millisecond proximity of the data store itself. We eliminate the notorious network waterfall where the client downloads a script, requests an API endpoint, waits for JSON, and only then constructs the DOM tree.",
        ],
      },
      {
        roman: "III",
        heading: "Reclaiming the Composable Unix Philosophy",
        paragraphs: [
          "When architecting applications with modern Server Actions and asynchronous React primitives, we rediscover the timeless Unix philosophy: small programs that do one thing with excellence, passing composable streams of data through transparent pipelines.",
          "As engineers and digital essayists, our duty is not merely to write code that compiles, but to craft durable systems that respect user attention, device longevity, and typographic clarity.",
        ],
      },
    ],
    pullQuote: {
      text: "Server components do not merely shift compute back to origin machines; they invite us to reconsider the boundaries of state, latency, and the tactile nature of rendering.",
      author: "Dr. Ananya Sharma &bull; Systems & Architecture Keynote",
    },
    editorDossier: {
      title: "Architectural Colophon & Dossier",
      content:
        "The shift to Server Components marks the definitive end of the 'download-everything-first' client era. By establishing compute locality at the edge, Next.js 15 bridges the raw performance of static broadsheet publishing with the dynamic agility of cloud computing.",
    },
    codeSnippet: {
      filename: "app/feed/page.js",
      language: "jsx",
      code: `// Async Server Component — Executes at the Edge origin
export default async function DispatchFeed() {
  // Direct zero-latency database query without client API fetch
  const dispatches = await prisma.essay.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return (
    <section className="broadsheet-grid">
      {dispatches.map((essay) => (
        <DispatchCard key={essay.id} essay={essay} />
      ))}
    </section>
  );
}`,
    },
    relatedDispatches: [
      {
        id: 2,
        title: "The Poetics of Tailwind CSS v4: Minimal Syntax as an Aesthetic Choice",
        category: "Design Craft",
        author: "Julian Vance",
        readTime: "6 min read",
      },
      {
        id: 3,
        title: "The Quiet Elegance of Zustand: Escaping Redux's Ceremony",
        category: "Frontend",
        author: "Marcus Sterling",
        readTime: "5 min read",
      },
    ],
  },
  {
    id: 2,
    title: "The Poetics of Tailwind CSS v4: Minimal Syntax as an Aesthetic Choice",
    subtitle: "How standard CSS variables and zero-configuration compilers elevate digital typography.",
    category: "Design & Craft",
    bureau: "Visual Typography & Aesthetics Bureau",
    issueNo: "Dispatch No. 041",
    folioPage: "Page C2 &bull; Sec. III",
    date: "September 5, 2026",
    dateline: "BOMBAY / DESIGN GUILD",
    readTime: "6 min read",
    wordCount: "1,240 words",
    themeColor: {
      badgeBg: "bg-amber-800 dark:bg-amber-900 text-white",
      borderAccent: "border-amber-800 dark:border-amber-500",
      textColor: "text-amber-800 dark:text-amber-400",
      quoteSpine: "border-l-amber-800 dark:border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
    },
    author: {
      name: "Julian Vance",
      role: "Senior Interface Fellow",
      fellowship: "Vichaar Aesthetics Guild",
      bio: "Editorial typographer and front-end craftsperson exploring the intersection between 19th-century broadsheets and contemporary CSS layout engines.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop",
    caption:
      "Fig. 2.0 &bull; Typographic Proofing Room &bull; Testing variable serif proportions across tactile screens.",
    summaryPoints: [
      "Tailwind v4 abandons JavaScript configuration files, anchoring directly into the browser's native CSS cascade and '@theme' directive.",
      "Zero-config builds compile in microseconds, allowing real-time typographic and color iterations.",
      "Digital typography gains the precision of archival broadsheets through native CSS font metrics and fluid type scales.",
    ],
    sections: [
      {
        roman: "I",
        heading: "The Return to Native Browser Primitives",
        paragraphs: [
          "For years, web development was plagued by heavy configuration files. We spent hours maintaining build orchestrations, babel plugins, and webpack loaders just to compile styling rules. Tailwind CSS v4 arrives with a radical philosophical shift: it anchors directly into the native browser cascade via modern CSS variables and '@theme' definitions.",
          "Rather than depending upon monolithic JavaScript configuration files, the styling engine compiles stylesheets at lightning speeds using a native Rust core, returning developers to the pure immediacy of writing CSS.",
        ],
      },
      {
        roman: "II",
        heading: "The Precision of Digital Broadsheets",
        paragraphs: [
          "Great typography has always demanded restraint. When designing reading experiences, the subtle balance between letter-spacing, line-height, and contrast defines whether an essay is merely scanned or deeply absorbed.",
          "With Tailwind v4, defining fluid typographic scales that harmonize across phone screens and 4K cinema displays becomes second nature. The living medium of the browser finally rivals the venerable beauty of inked linen rag.",
        ],
      },
    ],
    pullQuote: {
      text: "When typography is treated with reverence, words cease to be mere pixels on glass; they become physical vessels for thought.",
      author: "Julian Vance &bull; The Manifesto of Digital Broadsheets",
    },
    editorDossier: {
      title: "Typographic Notes",
      content:
        "The Vichaar editorial system utilizes Newsreader Serif paired with Geist Sans, calibrated with 1.85 line-height and classical Indian press broadsheet proportions.",
    },
    codeSnippet: {
      filename: "globals.css",
      language: "css",
      code: `@import "tailwindcss";

@theme {
  --font-serif: "Newsreader", Georgia, serif;
  --color-paper-ivory: #f5f1e8;
  --color-ink-obsidian: #1c1815;
}`,
    },
    relatedDispatches: [
      {
        id: 1,
        title: "Understanding Next.js 15 Server Components & Modern Flux",
        category: "Engineering",
        author: "Dr. Ananya Sharma",
        readTime: "7 min read",
      },
      {
        id: 3,
        title: "The Quiet Elegance of Zustand: Escaping Redux's Ceremony",
        category: "Frontend",
        author: "Marcus Sterling",
        readTime: "5 min read",
      },
    ],
  },
  {
    id: 3,
    title: "The Quiet Elegance of Zustand: Escaping Redux's Ceremony",
    subtitle: "Simplified state machines and the resurgence of minimalist reactivity in React 19.",
    category: "Perspectives",
    bureau: "Frontend Craft & Tooling Bureau",
    issueNo: "Dispatch No. 040",
    folioPage: "Page D1 &bull; Sec. IV",
    date: "August 28, 2026",
    dateline: "BANGALORE / OPEN LABS",
    readTime: "5 min read",
    wordCount: "1,080 words",
    themeColor: {
      badgeBg: "bg-emerald-800 dark:bg-emerald-900 text-white",
      borderAccent: "border-emerald-800 dark:border-emerald-500",
      textColor: "text-emerald-800 dark:text-emerald-400",
      quoteSpine: "border-l-emerald-800 dark:border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20",
    },
    author: {
      name: "Marcus Sterling",
      role: "Distributed Systems Researcher",
      fellowship: "Vichaar Computational Fellow",
      bio: "Writes about micro-frontends, event sourcing, and the psychology of tool complexity in high-throughput applications.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    caption:
      "Fig. 3.0 &bull; Network Metrics & Memory Footprint &bull; Profiling lean state stores under load.",
    summaryPoints: [
      "Zustand eliminates context provider nesting, allowing components to subscribe solely to the precise atomic state slices they render.",
      "Zero boilerplate: stores are defined with simple closures, avoiding actions, reducers, and dispatch hierarchies.",
      "Blazing performance through unbundled selector subscriptions and decoupled outside-React store access.",
    ],
    sections: [
      {
        roman: "I",
        heading: "The Trap of Architectural Over-Engineering",
        paragraphs: [
          "In software development, we often mistakenly equate complexity of tooling with sophistication of thought. When Redux first entered the React ecosystem, it solved a real problem: coordinating state across deeply nested trees. But over time, the ceremony of actions, action creators, reducers, selectors, and middleware became a labyrinth.",
          "Zustand represents a return to sanity. It reminds us that a state store can be as simple as an event emitter with a getter and setter.",
        ],
      },
      {
        roman: "II",
        heading: "Selective Reactivity & Minimalist Flux",
        paragraphs: [
          "By bypassing context provider nesting, components subscribe only to the slices of state they truly care about. When slice A changes, component B does not re-render.",
          "The result is fewer re-renders, cleaner mental models, and an application that feels snappy, light, and enduring.",
        ],
      },
    ],
    pullQuote: {
      text: "Simplicity is not a lack of capability; it is the ultimate achievement of architectural restraint.",
      author: "Marcus Sterling &bull; The Minimalist Architect",
    },
    editorDossier: {
      title: "Statecraft Synthesis",
      content:
        "Modern React 19 applications thrive when state is divided into two clear domains: server-cached queries handled at origin, and tiny, localized Zustand stores for transient client interaction.",
    },
    codeSnippet: {
      filename: "store/useJournalStore.js",
      language: "javascript",
      code: `import { create } from "zustand";

export const useJournalStore = create((set) => ({
  readingSize: "normal",
  setReadingSize: (size) => set({ readingSize: size }),
  bookmarks: [],
  toggleBookmark: (id) =>
    set((state) => ({
      bookmarks: state.bookmarks.includes(id)
        ? state.bookmarks.filter((b) => b !== id)
        : [...state.bookmarks, id],
    })),
}));`,
    },
    relatedDispatches: [
      {
        id: 1,
        title: "Understanding Next.js 15 Server Components",
        category: "Engineering",
        author: "Dr. Ananya Sharma",
        readTime: "7 min read",
      },
      {
        id: 2,
        title: "The Poetics of Tailwind CSS v4",
        category: "Design Craft",
        author: "Julian Vance",
        readTime: "6 min read",
      },
    ],
  },
];
