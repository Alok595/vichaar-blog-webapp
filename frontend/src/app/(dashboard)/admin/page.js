"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Feather,
  Send,
  Eye,
  CheckCircle2,
  FileText,
  LogOut,
  Sparkles,
  ArrowLeft,
  LayoutGrid,
  Trash2,
  Edit3,
  Plus,
  ExternalLink,
  AlertCircle,
  Clock,
  BookOpen,
  Image as ImageIcon,
  Heading2,
  Bold,
  Italic,
  Quote,
  List,
  Code,
  ArrowUp,
  ArrowDown,
  Layers,
  GripVertical
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { api } from "@/lib/api";
import { useAdminContext } from "@/lib/adminContext";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    activeTab,
    setActiveTab,
    myPosts,
    setMyPosts,
    isLoadingPosts,
    fetchMyPosts,
    registerStartNewDraftCallback,
  } = useAdminContext();

  const [hasMounted, setHasMounted] = useState(false);

  // Post form state
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("Engineering");
  const [subcategory, setSubcategory] = useState("");
  const [subcategoryDesc, setSubcategoryDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");

  // Editor Mode: 'visual' (Visual Section Builder) | 'preview' (Live Broadsheet)
  const [editorMode, setEditorMode] = useState("visual");

  // Visual Section Builder State
  const [introText, setIntroText] = useState("");
  const [visualSections, setVisualSections] = useState([
    { id: "sec-1", heading: "", body: "" },
  ]);

  // Executive Summary Dossier Points
  const [summaryPoint1, setSummaryPoint1] = useState("");
  const [summaryPoint2, setSummaryPoint2] = useState("");
  const [summaryPoint3, setSummaryPoint3] = useState("");

  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const defaultDepartments = [
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

  const defaultSubcategoriesMap = {
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

  const [departmentsList, setDepartmentsList] = useState(defaultDepartments);
  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");

  const [customSubcategoriesMap, setCustomSubcategoriesMap] = useState({});
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryDesc, setNewSubcategoryDesc] = useState("");

  // Load custom departments & subcategories from localStorage on mount
  useEffect(() => {
    try {
      const savedDeps = localStorage.getItem("vichaar_custom_departments");
      if (savedDeps) {
        const parsed = JSON.parse(savedDeps);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const combined = Array.from(new Set([...defaultDepartments, ...parsed]));
          setDepartmentsList(combined);
        }
      }

      const savedSubs = localStorage.getItem("vichaar_custom_subcategories");
      if (savedSubs) {
        const parsedSubs = JSON.parse(savedSubs);
        if (parsedSubs && typeof parsedSubs === "object") {
          setCustomSubcategoriesMap(parsedSubs);
        }
      }
    } catch (e) {
      console.warn("Could not load custom taxonomy:", e);
    }
  }, []);

  const handleSaveCustomDepartment = (e) => {
    e?.preventDefault();
    const cleanName = newDepartmentName.trim();
    if (!cleanName) return;

    const updated = Array.from(new Set([...departmentsList, cleanName]));
    setDepartmentsList(updated);
    setCategory(cleanName);

    try {
      const customOnly = updated.filter((d) => !defaultDepartments.includes(d));
      localStorage.setItem("vichaar_custom_departments", JSON.stringify(customOnly));
    } catch (err) {
      console.warn("Could not save custom departments:", err);
    }

    setNewDepartmentName("");
    setIsAddingDepartment(false);
  };

  const handleSaveCustomSubcategory = (e) => {
    e?.preventDefault();
    const cleanSubName = newSubcategoryName.trim();
    if (!cleanSubName) return;

    const subObj = {
      name: cleanSubName,
      desc: newSubcategoryDesc.trim() || `Specialized focus under ${category}`,
    };

    const currentList = [
      ...(defaultSubcategoriesMap[category] || []),
      ...(customSubcategoriesMap[category] || []),
    ];

    const updatedMap = {
      ...customSubcategoriesMap,
      [category]: [
        ...(customSubcategoriesMap[category] || []).filter((s) => s.name !== cleanSubName),
        subObj,
      ],
    };

    setCustomSubcategoriesMap(updatedMap);
    setSubcategory(cleanSubName);
    setSubcategoryDesc(subObj.desc);

    try {
      localStorage.setItem("vichaar_custom_subcategories", JSON.stringify(updatedMap));
    } catch (err) {
      console.warn("Could not save custom subcategories:", err);
    }

    setNewSubcategoryName("");
    setNewSubcategoryDesc("");
    setIsAddingSubcategory(false);
  };

  const getAvailableSubcategories = () => {
    const defaults = defaultSubcategoriesMap[category] || [];
    const customs = customSubcategoriesMap[category] || [];
    return [...defaults, ...customs];
  };

  const handleStartNewDraft = () => {
    setEditingPostId(null);
    setTitle("");
    setSubtitle("");
    setCategory(user?.department || "Engineering");
    setSubcategory("");
    setSubcategoryDesc("");
    setImageUrl("");
    setContent("");
    setIntroText("");
    setVisualSections([{ id: "sec-1", heading: "", body: "" }]);
    setSummaryPoint1("");
    setSummaryPoint2("");
    setSummaryPoint3("");
    setIsAddingDepartment(false);
    setNewDepartmentName("");
    setIsAddingSubcategory(false);
    setNewSubcategoryName("");
    setNewSubcategoryDesc("");
    setIsPublished(false);
    setErrorMessage("");
    setSuccessMessage("");
    setActiveTab("draft");
  };

  useEffect(() => {
    registerStartNewDraftCallback(() => handleStartNewDraft);
  }, [user]);

  const compileVisualToMarkdown = (intro, sections) => {
    let compiled = intro ? intro.trim() : "";
    sections.forEach((sec) => {
      if (sec.heading?.trim() || sec.body?.trim()) {
        if (compiled) compiled += "\n\n";
        if (sec.heading?.trim()) {
          compiled += `## ${sec.heading.trim()}\n`;
        }
        if (sec.body?.trim()) {
          compiled += sec.body.trim();
        }
      }
    });
    return compiled;
  };

  const parseMarkdownToVisual = (text) => {
    if (!text) return { intro: "", sections: [{ id: "sec-1", heading: "", body: "" }] };
    const lines = text.split("\n");
    let introLines = [];
    let sections = [];
    let currentSec = null;
    let foundHeading = false;

    for (const line of lines) {
      if (line.trim().startsWith("#")) {
        foundHeading = true;
        if (currentSec) {
          sections.push(currentSec);
        }
        currentSec = {
          id: `sec-${sections.length + 1}-${Date.now()}`,
          heading: line.trim().replace(/^#+\s*/, ""),
          body: "",
        };
      } else {
        if (!foundHeading) {
          introLines.push(line);
        } else if (currentSec) {
          currentSec.body += (currentSec.body ? "\n" : "") + line;
        }
      }
    }
    if (currentSec) {
      sections.push(currentSec);
    }
    return {
      intro: introLines.join("\n").trim(),
      sections: sections.length > 0 ? sections : [{ id: "sec-1", heading: "", body: "" }],
    };
  };

  const handleAddVisualSection = () => {
    setVisualSections((prev) => [
      ...prev,
      { id: `sec-${Date.now()}`, heading: "", body: "" },
    ]);
  };

  const handleUpdateVisualSection = (id, field, value) => {
    setVisualSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveVisualSection = (id) => {
    if (visualSections.length <= 1) {
      setVisualSections([{ id: `sec-${Date.now()}`, heading: "", body: "" }]);
      return;
    }
    setVisualSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleMoveVisualSection = (index, direction) => {
    setVisualSections((prev) => {
      const targetIdx = direction === "up" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title || "");
    setSubtitle(post.subtitle || "");
    setCategory(post.category || "Engineering");
    setSubcategory(post.subcategory || "");
    setSubcategoryDesc(post.subcategoryDesc || "");
    setImageUrl(post.imageUrl || "");
    setContent(post.content || "");

    // Unpack sections for Visual Studio
    let postSections = post.sections;
    if (typeof postSections === "string") {
      try {
        postSections = JSON.parse(postSections);
      } catch {
        postSections = null;
      }
    }

    if (Array.isArray(postSections) && postSections.length > 0) {
      const firstHeadingIdx = (post.content || "").indexOf("##");
      const extractedIntro = firstHeadingIdx > 0 ? post.content.slice(0, firstHeadingIdx).trim() : "";
      setIntroText(extractedIntro);
      setVisualSections(
        postSections.map((s, idx) => ({
          id: `sec-${idx + 1}-${Date.now()}`,
          heading: s.heading || "",
          body: Array.isArray(s.paragraphs) ? s.paragraphs.join("\n\n") : (s.body || ""),
        }))
      );
    } else {
      const parsed = parseMarkdownToVisual(post.content || "");
      setIntroText(parsed.intro);
      setVisualSections(parsed.sections);
    }

    // Populate summary points if available
    let points = post.summaryPoints;
    if (typeof points === "string") {
      try {
        points = JSON.parse(points);
      } catch {
        points = [];
      }
    }
    if (Array.isArray(points)) {
      setSummaryPoint1(points[0] || "");
      setSummaryPoint2(points[1] || "");
      setSummaryPoint3(points[2] || "");
    } else {
      setSummaryPoint1("");
      setSummaryPoint2("");
      setSummaryPoint3("");
    }

    setIsPublished(false);
    setErrorMessage("");
    setSuccessMessage("");
    setActiveTab("draft");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to extract 3 concise takeaway points from content
  const autoExtractSummary = () => {
    let textToAnalyze = content;
    if (editorMode === "visual" || (!textToAnalyze && (introText || visualSections.some((s) => s.body)))) {
      textToAnalyze = [introText, ...visualSections.map((s) => s.body)].filter(Boolean).join("\n\n");
    }

    if (!textToAnalyze.trim()) {
      alert("Please write some manuscript content first to auto-extract summary points.");
      return;
    }
    const sentences = textToAnalyze
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && !s.startsWith("#"));

    if (sentences.length > 0) {
      setSummaryPoint1(sentences[0] || subtitle || "Core architectural thesis and premise.");
      setSummaryPoint2(sentences[1] || "Critical evaluation of computational dynamics.");
      setSummaryPoint3(sentences[2] || "Practical conclusions for contemporary craft.");
    }
  };

  const formatRoman = (num) => {
    const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    return romans[num - 1] || `${num}`;
  };

  const parseSectionsFromContent = (rawContent) => {
    const lines = rawContent.split("\n");
    const hasHeadings = lines.some((l) => l.trim().startsWith("#"));

    if (hasHeadings) {
      const sections = [];
      let currentSection = null;
      let sectionIndex = 1;

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("#")) {
          if (currentSection && currentSection.paragraphs.length > 0) {
            sections.push(currentSection);
          }
          const headingText = trimmed.replace(/^#+\s*/, "");
          currentSection = {
            roman: formatRoman(sectionIndex++),
            heading: headingText,
            paragraphs: [],
          };
        } else if (trimmed.length > 0) {
          if (currentSection) {
            currentSection.paragraphs.push(trimmed);
          }
        }
      }
      if (currentSection && currentSection.paragraphs.length > 0) {
        sections.push(currentSection);
      }
      return sections;
    }

    return [];
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you certain you wish to retract and permanently delete this dispatch?")) {
      return;
    }

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

  const handlePublish = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Determine final content and sections based on editorMode
    let finalContent = content.trim();
    let finalSections = null;

    if (editorMode === "visual") {
      finalContent = compileVisualToMarkdown(introText, visualSections);
      const validVisual = visualSections.filter((s) => s.heading?.trim() || s.body?.trim());
      if (validVisual.length > 0) {
        finalSections = validVisual.map((s, idx) => ({
          roman: formatRoman(idx + 1),
          heading: s.heading.trim() || `Section ${formatRoman(idx + 1)}`,
          paragraphs: s.body
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean),
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
      // Build executive summary points
      const points = [summaryPoint1, summaryPoint2, summaryPoint3]
        .map((p) => p.trim())
        .filter(Boolean);

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
      console.error("Syndication error:", err);
      setErrorMessage(err.message || "Syndication failed. Please verify credentials.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="font-serif italic text-muted-foreground animate-pulse">
          Opening Author Bureau Ledger...
        </div>
      </div>
    );
  }

  // If user is not authenticated, show clearance requirement gate
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 max-w-xl text-center">
        <div className="border-2 border-foreground/80 bg-background p-8 md:p-12 shadow-[6px_6px_0px_0px_rgba(28,24,21,0.9)]">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Feather className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-sans uppercase tracking-widest font-black text-amber-800 dark:text-amber-400 block mb-1">
            Editorial Clearance Required • संपादकीय प्रकोष्ठ
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Author Desk Access Locked
          </h1>
          <p className="font-serif text-sm text-muted-foreground mb-6 leading-relaxed">
            The Author Writing Desk is strictly reserved for accredited Vichaar Syndicate fellows. Please sign in with your contributor passkey to draft and manage your isolated dispatches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto text-xs font-sans uppercase tracking-wider font-bold px-6 py-3 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors"
            >
              Sign In to Author Desk &rarr;
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto text-xs font-sans uppercase tracking-wider font-bold px-4 py-3 border border-border hover:bg-secondary text-foreground transition-colors"
            >
              Back to Broadsheet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 md:py-10 max-w-5xl mx-auto">

      {/* Sleek Minimal Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400">
              {activeTab === "draft"
                ? editingPostId
                  ? "Manuscript Revision"
                  : "Editorial Desk"
                : "Author Archive"}
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            {activeTab === "draft"
              ? editingPostId
                ? "Edit Dispatch"
                : "New Dispatch Draft"
              : `My Dispatches (${myPosts.length})`}
          </h1>
        </div>

        {/* Header Action Button */}
        {activeTab === "draft" && editingPostId && (
          <button
            onClick={handleStartNewDraft}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider px-3 py-1.5 border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors rounded-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cancel Edit & New Draft</span>
          </button>
        )}

        {activeTab === "my-posts" && (
          <button
            onClick={handleStartNewDraft}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider px-3 py-1.5 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors rounded-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft New Dispatch</span>
          </button>
        )}
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-serif flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-serif flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: DRAFTING & EDITING */}
      {activeTab === "draft" && (
        <>
          {isPublished ? (
            <div className="border-2 border-foreground/80 bg-background p-8 md:p-12 text-center shadow-[6px_6px_0px_0px_rgba(28,24,21,0.9)] max-w-2xl mx-auto my-8 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-sans uppercase tracking-widest font-black text-amber-800 dark:text-amber-400 block mb-1">
                Dispatch Broadcasted to Broadsheet
              </span>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
                &ldquo;{title}&rdquo;
              </h2>
              <p className="font-serif text-sm text-muted-foreground mb-6 leading-relaxed">
                Your essay has been set in digital type and archived in MySQL under your author byline (<strong>{user.name}</strong>).
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleStartNewDraft}
                  className="text-xs font-sans uppercase font-bold px-4 py-2 border border-border hover:bg-secondary cursor-pointer"
                >
                  Draft Another Essay
                </button>
                <button
                  onClick={() => setActiveTab("my-posts")}
                  className="text-xs font-sans uppercase font-bold px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer"
                >
                  View My Dispatches
                </button>
                <Link
                  href="/"
                  className="text-xs font-sans uppercase font-bold px-4 py-2 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors"
                >
                  View Front Page &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <form onSubmit={handlePublish} className="space-y-6">
                {/* Essay Title */}
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Essay Headline &bull; शीर्षक
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

                {/* Essay Deck / Subtitle */}
                <div>
                  <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Deck / Analytical Sub-Heading
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="A one-sentence philosophical or technical précis..."
                    className="w-full font-serif italic text-base p-3 bg-secondary/20 border border-border focus:border-foreground focus:bg-background focus:outline-none transition-colors"
                  />
                </div>

                {/* Department, Subcategory & Cover Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Field 1: Primary Department */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
                        Department &bull; अनुभाग
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingDepartment(!isAddingDepartment)}
                        className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingDepartment ? "Select" : "Add Custom"}</span>
                      </button>
                    </div>

                    {isAddingDepartment ? (
                      <div className="space-y-1.5 p-2 bg-secondary/30 border border-amber-800/40 dark:border-amber-400/40 rounded-xs animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          placeholder="Enter custom department..."
                          className="w-full text-xs font-serif p-1.5 bg-background border border-border focus:border-foreground focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveCustomDepartment();
                            }
                          }}
                        />
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={handleSaveCustomDepartment}
                            className="flex-1 px-2 py-1 bg-foreground text-background hover:bg-amber-800 hover:text-white text-[10px] font-sans uppercase font-bold tracking-wider rounded-xs cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingDepartment(false);
                              setNewDepartmentName("");
                            }}
                            className="px-2 py-1 border border-border hover:bg-secondary text-[10px] font-sans uppercase font-bold text-muted-foreground rounded-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === "__add_new__") {
                            setIsAddingDepartment(true);
                          } else {
                            setCategory(e.target.value);
                            setSubcategory("");
                            setSubcategoryDesc("");
                          }
                        }}
                        className="w-full font-serif text-sm p-2.5 bg-secondary/20 border border-border focus:border-foreground focus:outline-none"
                      >
                        {departmentsList.map((dep) => (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        ))}
                        <option value="__add_new__">+ Add Custom Department...</option>
                      </select>
                    )}
                  </div>

                  {/* Field 2: Specialized Subcategory */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-sans font-bold uppercase tracking-wider text-muted-foreground">
                        Subcategory &bull; उप-अनुभाग
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsAddingSubcategory(!isAddingSubcategory)}
                        className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{isAddingSubcategory ? "Select" : "Add Custom"}</span>
                      </button>
                    </div>

                    {isAddingSubcategory ? (
                      <div className="space-y-1.5 p-2 bg-secondary/30 border border-amber-800/40 dark:border-amber-400/40 rounded-xs animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                          placeholder="Subcategory (e.g., Vector Models)..."
                          className="w-full text-xs font-serif p-1.5 bg-background border border-border focus:border-foreground focus:outline-none"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={newSubcategoryDesc}
                          onChange={(e) => setNewSubcategoryDesc(e.target.value)}
                          placeholder="Short description (optional)..."
                          className="w-full text-[11px] font-serif p-1.5 bg-background border border-border focus:border-foreground focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleSaveCustomSubcategory();
                            }
                          }}
                        />
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={handleSaveCustomSubcategory}
                            className="flex-1 px-2 py-1 bg-foreground text-background hover:bg-amber-800 hover:text-white text-[10px] font-sans uppercase font-bold tracking-wider rounded-xs cursor-pointer"
                          >
                            Save Subcategory
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingSubcategory(false);
                              setNewSubcategoryName("");
                              setNewSubcategoryDesc("");
                            }}
                            className="px-2 py-1 border border-border hover:bg-secondary text-[10px] font-sans uppercase font-bold text-muted-foreground rounded-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        value={subcategory}
                        onChange={(e) => {
                          if (e.target.value === "__add_new_sub__") {
                            setIsAddingSubcategory(true);
                          } else {
                            setSubcategory(e.target.value);
                            const matched = getAvailableSubcategories().find((s) => s.name === e.target.value);
                            setSubcategoryDesc(matched?.desc || "");
                          }
                        }}
                        className="w-full font-serif text-sm p-2.5 bg-secondary/20 border border-border focus:border-foreground focus:outline-none"
                      >
                        <option value="">-- General / No Subcategory --</option>
                        {getAvailableSubcategories().map((sub) => (
                          <option key={sub.name} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                        <option value="__add_new_sub__">+ Add Custom Subcategory...</option>
                      </select>
                    )}
                  </div>

                  {/* Field 3: Cover Image URL */}
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

                {/* Executive Summary Dossier Points ( संक्षेप ) */}
                <div className="border border-border/80 bg-secondary/20 p-4 rounded-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                      <span className="text-[11px] font-sans font-black uppercase tracking-wider text-foreground">
                        Executive Summary Points &bull; संक्षेप (Optional)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={autoExtractSummary}
                      className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Auto-extract 3 key takeaway bullet points from your manuscript body"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Extract From Body</span>
                    </button>
                  </div>
                  <p className="text-xs font-serif italic text-muted-foreground">
                    These 3 bullet points will be highlighted in the Executive Summary box in the article sidebar.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400 shrink-0">01.</span>
                      <input
                        type="text"
                        value={summaryPoint1}
                        onChange={(e) => setSummaryPoint1(e.target.value)}
                        placeholder="Key takeaway 1 (e.g., Primary thesis or finding)..."
                        className="w-full text-xs font-serif p-2 bg-background border border-border focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400 shrink-0">02.</span>
                      <input
                        type="text"
                        value={summaryPoint2}
                        onChange={(e) => setSummaryPoint2(e.target.value)}
                        placeholder="Key takeaway 2 (e.g., Methodological or architectural insight)..."
                        className="w-full text-xs font-serif p-2 bg-background border border-border focus:border-foreground focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400 shrink-0">03.</span>
                      <input
                        type="text"
                        value={summaryPoint3}
                        onChange={(e) => setSummaryPoint3(e.target.value)}
                        placeholder="Key takeaway 3 (e.g., Synthesis or future implication)..."
                        className="w-full text-xs font-serif p-2 bg-background border border-border focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Manuscript Studio: Visual Sections Builder, Markdown, & Live Broadsheet Reading Preview */}
                <div className="border border-border/80 bg-background rounded-xs overflow-hidden shadow-2xs">
                  {/* Top Studio Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-secondary/30 border-b border-border/80">
                    {/* View Mode Switcher: Visual Studio & Live Preview */}
                    <div className="flex items-center gap-1 bg-background p-0.5 border border-border/70 rounded-xs">
                      <button
                        type="button"
                        onClick={() => setEditorMode("visual")}
                        className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-sans uppercase font-bold tracking-wider rounded-2xs transition-colors cursor-pointer ${
                          editorMode === "visual"
                            ? "bg-foreground text-background shadow-2xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                        title="Visual Section Builder - Compose sections visually with Roman numbered cards"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Visual Studio</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setContent(compileVisualToMarkdown(introText, visualSections));
                          setEditorMode("preview");
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-sans uppercase font-bold tracking-wider rounded-2xs transition-colors cursor-pointer ${
                          editorMode === "preview"
                            ? "bg-foreground text-background shadow-2xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                        title="Live Broadsheet Reading Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Live Broadsheet Reading</span>
                      </button>
                    </div>

                    {/* Word & Read Time Telemetry */}
                    <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                      <span>
                        {(() => {
                          const activeText =
                            editorMode === "visual"
                              ? compileVisualToMarkdown(introText, visualSections)
                              : content;
                          const words = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
                          return `${words} words`;
                        })()}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(() => {
                          const activeText =
                            editorMode === "visual"
                              ? compileVisualToMarkdown(introText, visualSections)
                              : content;
                          const words = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
                          return `${Math.max(1, Math.ceil(words / 200))} min read`;
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Mode 1: Visual Section Studio */}
                  {editorMode === "visual" && (
                    <div className="p-4 sm:p-6 bg-secondary/15 space-y-5">
                      {/* Preamble / Lead Block */}
                      <div className="bg-background border border-border/80 rounded-xs p-4 shadow-2xs space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-sans font-black uppercase tracking-widest px-2 py-0.5 bg-amber-800/10 text-amber-800 dark:bg-amber-400/10 dark:text-amber-400 rounded-2xs border border-amber-800/20 dark:border-amber-400/20">
                              Lead Hook &bull; आमुख
                            </span>
                            <span className="text-xs font-serif italic text-muted-foreground hidden sm:inline">
                              Opening thesis paragraph (will receive broadsheet drop-cap)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const dateline = "[NEW DELHI / DIGITAL BUREAU] — ";
                              if (!introText.startsWith("[NEW DELHI")) {
                                setIntroText((prev) => `${dateline}${prev}`);
                              }
                            }}
                            className="text-[10px] font-sans uppercase font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                            title="Insert Wire Dateline at start of opening lead"
                          >
                            <span>+ Wire Dateline</span>
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={introText}
                          onChange={(e) => setIntroText(e.target.value)}
                          placeholder="[NEW DELHI / DIGITAL BUREAU] — Draft the opening thesis hook or narrative context of your inquiry..."
                          className="w-full font-serif text-sm sm:text-base leading-relaxed p-3 bg-secondary/20 border border-border/70 focus:border-foreground focus:outline-none resize-y rounded-2xs"
                        />
                      </div>

                      {/* Numbered Roman Section Cards */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-sans font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                            <span>Numbered Manuscript Sections ({visualSections.length})</span>
                          </span>
                          <span className="text-[11px] font-serif italic text-muted-foreground">
                            Automatically creates Roman badges (§ I, § II) and TOC navigation links
                          </span>
                        </div>

                        {visualSections.map((sec, idx) => (
                          <div
                            key={sec.id || idx}
                            className="bg-background border-2 border-border/90 rounded-xs p-4 sm:p-5 shadow-2xs space-y-3 transition-all hover:border-foreground/60"
                          >
                            {/* Section Card Header */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/60">
                              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                <span className="font-sans text-xs font-black uppercase tracking-widest px-2.5 py-1 bg-foreground text-background rounded-xs shadow-2xs shrink-0">
                                  Sec. {formatRoman(idx + 1)}
                                </span>
                                <input
                                  type="text"
                                  value={sec.heading}
                                  onChange={(e) =>
                                    handleUpdateVisualSection(sec.id, "heading", e.target.value)
                                  }
                                  placeholder={`Section ${formatRoman(idx + 1)} Title (e.g., Theoretical Premise & Context)...`}
                                  className="w-full font-serif font-bold text-sm sm:text-base px-2.5 py-1 bg-secondary/25 border border-border/70 focus:border-foreground focus:outline-none rounded-2xs"
                                />
                              </div>

                              {/* Section Actions: Move Up, Move Down, Delete */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveVisualSection(idx, "up")}
                                  disabled={idx === 0}
                                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed rounded-2xs border border-border/60 transition-colors"
                                  title="Move Section Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveVisualSection(idx, "down")}
                                  disabled={idx === visualSections.length - 1}
                                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed rounded-2xs border border-border/60 transition-colors"
                                  title="Move Section Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVisualSection(sec.id)}
                                  className="p-1.5 text-muted-foreground hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xs border border-border/60 transition-colors"
                                  title="Remove this section"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Section Paragraphs Textarea */}
                            <div>
                              <textarea
                                rows={5}
                                value={sec.body}
                                onChange={(e) =>
                                  handleUpdateVisualSection(sec.id, "body", e.target.value)
                                }
                                placeholder={`Elaborate your arguments for Section ${formatRoman(idx + 1)}. Separate multiple paragraphs with a blank line...`}
                                className="w-full font-serif text-sm sm:text-base leading-[1.8] p-3.5 bg-secondary/15 border border-border/60 focus:border-foreground focus:outline-none resize-y rounded-2xs"
                              />
                            </div>
                          </div>
                        ))}

                        {/* Add Section Button */}
                        <button
                          type="button"
                          onClick={handleAddVisualSection}
                          className="w-full py-3.5 border-2 border-dashed border-border/90 hover:border-amber-800 dark:hover:border-amber-400 bg-background hover:bg-secondary/40 text-foreground font-sans text-xs uppercase font-bold tracking-widest rounded-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                          <span>Add Next Section (&sect; {formatRoman(visualSections.length + 1)})</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Live Broadsheet Reading Preview */}
                  {editorMode === "preview" && (
                    <div className="p-6 md:p-8 bg-background border-t border-border/80 space-y-8 animate-in fade-in duration-200">
                      {/* Preview Folio Header */}
                      <div className="border-b border-border/80 pb-2.5 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-muted-foreground">
                        <span className="font-bold text-foreground">
                          [{category.toUpperCase()}] &bull; VICHAAR BROADSHEET PREVIEW
                        </span>
                        <span className="font-mono">
                          {(() => {
                            const activeText =
                              editorMode === "visual"
                                ? compileVisualToMarkdown(introText, visualSections)
                                : content;
                            const words = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
                            return `${words} Words`;
                          })()}
                        </span>
                      </div>

                      {/* Article Header Preview */}
                      <div className="space-y-3">
                        <h2 className="font-serif text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-[1.15]">
                          {title || "Untitled Broadsheet Headline"}
                        </h2>
                        {subtitle && (
                          <p className="font-serif italic text-lg text-foreground/80 leading-relaxed border-l-2 border-amber-800 dark:border-amber-400 pl-3">
                            {subtitle}
                          </p>
                        )}
                        <div className="pt-2 pb-2 border-y border-border/60 text-xs font-sans text-muted-foreground flex items-center justify-between">
                          <span>By {user.name} &bull; {category} Fellow</span>
                          <span>
                            {(() => {
                              const activeText =
                                editorMode === "visual"
                                  ? compileVisualToMarkdown(introText, visualSections)
                                  : content;
                              const words = activeText.trim() ? activeText.trim().split(/\s+/).length : 0;
                              return `${Math.max(1, Math.ceil(words / 200))} min read`;
                            })()}
                          </span>
                        </div>
                      </div>

                      {/* Executive Summary Preview if provided */}
                      {(summaryPoint1 || summaryPoint2 || summaryPoint3) && (
                        <div className="border-2 border-foreground/80 dark:border-border bg-secondary/35 p-5 shadow-[3px_3px_0px_0px_rgba(28,24,21,0.8)] dark:shadow-[3px_3px_0px_0px_rgba(237,231,220,0.15)]">
                          <div className="flex items-center gap-2 pb-2 border-b border-foreground/30 mb-3">
                            <FileText className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                            <h4 className="font-sans text-xs font-black uppercase tracking-widest text-foreground">
                              Executive Summary &bull; संक्षेप
                            </h4>
                          </div>
                          <ul className="space-y-2 text-xs font-serif leading-relaxed">
                            {summaryPoint1 && (
                              <li className="flex items-start gap-2">
                                <span className="font-sans font-black text-amber-800 dark:text-amber-400">01.</span>
                                <span>{summaryPoint1}</span>
                              </li>
                            )}
                            {summaryPoint2 && (
                              <li className="flex items-start gap-2">
                                <span className="font-sans font-black text-amber-800 dark:text-amber-400">02.</span>
                                <span>{summaryPoint2}</span>
                              </li>
                            )}
                            {summaryPoint3 && (
                              <li className="flex items-start gap-2">
                                <span className="font-sans font-black text-amber-800 dark:text-amber-400">03.</span>
                                <span>{summaryPoint3}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Reading Preview with Intro and Roman Sections */}
                      <div className="space-y-8 font-serif text-lg sm:text-xl leading-[1.85] text-foreground">
                        {/* Preamble if present */}
                        {introText.trim() && (
                          <div className="space-y-4">
                            {introText
                              .split(/\n\s*\n/)
                              .map((p, idx) => (
                                <p
                                  key={idx}
                                  className={
                                    idx === 0
                                      ? "drop-cap text-foreground/95"
                                      : "text-foreground/90 leading-relaxed"
                                  }
                                >
                                  {p}
                                </p>
                              ))}
                          </div>
                        )}

                        {/* Visual Sections */}
                        {visualSections.filter((s) => s.heading?.trim() || s.body?.trim()).length > 0 ? (
                          visualSections
                            .filter((s) => s.heading?.trim() || s.body?.trim())
                            .map((sec, secIdx) => (
                              <section key={sec.id || secIdx} className="space-y-4">
                                {sec.heading?.trim() && (
                                  <div className="flex items-center gap-3 pt-4 border-b border-border/70 pb-2">
                                    <span className="font-sans text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-xs bg-foreground text-background">
                                      Sec. {formatRoman(secIdx + 1)}
                                    </span>
                                    <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                                      {sec.heading.trim()}
                                    </h3>
                                  </div>
                                )}
                                {sec.body
                                  .split(/\n\s*\n/)
                                  .filter(Boolean)
                                  .map((p, pIdx) => {
                                    const isFirstInArticle = !introText.trim() && secIdx === 0 && pIdx === 0;
                                    return (
                                      <p
                                        key={pIdx}
                                        className={
                                          isFirstInArticle
                                            ? "drop-cap text-foreground/95"
                                            : "text-foreground/90 leading-relaxed"
                                        }
                                      >
                                        {p}
                                      </p>
                                    );
                                  })}
                              </section>
                            ))
                        ) : !introText.trim() ? (
                          <div className="py-12 text-center text-muted-foreground italic font-serif text-sm">
                            No manuscript text entered yet. Switch to &quot;Visual Studio&quot; or &quot;Markdown&quot; to draft your essay.
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Link
                    href="/"
                    className="text-xs font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Front Page</span>
                  </Link>

                  <div className="flex items-center gap-3">
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
                </div>
              </form>
            </div>
          )}
        </>
      )}

      {/* TAB 2: MY ISOLATED DISPATCHES */}
      {activeTab === "my-posts" && (
        <div className="space-y-4 animate-in fade-in">

          {isLoadingPosts ? (
            <div className="py-12 text-center text-muted-foreground font-serif italic">
              Retrieving your broadsheet dispatches from MySQL...
            </div>
          ) : myPosts.length === 0 ? (
            <div className="border border-dashed border-border p-12 text-center space-y-3 bg-secondary/10">
              <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <h3 className="font-serif text-lg font-bold text-foreground">
                No Dispatches Found
              </h3>
              <p className="font-serif text-xs text-muted-foreground max-w-md mx-auto">
                You have not syndicated any essays yet under this byline. Use the writing desk to publish your first broadsheet dispatch.
              </p>
              <button
                onClick={handleStartNewDraft}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-xs font-sans uppercase font-bold tracking-wider hover:bg-amber-800 hover:text-white transition-colors cursor-pointer"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>Begin First Dispatch</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  className="border border-border bg-background p-5 hover:border-foreground/60 transition-colors shadow-xs"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-wider font-extrabold text-amber-800 dark:text-amber-400">
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
                    </div>

                    {/* Author Actions: Edit / Delete / View */}
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
                        onClick={() => handleEditClick(post)}
                        className="p-2 text-xs border border-border hover:bg-secondary text-muted-foreground hover:text-amber-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                        title="Edit dispatch manuscript"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
