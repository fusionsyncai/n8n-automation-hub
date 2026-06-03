import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { cache } from "react";
import { absoluteUrl } from "@/lib/site-config";
import { isCategorySlug } from "@/lib/content/categories";
import {
  authorSchema,
  postFrontmatterSchema,
  type Author,
  type Post,
} from "@/lib/content/schema";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

/**
 * Read every MDX file under content/posts, validate frontmatter,
 * and return fully resolved posts sorted newest-first.
 *
 * Wrapped in React `cache` so multiple components in the same request
 * share one I/O pass; important during build when many pages call this.
 *
 * Drafts are filtered out unless `includeDrafts` is true.
 */
export const getAllPosts = cache((includeDrafts = false): Post[] => {
  const files = safeReadDir(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => loadPost(file));

  return posts
    .filter((p) => includeDrafts || !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime(),
    );
});

function loadPost(filename: string): Post {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const result = postFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `[posts] Invalid frontmatter in ${filename}:\n${formatZodIssues(result.error.issues)}`,
    );
  }
  const fm = result.data;

  // Slug must match the filename so URLs and the file system never disagree.
  const slugFromFilename = filename.replace(/\.mdx$/, "");
  if (fm.slug !== slugFromFilename) {
    throw new Error(
      `[posts] slug mismatch in ${filename}: frontmatter slug "${fm.slug}" != filename "${slugFromFilename}". Rename the file or fix the frontmatter.`,
    );
  }

  if (!isCategorySlug(fm.category)) {
    throw new Error(
      `[posts] Unknown category "${fm.category}" in ${filename}. Add it to lib/content/categories.ts or fix the frontmatter.`,
    );
  }

  const minutes = fm.readingTime ?? Math.max(1, Math.round(readingTime(content).minutes));

  const href = `/posts/${fm.slug}`;

  return {
    frontmatter: fm,
    body: content,
    readingMinutes: minutes,
    href,
    absoluteUrl: absoluteUrl(href),
    resolvedAuthor: getAuthor(fm.author) ?? null,
  };
}

function formatZodIssues(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>,
): string {
  return issues
    .map((i) => {
      const dotted = i.path
        .map((segment) =>
          typeof segment === "symbol" ? segment.toString() : String(segment),
        )
        .join(".");
      return `  - ${dotted || "(root)"}: ${i.message}`;
    })
    .join("\n");
}

export const getPostBySlug = cache((slug: string): Post | undefined => {
  return getAllPosts(true).find((p) => p.frontmatter.slug === slug && !p.frontmatter.draft);
});

export const getPostsByCategory = cache((slug: string): Post[] => {
  return getAllPosts().filter((p) => p.frontmatter.category === slug);
});

export const getPostsByTag = cache((tag: string): Post[] => {
  const lower = tag.toLowerCase();
  return getAllPosts().filter((p) =>
    p.frontmatter.tags.some((t) => t.toLowerCase() === lower),
  );
});

export const getPostsByAuthor = cache((authorSlug: string): Post[] => {
  return getAllPosts().filter((p) => p.frontmatter.author === authorSlug);
});

export const getFeaturedPosts = cache((): Post[] => {
  return getAllPosts().filter((p) => p.frontmatter.featured);
});

/**
 * Brief §13: RelatedPosts shows 3 from same category or tag, never the post itself.
 * Strategy: prefer same category, fall back to tag overlap, fall back to recency.
 */
export const getRelatedPosts = cache((slug: string, limit = 3): Post[] => {
  const all = getAllPosts();
  const current = all.find((p) => p.frontmatter.slug === slug);
  if (!current) return [];

  const others = all.filter((p) => p.frontmatter.slug !== slug);

  const sameCategory = others.filter(
    (p) => p.frontmatter.category === current.frontmatter.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const currentTags = new Set(current.frontmatter.tags.map((t) => t.toLowerCase()));
  const sameTag = others
    .filter((p) => !sameCategory.includes(p))
    .filter((p) =>
      p.frontmatter.tags.some((t) => currentTags.has(t.toLowerCase())),
    );

  const result = [...sameCategory, ...sameTag];
  if (result.length >= limit) return result.slice(0, limit);

  const remaining = others.filter((p) => !result.includes(p));
  return [...result, ...remaining].slice(0, limit);
});

/**
 * All distinct tags across all posts. Used by /tags index and tag pages.
 * Returns tags sorted by usage (descending), then alphabetically.
 */
export const getAllTags = cache((): { tag: string; slug: string; count: number }[] => {
  const tally = new Map<string, { tag: string; count: number }>();
  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags) {
      const key = tag.toLowerCase();
      const existing = tally.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        tally.set(key, { tag, count: 1 });
      }
    }
  }
  return Array.from(tally.entries())
    .map(([key, { tag, count }]) => ({ tag, slug: key.replace(/\s+/g, "-"), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
});

export function tagSlug(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, "-");
}

/* -------------------------------------------------------------------------- */
/*  Authors                                                                    */
/* -------------------------------------------------------------------------- */

export const getAllAuthors = cache((): Author[] => {
  const files = safeReadDir(AUTHORS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((file) => loadAuthor(file));
});

export const getAuthor = cache((slug: string): Author | undefined => {
  return getAllAuthors().find((a) => a.slug === slug);
});

function loadAuthor(filename: string): Author {
  const filePath = path.join(AUTHORS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`[authors] Invalid JSON in ${filename}: ${(err as Error).message}`);
  }
  const result = authorSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `[authors] Invalid author in ${filename}:\n${formatZodIssues(result.error.issues)}`,
    );
  }
  const fileSlug = filename.replace(/\.json$/, "");
  if (result.data.slug !== fileSlug) {
    throw new Error(
      `[authors] slug mismatch in ${filename}: "${result.data.slug}" != filename "${fileSlug}".`,
    );
  }
  return result.data;
}
