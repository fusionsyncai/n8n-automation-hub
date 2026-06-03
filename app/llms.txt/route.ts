import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/content/categories";
import { getAllPosts } from "@/lib/content/posts";
import { absoluteMarkdownUrlForPost } from "@/lib/content/markdown";

export const dynamic = "force-static";

export function GET() {
  const posts = getAllPosts();

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.name} publishes installable n8n workflow implementations (step-by-step setup, JSON export) and architecture playbooks for business operations, sales, Slack, productivity tools, Telegram, WhatsApp, Meta, blog and SEO, and AI agents. Powered by ${siteConfig.parent.name}.`,
    "",
    "## Primary Pages",
    "",
    `- [Blog home](${siteConfig.url}): Editorial home for ${siteConfig.name} articles on n8n workflow automation across business, sales, messaging, productivity, and AI agent use cases.`,
    `- [About](${absoluteUrl("/about")}): Explains the hub's purpose, who runs it, and how it is powered by ${siteConfig.parent.name}.`,
    `- [Categories](${absoluteUrl("/categories")}): Index of the eight content pillars on the hub.`,
    `- [${siteConfig.parent.name}](${siteConfig.parent.url}): Parent agency that builds n8n automations and AI agents end-to-end for client teams.`,
    `- [Book a call](${siteConfig.agency.bookCallUrl}): Scope an automation build with ${siteConfig.parent.name}.`,
    "",
    "## Blog Posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.frontmatter.title}](${absoluteMarkdownUrlForPost(post)}): ${post.frontmatter.description}`,
    ),
    "",
    "## Categories",
    "",
    ...categories.map(
      (category) =>
        `- [${category.name}](${absoluteUrl(`/categories/${category.slug}`)}): ${category.description}`,
    ),
    "",
    "## Legal",
    "",
    `- [Privacy Policy](${siteConfig.legal.privacyUrl}): Privacy policy for the hub and the parent agency.`,
    `- [Terms of Service](${siteConfig.legal.termsUrl}): Terms covering acceptable use, disclaimers, and liability limits.`,
    "",
    "## Key Facts",
    "",
    `- Publication: ${siteConfig.name}`,
    `- Parent company: ${siteConfig.parent.name}`,
    "- Topic surface: n8n workflow automation, AI agents, integrations, ops, sales, content, and messaging.",
    "- Editorial stance: independent, opinionated, hands-on. Not affiliated with n8n GmbH.",
    "- Markdown alternates: every published post has a text/markdown surface at `/posts/[slug]/markdown`.",
    "",
    "## Contact",
    "",
    `- Website: ${siteConfig.url}`,
    `- Parent agency: ${siteConfig.parent.url}`,
    `- Contact: ${siteConfig.agency.contactUrl}`,
    `- Privacy requests: ${siteConfig.legal.privacyUrl}`,
    "",
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
      Link: `<${absoluteUrl("/sitemap.xml")}>; rel="sitemap"`,
    },
  });
}
