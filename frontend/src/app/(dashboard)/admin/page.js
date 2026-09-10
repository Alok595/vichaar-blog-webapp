"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Feather,
  Send,
  CheckCircle2,
  FileText,
  ArrowLeft,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { api } from "@/lib/api";
import { useAdminContext } from "@/lib/adminContext";

import StatsBar from "@/components/admin/StatsBar";
import MyPostsList from "@/components/admin/MyPostsList";
import SummaryPoints from "@/components/admin/SummaryPoints";
import DepartmentSelector from "@/components/admin/DepartmentSelector";
import SubcategorySelector from "@/components/admin/SubcategorySelector";
import ManuscriptEditor from "@/components/admin/ManuscriptEditor";



const DEFAULT_DEPARTMENTS = [
  "Engineering",
  "Design & Craft",
  "Perspectives",
  "AI & Neural",
  "Culture & Society",
  "Science & Cosmos",
  "Book Dispatches",
  "Frontend & React Patterns",
  "Architecture & Databases",
  "Humanities & Philosophy",
];

const DEFAULT_SUBCATEGORIES = {
  Engineering: [
    { name: "Systems & Architecture", desc: "Server components, latency physics, and scalable edge pipelines" },
    { name: "Relational Schemas & Prisma", desc: "Type-safe database modeling with MySQL and schema migrations" },
    { name: "Minimalist Statecraft", desc: "Decoupled flux stores with Zustand and modern React 19 hooks" },
    { name: "Network & Cloud Edge", desc: "Microservice topologies, caching layers, and resilient origin nodes" },
  ],
  "Design & Craft": [
    { name: "Digital Typography", desc: "Serif proportions, editorial drop caps, and comfortable reading rhythm" },
    { name: "Tailwind v4 Engine", desc: "CSS native variables, zero-config styling, and bespoke themes" },
    { name: "Tactile Newsprint UI", desc: "Translating century-old broadsheet print craft into responsive browsers" },
  ],
  Perspectives: [
    { name: "Computational Philosophy", desc: "Deliberate inquiries on tools, cognition, and intentional software" },
    { name: "Architectural Critiques", desc: "Long-form analytical dissections of modern full-stack workflows" },
    { name: "The Open Web", desc: "Advocating for author sovereignty, syndicated feeds, and durability" },
  ],
  "AI & Neural": [
    { name: "Large Models & Reasoning", desc: "Foundational transformer architectures, attention mechanisms, and benchmarks" },
    { name: "Agentic Workflows", desc: "Autonomous reasoning loops, multi-agent systems, and tool execution" },
    { name: "Human-Machine Alignment", desc: "Ethical boundaries, interpretability, and the future of human intellect" },
  ],
  "Culture & Society": [
    { name: "Digital Public Squares", desc: "The evolution of communal debate, civic discourse, and platform gatekeeping" },
    { name: "Media Ecology", desc: "How communication mediums shape cognitive perception and cultural norms" },
    { name: "The Attention Economy", desc: "Resisting algorithmic fragmentation through deliberate long-form immersion" },
  ],
  "Science & Cosmos": [
    { name: "Quantum Computation", desc: "Superposition algorithms, error correction, and quantum hardware roadmaps" },
    { name: "Complex Systems", desc: "Emergent phenomena, nonlinear dynamics, and statistical physics in nature" },
    { name: "Astrophysics & Space", desc: "Deep space observation, cosmological frontiers, and planetary exploration" },
  ],
  "Book Dispatches": [
    { name: "Critical Reviews", desc: "In-depth analytical dissections of contemporary technical and philosophical treatises" },
    { name: "Essays on Classics", desc: "Revisiting foundational texts of computer science and literature" },
    { name: "Author Dialogues", desc: "Unedited long-form conversations with authors, engineers, and theorists" },
  ],
};



const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const formatRoman = (n) => ROMAN[n - 1] || `${n}`;

function compileVisualToMarkdown(intro, sections) {
  let out = intro ? intro.trim() : "";
  for (const sec of sections) {
    if (sec.heading?.trim() || sec.body?.trim()) {
      if (out) out += "\n\n";
      if (sec.heading?.trim()) out += `## ${sec.heading.trim()}\n`;
      if (sec.body?.trim()) out += sec.body.trim();
    }
  }
  return out;
}

