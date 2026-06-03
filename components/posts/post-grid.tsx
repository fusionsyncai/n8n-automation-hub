import { cn } from "@/lib/utils";
import { PostCard } from "@/components/posts/post-card";
import type { Post } from "@/lib/content/schema";

export interface PostGridProps {
  posts: readonly Post[];
  className?: string;
  columns?: 2 | 3;
  variant?: "default" | "catalog";
}

export function PostGrid({
  posts,
  className,
  columns = 3,
  variant = "catalog",
}: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-ink-muted",
          className,
        )}
      >
        No posts yet. Check back soon.
      </div>
    );
  }

  const colClasses =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";

  return (
    <ul className={cn("grid gap-8", colClasses, className)}>
      {posts.map((post) => (
        <li key={post.frontmatter.slug}>
          <PostCard post={post} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
