export const NAV_SECTIONS = [
  {
    name: "Latest Essays",
    href: "/",
    accentColor: "text-red-700 dark:text-red-400",
    activeBar: "bg-red-700 dark:bg-red-500",
    accentDot: "bg-red-600",
  },
  {
    name: "Engineering",
    href: "/?category=Engineering",
    accentColor: "text-blue-800 dark:text-blue-400",
    activeBar: "bg-blue-800 dark:bg-blue-400",
    topBorder: "border-t-4 border-t-blue-800 dark:border-t-blue-500",
    tagColor: "bg-blue-800 dark:bg-blue-900 text-white",
    subcategories: [
      {
        name: "Systems & Architecture",
        desc: "Server components, latency physics, and scalable edge pipelines",
        href: "/?category=Engineering",
      },
      {
        name: "Relational Schemas & Prisma",
        desc: "Type-safe database modeling with MySQL and schema migrations",
        href: "/?category=Engineering",
      },
      {
        name: "Minimalist Statecraft",
        desc: "Decoupled flux stores with Zustand and modern React 19 hooks",
        href: "/?category=Engineering",
      },
      {
        name: "Network & Cloud Edge",
        desc: "Microservice topologies, caching layers, and resilient origin nodes",
        href: "/?category=Engineering",
      },
    ],
  },
  {
    name: "Design & Craft",
    href: "/?category=Design+%26+Craft",
    accentColor: "text-amber-800 dark:text-amber-400",
    activeBar: "bg-amber-800 dark:bg-amber-400",
    topBorder: "border-t-4 border-t-amber-800 dark:border-t-amber-500",
    tagColor: "bg-amber-800 dark:bg-amber-900 text-white",
    subcategories: [
      {
        name: "Digital Typography",
        desc: "Serif proportions, editorial drop caps, and comfortable reading rhythm",
        href: "/?category=Design+%26+Craft",
      },
      {
        name: "Tailwind v4 Engine",
        desc: "CSS native variables, zero-config styling, and bespoke themes",
        href: "/?category=Design+%26+Craft",
      },
      {
        name: "Tactile Newsprint UI",
        desc: "Translating century-old broadsheet print craft into responsive browsers",
        href: "/?category=Design+%26+Craft",
      },
    ],
  },
  {
    name: "Perspectives",
    href: "/?category=Perspectives",
    accentColor: "text-emerald-800 dark:text-emerald-400",
    activeBar: "bg-emerald-800 dark:bg-emerald-400",
    topBorder: "border-t-4 border-t-emerald-800 dark:border-t-emerald-500",
    tagColor: "bg-emerald-800 dark:bg-emerald-900 text-white",
    subcategories: [
      {
        name: "Computational Philosophy",
        desc: "Deliberate inquiries on tools, cognition, and intentional software",
        href: "/?category=Perspectives",
      },
      {
        name: "Architectural Critiques",
        desc: "Long-form analytical dissections of modern full-stack workflows",
        href: "/?category=Perspectives",
      },
      {
        name: "The Open Web",
        desc: "Advocating for author sovereignty, syndicated feeds, and durability",
        href: "/?category=Perspectives",
      },
    ],
  },
  {
    name: "AI & Neural",
    href: "/?category=AI+%26+Neural",
    accentColor: "text-purple-800 dark:text-purple-400",
    activeBar: "bg-purple-800 dark:bg-purple-400",
    topBorder: "border-t-4 border-t-purple-800 dark:border-t-purple-500",
    tagColor: "bg-purple-800 dark:bg-purple-900 text-white",
    subcategories: [
      {
        name: "Large Models & Reasoning",
        desc: "Foundational transformer architectures, attention mechanisms, and benchmarks",
        href: "/?category=AI+%26+Neural",
      },
      {
        name: "Agentic Workflows",
        desc: "Autonomous reasoning loops, multi-agent systems, and tool execution",
        href: "/?category=AI+%26+Neural",
      },
      {
        name: "Human-Machine Alignment",
        desc: "Ethical boundaries, interpretability, and the future of human intellect",
        href: "/?category=AI+%26+Neural",
      },
    ],
  },
  {
    name: "Culture & Society",
    href: "/?category=Culture+%26+Society",
    accentColor: "text-rose-800 dark:text-rose-400",
    activeBar: "bg-rose-800 dark:bg-rose-400",
    topBorder: "border-t-4 border-t-rose-800 dark:border-t-rose-500",
    tagColor: "bg-rose-800 dark:bg-rose-900 text-white",
    subcategories: [
      {
        name: "Digital Public Squares",
        desc: "The evolution of communal debate, civic discourse, and platform gatekeeping",
        href: "/?category=Culture+%26+Society",
      },
      {
        name: "Media Ecology",
        desc: "How communication mediums shape cognitive perception and cultural norms",
        href: "/?category=Culture+%26+Society",
      },
      {
        name: "The Attention Economy",
        desc: "Resisting algorithmic fragmentation through deliberate long-form immersion",
        href: "/?category=Culture+%26+Society",
      },
    ],
  },
  {
    name: "Science & Cosmos",
    href: "/?category=Science+%26+Cosmos",
    accentColor: "text-cyan-800 dark:text-cyan-400",
    activeBar: "bg-cyan-800 dark:bg-cyan-400",
    topBorder: "border-t-4 border-t-cyan-800 dark:border-t-cyan-500",
    tagColor: "bg-cyan-800 dark:bg-cyan-900 text-white",
    subcategories: [
      {
        name: "Quantum Computation",
        desc: "Superposition algorithms, error correction, and quantum hardware roadmaps",
        href: "/?category=Science+%26+Cosmos",
      },
      {
        name: "Complex Systems",
        desc: "Emergent phenomena, nonlinear dynamics, and statistical physics in nature",
        href: "/?category=Science+%26+Cosmos",
      },
      {
        name: "Astrophysics & Space",
        desc: "Deep space observation, cosmological frontiers, and planetary exploration",
        href: "/?category=Science+%26+Cosmos",
      },
    ],
  },
  {
    name: "Book Dispatches",
    href: "/?category=Book+Dispatches",
    accentColor: "text-orange-800 dark:text-orange-400",
    activeBar: "bg-orange-800 dark:bg-orange-400",
    topBorder: "border-t-4 border-t-orange-800 dark:border-t-orange-500",
    tagColor: "bg-orange-800 dark:bg-orange-900 text-white",
    subcategories: [
      {
        name: "Critical Reviews",
        desc: "In-depth analytical dissections of contemporary technical and philosophical treatises",
        href: "/?category=Book+Dispatches",
      },
      {
        name: "Essays on Classics",
        desc: "Revisiting foundational texts of computer science and literature",
        href: "/?category=Book+Dispatches",
      },
      {
        name: "Author Dialogues",
        desc: "Unedited long-form conversations with authors, engineers, and theorists",
        href: "/?category=Book+Dispatches",
      },
    ],
  },
  { name: "About the Journal", href: "/about" },
  { name: "Author Desk", href: "/login", isSpecial: true },
];