function parseMarkdownToVisual(text) {
  if (!text) return { intro: "", sections: [{ id: "sec-1", heading: "", body: "" }] };

  const lines = text.split("\n");
  const introLines = [];
  const sections = [];
  let current = null;
  let foundHeading = false;

  for (const line of lines) {
    if (line.trim().startsWith("#")) {
      foundHeading = true;
      if (current) sections.push(current);
      current = { id: `sec-${sections.length + 1}-${Date.now()}`, heading: line.trim().replace(/^#+\s*/, ""), body: "" };
    } else {
      if (!foundHeading) introLines.push(line);
      else if (current) current.body += (current.body ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);

  return {
    intro: introLines.join("\n").trim(),
    sections: sections.length > 0 ? sections : [{ id: "sec-1", heading: "", body: "" }],
  };
}

function parseSectionsFromContent(rawContent) {
  const lines = rawContent.split("\n");
  if (!lines.some((l) => l.trim().startsWith("#"))) return [];

  const sections = [];
  let current = null;
  let idx = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) {
      if (current?.paragraphs.length > 0) sections.push(current);
      current = { roman: formatRoman(idx++), heading: trimmed.replace(/^#+\s*/, ""), paragraphs: [] };
    } else if (trimmed && current) {
      current.paragraphs.push(trimmed);
    }
  }
  if (current?.paragraphs.length > 0) sections.push(current);
  return sections;
}



export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { activeTab, setActiveTab, myPosts, setMyPosts, isLoadingPosts, fetchMyPosts, registerStartNewDraftCallback } = useAdminContext();

  const [hasMounted, setHasMounted] = useState(false);


  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryDesc, setSubcategoryDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");


  const [editorMode, setEditorMode] = useState("visual");
  const [introText, setIntroText] = useState("");
  const [visualSections, setVisualSections] = useState([{ id: "sec-1", heading: "", body: "" }]);


  const [summaryPoint1, setSummaryPoint1] = useState("");
  const [summaryPoint2, setSummaryPoint2] = useState("");
  const [summaryPoint3, setSummaryPoint3] = useState("");


  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);


  const [departmentsList, setDepartmentsList] = useState(DEFAULT_DEPARTMENTS);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [customSubcategoriesMap, setCustomSubcategoriesMap] = useState({});
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryDesc, setNewSubcategoryDesc] = useState("");

  useEffect(() => { setHasMounted(true); }, []);

  // Load saved custom taxonomy from localStorage
  useEffect(() => {
    try {
      const savedDeps = localStorage.getItem("vichaar_custom_departments");
      if (savedDeps) {
        const parsed = JSON.parse(savedDeps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDepartmentsList(Array.from(new Set([...DEFAULT_DEPARTMENTS, ...parsed])));
        }
      }
      const savedSubs = localStorage.getItem("vichaar_custom_subcategories");
      if (savedSubs) {
        const parsed = JSON.parse(savedSubs);
        if (parsed && typeof parsed === "object") setCustomSubcategoriesMap(parsed);
      }
    } catch (e) {
      console.warn("Could not load custom taxonomy:", e);
    }
  }, []);

  const getAvailableSubcategories = () => [
    ...(DEFAULT_SUBCATEGORIES[category] || []),
    ...(customSubcategoriesMap[category] || []),
  ];



  const handleSaveCustomDepartment = () => {
    const name = newDepartmentName.trim();
    if (!name) return;
    const updated = Array.from(new Set([...departmentsList, name]));
    setDepartmentsList(updated);
    setCategory(name);
    try {
      localStorage.setItem("vichaar_custom_departments", JSON.stringify(updated.filter((d) => !DEFAULT_DEPARTMENTS.includes(d))));
    } catch (e) { /* ignore */ }
    setNewDepartmentName("");
    setIsAddingDepartment(false);
  };

  const handleSaveCustomSubcategory = () => {
    const name = newSubcategoryName.trim();
    if (!name) return;
    const subObj = { name, desc: newSubcategoryDesc.trim() || `Specialized focus under ${category}` };
    const updated = {
      ...customSubcategoriesMap,
      [category]: [...(customSubcategoriesMap[category] || []).filter((s) => s.name !== name), subObj],
    };
    setCustomSubcategoriesMap(updated);
    setSubcategory(name);
    setSubcategoryDesc(subObj.desc);
    try { localStorage.setItem("vichaar_custom_subcategories", JSON.stringify(updated)); } catch (e) { /* ignore */ }
    setNewSubcategoryName("");
    setNewSubcategoryDesc("");
    setIsAddingSubcategory(false);
  };

  const handleStartNewDraft = () => {
    setEditingPostId(null);
    setTitle(""); setSubtitle(""); setCategory(user?.department || "Engineering");
    setSubcategory(""); setSubcategoryDesc(""); setImageUrl(""); setContent("");
    setIntroText("");
    setVisualSections([{ id: "sec-1", heading: "", body: "" }]);
    setSummaryPoint1(""); setSummaryPoint2(""); setSummaryPoint3("");
    setIsAddingDepartment(false); setNewDepartmentName("");
    setIsAddingSubcategory(false); setNewSubcategoryName(""); setNewSubcategoryDesc("");
    setIsPublished(false); setErrorMessage(""); setSuccessMessage("");
    setActiveTab("draft");
  };

  useEffect(() => { registerStartNewDraftCallback(() => handleStartNewDraft); }, [user]);

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title || "");
    setSubtitle(post.subtitle || "");
    setCategory(post.category || "Engineering");
    setSubcategory(post.subcategory || "");
    setSubcategoryDesc(post.subcategoryDesc || "");
    setImageUrl(post.imageUrl || "");
    setContent(post.content || "");

    let secs = post.sections;
    if (typeof secs === "string") { try { secs = JSON.parse(secs); } catch { secs = null; } }

    if (Array.isArray(secs) && secs.length > 0) {
      const firstH = (post.content || "").indexOf("##");
      setIntroText(firstH > 0 ? post.content.slice(0, firstH).trim() : "");
      setVisualSections(secs.map((s, i) => ({
        id: `sec-${i + 1}-${Date.now()}`,
        heading: s.heading || "",
        body: Array.isArray(s.paragraphs) ? s.paragraphs.join("\n\n") : (s.body || ""),
      })));
    } else {
      const parsed = parseMarkdownToVisual(post.content || "");
      setIntroText(parsed.intro);
      setVisualSections(parsed.sections);
    }

    let pts = post.summaryPoints;
    if (typeof pts === "string") { try { pts = JSON.parse(pts); } catch { pts = []; } }
    if (Array.isArray(pts)) {
      setSummaryPoint1(pts[0] || ""); setSummaryPoint2(pts[1] || ""); setSummaryPoint3(pts[2] || "");
    } else {
      setSummaryPoint1(""); setSummaryPoint2(""); setSummaryPoint3("");
    }

    setIsPublished(false); setErrorMessage(""); setSuccessMessage("");
    setActiveTab("draft");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you certain you wish to retract and permanently delete this dispatch?")) return;
    setDeletingId(postId);
    try {
      await api.deletePost(postId);
      setMyPosts((prev) => prev.filter((p) => p.id !== postId));
      setSuccessMessage("Dispatch successfully retracted from archive.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to delete post. Authorization denied.");
    } finally {
      setDeletingId(null);
    }
  };

  const autoExtractSummary = () => {
    const text = editorMode === "visual"
      ? [introText, ...visualSections.map((s) => s.body)].filter(Boolean).join("\n\n")
      : content;
    if (!text.trim()) { alert("Please write some manuscript content first."); return; }
    const sentences = text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter((s) => s.length > 20 && !s.startsWith("#"));
    setSummaryPoint1(sentences[0] || subtitle || "Core architectural thesis and premise.");
    setSummaryPoint2(sentences[1] || "Critical evaluation of computational dynamics.");
    setSummaryPoint3(sentences[2] || "Practical conclusions for contemporary craft.");
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setErrorMessage(""); setSuccessMessage("");

    let finalContent = content.trim();
    let finalSections = null;

    if (editorMode === "visual") {
      finalContent = compileVisualToMarkdown(introText, visualSections);
      const valid = visualSections.filter((s) => s.heading?.trim() || s.body?.trim());
      if (valid.length > 0) {
        finalSections = valid.map((s, idx) => ({
          roman: formatRoman(idx + 1),
          heading: s.heading.trim() || `Section ${formatRoman(idx + 1)}`,
          paragraphs: s.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        }));
      }
    } else {
      finalSections = parseSectionsFromContent(finalContent);
      if (finalSections.length === 0) finalSections = null;
    }

    if (!title.trim() || !finalContent) {
      setErrorMessage("Please furnish both an essay headline and manuscript body.");
      return;
    }

    setIsPublishing(true);
    try {
      const points = [summaryPoint1, summaryPoint2, summaryPoint3].map((p) => p.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        category,
        subcategory: subcategory.trim() || null,
        subcategoryDesc: subcategoryDesc.trim() || null,
        content: finalContent,
        summaryPoints: points.length > 0 ? points : null,
        sections: finalSections,
        imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        readTime: `${Math.max(3, Math.ceil(finalContent.split(/\s+/).length / 200))} min read`,
        published: true,
      };

      if (editingPostId) {
        await api.updatePost(editingPostId, payload);
        setSuccessMessage("Dispatch revisions printed and syndicated successfully!");
      } else {
        await api.createPost(payload);
        setIsPublished(true);
      }
      await fetchMyPosts();
    } catch (err) {
      setErrorMessage(err.message || "Syndication failed. Please verify credentials.");
    } finally {
      setIsPublishing(false);
    }
  };



  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="font-serif italic text-muted-foreground animate-pulse">Opening Author Writing Studio...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-xl text-center">
        <div className="border-2 border-foreground/80 bg-background p-8 md:p-12 shadow-[6px_6px_0px_0px_rgba(28,24,21,0.9)]">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Feather className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-sans uppercase tracking-widest font-black text-amber-800 dark:text-amber-400 block mb-1">
            Access Required
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">Author Desk Access Locked</h1>
          <p className="font-serif text-sm text-muted-foreground mb-6 leading-relaxed">
            The Author Writing Desk is strictly reserved for accredited Vichaar Syndicate fellows.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="w-full sm:w-auto text-xs font-sans uppercase tracking-wider font-bold px-6 py-3 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors">
              Sign In to Author Desk &rarr;
            </Link>
            <Link href="/" className="w-full sm:w-auto text-xs font-sans uppercase tracking-wider font-bold px-4 py-3 border border-border hover:bg-secondary text-foreground transition-colors">
              Back to Broadsheet
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
              {activeTab === "draft" ? (editingPostId ? "Manuscript Revision" : "Editorial Desk") : "Author Archive"}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {activeTab === "draft"
              ? editingPostId ? "Edit Dispatch" : "New Dispatch Draft"
              : `My Dispatches (${myPosts.length})`}
          </h1>
        </div>

        {activeTab === "draft" && editingPostId && (
          <button onClick={handleStartNewDraft} className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider px-3 py-1.5 border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors rounded-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Cancel Edit & New Draft</span>
          </button>
        )}

        {activeTab === "my-posts" && (
          <button onClick={handleStartNewDraft} className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider px-3 py-1.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors rounded-xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Draft New Dispatch</span>
          </button>
        )}
      </div>


      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-serif flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}


      {activeTab === "draft" && (
        <>
          {isPublished ? (
            // Success confirmation screen
            <div className="border-2 border-foreground/80 bg-background p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_rgba(28,24,21,0.9)] max-w-2xl mx-auto my-8 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-sans uppercase tracking-widest font-black text-amber-800 dark:text-amber-400 block mb-1">
                Dispatch Broadcasted to Broadsheet
              </span>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-3">&ldquo;{title}&rdquo;</h2>
              <p className="font-serif text-sm text-muted-foreground mb-6 leading-relaxed">
                Your essay has been set in digital type and archived in MySQL under your author byline (<strong>{user.name}</strong>).
              </p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={handleStartNewDraft} className="text-xs font-sans uppercase font-bold px-4 py-2 border border-border hover:bg-secondary cursor-pointer">
                  Draft Another Essay
                </button>
                <button onClick={() => setActiveTab("my-posts")} className="text-xs font-sans uppercase font-bold px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer">
                  View My Dispatches
                </button>
                <Link href="/" className="text-xs font-sans uppercase font-bold px-4 py-2 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors">
                  View Front Page &rarr;
                </Link>
              </div>
            </div>
          ) : (
            // Main writing form
            <div className="max-w-4xl mx-auto space-y-6">
              <form onSubmit={handlePublish} className="space-y-6">

                {/* Headline */}
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a compelling broadsheet headline..."
                    className="w-full font-serif text-2xl sm:text-3xl font-bold p-3 bg-secondary/20 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Sub-Heading
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A one-sentence philosophical or technical précis..."
                    className="w-full font-serif italic text-base p-3 bg-secondary/20 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                  />
                </div>

                {/* Taxonomy + Image grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <DepartmentSelector
                    category={category}
                    setCategory={(val) => { setCategory(val); setSubcategory(""); setSubcategoryDesc(""); }}
                    departmentsList={departmentsList}
                    isAddingDepartment={isAddingDepartment}
                    setIsAddingDepartment={setIsAddingDepartment}
                    newDepartmentName={newDepartmentName}
                    setNewDepartmentName={setNewDepartmentName}
                    onSaveCustomDepartment={handleSaveCustomDepartment}
                  />

                  <SubcategorySelector
                    subcategory={subcategory}
                    setSubcategory={setSubcategory}
                    setSubcategoryDesc={setSubcategoryDesc}
                    availableSubcategories={getAvailableSubcategories()}
                    isAddingSubcategory={isAddingSubcategory}
                    setIsAddingSubcategory={setIsAddingSubcategory}
                    newSubcategoryName={newSubcategoryName}
                    setNewSubcategoryName={setNewSubcategoryName}
                    newSubcategoryDesc={newSubcategoryDesc}
                    setNewSubcategoryDesc={setNewSubcategoryDesc}
                    onSaveCustomSubcategory={handleSaveCustomSubcategory}
                  />

                  <div>
                    <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Cover Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full font-serif text-xs p-2.5 bg-secondary/20 border border-border focus:border-foreground focus:outline-none"
                    />
                  </div>
                </div>

                {/* Byline display */}
                <div className="p-3 bg-secondary/30 border border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs font-serif">
                  <span className="text-muted-foreground">Author Byline & Classification:</span>
                  <span className="font-bold text-foreground">
                    {user.name} &bull; {category}{subcategory ? ` › ${subcategory}` : ""} Fellow
                  </span>
                </div>

                {/* Summary points */}
                <SummaryPoints
                  point1={summaryPoint1}
                  point2={summaryPoint2}
                  point3={summaryPoint3}
                  onChange1={setSummaryPoint1}
                  onChange2={setSummaryPoint2}
                  onChange3={setSummaryPoint3}
                  onAutoExtract={autoExtractSummary}
                />

                {/* Manuscript editor */}
                <ManuscriptEditor
                  editorMode={editorMode}
                  setEditorMode={setEditorMode}
                  introText={introText}
                  setIntroText={setIntroText}
                  visualSections={visualSections}
                  formatRoman={formatRoman}
                  onAddSection={() => setVisualSections((prev) => [...prev, { id: `sec-${Date.now()}`, heading: "", body: "" }])}
                  onUpdateSection={(id, field, val) => setVisualSections((prev) => prev.map((s) => s.id === id ? { ...s, [field]: val } : s))}
                  onMoveSection={(idx, dir) => {
                    setVisualSections((prev) => {
                      const target = dir === "up" ? idx - 1 : idx + 1;
                      if (target < 0 || target >= prev.length) return prev;
                      const next = [...prev];
                      [next[idx], next[target]] = [next[target], next[idx]];
                      return next;
                    });
                  }}
                  onRemoveSection={(id) => {
                    setVisualSections((prev) =>
                      prev.length <= 1
                        ? [{ id: `sec-${Date.now()}`, heading: "", body: "" }]
                        : prev.filter((s) => s.id !== id)
                    );
                  }}
                  title={title}
                  subtitle={subtitle}
                  category={category}
                  user={user}
                  summaryPoint1={summaryPoint1}
                  summaryPoint2={summaryPoint2}
                  summaryPoint3={summaryPoint3}
                  compileVisualToMarkdown={compileVisualToMarkdown}
                  setContent={setContent}
                />

                {/* Footer actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link href="/" className="text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Front Page</span>
                  </Link>

                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="px-6 py-2.5 text-xs font-sans uppercase font-bold tracking-wider bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <span>Syndicating to MySQL...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{editingPostId ? "Save Revisions" : "Dispatch to Broadsheet"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}


      {activeTab === "my-posts" && (
        <div className="space-y-6 animate-in fade-in">
          <StatsBar posts={myPosts} />
          <MyPostsList
            posts={myPosts}
            isLoading={isLoadingPosts}
            deletingId={deletingId}
            onEdit={handleEditClick}
            onDelete={handleDeletePost}
            onNewDraft={handleStartNewDraft}
          />
        </div>
      )}
    </div>
  );
}
