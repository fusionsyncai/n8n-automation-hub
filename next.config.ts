import type { NextConfig } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  // The hub is served as a subfolder of the main site at
  // `www.fusionsync.ai/workflow` via a reverse proxy in the fusionsync-website
  // middleware. basePath makes Next emit every page route, `_next` asset, and
  // `next/link` href under `/workflow`, so the proxied HTML resolves correctly
  // under the apex domain instead of 404ing at the root. The website middleware
  // forwards the `/workflow` prefix unchanged, so paths line up 1:1.
  basePath: "/workflow",
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
