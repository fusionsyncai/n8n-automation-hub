import Link from "next/link";
import { ArrowRightIcon, BookOpenIcon, WrenchIcon } from "lucide-react";
import { getContentTypeMeta, isContentType } from "@/lib/content/content-types";
import type { Post } from "@/lib/content/schema";

export interface CompanionPostBannerProps {
  post: Post;
  companion: Post | null;
}

export function CompanionPostBanner({
  post,
  companion,
}: CompanionPostBannerProps) {
  const companionSlug = post.frontmatter.companionSlug;
  if (!companionSlug) return null;

  const type = post.frontmatter.contentType;
  const typeMeta = isContentType(type) ? getContentTypeMeta(type) : undefined;

  if (companion) {
    const companionType = companion.frontmatter.contentType;
    const companionMeta = isContentType(companionType)
      ? getContentTypeMeta(companionType)
      : undefined;
    const Icon =
      companionType === "implementation" ? WrenchIcon : BookOpenIcon;

    return (
      <aside className="mb-8 rounded-xl border border-border bg-surface-soft px-5 py-4">
        <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
          {typeMeta?.label ?? "This post"} · paired guide
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {companionType === "implementation"
            ? "Ready to install it? Follow the step-by-step implementation with screenshots and workflow export."
            : "Want the architecture and tradeoffs first? Read the playbook before you build."}
        </p>
        <Link
          href={companion.href}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover"
        >
          <Icon className="h-4 w-4" aria-hidden />
          {companionMeta?.label ?? "Companion"}: {companion.frontmatter.title}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </aside>
    );
  }

  const plannedLabel =
    type === "playbook" ? "Implementation guide" : "Playbook";

  return (
    <aside className="mb-8 rounded-xl border border-dashed border-border bg-surface px-5 py-4">
      <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
        Coming next
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        The {plannedLabel.toLowerCase()} for this workflow (
        <code className="rounded bg-surface-soft px-1.5 py-0.5 font-mono text-xs text-ink">
          {companionSlug}
        </code>
        ) is in progress. Check back for the full install walkthrough and
        exportable JSON.
      </p>
    </aside>
  );
}
