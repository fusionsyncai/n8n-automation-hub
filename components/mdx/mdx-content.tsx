import "server-only";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx/mdx-components";

/**
 * MDX pipeline.
 *
 * Brief notes guiding plugin choice:
 * - GFM (tables, task lists, autolinks, strikethrough): needed for the
 *   feature-by-feature comparison archetype (Brief §7.2.D).
 * - rehype-slug + rehype-autolink-headings: sticky TableOfContents needs
 *   stable heading IDs; permalinks help readers share specific sections.
 * - rehype-pretty-code with Shiki: Brief §6.2 mandates code blocks for
 *   cURL/JSON examples; we render them with a calm light theme.
 *
 * Note: We use `next-mdx-remote/rsc` (not @next/mdx) so frontmatter (Brief §12)
 * stays in YAML and we can pass JS plugin options. With Turbopack + @next/mdx,
 * non-serializable plugin options (like our autolink-headings content fn) fail
 * to cross the Rust/JS boundary, so /rsc compilation in Node is the right path.
 */

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: true,
  defaultLang: "plaintext",
};

export async function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              {
                behavior: "append",
                properties: {
                  className: ["heading-anchor"],
                  ariaLabel: "Link to this section",
                },
                content: { type: "text", value: "#" },
              },
            ],
            [rehypePrettyCode, prettyCodeOptions],
          ],
          format: "mdx",
        },
      }}
    />
  );
}
