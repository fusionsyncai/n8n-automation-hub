import { ArrowUpRightIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { ContentType } from "@/lib/content/content-types";

export type CtaBlockVariant = "playbook" | "implementation";

export interface CtaBlockProps {
  /**
   * Playbook posts: "Want this built for you?"
   * Implementation posts: "Need help setting this up?"
   * Omit to use playbook copy (homepage, legacy MDX).
   */
  variant?: CtaBlockVariant;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  href?: string;
}

const ctaPresets: Record<
  CtaBlockVariant,
  Required<Pick<CtaBlockProps, "heading" | "body" | "ctaLabel">>
> = {
  playbook: {
    heading: "Want this built for you?",
    body: "FusionSync AI designs, builds, and deploys n8n automations end-to-end. From speed-to-lead to full ops stacks.",
    ctaLabel: "Talk to FusionSync AI",
  },
  implementation: {
    heading: "Need help setting this up?",
    body: "FusionSync AI deploys production n8n workflows in your stack: credentials, Slack approvals, Sheets ops, and handoff to your team.",
    ctaLabel: "Book a call",
  },
};

export function ctaVariantForContentType(
  contentType: ContentType | string | undefined,
): CtaBlockVariant {
  return contentType === "implementation" ? "implementation" : "playbook";
}

export function CtaBlock({
  variant,
  heading,
  body,
  ctaLabel,
  href = siteConfig.agency.bookCallUrl,
}: CtaBlockProps) {
  const preset = variant ? ctaPresets[variant] : ctaPresets.playbook;
  const resolvedHeading = heading ?? preset.heading;
  const resolvedBody = body ?? preset.body;
  const resolvedLabel = ctaLabel ?? preset.ctaLabel;
  return (
    <aside className="not-prose relative overflow-hidden rounded-2xl border border-chrome-line bg-chrome text-chrome-text shadow-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.08]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
        <div className="max-w-lg">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-chrome-faint">
            {siteConfig.parent.name}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {resolvedHeading}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-[1.65] text-chrome-subtle">
            {resolvedBody}
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-cta transition-colors hover:bg-accent-hover sm:self-center"
        >
          {resolvedLabel}
          <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </aside>
  );
}
