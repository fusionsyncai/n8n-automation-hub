/**
 * Two editorial formats on the n8n Automation Hub.
 *
 * - **implementation** (primary): installable workflow guides with overview,
 *   step-by-step setup, screenshots, and exportable n8n JSON.
 * - **playbook** (secondary): research and architecture-first posts that explain
 *   the pattern before (or alongside) a full build.
 *
 * See content/CONTENT-STRATEGY.md for the full publishing workflow.
 */

export const contentTypes = ["implementation", "playbook"] as const;

export type ContentType = (typeof contentTypes)[number];

export interface ContentTypeMeta {
  slug: ContentType;
  /** Short label for chips and filters. */
  label: string;
  /** One-line description for editors and agents. */
  summary: string;
}

export const contentTypeMeta: Record<ContentType, ContentTypeMeta> = {
  implementation: {
    slug: "implementation",
    label: "Implementation",
    summary:
      "Overview, prerequisites, step-by-step setup, screenshots, and importable workflow JSON.",
  },
  playbook: {
    slug: "playbook",
    label: "Playbook",
    summary:
      "Architecture, tools, tradeoffs, and patterns. Often published before the matching implementation guide.",
  },
};

export function getContentTypeMeta(slug: string): ContentTypeMeta | undefined {
  if (slug === "implementation" || slug === "playbook") {
    return contentTypeMeta[slug];
  }
  return undefined;
}

export function isContentType(slug: string): slug is ContentType {
  return slug === "implementation" || slug === "playbook";
}
