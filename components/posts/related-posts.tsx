import { PostCard } from "@/components/posts/post-card";
import type { Post } from "@/lib/content/schema";

export function RelatedPosts({ posts }: { posts: readonly Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mx-auto mt-20 w-full max-w-(--container-wide) border-t border-border bg-canvas px-4 py-12 sm:px-6 lg:px-8"
    >
      <h2
        id="related-posts-heading"
        className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
      >
        Keep reading
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.frontmatter.slug}>
            <PostCard post={post} variant="catalog" />
          </li>
        ))}
      </ul>
    </section>
  );
}
