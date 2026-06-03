import { ArrowUpRightIcon, CheckIcon } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const capabilities = [
  "Lead capture and speed-to-lead",
  "AI agents with human-in-the-loop",
  "CRM, Slack, and Sheets wired together",
  "Deployed and monitored in your stack",
];

/**
 * Homepage-level CTA. Broader than the per-post CtaBlock: speaks to a visitor
 * browsing the whole hub who has a business process they want automated.
 */
export function HomeCta() {
  return (
    <aside className="relative overflow-hidden rounded-3xl border border-chrome-line bg-chrome text-chrome-text shadow-panel">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-brand-gradient opacity-[0.12]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl"
      />

      <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12 lg:px-14">
        <div>
          <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-chrome-faint">
            {siteConfig.parent.name} · done-for-you
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
            Need an automation for your{" "}
            <span className="text-brand-gradient">business process?</span>
          </h2>
          <p className="mt-4 max-w-xl text-[0.9375rem] leading-[1.7] text-chrome-subtle sm:text-base">
            Tell us the workflow you keep doing by hand. We design, build, and
            ship the n8n automation end-to-end, with AI where it helps and a
            human in the loop where it matters. You get a system you own, not a
            demo.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.agency.bookCallUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-cta transition-colors hover:bg-accent-hover"
            >
              Book a call
              <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#library"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-chrome-line px-6 py-3 text-sm font-semibold text-chrome-text transition-colors hover:bg-white/5"
            >
              Browse the workflow library
            </a>
          </div>
        </div>

        <ul className="grid gap-3 rounded-2xl border border-chrome-line/70 bg-white/3 p-5 sm:p-6">
          {capabilities.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[0.9375rem] leading-snug text-chrome-subtle"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                <CheckIcon className="h-3 w-3" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
