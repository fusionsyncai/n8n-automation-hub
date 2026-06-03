import Link from "next/link";
import Image from "next/image";
import { cn, formatDate, toIsoDate } from "@/lib/utils";
import type { Author } from "@/lib/content/schema";

export interface AuthorBylineProps {
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  className?: string;
}

export function AuthorByline({
  author,
  publishedAt,
  updatedAt,
  readingMinutes,
  className,
}: AuthorBylineProps) {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <Link
        href={`/authors/${author.slug}`}
        aria-label={`Posts by ${author.name}`}
        className="flex items-center gap-3"
      >
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full border border-border"
          />
        ) : (
          <span className="h-9 w-9 rounded-full bg-brand-gradient-soft border border-border" />
        )}
        <span className="font-medium text-ink">{author.name}</span>
      </Link>
      <span aria-hidden className="text-ink-faint">
        ·
      </span>
      <time dateTime={toIsoDate(publishedAt)} className="text-ink-muted">
        {formatDate(publishedAt)}
      </time>
      <span aria-hidden className="text-ink-faint">
        ·
      </span>
      <span className="text-ink-muted">{readingMinutes} min read</span>
      {updatedAt && updatedAt !== publishedAt ? (
        <>
          <span aria-hidden className="text-ink-faint">
            ·
          </span>
          <span className="text-ink-faint">
            Updated {formatDate(updatedAt)}
          </span>
        </>
      ) : null}
    </div>
  );
}
