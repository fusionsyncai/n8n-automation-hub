import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, FileTextIcon } from "lucide-react";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import {
  getAllPosts,
  getAuthor,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/content/posts";
import {
  absoluteMarkdownUrlForPost,
  markdownUrlForPost,
} from "@/lib/content/markdown";
import { MdxContent } from "@/components/mdx/mdx-content";
import { CategoryChip } from "@/components/posts/category-chip";
import { CompanionPostBanner } from "@/components/posts/companion-post-banner";
import { ContentTypeChip } from "@/components/posts/content-type-chip";
import { AuthorByline } from "@/components/posts/author-byline";
import { ShareLinks } from "@/components/posts/share-links";
import { TableOfContents } from "@/components/posts/table-of-contents";
import { RelatedPosts } from "@/components/posts/related-posts";
import {
  CtaBlock,
  ctaVariantForContentType,
} from "@/components/mdx/cta-block";
import { toIsoDate } from "@/lib/utils";

interface PageParams {
  params: Promise<{ slug: string }>;
}

/**
 * Brief: every published post is statically rendered. We tell Next that
 * unlisted slugs should 404; no runtime dynamic generation needed.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getAllPosts();
  // With Cache Components on, generateStaticParams must return at least one entry.
  // Until the first post ships we return a placeholder slug; the page below
  // will notFound() for it.
  if (posts.length === 0) return [{ slug: "__placeholder__" }];
  return posts.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { frontmatter, absoluteUrl: postUrl } = post;
  const ogImage = frontmatter.ogImage ?? frontmatter.coverImage ?? siteConfig.defaultOgImage;
  const markdownUrl = absoluteMarkdownUrlForPost(post);

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    keywords: frontmatter.tags,
    alternates: {
      canonical: postUrl,
      types: {
        "text/markdown": markdownUrl,
      },
    },
    openGraph: {
      type: "article",
      url: postUrl,
      title: frontmatter.title,
      description: frontmatter.description,
      siteName: siteConfig.name,
      publishedTime: toIsoDate(frontmatter.publishedAt),
      modifiedTime: frontmatter.updatedAt
        ? toIsoDate(frontmatter.updatedAt)
        : toIsoDate(frontmatter.publishedAt),
      authors: [
        getAuthor(frontmatter.author)?.name ?? siteConfig.parent.name,
      ],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { frontmatter, body, readingMinutes, absoluteUrl: postUrl } = post;
  const markdownHref = markdownUrlForPost(slug);
  const author = getAuthor(frontmatter.author);
  const related = getRelatedPosts(slug);
  const companion = frontmatter.companionSlug
    ? getPostBySlug(frontmatter.companionSlug)
    : null;

  /* ------------------------------------------------------------------ */
  /*  Per-post BlogPosting JSON-LD (Brief §8.3)                          */
  /* ------------------------------------------------------------------ */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.ogImage
      ? absoluteUrl(frontmatter.ogImage)
      : frontmatter.coverImage
        ? absoluteUrl(frontmatter.coverImage)
        : absoluteUrl(siteConfig.defaultOgImage),
    datePublished: toIsoDate(frontmatter.publishedAt),
    dateModified: toIsoDate(frontmatter.updatedAt ?? frontmatter.publishedAt),
    author: author
      ? { "@type": "Person", name: author.name }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    mainEntityOfPage: postUrl,
    keywords: frontmatter.tags.join(", "),
  };

  return (
    <article className="bg-canvas pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ---------------------------------------------------------- */}
      {/*  Header                                                      */}
      {/* ---------------------------------------------------------- */}
      <div className="border-b border-border bg-surface bg-hero-wash">
        <div className="mx-auto flex w-full max-w-(--container-wide) flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            Workflow library
          </Link>
          <a
            href={markdownHref}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-wide text-ink-faint transition-colors hover:text-ink"
            type="text/markdown"
          >
            <FileTextIcon className="h-3.5 w-3.5" />
            Markdown
          </a>
        </div>

        <header className="mx-auto w-full max-w-3xl px-4 pb-12 pt-2 text-center sm:px-6 sm:pb-14">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <ContentTypeChip contentType={frontmatter.contentType} size="md" />
            <CategoryChip
              slug={frontmatter.category}
              featured={frontmatter.featured}
              size="md"
            />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {frontmatter.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
            {frontmatter.description}
          </p>
          {author ? (
            <div className="mt-8 flex justify-center">
              <AuthorByline
                author={author}
                publishedAt={frontmatter.publishedAt}
                updatedAt={frontmatter.updatedAt}
                readingMinutes={readingMinutes}
              />
            </div>
          ) : null}
        </header>

        {frontmatter.coverImage ? (
          <div className="mx-auto w-full max-w-(--container-wide) px-4 pb-12 sm:px-6 sm:pb-14">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-card">
              <Image
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                fill
                priority
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Body + sticky TOC                                          */}
      {/* ---------------------------------------------------------- */}
      <div className="mx-auto mt-12 grid w-full max-w-(--container-wide) gap-12 px-6 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <div data-post-body className="mx-auto max-w-(--container-prose)">
            {/* Mobile-only collapsible TOC. Desktop variant lives in the aside. */}
            <TableOfContents variant="mobile" />
            <CompanionPostBanner post={post} companion={companion ?? null} />
            <MdxContent source={body} />

            <CtaBlock variant={ctaVariantForContentType(frontmatter.contentType)} />

            {frontmatter.tags.length > 0 ? (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
                <span className="text-xs uppercase tracking-wider text-ink-faint">
                  Tags
                </span>
                {frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="rounded-md border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              {author ? (
                <Link
                  href={`/authors/${author.slug}`}
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  More from {author.name} →
                </Link>
              ) : (
                <span />
              )}
              <ShareLinks url={postUrl} title={frontmatter.title} />
            </div>
          </div>
        </div>

        <aside className="hidden lg:block">
          <TableOfContents variant="desktop" />
        </aside>
      </div>

      <RelatedPosts posts={related} />
    </article>
  );
}
