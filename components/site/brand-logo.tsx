import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/** Raster mark used in header, footer, and about. */
export const brandLogoSrc = "/brand/n8n-hub-logo.png";

export interface BrandLogoProps {
  variant?: "horizontal" | "mark" | "stacked";
  tone?: "light" | "dark";
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  hideWordmark?: boolean;
}

export function BrandLogo({
  variant = "horizontal",
  tone = "dark",
  className,
  markClassName,
  wordmarkClassName,
  hideWordmark = false,
}: BrandLogoProps) {
  const { prefix, accent, suffix } = siteConfig.wordmark;
  const onDark = tone === "light";

  const mark = (
    <BrandMark
      className={cn(
        variant === "stacked" ? "h-10 w-10" : "h-8 w-8 sm:h-9 sm:w-9",
        markClassName,
      )}
    />
  );

  if (variant === "mark" || hideWordmark) {
    return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
  }

  const wordmark = (
    <span
      className={cn(
        "inline-flex flex-col leading-none sm:flex-row sm:items-baseline sm:gap-1",
        wordmarkClassName,
      )}
    >
      <span className="inline-flex items-baseline gap-0.5">
        <span
          className={cn(
            "font-mono text-[0.95em] font-bold",
            onDark ? "text-chrome-text" : "text-ink",
          )}
        >
          {prefix}
        </span>
        <span className="font-display text-[1.05em] font-bold tracking-tight text-brand-gradient">
          {accent}
        </span>
      </span>
      <span
        className={cn(
          "font-mono text-[0.65em] font-semibold uppercase tracking-[0.2em] sm:ml-0.5",
          onDark ? "text-chrome-faint" : "text-ink-faint",
        )}
      >
        {suffix}
      </span>
    </span>
  );

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-2", className)}>
        {mark}
        {wordmark}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {mark}
      {wordmark}
    </span>
  );
}

function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src={brandLogoSrc}
      alt={`${siteConfig.shortName} logo`}
      width={36}
      height={36}
      priority
      className={cn("flex-none rounded-lg object-contain", className)}
    />
  );
}
