import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { getAllPosts, getAuthor } from "@/lib/content/posts";

/**
 * Brief §8.4: full-text RSS for the last 30 posts.
 * We hand-roll the XML rather than pull a `rss` lib so the surface stays
 * dependency-light and the output is easy to audit.
 */
export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts().slice(0, 30);

  const feedUrl = absoluteUrl("/feed.xml");
  const updated = posts[0]
    ? new Date(
        posts[0].frontmatter.updatedAt ?? posts[0].frontmatter.publishedAt,
      ).toUTCString()
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const author = getAuthor(post.frontmatter.author);
      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${escapeXml(post.absoluteUrl)}</link>
      <guid isPermaLink="true">${escapeXml(post.absoluteUrl)}</guid>
      <pubDate>${new Date(post.frontmatter.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(post.frontmatter.description)}</description>
      ${author ? `<author>${escapeXml(author.name)}</author>` : ""}
      ${post.frontmatter.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${siteConfig.name} blog`)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // 1 hour CDN cache, stale-while-revalidate so feed readers stay fresh.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
