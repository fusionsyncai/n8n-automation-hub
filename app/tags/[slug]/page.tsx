import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag, tagSlug } from "@/lib/content/posts";
import { CatalogShell } from "@/components/layout/catalog-shell";
import { PostCard } from "@/components/posts/post-card";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const tags = getAllTags();
  if (tags.length === 0) return [{ slug: "__placeholder__" }];
  return tags.map((t) => ({ slug: t.slug }));
}

function findTagBySlug(slug: string): { tag: string; count: number } | undefined {
  return getAllTags().find((t) => t.slug === slug);
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const found = findTagBySlug(slug);
  if (!found) return {};
  return {
    title: `#${found.tag}`,
    description: `Posts tagged with ${found.tag} on the n8n Automation Hub. ${found.count} ${found.count === 1 ? "post" : "posts"}.`,
    alternates: { canonical: `/tags/${slug}` },
  };
}

export default async function TagPage({ params }: PageParams) {
  const { slug } = await params;
  const found = findTagBySlug(slug);
  if (!found) notFound();
  const posts = getPostsByTag(found.tag).filter((p) =>
    p.frontmatter.tags.some((t) => tagSlug(t) === slug),
  );

  return (
    <>
      <section className="border-b border-border bg-surface bg-hero-wash px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-(--container-wide)">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-accent">
            Tag
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            #{found.tag}
          </h1>
        </div>
      </section>

      <CatalogShell title={`${posts.length} post${posts.length === 1 ? "" : "s"}`}>
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post.frontmatter.slug}>
              <PostCard post={post} variant="catalog" />
            </li>
          ))}
        </ul>
      </CatalogShell>
    </>
  );
}
