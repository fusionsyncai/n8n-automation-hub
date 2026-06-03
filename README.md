# n8n Automation Hub

**n8n Automation Hub** is a content product, not a typical app. It publishes
**installable n8n workflows** that a business can download, import, and run,
backed by **architecture playbooks** that explain how and why each workflow is
built.

It is operated by [FusionSync AI](https://fusionsync.ai). Every workflow ends
with a clear path to get it built for you.

## What we publish

Two content types (see `content/CONTENT-STRATEGY.md` for the full SOP):

| Type | `contentType` | Primary? | What it is |
|------|---------------|----------|------------|
| **Workflow implementation** | `implementation` | Yes | Overview, prerequisites, step-by-step setup with screenshots, importable workflow JSON, and operations notes. Someone can follow it and run the automation in their own stack. |
| **Playbook** | `playbook` | No | Architecture, tools, human-in-the-loop patterns, data model, and tradeoffs. Usually published before the matching implementation. |

A single automation idea often ships as **two posts**: the playbook first, then
the implementation guide. They are linked via `companionSlug` in frontmatter.

### Flagship example

The form-to-reply workflow (form submission, AI draft, Slack human-in-the-loop
approval, send on approve, Google Sheets as the system of record):

- Playbook: `content/posts/playbook-ai-form-replies-human-in-the-loop-slack.mdx`
- Implementation: `implement-ai-form-replies-human-in-the-loop` (planned)

## The eight pillars

Every post belongs to one category in `lib/content/categories.ts`: business
process, sales process, Slack, productivity tools, Telegram, WhatsApp and Meta,
blog and SEO, and AI agents and LLM automation.

## How content is authored

1. Read `content/CONTENT-STRATEGY.md` (the editorial SOP). The Cursor rule
   `.cursor/rules/blog-post-creation.mdc` enforces this when editing posts.
2. Start from a template in `content/templates/`:
   - `playbook-post.template.mdx`
   - `implementation-post.template.mdx`
3. Frontmatter is validated by Zod (`lib/content/schema.ts`) at build time. The
   build fails loudly if anything is off.

### Authoring components (MDX)

- `<Callout variant="tip|warning|info" title="..." />` for asides.
- `<InlineCta />` for a mid-post nudge.
- `<WorkflowDiagram>` with `<WorkflowStep node=".." via=".." detail=".." />` and
  `<WorkflowOutput>..</WorkflowOutput>` children for architecture diagrams. Use
  this instead of ASCII art so diagrams stay centered and responsive.
- Do **not** add `<CtaBlock />` in MDX. The post layout adds the right CTA based
  on `contentType`: implementations get "Need help setting this up?", playbooks
  get "Want this built for you?".

## Editorial rules (enforced)

`scripts/check-rules.ts` fails the build on:

- Wrong brand casing. Always `n8n Automation Hub` (lowercase `n8n`) and
  `FusionSync AI`.
- Any claim of partnership, endorsement, or affiliation with n8n GmbH. The hub
  is independent editorial.
- Invented stats (use `TODO(stat)` when a real number is coming).
- Hard-coded prices in prose (link to a pricing source instead).
- Em dashes (U+2014) or en dashes (U+2013). Use colons, commas, parentheses, or
  two hyphens.

## Stack

- Next.js 16 (App Router) with React 19
- Tailwind CSS 4 (CSS-first config in `app/globals.css`)
- MDX via `next-mdx-remote/rsc` with `remark-gfm`, `rehype-slug`,
  `rehype-autolink-headings`, and `rehype-pretty-code`
- Frontmatter validated by Zod (`lib/content/schema.ts`)
- Brand and editorial linter (`scripts/check-rules.ts`)

## Project layout

```
app/                    App Router pages, OG images, RSS, llms.txt, sitemap, robots
components/
  mdx/                  Authored MDX components (Callout, CtaBlock, InlineCta, WorkflowDiagram)
  posts/                Post UI (cards, catalog, byline, share, TOC, content-type chip)
  site/                 Site chrome (header, footer, sidebar, mobile nav, brand logo)
content/
  CONTENT-STRATEGY.md   Editorial SOP (read before writing posts)
  templates/            Playbook + implementation MDX templates
  authors/              Author records as JSON
  posts/                MDX posts
lib/
  site-config.ts        Single source of truth for identity + URLs
  content/              Category taxonomy, content types, post loaders, Zod schemas
scripts/check-rules.ts  Brand + editorial rules linter
```

## Development

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run check:rules  # brand + editorial rules linter
npm run build        # check:rules then next build
```

## Environment

All optional; the build falls back to local defaults.

| Variable | Default |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` |
| `NEXT_PUBLIC_PARENT_URL` | `https://fusionsync.ai` |
| `NEXT_PUBLIC_AGENCY_URL` | `https://fusionsync.ai` |
| `NEXT_PUBLIC_AGENCY_SERVICES_URL` | `https://fusionsync.ai/services` |
| `NEXT_PUBLIC_AGENCY_CONTACT_URL` | `https://fusionsync.ai/contact` |
| `NEXT_PUBLIC_AGENCY_BOOK_CALL_URL` | `https://cal.com/fusionsyncai/n8n-hub-call-booking` |
| `NEXT_PUBLIC_PRIVACY_URL` | `https://fusionsync.ai/privacy` |
| `NEXT_PUBLIC_TERMS_URL` | `https://fusionsync.ai/terms` |

## License

Editorial content © FusionSync AI. Reach out via
[fusionsync.ai/contact](https://fusionsync.ai/contact) before reposting.
