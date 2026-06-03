"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon, ArrowUpRightIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({ links }: { links: readonly NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-ink transition-colors hover:bg-surface-soft lg:hidden"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-full max-w-xs flex-col border-l border-border bg-surface shadow-xl transition-transform duration-200",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-end border-b border-border px-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-soft"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-surface-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-border p-4">
            <a
              href={siteConfig.agency.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white"
            >
              Get it built
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
