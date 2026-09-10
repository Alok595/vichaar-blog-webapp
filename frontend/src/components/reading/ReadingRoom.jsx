"use client";

import { useState } from "react";
import { ReadingToolbar } from "./ReadingToolbar";
import { ArticleContent } from "./ArticleContent";
import { PostSidebar } from "./PostSidebar";

export function ReadingRoom({ post }) {
  const [fontSize, setFontSize] = useState("normal");

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-14 max-w-7xl">
      {/* 1. Top Reading Utility Toolbar */}
      <ReadingToolbar
        category={post.category}
        fontSize={fontSize}
        setFontSize={setFontSize}
        title={post.title}
        post={post}
      />

      {/* 2. Main Broadsheet Two-Column Reading Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left / Main Essay Column (8 cols) */}
        <main className="lg:col-span-8">
          <ArticleContent post={post} fontSize={fontSize} />
        </main>

        {/* Right / Bureau Margin Column (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
          <PostSidebar post={post} />
        </div>
      </div>
    </div>
  );
}
