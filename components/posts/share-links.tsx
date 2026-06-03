"use client";

import { useState } from "react";
import { LinkIcon, CheckIcon } from "lucide-react";
import { TwitterXIcon, LinkedInIcon } from "@/components/icons/brand-icons";
import { cn } from "@/lib/utils";

export interface ShareLinksProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareLinks({ url, title, className }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);

  const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard might be unavailable in older browsers; ignore silently.
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs uppercase tracking-wider text-ink-faint">
        Share
      </span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <TwitterXIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <LinkedInIcon className="h-3.5 w-3.5" />
      </a>
      <button
        type="button"
        onClick={copyUrl}
        aria-label="Copy link"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <LinkIcon className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
