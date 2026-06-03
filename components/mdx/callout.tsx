import * as React from "react";
import {
  InfoIcon,
  TriangleAlertIcon,
  CircleCheckIcon,
  LightbulbIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutVariant = "info" | "warning" | "success" | "tip";

const variantConfig: Record<
  CalloutVariant,
  { icon: React.ComponentType<{ className?: string }>; classes: string; label: string }
> = {
  info: {
    icon: InfoIcon,
    classes: "border-brand-violet/30 bg-brand-violet/5 [&_a]:decoration-brand-violet/60",
    label: "Note",
  },
  warning: {
    icon: TriangleAlertIcon,
    classes:
      "border-amber-300/60 bg-amber-50/70 [&_a]:decoration-amber-500/60",
    label: "Heads up",
  },
  success: {
    icon: CircleCheckIcon,
    classes: "border-emerald-300/60 bg-emerald-50/70 [&_a]:decoration-emerald-500/60",
    label: "Good call",
  },
  tip: {
    icon: LightbulbIcon,
    classes: "border-brand-pink/30 bg-brand-pink/5 [&_a]:decoration-brand-pink/60",
    label: "Tip",
  },
};

export interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
}

/**
 * Inline callout for posts. Brief §13: info / warning / success variants.
 * Added `tip` because it shows up naturally in playbook-style posts.
 */
export function Callout({ variant = "info", title, children }: CalloutProps) {
  const cfg = variantConfig[variant];
  const Icon = cfg.icon;
  return (
    <aside
      className={cn(
        "my-7 flex gap-4 rounded-lg border px-5 py-4 text-[0.9375rem] leading-[1.7]",
        "[&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        cfg.classes,
      )}
    >
      <Icon
        aria-hidden
        className="mt-1 h-5 w-5 flex-none text-ink"
      />
      <div className="min-w-0 flex-1 text-ink">
        {title ? (
          <p className="!mt-0 !mb-1 font-semibold text-ink">{title}</p>
        ) : null}
        <div className="text-ink-muted">{children}</div>
      </div>
    </aside>
  );
}
