import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Callout } from "@/components/mdx/callout";
import { CtaBlock } from "@/components/mdx/cta-block";
import { InlineCta } from "@/components/mdx/inline-cta";
import {
  WorkflowDiagram,
  WorkflowOutput,
  WorkflowStep,
} from "@/components/mdx/workflow-diagram";

/**
 * Components passed to <MDXRemote />: both element overrides (h2, a, img, ...)
 * and authored components callable from MDX (<Callout />, <CtaBlock />, ...).
 */
export const mdxComponents = {
  /* ------------------------------------------------------------------ */
  /*  Headings: anchor link affordance comes from the rehype plugin.    */
  /* ------------------------------------------------------------------ */
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-12 mb-6 font-display text-4xl leading-[1.1] text-ink sm:text-5xl",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-12 mb-4 scroll-mt-24 font-display text-3xl leading-tight text-ink sm:text-4xl",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-10 mb-3 scroll-mt-24 font-sans text-xl font-semibold tracking-tight text-ink sm:text-2xl",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 mb-2 scroll-mt-24 font-sans text-lg font-semibold tracking-tight text-ink",
        className,
      )}
      {...props}
    />
  ),

  /* ------------------------------------------------------------------ */
  /*  Body block elements                                                */
  /* ------------------------------------------------------------------ */
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "my-5 text-[1.0625rem] leading-[1.75] text-ink-muted",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-5 list-disc pl-6 text-[1.0625rem] leading-[1.75] text-ink-muted marker:text-ink-faint",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-5 list-decimal pl-6 text-[1.0625rem] leading-[1.75] text-ink-muted marker:text-ink-faint",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn("my-2 [&>p]:my-2", className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "my-7 border-l-4 border-accent bg-surface-soft pl-6 pr-4 py-3 text-ink",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      className={cn("my-12 border-t border-border", className)}
      {...props}
    />
  ),

  /* ------------------------------------------------------------------ */
  /*  Tables (GFM)                                                       */
  /* ------------------------------------------------------------------ */
  table: ({
    className,
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-7 w-full overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse text-sm text-ink-muted",
          className,
        )}
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="border-b border-border-strong text-left" {...props} />
  ),
  th: ({
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => (
    <th
      className={cn(
        "px-4 py-3 font-semibold text-ink",
        className,
      )}
      {...props}
    />
  ),
  td: ({
    className,
    ...props
  }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => (
    <td
      className={cn("px-4 py-3 align-top border-b border-border", className)}
      {...props}
    />
  ),

  /* ------------------------------------------------------------------ */
  /*  Inline elements                                                    */
  /* ------------------------------------------------------------------ */
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-ink" {...props} />
  ),
  a: ({
    href = "#",
    className,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = /^https?:\/\//i.test(href) || href.startsWith("mailto:");
    const baseClass =
      "text-ink underline decoration-accent/60 underline-offset-[3px] decoration-2 transition-colors hover:decoration-accent";

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(baseClass, className)}
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(baseClass, className)} {...props}>
        {children}
      </Link>
    );
  },

  /* ------------------------------------------------------------------ */
  /*  Images: next/image with sensible defaults for editorial layout     */
  /* ------------------------------------------------------------------ */
  img: ({
    src,
    alt,
    width,
    height,
    className,
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;
    const w = typeof width === "number" ? width : 1600;
    const h = typeof height === "number" ? height : 900;
    return (
      <span className="my-8 block overflow-hidden rounded-lg border border-border bg-surface-muted">
        <Image
          src={src}
          alt={alt ?? ""}
          width={w}
          height={h}
          className={cn("h-auto w-full", className)}
          sizes="(min-width: 768px) 720px, 100vw"
        />
      </span>
    );
  },

  /* ------------------------------------------------------------------ */
  /*  Authorable MDX components (callable inside posts)                  */
  /* ------------------------------------------------------------------ */
  Callout,
  CtaBlock,
  InlineCta,
  WorkflowDiagram,
  WorkflowStep,
  WorkflowOutput,
};
