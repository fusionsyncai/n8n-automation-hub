"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NewsletterFormProps {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  className?: string;
}

export function NewsletterForm({
  heading = "New n8n workflows in your inbox.",
  body = "Short, practical, no fluff. New workflows and importable templates whenever we ship one.",
  buttonLabel = "Subscribe",
  className,
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">(
    "idle",
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setTimeout(() => setStatus("ok"), 400);
  }

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface px-6 py-8 shadow-card sm:px-10 sm:py-10",
        className,
      )}
    >
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div className="max-w-md">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            {body}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="flex-1 rounded-md border border-border bg-canvas px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/25"
            disabled={status === "submitting" || status === "ok"}
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "ok"}
            className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-cta transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "ok" ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Subscribed
              </>
            ) : (
              <>
                {buttonLabel}
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
      <p className="mt-4 font-mono text-[0.625rem] text-ink-faint">
        No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
