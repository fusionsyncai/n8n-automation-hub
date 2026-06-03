import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags } from "@/lib/content/posts";
import { CatalogShell } from "@/components/layout/catalog-shell";

export const metadata: Metadata = {
  title: "Tags",
  description:
    "Browse every tag used across the n8n Automation Hub. Long-tail topics covering specific integrations, workflow patterns, AI agents, and tooling.",
  alternates: { canonical: "/tags" },
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <>
      <section className="border-b border-border bg-surface bg-hero-wash px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-(--container-wide)">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Tags
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Every topic, one cloud.
          </h1>
          <p className="mt-3 max-w-2xl text-ink-muted">
            Long-tail and specific. For when you need one technique, not a
            whole pillar.
          </p>
        </div>
      </section>

      <CatalogShell title="All tags">
        {tags.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-ink-muted">
            No tags yet.
          </div>
        ) : (
          <ul className="flex flex-wrap gap-2.5">
            {tags.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tags/${t.slug}`}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 font-mono text-xs text-ink-muted shadow-card transition-colors hover:border-accent/40 hover:text-ink"
                >
                  <span>{t.tag}</span>
                  <span className="rounded bg-surface-soft px-1.5 py-0.5 text-[0.6875rem] text-ink-faint">
                    {t.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CatalogShell>
    </>
  );
}
