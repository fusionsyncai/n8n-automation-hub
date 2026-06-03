import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { getAllAuthors, getAuthor, getPostsByAuthor } from "@/lib/content/posts";
import { PostGrid } from "@/components/posts/post-grid";
import { siteConfig } from "@/lib/site-config";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const authors = getAllAuthors();
  if (authors.length === 0) return [{ slug: "__placeholder__" }];
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};
  return {
    title: author.name,
    description: author.bio,
    alternates: { canonical: `/authors/${slug}` },
    openGraph: {
      title: `${author.name} · ${siteConfig.name}`,
      description: author.bio,
      url: `/authors/${slug}`,
    },
  };
}

export default async function AuthorPage({ params }: PageParams) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();
  const posts = getPostsByAuthor(slug);

  return (
    <div className="mx-auto w-full max-w-(--container-wide) px-6 py-16 sm:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        Back to home
      </Link>

      <header className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={96}
            height={96}
            className="h-20 w-20 rounded-full border border-border"
          />
        ) : (
          <span className="h-20 w-20 rounded-full bg-brand-gradient-soft border border-border" />
        )}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Author
          </p>
          <h1 className="mt-2 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            {author.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
            {author.bio}
          </p>
          <p className="mt-3 text-sm text-ink-faint">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </p>
        </div>
      </header>

      <div className="mt-14">
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
