# portfolio

Personal site of **Harun Bahrudin** — a frontend engineer who ships to web, mobile, and desktop.

The site is built around implementation-craft case studies: what the constraint was, what I tried and rejected, and what I actually did. Not client logos, not a technology wall.

## Status

In development. Not deployed yet.

## Stack

| | |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4, design tokens in CSS variables |
| Content | Local MDX, validated at build time — no CMS |
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

## Local development

```bash
pnpm install
pnpm dev
```

## Licence

Code is MIT. Written content and images are not.
