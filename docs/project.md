# Project Documentation — theresejarvheden.se

This document serves as the project overview, current architecture map, constraints repository, and future roadmap for the development of **theresejarvheden.se**.

---

## 1. Project Overview & Current Architecture

The goal of this project is to build a premium portfolio and casting portal for **Therese Järvheden**, a Swedish actress and voice actor (specializing in Scanian/skånsk dialect). 

### Current Tech Stack
- **Framework:** TanStack Start (`@tanstack/react-start`) on React 19 and Vite
- **Routing:** TanStack Router (`@tanstack/react-router`) with file-based routing
- **Styling:** Tailwind CSS v4.0 (with new `@theme` configuration and `@utility` rules in `src/styles.css`)
- **Animation:** Framer Motion (for cinematic transitions, spotlight cursors, and parallax effects)
- **Icons:** Lucide React

### Current Codebase Map
- `src/routes/__root.tsx`: The root shell, HTML scaffolding, metadata/viewport settings, Google Fonts integration (Cormorant Garamond + Inter Tight).
- `src/routes/index.tsx`: The primary single-page landing component. It holds all copy translations (Swedish and English), portfolio media assets, credit tables, and components (Spotlight, Hero, Biography, FilmReel, Credits, Voice, Contact, Footer).
- `src/styles.css`: Standard styling variables (oklch colors), custom Tailwind v4 configurations, utility classes (film-grain, cursor defaults, no-scrollbar).
- `src/lib/lovable-error-reporting.ts` & others: Diagnostics and error boundaries designed to integrate with the Lovable development environment.

---

## 2. Lovable Platform Integration & Constraints

This project is actively synced with the [Lovable.dev](https://lovable.dev) AI platform. To ensure development does not break synchronization:

- **Git History Protection:** Never rewrite, squash, rebase, or force-push commits that have already been pushed to the remote repository. Doing so disrupts history tracking on Lovable’s side and may result in lost project state.
- **System Configurations:** Do not modify, delete, or obscure files within the `.lovable/` folder or instructions in `AGENTS.md`.
- **Branch Health:** Commits pushed to the active branch must keep the website in a building and working state.

---

## 3. Astro Migration Plan (Speed & SEO)

To maximize performance, load times, and search/AI-engine indexability, the long-term plan is to migrate this application to **Astro**.

### Why Astro?
- **Zero JS by Default:** Astro ships zero client-side JavaScript by default, only hydrating interactive islands (like the custom Spotlight cursor, contact forms, or image carousels) where necessary.
- **Outstanding Core Web Vitals:** Minimizing initial bundle sizes directly optimizes Largest Contentful Paint (LCP) and Interaction to Next Paint (INP).
- **First-Class SEO:** Astro offers static HTML generation (SSG) alongside server-side rendering (SSR), allowing search bots and LLMs (ChatGPT, Gemini, Perplexity) to crawl fully populated HTML pages without rendering JavaScript.

### Migration Mapping Guide
When the migration to Astro occurs, the TanStack Router structure should be mapped as follows:

| Current Route (TanStack Start) | Astro Output Route | Static/SSR | Notes |
| :--- | :--- | :--- | :--- |
| `src/routes/index.tsx` (Home) | `src/pages/index.astro` | Static (SSG) | Hero section, short bio, key showreels, direct links. |
| `/cv` (TBD - currently section) | `src/pages/cv.astro` | Static (SSG) | Full HTML table for credits, printable styling. |
| `/showreels` (TBD) | `src/pages/showreels.astro` | Static (SSG) | Embedded video objects using Vimeo and schema.org markup. |
| `/voice` (TBD) | `src/pages/voice.astro` | Static (SSG) | Voice reels, audio elements, Scania dialect marketing. |
| `/kontakt` (TBD) | `src/pages/kontakt.astro` | SSR / Hybrid | Form submission endpoint. |
| `/en/*` (TBD - currently local state) | `src/pages/en/...` | Static (SSG) | Localized paths for international casting agencies. |

---

## 4. Development & Styling Guidelines

Any updates to the current TanStack Start implementation must keep the final Astro migration and the strict rules in `docs/rules.md` and `docs/seo.md` in mind:

1. **Keep Files Under 400 Lines:** Divide large files into reusable components. Current `src/routes/index.tsx` is >1000 lines and should be partitioned into separate files under `src/components/` as features are added or modified.
2. **Prevent Layout Shift (CLS):** Always assign explicit `width` and `height` dimensions (or CSS aspect-ratio utilities) to image elements and video placeholders.
3. **Optimized LCP (Above-the-Fold Assets):** Hero image assets must load eagerly and receive high-priority fetching. Avoid using client-side React hydration to render critical text above the fold.
4. **Real HTML for CV Data:** Maintain tabular and list layouts for credits instead of embedding images of CV PDFs. Crawler and AI engines must be able to parse text details directly.
5. **Stable Asset URLs & SEO Alt Tags:** Images must utilize clean, keyword-rich filenames and descriptive alt text (e.g., `therese-jarvheden-headshot-2025.jpg` rather than CDN-hashed URLs).

---

## 5. Technical Progress & Issue Resolutions
* For detailed documentation on completed features, act divisions, and navigation lifecycle, see [progress.md](progress.md).
* For detailed documentation on layout shifts, touchscreen fixes, scroll lock resolution, and structural swaps, see [fixes.md](fixes.md).
