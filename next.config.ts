import type { NextConfig } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  // Posts may reference cover images by relative path under /public/. That's
  // already covered by next/image without configuration. If we ever embed
  // remote images (e.g. from a CDN), add their hostnames here.
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/posts/:slug",
        headers: [
          {
            key: "Link",
            value: `<${siteUrl}/posts/:slug/markdown>; rel="alternate"; type="text/markdown"`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
