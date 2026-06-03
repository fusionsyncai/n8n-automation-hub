import Link from "next/link";
import { RssIcon, MapIcon, ArrowUpRightIcon } from "lucide-react";
import { BrandLogo } from "@/components/site/brand-logo";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/content/categories";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-chrome-border bg-chrome text-chrome-subtle">
      <div className="mx-auto max-w-(--container-wide) px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label={`${siteConfig.name} home`}>
              <BrandLogo variant="horizontal" tone="light" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-chrome-faint">
              {siteConfig.description}
            </p>
            <p className="mt-5 text-xs text-chrome-faint">
              Powered by{" "}
              <a
                href={siteConfig.parent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-chrome-text underline decoration-accent underline-offset-4 hover:decoration-chrome-text"
              >
                {siteConfig.parent.name}
              </a>
            </p>
            <a
              href={siteConfig.agency.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-chrome-text hover:text-accent"
            >
              Book a call
              <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-chrome-faint">
              Categories
            </h3>
            <ul className="mt-4 space-y-2">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-sm transition-colors hover:text-chrome-text"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-chrome-faint">
              Site
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:text-chrome-text">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm hover:text-chrome-text"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-sm hover:text-chrome-text">
                  Tags
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="inline-flex items-center gap-1.5 text-sm hover:text-chrome-text"
                >
                  <MapIcon className="h-3.5 w-3.5" /> Sitemap
                </Link>
              </li>
              <li>
                <Link
                  href="/feed.xml"
                  className="inline-flex items-center gap-1.5 text-sm hover:text-chrome-text"
                >
                  <RssIcon className="h-3.5 w-3.5" /> RSS
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-chrome-faint">
              FusionSync AI
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={siteConfig.parent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-chrome-text"
                >
                  Agency
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.agency.servicesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-chrome-text"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.legal.privacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-chrome-text"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.legal.termsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-chrome-text"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-chrome-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-chrome-faint">
            © {year} {siteConfig.parent.name}. All rights reserved.
          </p>
          <p className="text-xs text-chrome-faint">
            Independent editorial. Not affiliated with n8n GmbH.
          </p>
        </div>
      </div>
    </footer>
  );
}
