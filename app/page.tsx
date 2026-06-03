import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, ZapIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { categories } from "@/lib/content/categories";
import { getAllPosts, getFeaturedPosts } from "@/lib/content/posts";
import { PostCatalog } from "@/components/posts/post-catalog";
import { ContentTypeChip } from "@/components/posts/content-type-chip";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { HomeCta } from "@/components/site/home-cta";

export default function HomePage() {
  const allPosts = getAllPosts();
  const featured = getFeaturedPosts();

  const counts: Record<string, number> = {};
  for (const p of allPosts) {
    counts[p.frontmatter.category] =
      (counts[p.frontmatter.category] ?? 0) + 1;
  }

  // Featured mini cards: featured first, topped up with most recent.
  const featuredCards = [
    ...featured,
    ...allPosts.filter((p) => !featured.includes(p)),
  ].slice(0, 3);

  return (
    <>
      {/* Light hero with gradient wash + product preview (n8n.io style) */}
      <section className="relative overflow-hidden border-b border-border bg-surface bg-hero-wash">
        <div className="mx-auto grid max-w-(--container-wide) gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-muted shadow-sm">
              <ZapIcon className="h-3.5 w-3.5 text-accent" aria-hidden />
              <span>
                {siteConfig.shortName} · powered by{" "}
                <span className="text-ink">{siteConfig.parent.name}</span>
              </span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
              Build workflows that{" "}
              <span className="text-brand-gradient">run your ops</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
              Installable workflow implementations with step-by-step setup,
              plus architecture playbooks for sales, Slack, AI agents, and ops.
              Import the JSON. Run it in your business.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#library"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-cta transition-colors hover:bg-accent-hover"
              >
                Browse workflows
                <ArrowRightIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.agency.bookCallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-secondary/30 hover:bg-surface-soft"
              >
                Hire {siteConfig.parent.name}
              </a>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-ink-faint">
                  Posts
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink">
                  {allPosts.length}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-ink-faint">
                  Categories
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink">
                  {categories.length}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-wider text-ink-faint">
                  Stack
                </dt>
                <dd className="mt-1 font-display text-2xl font-bold text-ink">
                  n8n
                </dd>
              </div>
            </dl>
          </div>

          {/* Hero workflow preview: real n8n canvas screenshot */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-brand-gradient opacity-[0.12] blur-2xl"
            />
            <div className="relative overflow-hidden rounded-2xl border border-border shadow-panel">
              <Image
                src="/hero/n8n-workflow-canvas.jpg"
                alt="An n8n workflow canvas: multi-channel lead capture across WhatsApp, Instagram, and Messenger routing into lead creation and an AI agent."
                width={1024}
                height={484}
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full"
              />
            </div>
            {featuredCards.length > 0 ? (
              <div className="mt-4">
                <p className="font-mono text-[0.625rem] uppercase tracking-wider text-accent">
                  Featured
                </p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                  {featuredCards.map((post) => (
                    <li key={post.frontmatter.slug}>
                      <Link
                        href={post.href}
                        className="group flex h-full flex-col rounded-xl border border-border bg-surface p-3 shadow-card transition-all hover:-translate-y-0.5 hover:border-secondary/25 hover:shadow-card-hover"
                      >
                        <ContentTypeChip
                          contentType={post.frontmatter.contentType}
                        />
                        <p className="mt-2 line-clamp-3 font-display text-sm font-semibold leading-snug text-ink group-hover:text-accent">
                          {post.frontmatter.title}
                        </p>
                        <span className="mt-auto pt-2 font-mono text-[0.625rem] text-ink-faint">
                          {post.readingMinutes} min
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div id="library">
        {allPosts.length > 0 ? (
          <PostCatalog
            posts={allPosts}
            categories={categories}
            counts={counts}
            heroPost={undefined}
          />
        ) : (
          <div className="bg-canvas px-6 py-20 text-center">
            <p className="font-display text-2xl font-bold text-ink">
              First workflow post coming soon.
            </p>
          </div>
        )}
      </div>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-(--container-wide) px-4 py-12 sm:px-6 lg:py-16">
          <NewsletterForm />
        </div>
      </section>

      <section className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-(--container-wide) px-4 py-12 sm:px-6 lg:py-16">
          <HomeCta />
        </div>
      </section>
    </>
  );
}
