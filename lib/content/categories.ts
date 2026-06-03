/**
 * Every post belongs to exactly one of these eight pillars on the n8n
 * Automation Hub. Slugs map to URL segments: /categories/<slug>.
 *
 * If you add a category here, also create at least one starter post that
 * lives under it so the category page does not render empty.
 */

export type CategorySlug =
  | "business-process-automation"
  | "sales-process-automation"
  | "slack-automation"
  | "productivity-automation"
  | "telegram-automation"
  | "whatsapp-meta-automation"
  | "blog-seo-automation"
  | "ai-agents-automation";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** One-line summary used on the category index. */
  tagline: string;
  /** Long-form description used as the category page intro + meta description. */
  description: string;
}

export const categories: readonly Category[] = [
  {
    slug: "business-process-automation",
    name: "Business process automation",
    tagline:
      "Replace the spreadsheets, the email chains, and the manual hand-offs.",
    description:
      "Practical n8n playbooks for replacing manual back-office work: approvals, document routing, invoicing, onboarding, internal tickets, and the spreadsheets that should have been a workflow three years ago.",
  },
  {
    slug: "sales-process-automation",
    name: "Sales process automation",
    tagline: "Pipeline, CRM, lead scoring, and follow-ups that run themselves.",
    description:
      "How to use n8n to glue your CRM (HubSpot, Pipedrive, Salesforce, Attio) to the rest of the stack. Lead capture, enrichment, scoring, sequenced follow-ups, deal-stage routing, and reporting that does not require a SDR babysitting a Google Sheet.",
  },
  {
    slug: "slack-automation",
    name: "Slack automation",
    tagline:
      "Channels, alerts, approvals, and reports without writing a Slack app.",
    description:
      "Slack is where work actually happens. We cover n8n recipes for inbound alerts (Stripe, GitHub, Sentry, Datadog), interactive approval flows, daily standup digests, channel routing, and slash-command-style triggers without standing up a custom Slack bot.",
  },
  {
    slug: "productivity-automation",
    name: "Productivity tools automation",
    tagline:
      "Notion, Airtable, Google Workspace, Linear, ClickUp, and the connective tissue.",
    description:
      "Turn Notion, Airtable, Google Workspace, Linear, Asana, ClickUp, and the rest of your productivity stack into a single connected system. Two-way syncs, templated content creation, weekly digests, and the small automations that pay back daily.",
  },
  {
    slug: "telegram-automation",
    name: "Telegram automation",
    tagline:
      "Bots, channels, and customer messaging with n8n in front of the Telegram API.",
    description:
      "Build Telegram bots and channel automations in n8n: customer support routing, notifications, content broadcasts, group moderation, and command-driven workflows. From a single trigger to a multi-step agent, without a Node.js codebase.",
  },
  {
    slug: "whatsapp-meta-automation",
    name: "WhatsApp & Meta automation",
    tagline:
      "WhatsApp Business, Instagram messaging, and the Meta marketing API in n8n.",
    description:
      "n8n workflows for the WhatsApp Business Cloud API, Instagram messaging, and the broader Meta marketing surface. Opt-ins, session-window handling, broadcast templates, ad-lead routing, and multi-channel follow-ups that survive Meta policy changes.",
  },
  {
    slug: "blog-seo-automation",
    name: "Blog & SEO automation",
    tagline:
      "Content pipelines, internal linking, indexing, and analytics on autopilot.",
    description:
      "n8n recipes for content operations: brief generation, draft routing, image creation, internal-linking suggestions, sitemap pings, indexing checks, Search Console reporting, and the SEO grunt work that ate your Friday.",
  },
  {
    slug: "ai-agents-automation",
    name: "AI agents & LLM automation",
    tagline:
      "RAG, tool-using agents, and LLM workflows wired up with n8n nodes.",
    description:
      "Production AI agents in n8n: draft-and-review flows, tool calling, human-in-the-loop in Slack, guardrails, and installable implementations with step-by-step setup. Plus playbooks on when an agent beats a deterministic workflow.",
  },
] as const;

const categoryBySlug = new Map<CategorySlug, Category>(
  categories.map((c) => [c.slug, c]),
);

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug as CategorySlug);
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return categoryBySlug.has(slug as CategorySlug);
}
