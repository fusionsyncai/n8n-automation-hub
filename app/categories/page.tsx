import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/content/categories";
import { getAllPosts } from "@/lib/content/posts";
import { CatalogShell } from "@/components/layout/catalog-shell";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse every category on the n8n Automation Hub: business process automation, sales, Slack, productivity tools, Telegram, WhatsApp and Meta, SEO, and AI agents.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  const posts = getAllPosts();
  const counts = new Map<string, number>();
  for (const p of posts) {
    counts.set(
      p.frontmatter.category,
      (counts.get(p.frontmatter.category) ?? 0) + 1,
    );
  }

  return (
    <>
      <section className="border-b border-border bg-surface bg-hero-wash px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-(--container-wide)">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            Browse
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            All categories
          </h1>
          <p className="mt-3 max-w-2xl text-ink-muted">
            Eight pillars from speed-to-lead and qualification to Slack,
            WhatsApp, SEO, and AI agents.
          </p>
        </div>
      </section>

      <CatalogShell>
        <ul className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => {
            const count = counts.get(cat.slug) ?? 0;
            return (
              <li key={cat.slug}>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-secondary/20 hover:shadow-card-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-semibold text-ink group-hover:text-accent">
                      {cat.name}
                    </h2>
                    <span className="shrink-0 rounded-md bg-accent-soft px-2 py-0.5 font-mono text-[0.6875rem] font-semibold text-accent">
                      {count}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {cat.tagline}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </CatalogShell>
    </>
  );
}
