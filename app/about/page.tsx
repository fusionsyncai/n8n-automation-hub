import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/site/brand-logo";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the n8n Automation Hub: installable workflow implementations and architecture playbooks for n8n. Powered by FusionSync AI.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-surface bg-hero-wash px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
            About
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Installable{" "}
            <span className="text-brand-gradient">n8n</span> workflows, not
            just theory.
          </h1>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl bg-canvas px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-ink-muted">
          <p>
            {siteConfig.name} is an editorial hub for the people doing the
            actual work in n8n. Operators, founders, ops leads, RevOps,
            marketing engineers, and agencies wiring CRMs, inboxes, and
            lead qualification into one stack.
          </p>
          <p>
            <strong>Implementations</strong> are the core: overview,
            step-by-step setup, screenshots, and workflow JSON you can import.{" "}
            <strong>Playbooks</strong> are the architecture layer: research,
            tools, human-in-the-loop patterns, and tradeoffs. We usually ship
            the playbook first, then the full build guide.
          </p>
          <p>
            No &ldquo;10 mind-blowing AI hacks&rdquo; energy. Copy-pasteable
            JSON, honest comparisons, and teardowns of what worked (or did
            not).
          </p>
        </div>

        <hr className="my-12 border-border" />

        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Who runs this
        </h2>
        <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.75] text-ink-muted">
          <p>
            Published by{" "}
            <a
              href={siteConfig.parent.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-[3px]"
            >
              FusionSync AI
            </a>
            , an automation and AI agency. Want one of these built for you?
            Same team, same opinions.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={siteConfig.agency.bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-md bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white shadow-cta hover:bg-accent-hover"
          >
            Book a call
            <ArrowUpRightIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={siteConfig.agency.servicesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-surface-soft"
          >
            Services
          </a>
        </div>

        <hr className="my-12 border-border" />

        <p className="text-sm text-ink-muted">
          n8n is a trademark of n8n GmbH. {siteConfig.name} is independent
          editorial, not affiliated with n8n GmbH.
        </p>

        <div className="mt-12 flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 shadow-card">
          <div className="flex items-center gap-3">
            <BrandLogo variant="mark" markClassName="h-9 w-9" tone="dark" />
            <span className="text-sm text-ink-muted">Pitch a workflow?</span>
          </div>
          <a
            href={siteConfig.agency.contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-ink hover:text-accent"
          >
            Contact →
          </a>
        </div>
      </div>
    </>
  );
}
