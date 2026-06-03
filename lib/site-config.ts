/**
 * Single source of truth for site-level identity used across metadata,
 * navigation, footer, and structured data.
 *
 * Reads from environment so the same build can be promoted across hosts.
 * Falls back to sensible defaults so `next dev` works without an .env.
 */

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

const env = (key: string, fallback: string) =>
  stripTrailingSlash(process.env[key] ?? fallback);

export const siteConfig = {
  name: "n8n Automation Hub",
  shortName: "n8n Hub",
  /**
   * Display wordmark. The logo component renders the three segments with
   * distinct typographic treatment (mono, italic-gradient, regular).
   */
  wordmark: {
    prefix: "n8n",
    accent: "Automation",
    suffix: "Hub",
  },
  tagline:
    "Installable n8n workflow implementations and architecture playbooks",
  description:
    "Downloadable n8n workflow implementations with step-by-step setup, plus architecture playbooks for business ops, sales, Slack, AI agents, and more. Built by FusionSync AI.",
  /**
   * Footer attribution. The hub is operated by FusionSync AI, and every
   * primary CTA routes back to the agency to keep traffic flowing.
   */
  parent: {
    name: "FusionSync AI",
    url: env("NEXT_PUBLIC_PARENT_URL", "https://fusionsync.ai"),
    tagline: "AI agency building automations and AI agents end-to-end.",
  },
  /**
   * URLs that the brief locks down for canonicals, sitemaps, RSS, and OG.
   * Configure NEXT_PUBLIC_SITE_URL when promoting the build to a real host.
   */
  url: env("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  /**
   * The hub is editorial. Every "do it for me" CTA points back to the
   * FusionSync AI agency: services, contact, and the call-booking page.
   */
  agency: {
    url: env("NEXT_PUBLIC_AGENCY_URL", "https://fusionsync.ai"),
    servicesUrl: env(
      "NEXT_PUBLIC_AGENCY_SERVICES_URL",
      "https://fusionsync.ai/services",
    ),
    contactUrl: env(
      "NEXT_PUBLIC_AGENCY_CONTACT_URL",
      "https://fusionsync.ai/contact",
    ),
    bookCallUrl: env(
      "NEXT_PUBLIC_AGENCY_BOOK_CALL_URL",
      "https://cal.com/fusionsyncai/n8n-hub-call-booking",
    ),
  },
  /**
   * Legal pages live on the agency domain so the source of truth stays in
   * one place. Update these when the agency publishes them.
   */
  legal: {
    privacyUrl: env(
      "NEXT_PUBLIC_PRIVACY_URL",
      "https://fusionsync.ai/privacy",
    ),
    termsUrl: env(
      "NEXT_PUBLIC_TERMS_URL",
      "https://fusionsync.ai/terms",
    ),
  },
  /**
   * The hub ships with a typographic logo component (see
   * components/site/brand-logo.tsx), so no raster logo files are required.
   * The favicon is whatever lives at /favicon.ico in the app router.
   */
  social: {
    twitter: "@fusionsyncai",
  },
  /**
   * Site-wide keywords for metadata. Aimed at the n8n and workflow-automation
   * search universe rather than any single channel.
   */
  keywords: [
    "n8n",
    "n8n automation",
    "n8n workflow",
    "n8n templates",
    "workflow automation",
    "business process automation",
    "sales automation",
    "Slack automation",
    "Telegram automation",
    "WhatsApp automation",
    "SEO automation",
    "no-code automation",
    "FusionSync AI",
  ],
  defaultOgImage: "/og/default.png",
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Resolve a site-relative path to a fully qualified URL.
 * Used for canonical links, sitemap entries, RSS items, and JSON-LD URLs.
 */
export function absoluteUrl(path: string = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}
