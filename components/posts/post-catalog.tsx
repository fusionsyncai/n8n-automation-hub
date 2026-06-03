"use client";

import { useMemo, useState } from "react";
import { CategorySidebar } from "@/components/site/category-sidebar";
import { PostCard } from "@/components/posts/post-card";
import { cn } from "@/lib/utils";
import {
  contentTypeMeta,
  contentTypes,
  type ContentType,
} from "@/lib/content/content-types";
import type { Category } from "@/lib/content/categories";
import type { Post } from "@/lib/content/schema";

type ContentFilter = "all" | ContentType;

export interface PostCatalogProps {
  posts: readonly Post[];
  categories: readonly Category[];
  counts: Record<string, number>;
  heroPost?: Post;
}

export function PostCatalog({
  posts,
  categories,
  counts,
}: PostCatalogProps) {
  const [query, setQuery] = useState("");
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const totalPosts = posts.length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (
        contentFilter !== "all" &&
        p.frontmatter.contentType !== contentFilter
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        p.frontmatter.title,
        p.frontmatter.description,
        ...p.frontmatter.tags,
        p.frontmatter.category,
        p.frontmatter.contentType,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, contentFilter]);

  return (
    <div className="flex min-h-[480px] flex-col lg:flex-row">
      <CategorySidebar
        categories={categories}
        counts={counts}
        totalPosts={totalPosts}
        activeSlug={null}
        searchQuery={query}
        onSearchChange={setQuery}
        className="lg:sticky lg:top-[7.25rem] lg:max-h-[calc(100vh-7.25rem)] lg:self-start"
      />

      <div className="min-w-0 flex-1 bg-canvas bg-canvas-dots">
        <div className="flex flex-col gap-4 border-b border-border bg-surface px-4 py-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">
                {query.trim() ? "Search results" : "Workflow library"}
              </h2>
              <p className="mt-0.5 font-mono text-[0.6875rem] text-ink-faint">
                {filtered.length} post{filtered.length === 1 ? "" : "s"}
              </p>
            </div>
            <div
              className="flex flex-wrap gap-1 rounded-lg border border-border bg-canvas p-1"
              role="tablist"
              aria-label="Filter by content type"
            >
              <FilterTab
                active={contentFilter === "all"}
                onClick={() => setContentFilter("all")}
              >
                All
              </FilterTab>
              {contentTypes.map((type) => (
                <FilterTab
                  key={type}
                  active={contentFilter === type}
                  onClick={() => setContentFilter(type)}
                >
                  {contentTypeMeta[type].label}
                </FilterTab>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-8 sm:px-8 sm:py-10">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                No posts match your filters.
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Try another keyword or pick a category.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((post) => (
                <li key={post.frontmatter.slug}>
                  <PostCard post={post} variant="catalog" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-wide transition-colors",
        active
          ? "bg-surface text-ink shadow-sm"
          : "text-ink-faint hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
