import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/site/brand-logo";
import { MobileNav } from "@/components/site/mobile-nav";

const navLinks = [
  { href: "/", label: "Workflows" },
  { href: "/categories", label: "Categories" },
  { href: "/tags", label: "Tags" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-surface/80">
      <div className="mx-auto flex h-14 max-w-(--container-wide) items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name} home`}
          className="flex min-w-0 items-center"
        >
          <BrandLogo variant="horizontal" tone="dark" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={siteConfig.agency.bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-cta transition-colors hover:bg-accent-hover md:inline-flex"
          >
            Get it built
            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
