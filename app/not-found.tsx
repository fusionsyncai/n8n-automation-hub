import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-canvas px-6 py-24 text-center">
      <p className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-ink-faint">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
        That page doesn&rsquo;t exist.
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-ink-muted">
        The slug may have changed or the link was slightly off.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-cta hover:bg-accent-hover"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" />
          Home
        </Link>
        <Link
          href="/categories"
          className="inline-flex items-center rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-ink hover:bg-surface-soft"
        >
          Categories
        </Link>
      </div>
    </div>
  );
}
