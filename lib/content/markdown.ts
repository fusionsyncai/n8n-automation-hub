import "server-only";
import { ctaVariantForContentType } from "@/components/mdx/cta-block";
import { siteConfig } from "@/lib/site-config";
import type { Post } from "@/lib/content/schema";

export function markdownUrlForPost(slug: string): string {
  return `/posts/${slug}/markdown`;
}

export function absoluteMarkdownUrlForPost(post: Post): string {
  return `${post.absoluteUrl}/markdown`;
}

export function renderPostAsMarkdown(post: Post): string {
  const { frontmatter, body, readingMinutes, absoluteUrl } = post;
  const parts = [
    `# ${frontmatter.title}`,
    frontmatter.description,
    [
      `Published: ${frontmatter.publishedAt}`,
      `Updated: ${frontmatter.updatedAt ?? frontmatter.publishedAt}`,
      `Reading time: ${readingMinutes} min`,
      `Canonical: ${absoluteUrl}`,
      `Markdown: ${absoluteMarkdownUrlForPost(post)}`,
      `Tags: ${frontmatter.tags.join(", ")}`,
    ].join("\n"),
    normalizeMdxToMarkdown(body),
    postCtaMarkdownLine(frontmatter.contentType),
  ];

  return `${parts.map((part) => part.trim()).filter(Boolean).join("\n\n")}\n`;
}

function postCtaMarkdownLine(contentType: string | undefined): string {
  const variant = ctaVariantForContentType(contentType);
  if (variant === "implementation") {
    return `Need help setting this up? [Book a call](${siteConfig.agency.bookCallUrl}).`;
  }
  return `Want this built for you? [Talk to ${siteConfig.parent.name}](${siteConfig.agency.bookCallUrl}).`;
}

function normalizeMdxToMarkdown(source: string): string {
  return source
    .replace(
      /<Callout\b[^>]*title=["']([^"']+)["'][^>]*>([\s\S]*?)<\/Callout>/g,
      (_match, title: string, children: string) =>
        blockquote(`**${decodeHtmlEntities(title)}**\n\n${children.trim()}`),
    )
    .replace(
      /<Callout\b[^>]*>([\s\S]*?)<\/Callout>/g,
      (_match, children: string) => blockquote(children.trim()),
    )
    .replace(
      /<InlineCta\b[^>]*>([\s\S]*?)<\/InlineCta>/g,
      (_match, children: string) =>
        `${children.trim()}\n\n[Hire ${siteConfig.parent.name}](${siteConfig.agency.contactUrl})`,
    )
    .replace(
      /<InlineCta\s*\/>/g,
      `${siteConfig.parent.name} builds workflows like this one end-to-end.\n\n[Hire ${siteConfig.parent.name}](${siteConfig.agency.contactUrl})`,
    )
    .replace(/<CtaBlock\b[\s\S]*?\/>/g, "")
    .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s+[^>]*)?>/g, "")
    .replace(/\{["']\s*["']\}/g, " ")
    .replace(/\{`([^`]+)`\}/g, "$1")
    .replace(/\{"([^"]+)"\}/g, "$1")
    .replace(/\{'([^']+)'\}/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => decodeHtmlEntities(line).trimEnd())
    .join("\n")
    .trim();
}

function blockquote(markdown: string): string {
  return markdown
    .split("\n")
    .map((line) => (line.trim() ? `> ${line}` : ">"))
    .join("\n");
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
