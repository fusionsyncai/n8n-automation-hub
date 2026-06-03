import { getAllPosts, getPostBySlug } from "@/lib/content/posts";
import {
  absoluteMarkdownUrlForPost,
  renderPostAsMarkdown,
} from "@/lib/content/markdown";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) return [{ slug: "__placeholder__" }];
  return posts.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(renderPostAsMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
      "X-Robots-Tag": "noindex, follow",
      Link: [
        `<${post.absoluteUrl}>; rel="canonical"`,
        `<${absoluteMarkdownUrlForPost(post)}>; rel="self"; type="text/markdown"`,
      ].join(", "),
    },
  });
}
