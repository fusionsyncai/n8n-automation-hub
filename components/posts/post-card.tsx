import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon } from "lucide-react";
import { cn, formatDateShort, toIsoDate } from "@/lib/utils";
import { CategoryChip } from "@/components/posts/category-chip";
import { ContentTypeChip } from "@/components/posts/content-type-chip";
import { PostCover } from "@/components/posts/post-cover";
import type { Post } from "@/lib/content/schema";

export interface PostCardProps {
  post: Post;
  variant?: "default" | "compact" | "hero" | "catalog";
  className?: string;
  priority?: boolean;
}

export function PostCard({
  post,
  variant = "default",
  className,
  priority = false,
}: PostCardProps) {
  const { frontmatter, href, readingMinutes } = post;
  const author = post.resolvedAuthor;

  if (variant === "catalog") {
    return (
      <article className={cn("group h-full", className)}>
        <Link
          href={href}
          aria-label={frontmatter.title}
          className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-2xl"
        >
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:border-secondary/25 group-hover:shadow-card-hover">
            <div className="p-3 pb-0">
              {frontmatter.coverImage ? (
                <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-border">
                  <Image
                    src={frontmatter.coverImage}
                    alt={frontmatter.title}
                    fill
                    sizes="(min-width: 1280px) 360px, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <PostCover
                  title={frontmatter.title}
                  slug={frontmatter.slug}
                  categorySlug={frontmatter.category}
                  size="card"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col p-5 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <ContentTypeChip contentType={frontmatter.contentType} />
                <CategoryChip
                  slug={frontmatter.category}
                  asLink={false}
                  size="sm"
                />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-tight text-ink line-clamp-2 group-hover:text-accent transition-colors">
                {frontmatter.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-2">
                {frontmatter.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-[0.6875rem] text-ink-faint">
                  {readingMinutes} min ·{" "}
                  <time dateTime={toIsoDate(frontmatter.publishedAt)}>
                    {formatDateShort(frontmatter.publishedAt)}
                  </time>
                </span>
                <ArrowUpRightIcon className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "hero") {
    return (
      <article className={cn("group", className)}>
        <Link
          href={href}
          aria-label={frontmatter.title}
          className="grid overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all hover:shadow-card-hover lg:grid-cols-2"
        >
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <CategoryChip
              slug={frontmatter.category}
              featured={frontmatter.featured}
              asLink={false}
              size="md"
            />
            <h2 className="mt-4 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl group-hover:text-accent transition-colors">
              {frontmatter.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg line-clamp-3">
              {frontmatter.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-ink-faint">
              {author?.avatar ? (
                <Image
                  src={author.avatar}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border border-border"
                />
              ) : null}
              {author ? (
                <span className="text-ink-muted">{author.name}</span>
              ) : null}
              <span aria-hidden>·</span>
              <time dateTime={toIsoDate(frontmatter.publishedAt)}>
                {formatDateShort(frontmatter.publishedAt)}
              </time>
              <span aria-hidden>·</span>
              <span>{readingMinutes} min read</span>
            </div>
          </div>
          <div className="relative min-h-[220px] border-t border-border bg-canvas p-4 lg:border-t-0 lg:border-l">
            {frontmatter.coverImage ? (
              <div className="relative h-full min-h-[200px] overflow-hidden rounded-xl">
                <Image
                  src={frontmatter.coverImage}
                  alt={frontmatter.title}
                  fill
                  priority={priority}
                  className="object-cover"
                />
              </div>
            ) : (
              <PostCover
                title={frontmatter.title}
                slug={frontmatter.slug}
                categorySlug={frontmatter.category}
                size="hero"
                className="h-full min-h-[200px]"
              />
            )}
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className={cn("group", className)}>
        <Link href={href} aria-label={frontmatter.title} className="flex gap-4">
          <div className="relative h-[4.5rem] w-24 flex-none overflow-hidden rounded-lg">
            {frontmatter.coverImage ? (
              <Image src={frontmatter.coverImage} alt="" fill sizes="96px" className="object-cover" />
            ) : (
              <PostCover
                title={frontmatter.title}
                slug={frontmatter.slug}
                categorySlug={frontmatter.category}
                className="min-h-0 h-full rounded-lg"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <CategoryChip slug={frontmatter.category} asLink={false} size="sm" />
            <h3 className="mt-1.5 text-sm font-semibold leading-snug text-ink line-clamp-2 group-hover:text-accent">
              {frontmatter.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-ink-faint">
              {formatDateShort(frontmatter.publishedAt)} · {readingMinutes} min
            </p>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group", className)}>
      <Link href={href} aria-label={frontmatter.title}>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all group-hover:shadow-card-hover">
          <div className="p-3 pb-0">
            {frontmatter.coverImage ? (
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image
                  src={frontmatter.coverImage}
                  alt={frontmatter.title}
                  fill
                  priority={priority}
                  className="object-cover"
                />
              </div>
            ) : (
              <PostCover
                title={frontmatter.title}
                slug={frontmatter.slug}
                categorySlug={frontmatter.category}
              />
            )}
          </div>
          <div className="p-5">
            <CategoryChip slug={frontmatter.category} featured={frontmatter.featured} asLink={false} />
            <h3 className="mt-3 font-display text-xl font-semibold text-ink group-hover:text-accent">
              {frontmatter.title}
            </h3>
            <p className="mt-2 text-sm text-ink-muted line-clamp-2">
              {frontmatter.description}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
