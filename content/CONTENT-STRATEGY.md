# n8n Automation Hub: content strategy

This document is the source of truth for what we publish and how agents should spin up posts when Vishal provides workflow details and screenshots.

## Positioning

The hub is **not** a generic "how to use n8n" blog. The core product is **workflow implementations**: real automations a business can **download, import, and run** inside their processes.

**Secondary** content is **playbook-style**: research, architecture, tool choices, and patterns. Still practical, still opinionated, but without the full install guide until the implementation ships (or as a precursor to it).

Powered by **FusionSync AI**. Every implementation ends with a CTA: need help setting this up? Book a call via `siteConfig.agency.bookCallUrl`.

## Two content types (`contentType` in frontmatter)

| Type | `contentType` | Primary? | Purpose |
|------|---------------|----------|---------|
| **Workflow implementation** | `implementation` | Yes | Someone can follow steps and install the automation in their stack. |
| **Playbook** | `playbook` | No | Theory + architecture + tools. Often published **before** the matching implementation. |

### Implementation post structure (required sections, in this order)

This is the canonical structure. Match it for every implementation post. Use
`content/posts/implement-ai-form-replies-human-in-the-loop.mdx` and
`content/posts/linkedin-post-automation-ai-agents-n8n.mdx` as the reference posts.

1. **Intro (no heading)**: 2 short paragraphs. First is the problem hook (who feels the pain, why the naive fix fails). Second is what this guide builds plus the key design decision, with a link to the `companionSlug` playbook.
2. **## Available resources**: Numbered list of the assets (workflow + data store), immediately followed by the `<WorkflowDownload />` card pointing at `public/workflows/[slug].json`.
3. **## What you'll need**: Numbered prerequisites with bolded lead-ins (accounts, credentials, app scopes, LLM key).
4. **## Overview of the automation**: 1-2 framing sentences, a numbered list of the phases (a human approval usually sits between them), the `<WorkflowDiagram />`, then one paragraph on the important design decision.
5. **## Step-by-step setup**: `###` numbered subsections. Start with "Set up the [data store]" (schema/columns table), then "Connect credentials in n8n", then "Build phase one ...", "Build phase two ...", and end with "Import the workflow JSON". Use bolded action lead-ins and fenced code for expressions, code, and Block Kit / JSON.
6. **## Testing the workflow**: Numbered validation walkthrough that exercises the human gate, plus the most common failure point.
7. **## Customization options**: Bullet list with bolded lead-ins (swap model, replace form, auto-send, routing, etc.).
8. **## Common mistakes that quietly break this**: Bullet list of failure modes (system of record, correlation keys, fast webhook ack, idempotency, security/PII).
9. **`<InlineCta />`**: A single bare inline CTA right before the conclusion.
10. **## Conclusion**: Wrap-up paragraph restating the outcome and the human-in-control payoff.

The page-level CTA is added automatically by the post layout (do not put
`<CtaBlock />` in MDX). Implementation posts get **"Need help setting this up?"**;
playbooks get **"Want this built for you?"**

### Playbook post structure (required sections)

1. **Problem**: Who feels this pain and what breaks today.
2. **Target architecture**: End-to-end flow without pretending every screenshot exists yet.
3. **Components**: n8n, AI/LLM, Slack, Sheets, email, forms, etc. Why each.
4. **Human-in-the-loop**: Where humans must approve, edit, or reject (if applicable).
5. **Data model**: Especially Google Sheets columns or CRM fields as system of record.
6. **Guardrails**: What must never auto-send; compliance and tone notes.
7. **Implementation pointer**: Link to `companionSlug` when the implementation post exists; otherwise state "implementation guide coming."

## Publishing workflow (usual sequence)

For each **automation idea** we often ship **two posts**:

1. **Playbook first**: `contentType: playbook`, set `companionSlug` to the planned implementation slug.
2. **Implementation second**: `contentType: implementation`, same `companionSlug` pointing back to the playbook (bidirectional pairing in frontmatter).

When Vishal asks for a post:

- He provides **how the workflow works**, **what it solves**, and **screenshots** (implementations).
- Agents use templates in `content/templates/` and validate frontmatter against `lib/content/schema.ts`.
- Run `npm run check:rules` before commit (no em/en dashes, brand casing, no invented stats).

## Reference automation (first flagship pair)

**Use case:** Form submission → n8n captures → analysis → AI agent drafts first reply → **human-in-the-loop** in Slack (approve / request changes / reject) → on approve, tool sends message (e.g. email) → **Google Sheets** tracks all rows and status.

| Post | Slug | Status |
|------|------|--------|
| Playbook (architecture) | `playbook-ai-form-replies-human-in-the-loop-slack` | Published |
| Implementation (setup + screenshots) | `implement-ai-form-replies-human-in-the-loop` | Planned |

## Diagrams

Do not use ASCII art for architecture diagrams (it overflows on mobile). Use the
`<WorkflowDiagram />` MDX component: a centered, responsive vertical node flow.

```mdx
<WorkflowDiagram caption="Optional one-line caption.">
  <WorkflowStep node="Form provider" detail="Typeform, Tally, native n8n form." />
  <WorkflowStep node="n8n" via="webhook / trigger" detail="Normalize and write sheet row." />
  <WorkflowStep node="AI agent" detail="Draft the first reply." />
  <WorkflowOutput>Email API (send on approve)</WorkflowOutput>
  <WorkflowOutput>Google Sheets status log</WorkflowOutput>
</WorkflowDiagram>
```

Use child elements only (not `steps={[...]}` array props; those do not render in our
MDX pipeline). `via` is the connector label into that step. Everything wraps; no
horizontal scroll.

## Categories

Posts still use **one** of the eight pillar categories (`lib/content/categories.ts`). Pick the pillar that matches the buyer (e.g. `ai-agents-automation` for agent-heavy flows, `slack-automation` for approval-heavy flows).

## Frontmatter cheatsheet

```yaml
contentType: playbook | implementation
companionSlug: optional-kebab-slug-of-paired-post
featured: true   # sparingly, for homepage hero
```

## Agent checklist for new implementation posts

- [ ] Sections follow the canonical order: intro hook, Available resources, What you'll need, Overview of the automation, Step-by-step setup, Testing the workflow, Customization options, Common mistakes, `<InlineCta />`, Conclusion
- [ ] Intro is 2 paragraphs with no heading (problem hook, then what you build)
- [ ] `<WorkflowDownload />` sits under "Available resources" and the JSON exists in `public/workflows/[slug].json`
- [ ] Step-by-step uses `###` subsections (data store, credentials, phase one, phase two, import JSON)
- [ ] Testing section exercises the human-in-the-loop gate
- [ ] Sheet column names and Slack button actions are explicit
- [ ] No invented metrics; use `TODO(stat)` if a number is needed later
- [ ] CTA to Cal.com booking URL via site config
- [ ] `companionSlug` set if a playbook already exists
- [ ] Description 40-200 chars; title 8-120 chars
