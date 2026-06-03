import { CategorySidebar } from "@/components/site/category-sidebar";
import { categories } from "@/lib/content/categories";
import { getAllPosts } from "@/lib/content/posts";

export interface CatalogShellProps {
  children: React.ReactNode;
  /** Highlight this category in the sidebar */
  activeCategorySlug?: string | null;
  /** Title shown in the canvas header strip */
  title?: string;
  subtitle?: string;
}

/**
 * Two-column catalog layout: dark sidebar + light canvas content.
 * Used on category and tag index pages.
 */
export function CatalogShell({
  children,
  activeCategorySlug = null,
  title,
  subtitle,
}: CatalogShellProps) {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};
  for (const p of posts) {
    counts[p.frontmatter.category] =
      (counts[p.frontmatter.category] ?? 0) + 1;
  }

  return (
    <div className="flex min-h-[480px] flex-col lg:flex-row">
      <CategorySidebar
        categories={categories}
        counts={counts}
        totalPosts={posts.length}
        activeSlug={activeCategorySlug}
        className="lg:sticky lg:top-[7.25rem] lg:max-h-[calc(100vh-7.25rem)] lg:self-start"
      />
      <div className="min-w-0 flex-1 bg-canvas bg-canvas-dots">
        {title ? (
          <div className="border-b border-border bg-surface px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
