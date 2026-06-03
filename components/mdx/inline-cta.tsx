import { ArrowRightIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export interface InlineCtaProps {
  children?: React.ReactNode;
  /** Defaults to the n8n Hub Cal.com booking page. */
  href?: string;
  /** Trailing link label. */
  label?: string;
}

/**
 * Mid-post inline CTA. Short, contextual nudge to the FusionSync AI
 * agency for readers who would rather hire the build than do the build.
 */
export function InlineCta({
  children,
  href = siteConfig.agency.bookCallUrl,
  label = "Book a call",
}: InlineCtaProps) {
  return (
    <aside className="not-prose my-8 rounded-md border border-border border-l-4 border-l-accent bg-surface px-5 py-4 shadow-card">
      <p className="text-[1rem] leading-[1.65] text-ink">
        {children ?? (
          <>
            <span className="font-semibold">FusionSync AI</span> builds
            workflows like this one end-to-end. Skip the trial-and-error.
          </>
        )}{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-ink underline decoration-accent decoration-2 underline-offset-[3px] hover:decoration-chrome"
        >
          {label}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      </p>
    </aside>
  );
}
