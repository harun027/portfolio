# portfolio

Personal site of **Harun Bahrudin**, a frontend engineer who ships to web, mobile, and desktop.

The site is built around implementation-craft case studies: what the constraint was, what I tried and rejected, and what I actually did. Not client logos, not a technology wall.

## Status

In development. Not deployed yet.

## Stack

| | |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4, design tokens in CSS variables |
| Content | Local MDX and JSON, validated at build time. No CMS |
| Motion | Motion, with full `prefers-reduced-motion` support |
| Hosting | Vercel |

## Design constraints

These are deliberate and enforced, not preferences:

- **Monochrome plus one accent.** The accent appears in at most three places. No gradients, no glassmorphism.
- **Character comes from typography and whitespace**, not colour.
- **No dates anywhere in the content model.** Notes have no publish dates — not hidden, absent — so nothing can look stale.
- **Build fails on placeholder text.** Frontmatter is validated and any `lorem` / `TODO` / `TBD` / `placeholder` string stops the build.
- **Fully keyboard operable**, visible focus states, WCAG AA contrast.

## Structure

```
app/         routes: /, /work/[slug], /notes, /notes/[slug], /services
components/  UI, one concern per file
content/     work/*.mdx and notes/*.mdx
lib/         content loading and frontmatter validation
public/      images and cv.pdf
```

## The content gate

A portfolio whose copy is not written yet should not be deployable, so that rule
lives in the build rather than in good intentions. `lib/content.ts` validates
every frontmatter field and every content file, and `next build` exits non-zero
when a required field is missing or a string still reads `TODO`, `TBD`, `lorem`,
or `placeholder`.

To look at an unfinished site locally, skip the gate:

```bash
pnpm build:draft   # warns instead of failing
```

Images are the one exception. Temporary imagery is allowed while real
screenshots are pending; unwritten text is not.

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build        # fails while any copy is unwritten, by design
```

## Licence

Code is MIT. Written content and images are not.
