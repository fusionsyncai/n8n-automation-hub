"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Brief §13: TableOfContents. Sticky on desktop, collapsible on mobile.
 *
 * Strategy: scrape h2/h3 from the post body markdown text on the client.
 * (We render this client-side because the heading IDs are only stable after
 * rehype-slug runs, which happens on the server during compile. Reading the
 * DOM after mount is cheap and avoids needing a parallel AST pass.)
 *
 * Two render modes, picked explicitly at the call site so we never end up
 * with two desktop navs fighting each other in the same column:
 *  - `mobile`  → in-flow collapsible <details>, intended for the body column
 *  - `desktop` → sticky right-rail nav, intended for the aside column
 */
export interface TableOfContentsProps {
  variant: "mobile" | "desktop";
  contentSelector?: string;
}

export function TableOfContents({
  variant,
  contentSelector = "[data-post-body]",
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.querySelector(contentSelector);
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>("h2, h3"));
    const next: TocItem[] = headings
      .filter((h) => h.id)
      .map((h) => ({
        id: h.id,
        text: h.textContent?.replace(/#$/, "").trim() ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      }));
    // Reading the rehype-emitted heading IDs requires a DOM that only exists
    // after hydration, so a one-shot scrape on mount is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(next);
  }, [contentSelector]);

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0% -55% 0%",
        threshold: [0, 1],
      },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const list = useMemo(() => items, [items]);

  if (list.length < 3) return null; // Don't show TOC for short posts.

  if (variant === "mobile") {
    return (
      <details
        className="lg:hidden mb-10 rounded-lg border border-border bg-surface-muted"
        open={open}
        onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-ink flex items-center justify-between">
          <span>On this page</span>
          <span aria-hidden className="text-ink-faint text-xs">
            {open ? "Hide" : "Show"}
          </span>
        </summary>
        <nav className="px-4 pb-4">
          <TocList items={list} activeId={activeId} />
        </nav>
      </details>
    );
  }

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-28 self-start"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
        On this page
      </p>
      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
        <TocList items={list} activeId={activeId} />
      </div>
    </nav>
  );
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string | null }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
          <a
            href={`#${item.id}`}
            className={cn(
              "block border-l-2 pl-3 py-1 transition-colors leading-snug",
              activeId === item.id
                ? "border-accent text-ink"
                : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
