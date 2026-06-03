import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function SiteTopBar() {
  return (
    <div className="border-b border-border bg-surface-muted">
      <div className="mx-auto flex h-9 max-w-(--container-wide) items-center justify-between px-4 text-[0.6875rem] font-medium text-ink-faint sm:px-6">
        <span>
          Powered by{" "}
          <a
            href={siteConfig.parent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted transition-colors hover:text-accent"
          >
            {siteConfig.parent.name}
          </a>
        </span>
        <div className="flex items-center gap-4 sm:gap-5">
          <Link href="/feed.xml" className="hidden hover:text-ink sm:inline">
            RSS
          </Link>
          <a
            href={siteConfig.agency.servicesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            Services
          </a>
          <a
            href={siteConfig.agency.bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-accent hover:text-accent-hover"
          >
            Book a call
            <ArrowUpRightIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
