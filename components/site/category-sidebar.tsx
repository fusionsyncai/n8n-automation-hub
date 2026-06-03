"use client";

import Link from "next/link";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/content/categories";

export interface CategorySidebarProps {
  categories: readonly Category[];
  counts: Record<string, number>;
  totalPosts: number;
  activeSlug?: string | null;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export function CategorySidebar({
  categories,
  counts,
  totalPosts,
  activeSlug = null,
  searchQuery = "",
  onSearchChange,
  className,
}: CategorySidebarProps) {
  const searchable = typeof onSearchChange === "function";

  return (
    <aside
      className={cn(
        "flex w-full flex-col border-border bg-surface lg:w-(--sidebar-width) lg:shrink-0 lg:border-r",
        className,
      )}
    >
      <div className="border-b border-border p-4">
        {searchable ? (
          <label className="relative block">
            <span className="sr-only">Search workflows</span>
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search workflows..."
              className="w-full rounded-lg border border-border bg-canvas py-2.5 pl-10 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </label>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg border border-border bg-canvas px-3 py-2.5 text-sm text-ink-muted transition-colors hover:border-accent/30 hover:text-ink"
          >
            <SearchIcon className="h-4 w-4" aria-hidden />
            Search on home
          </Link>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Categories">
        <p className="mb-2 px-2 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          Categories
        </p>
        <ul className="space-y-0.5">
          <li>
            <SidebarLink
              href="/"
              active={activeSlug === null}
              count={totalPosts}
            >
              All workflows
            </SidebarLink>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <SidebarLink
                href={`/categories/${cat.slug}`}
                active={activeSlug === cat.slug}
                count={counts[cat.slug] ?? 0}
              >
                {cat.name}
              </SidebarLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden border-t border-border p-4 lg:block">
        <Link
          href="/categories"
          className="text-xs font-medium text-ink-muted hover:text-accent"
        >
          All categories →
        </Link>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent-soft font-medium text-accent"
          : "text-ink-muted hover:bg-surface-soft hover:text-ink",
      )}
    >
      <span className="min-w-0 truncate leading-snug">{children}</span>
      <span
        className={cn(
          "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[0.6875rem] tabular-nums",
          active
            ? "bg-accent/15 text-accent"
            : "bg-surface-soft text-ink-faint",
        )}
      >
        {count}
      </span>
    </Link>
  );
}
