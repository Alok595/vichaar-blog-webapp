import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

async function seed() {
  console.log('🌱 Starting database seed with Prisma & MySQL...');

  // 1. Create or upsert Demo Author / Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('author-pass-2026', salt);

  const demoAuthor = await prisma.user.upsert({
    where: { email: 'ananya.sharma@vichaar.org' },
    update: {},
    create: {
      name: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@vichaar.org',
      password: hashedPassword,
      department: 'Engineering',
      role: 'Senior Engineering Fellow',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      bio: 'Researches compute topology, compiler optimizations, and distributed state machines.',
    },
  });

  const demoDesigner = await prisma.user.upsert({
    where: { email: 'julian.vance@vichaar.org' },
    update: {},
    create: {
      name: 'Julian Vance',
      email: 'julian.vance@vichaar.org',
      password: hashedPassword,
      department: 'Design Craft',
      role: 'Senior Interface Fellow',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      bio: 'Editorial typographer and front-end craftsperson exploring the intersection of print broadsheets and web layouts.',
    },
  });

  console.log('✅ Demo authors seeded:', demoAuthor.name, ',', demoDesigner.name);

  // 2. Clear old posts and insert seed posts
  await prisma.post.deleteMany({});

  const samplePosts = [
    {
      title: "Understanding Next.js 15 Server Components & The Architecture of Modern Flux",
      subtitle: "On compute locality, latency physics, and the return to declarative rendering at the edge.",
      category: "Engineering",
      bureau: "Systems & Architecture Bureau",
      issueNo: "Dispatch No. 042",
      folioPage: "Page B1 • Sec. II",
      content: `We stand at a critical juncture in the philosophy of the open web. For over a decade, single-page application architectures slowly transformed the browser from a resilient document reader into an overburdened execution sandbox. Every interaction required shipping megabytes of compiled JavaScript over cellular networks merely to paint static text and wire event listeners to empty boxes.

This paradigm imposed a heavy cognitive and computational tax. Users on mid-tier hardware suffered under prolonged hydration pauses, battery drainage, and erratic layout shifts. The promise of the modern web was eclipsed by the ceremonial weight of the client runtime.

Next.js Server Components fundamentally invert this dynamic. By executing on the origin machine or regional edge by default, they preserve precious device memory and eliminate hydration penalties entirely. Components stream rendered HTML directly to the browser, while interactive islands are hydrated with surgical precision.

When a component needs to query a database via Prisma or read from a key-value cache, it does so within sub-millisecond proximity of the data store itself. We eliminate the notorious network waterfall where the client downloads a script, requests an API endpoint, waits for JSON, and only then constructs the DOM tree.`,
      summaryPoints: [
        "Server Components execute exclusively at build or request time, leaving zero runtime JavaScript weight in the user's browser bundle.",
        "Compute locality shifts data-fetching adjacent to relational databases, eliminating the notorious waterfalls of REST client architectures.",
        "The browser returns to its foundational purpose: an ultra-fast, accessible rendering canvas unencumbered by megabytes of framework hydration."
      ],
      authorId: demoAuthor.id,
      authorName: demoAuthor.name,
      authorRole: demoAuthor.role,
      authorAvatar: demoAuthor.avatar,
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      caption: "Fig. 1.0 • The Terminal Workspace in Delhi Studio • Architectural dissection of server-rendered pipelines.",
      readTime: "7 min read",
      wordCount: "1,420 words",
      featured: true,
      published: true,
    },
    {
      title: "The Poetics of Tailwind CSS v4: Minimal Syntax as an Aesthetic Choice",
      subtitle: "How standard CSS variables and zero-configuration compilers elevate digital typography.",
      category: "Design Craft",
      bureau: "Visual Typography & Aesthetics Bureau",
      issueNo: "Dispatch No. 041",
      folioPage: "Page C2 • Sec. III",
      content: `CSS is no longer a set of inert presentation declarations; in its fourth incarnation, Tailwind transforms the stylesheet into an ambient design language governed by native variables.

Tailwind v4 abandons JavaScript configuration files, anchoring directly into the browser's native CSS cascade and '@theme' directive. Zero-config builds compile in microseconds, allowing real-time typographic and color iterations. By eliminating the disconnect between design tokens and stylesheet authoring, developers reclaim the tactile pleasure of crafting typographic rhythm.`,
      summaryPoints: [
        "Tailwind v4 abandons JavaScript configuration files, anchoring directly into the browser's native CSS cascade.",
        "Zero-config builds compile in microseconds, allowing real-time typographic and color iterations.",
        "Custom design tokens translate into standard CSS variables effortlessly."
      ],
      authorId: demoDesigner.id,
      authorName: demoDesigner.name,
      authorRole: demoDesigner.role,
      authorAvatar: demoDesigner.avatar,
      imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop",
      caption: "Fig. 2.0 • Typographic Proofing Room • Testing variable serif proportions across tactile screens.",
      readTime: "6 min read",
      wordCount: "1,240 words",
      featured: false,
      published: true,
    },
    {
      title: "The Quiet Elegance of Zustand: Escaping Redux's Ceremony",
      subtitle: "Why the developer consciousness gravitates towards lighter weight primitives when building interactive distributed state machines.",
      category: "Frontend",
      bureau: "State Primitives Guild",
      issueNo: "Dispatch No. 039",
      folioPage: "Page D4 • Sec. I",
      content: `State management in frontend architecture has long suffered from over-engineering and excess ritual. Zustand strips away boilerplate, reducers, and context wrappers, providing a clean hook-based model that scales from tiny toggles to complex distributed UI state.`,
      summaryPoints: [
        "Boilerplate-free subscription model based on React's useSyncExternalStore.",
        "Zero provider wrappers required at the root component tree.",
        "Seamless integration with asynchronous backend workflows."
      ],
      authorId: demoAuthor.id,
      authorName: demoAuthor.name,
      authorRole: demoAuthor.role,
      authorAvatar: demoAuthor.avatar,
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      caption: "Fig. 3.0 • Reactive Dataflow Visualizer.",
      readTime: "5 min read",
      wordCount: "980 words",
      featured: false,
      published: true,
    },
    {
      title: "Why Relational Schemas & Prisma Anchor Modern Distributed Computing",
      subtitle: "Type safety, relational integrity, and the enduring power of SQL in high-scale systems.",
      category: "Architecture",
      bureau: "Systems & Architecture Bureau",
      issueNo: "Dispatch No. 038",
      folioPage: "Page B4 • Sec. II",
      content: `In an era of schema-less promises, relational integrity backed by MySQL and type-safe abstractions like Prisma remains the gold standard. When database constraints mirror domain models, entire classes of production bugs disappear before code reaches staging.`,
      summaryPoints: [
        "Foreign key constraints enforce referential integrity at the database layer.",
        "Prisma Client provides end-to-end TypeScript/JavaScript type inference.",
        "Predictable index structures ensure sub-millisecond query performance."
      ],
      authorId: demoAuthor.id,
      authorName: demoAuthor.name,
      authorRole: demoAuthor.role,
      authorAvatar: demoAuthor.avatar,
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
      caption: "Fig. 4.0 • The Distributed Schema Registry.",
      readTime: "8 min read",
      wordCount: "1,600 words",
      featured: false,
      published: true,
    }
  ];

  for (const post of samplePosts) {
    await prisma.post.create({ data: post });
  }

  console.log(`✅ Seeded ${samplePosts.length} broadsheet posts successfully into MySQL!`);
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
