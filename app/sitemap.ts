import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { categories } from "@/lib/content/categories";
import { getAllAuthors, getAllPosts, getAllTags } from "@/lib/content/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/tags"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/categories/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: absoluteUrl(`/tags/${t.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  const authorEntries: MetadataRoute.Sitemap = getAllAuthors().map((a) => ({
    url: absoluteUrl(`/authors/${a.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: p.absoluteUrl,
    lastModified: new Date(p.frontmatter.updatedAt ?? p.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: p.frontmatter.featured ? 0.9 : 0.8,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...tagEntries,
    ...authorEntries,
    ...postEntries,
  ];
}
