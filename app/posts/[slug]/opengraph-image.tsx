import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug, getAuthor } from "@/lib/content/posts";
import { getCategory } from "@/lib/content/categories";
import { siteConfig } from "@/lib/site-config";

/**
 * Per-post OG image (Brief §8.5).
 * 1200×630 with the post title, category, author on a brand-gradient background.
 *
 * Prerendered at build time for every slug returned by generateStaticParams.
 */

export const alt = `${siteConfig.name} blog post`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) return [{ slug: "__placeholder__" }];
  return posts.map((p) => ({ slug: p.frontmatter.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.frontmatter.title ?? siteConfig.name;
  const description = post?.frontmatter.description ?? siteConfig.tagline;
  const category = post ? getCategory(post.frontmatter.category) : undefined;
  const author = post ? getAuthor(post.frontmatter.author) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #1a0533 0%, #2d0a4e 35%, #833ab4 65%, #fd1d50 90%, #ff8a3d 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: "rgba(255, 138, 61, 0.35)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(165, 64, 245, 0.4)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: -0.4,
            }}
          >
            <span style={{ opacity: 0.95 }}>{siteConfig.shortName}</span>
          </div>
          {category ? (
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: "rgba(255, 255, 255, 0.14)",
                padding: "10px 20px",
                borderRadius: 9999,
                border: "1px solid rgba(255, 255, 255, 0.18)",
              }}
            >
              {category.name}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          <div
            style={{
              fontSize: title.length > 70 ? 60 : 72,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              lineHeight: 1.4,
              opacity: 0.85,
              maxWidth: 920,
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 18,
              opacity: 0.8,
            }}
          >
            <div style={{ display: "flex" }}>{author?.name ?? siteConfig.name}</div>
            <div style={{ display: "flex" }}>
              {siteConfig.url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
