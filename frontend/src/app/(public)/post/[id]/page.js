import Link from "next/link";
import { POSTS_DATA } from "@/lib/postsData";
import { ReadingRoom } from "@/components/reading";
import { API_BASE_URL } from "@/lib/api";

function formatRoman(num) {
  const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
  return romans[num - 1] || `${num}`;
}

function parsePostSectionsAndSummary(post) {
  let summaryPoints = post.summaryPoints;
  if (typeof summaryPoints === "string") {
    try {
      summaryPoints = JSON.parse(summaryPoints);
    } catch {
      summaryPoints = summaryPoints.split("\n").filter((l) => l.trim().length > 0);
    }
  }

  // If no summary points, intelligently create 3 concise points from subtitle and content
  if (!summaryPoints || !Array.isArray(summaryPoints) || summaryPoints.length === 0) {
    const rawContent = post.content || "";
    const sentences = rawContent
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && !s.startsWith("#"));

    summaryPoints = [];
    if (post.subtitle) {
      summaryPoints.push(post.subtitle);
    }
    if (sentences[0] && sentences[0] !== post.subtitle) {
      summaryPoints.push(sentences[0]);
    }
    if (sentences[1] && sentences[1] !== post.subtitle && summaryPoints.length < 3) {
      summaryPoints.push(sentences[1]);
    }
    if (sentences[2] && summaryPoints.length < 3) {
      summaryPoints.push(sentences[2]);
    }

    if (summaryPoints.length === 0) {
      summaryPoints = [
        "A rigorous inquiry into computational craft and contemporary editorial thought.",
        "Synthesizing principles of architecture, typography, and enduring systems.",
        "Published under the accredited Vichaar Syndicate author ledger.",
      ];
    }
  }

  let sections = post.sections;
  if (typeof sections === "string") {
    try {
      sections = JSON.parse(sections);
    } catch {
      sections = null;
    }
  }

  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    const rawContent = post.content || "";
    const lines = rawContent.split("\n");
    const hasHeadings = lines.some((l) => l.trim().startsWith("#"));

    if (hasHeadings) {
      sections = [];
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
    } else {
      sections = null;
    }
  }

  return { summaryPoints, sections };
}

async function fetchPost(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.post) {
        const p = data.post;
        const { summaryPoints, sections } = parsePostSectionsAndSummary(p);

        // Find related dispatches from fallback sample dataset
        const related = POSTS_DATA.filter((item) => item.id !== parseInt(id)).slice(0, 3).map((r) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          author: r.author.name,
          readTime: r.readTime,
        }));

        return {
          ...p,
          date: new Date(p.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          summaryPoints,
          sections,
          relatedDispatches: related,
          author: {
            name: p.author?.name || p.authorName || "Staff Fellow",
            role: p.author?.role || p.authorRole || "Editorial Fellow",
            fellowship: "Vichaar Contributing Fellow",
            avatar: p.author?.avatar || p.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
            bio: p.author?.bio || "Contributing fellow to the Vichaar Broadsheet writing desk.",
          },
        };
      }
    }
  } catch (e) {
    console.warn("Backend fetch failed, falling back to local dataset:", e.message);
  }

  return POSTS_DATA.find((p) => p.id === parseInt(id));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return {
      title: "Dispatch Not Found | Vichaar (विचार)",
      description: "The requested essay could not be located in our archives.",
    };
  }

  return {
    title: `${post.title} | Vichaar (विचार)`,
    description: post.subtitle || post.summaryPoints?.[0] || "Broadsheet reading dispatch from Vichaar.",
  };
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await fetchPost(id);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-28 text-center font-serif">
        <div className="max-w-md mx-auto border-2 border-foreground/80 p-8 shadow-[4px_4px_0px_0px_rgba(28,24,21,0.9)] bg-background">
          <span className="text-[10px] font-sans uppercase tracking-widest font-black text-red-700 dark:text-red-400 block mb-2">
            Archival Error 404
          </span>
          <h1 className="text-3xl font-bold mb-3 text-foreground">Dispatch Not Found</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            The requested folio could not be found in our syndicated registers. It may have been archived or moved.
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-sans uppercase tracking-widest font-bold px-4 py-2 bg-foreground text-background hover:bg-amber-800 hover:text-white transition-colors"
          >
            &larr; Return to Front Page
          </Link>
        </div>
      </div>
    );
  }

  return <ReadingRoom post={post} />;
}
