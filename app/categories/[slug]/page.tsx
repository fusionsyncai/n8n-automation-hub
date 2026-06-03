import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/content/categories";
import { getPostsByCategory } from "@/lib/content/posts";
import { CatalogShell } from "@/components/layout/catalog-shell";
import { PostCard } from "@/components/posts/post-card";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `/categories/${cat.slug}` },
    openGraph: {
      title: cat.name,
      description: cat.description,
      url: `/categories/${cat.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageParams) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const posts = getPostsByCategory(slug);

  return (
    <>
      <section className="border-b border-border bg-surface bg-hero-wash px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-(--container-wide)">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-accent">
            Category
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {cat.name}
          </h1>
          <p className="mt-3 max-w-2xl text-ink-muted sm:text-lg">
            {cat.description}
          </p>
        </div>
      </section>

      <CatalogShell
        activeCategorySlug={slug}
        title={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
      >
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center text-sm text-ink-muted">
            No posts in this category yet.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <li key={post.frontmatter.slug}>
                <PostCard post={post} variant="catalog" />
              </li>
            ))}
          </ul>
        )}
      </CatalogShell>
    </>
  );
}
