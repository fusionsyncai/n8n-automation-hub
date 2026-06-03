import { z } from "zod";

/**
 * Brief §12: frontmatter schema. Every MDX post must validate against this,
 * or the build fails. Keeps the writer honest and the renderer simple.
 */
export const postFrontmatterSchema = z.object({
  title: z.string().min(8).max(120),
  description: z.string().min(40).max(200),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "slug must be lowercase kebab-case (a-z, 0-9, -)",
    ),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, "publishedAt must start with YYYY-MM-DD"),
  updatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}/, "updatedAt must start with YYYY-MM-DD")
    .optional(),
  /** Author slug. Must match an entry in content/authors/. */
  author: z.string().min(1),
  /** One of the eight pillar categories. Brief §7.1. */
  category: z.string().min(1),
  /**
   * Editorial format. Implementations are primary (installable guides).
   * Playbooks are architecture and research-first. See content/CONTENT-STRATEGY.md.
   */
  contentType: z.enum(["implementation", "playbook"]).default("playbook"),
  /**
   * Slug of the paired post (playbook ↔ implementation) when both exist.
   * Example: a playbook sets companionSlug to the future implementation slug.
   */
  companionSlug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  tags: z.array(z.string().min(1)).default([]),
  coverImage: z.string().optional(),
  ogImage: z.string().optional(),
  /** Minutes. Auto-computed from content if omitted. */
  readingTime: z.coerce.number().int().positive().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof postFrontmatterSchema>;

export const authorSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  avatar: z.string().optional(),
  bio: z.string().min(1),
  twitter: z.string().optional(),
  url: z.string().url().optional(),
});

export type Author = z.infer<typeof authorSchema>;

/**
 * The fully resolved post used everywhere downstream. Combines:
 * - Validated frontmatter
 * - Raw + compiled MDX body
 * - Computed reading time, hrefs, dates
 */
export interface Post {
  frontmatter: PostFrontmatter;
  body: string;
  readingMinutes: number;
  href: string;
  /** Absolute URL. Used for canonical, OG, JSON-LD, RSS. */
  absoluteUrl: string;
  /**
   * Author resolved at load time on the server. Attached here so client
   * components (e.g. the searchable catalog) can render the byline without
   * importing the server-only posts module.
   */
  resolvedAuthor: Author | null;
}
