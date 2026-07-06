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
- **Backend/Database:** Supabase (PostgreSQL, Storage buckets, Row Level Security)

### Current Codebase Map

- `src/routes/__root.tsx`: The root shell, HTML scaffolding, metadata/viewport settings, Google Fonts integration (Cormorant Garamond + Inter Tight).
- `src/routes/index.tsx`: The primary single-page landing component. It fetches from the live database on mount, merges translations dynamically, updates SEO tags, and distributes dynamic data to page sections.
- `src/routes/backstage.tsx`: The route gate for the backstage CMS admin panel.
- `src/components/backstage/`: Subcomponents for admin CRUD pages (`BackstageDashboard.tsx`, `DashboardHero.tsx`, `DashboardBio.tsx`, `DashboardPortfolio.tsx`, `DashboardCredits.tsx`, `DashboardSeo.tsx`, `DashboardMedia.tsx`).
- `src/lib/supabase.ts`: Database client instantiation and connection helpers.
- `src/lib/supabase-sync.ts`: Automated data seeder that syncs static local assets up to Supabase if the tables are empty or manually forced.
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

| Current Route (TanStack Start)        | Astro Output Route          | Static/SSR   | Notes                                                     |
| :------------------------------------ | :-------------------------- | :----------- | :-------------------------------------------------------- |
| `src/routes/index.tsx` (Home)         | `src/pages/index.astro`     | Static (SSG) | Hero section, short bio, key showreels, direct links.     |
| `/cv` (TBD - currently section)       | `src/pages/cv.astro`        | Static (SSG) | Full HTML table for credits, printable styling.           |
| `/showreels` (TBD)                    | `src/pages/showreels.astro` | Static (SSG) | Embedded video objects using Vimeo and schema.org markup. |
| `/voice` (TBD)                        | `src/pages/voice.astro`     | Static (SSG) | Voice reels, audio elements, Scania dialect marketing.    |
| `/kontakt` (TBD)                      | `src/pages/kontakt.astro`   | SSR / Hybrid | Form submission endpoint.                                 |
| `/en/*` (TBD - currently local state) | `src/pages/en/...`          | Static (SSG) | Localized paths for international casting agencies.       |

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

- For detailed documentation on completed features, act divisions, and navigation lifecycle, see [progress.md](progress.md).
- For detailed documentation on layout shifts, touchscreen fixes, scroll lock resolution, and structural swaps, see [fixes.md](fixes.md).

---

## 6. Section Scroll Transitions & Visual Effects

To create a cohesive, cinematic visual flow, a scroll exit transition has been implemented for all major page sections. This effect ensures that as the user scrolls past any section, it smoothly fades out and zooms in, revealing the dark stage background underneath and enhancing section-to-section readability.

### Animation Details (Framer Motion)

- **Normal Flow Sections** (`Biography`, `Credits`, `Voice`, `Contact`):
  - **Hook:** `useScroll` tracking the section element with offset `["start start", "end start"]`.
  - **Mappings:** Progress from `0.5` to `0.95` translates `opacity` from `1` to `0` and `scale` from `1` to `1.05`.
  - **Wrapper:** Content is wrapped in a `<motion.div style={{ opacity, scale }}>` to ensure layout styles remain unaffected.
- **Sticky Portfolio Section** (`Portfolio`):
  - **Challenge:** The horizontal scroll track uses a sticky container inside a `320vh` parent, meaning standard offsets would cause it to fade out prematurely.
  - **Solution:** Configured `useScroll` with offset `["end end", "end start"]` to trigger the exit transition only _after_ the horizontal scroll finishes and the section begins moving off-screen.

- **Contact Form Spotlight Overlay**:
  - **Trigger:** Activates whenever any input or textarea inside the Contact component gains focus.
  - **Effect:** Overlays a dark (`bg-black/80`) mask covering the form container (`z-20` overlay with `pointer-events-none`).
  - **Spotlight Mask:** Uses CSS `mask-image` with a custom `radial-gradient` that creates a `450px` radius transparent circle. This highlights only the active focal area in high-contrast brightness, while keeping user input fully interactive.
  - **Tracking:** The spotlight automatically centers over the focused field element when first focused, and then follows the user's mouse coordinates dynamically on mouse movement.
  - **Deactivation:** Fades away on blur, when the user clicks outside, or when scrolling away to a different section (achieved using an `IntersectionObserver` that blurs the active input when the contact section exits the viewport).

- **Cinematic Showreel & Theater Mode**:
  - **Scale and Dimming Transition:** Tracks expansion state `isEnlarged` and completion state `isTransitionComplete`. Scales up the player card to a widescreen theater canvas `w-[94vw] max-w-[1400px]` over a slow, premium 2.2-second transition using an ultra-smooth `[0.16, 1, 0.3, 1]` ease-out curve.
  - **Delayed Projection Autoplay:** Displays a static poster image during the scale-up, gradually darkening it using an absolute black overlay fading to opacity `1`. The video player mounts and autoplays only after the screen reaches full width and the backdrop turns pitch black.
  - **Cursor Spotlight Exclusion:** Employs a `data-no-spotlight` attribute to hide the cursor dot and orange spotlight highlight entirely over the media player canvas, ensuring clean distraction-free movie viewing.

---

## 7. Guidelines Alignment & SEO Checklist

By referencing `docs/rules.md` and `docs/seo.md`, our technical updates follow these core principles:

- **Clean Structure for Astro:** Scroll transitions are applied modularly inside each section component rather than using global, page-wide scroll listeners, ensuring they remain easy to translate into Astro components in the future.
- **No CLS / Safe Scaling:** All animated containers use hardware-accelerated CSS properties (`transform: scale`, `opacity`) avoiding layout shifts (CLS).
- **Lovable Sync Stability:** All edits avoid altering files in the `.lovable/` folder or altering established Git commit history.

---

## 8. Backstage CMS Updates & Shared Media Picker

Recent enhancements to the admin panel streamline content management and align the interface with site semantics:

- **Shared Media Selector:** A reusable component `MediaPickerModal` retrieves files from the Supabase storage bucket (`portfolio`), filtering assets by type (images, videos, audio) for one-click selection across Portfolio, Showreels, Meriter, and SEO (OpenGraph image).
- **Showreel Poster Previews:** Embeds real-time image previews within the Showreels dashboard to verify poster asset links.
- **Year-Based Auto-Sorting & Custom Ordering:** Merit list elements are sorted automatically by year descending. The addition of manual move-up/down arrows updates the sorting indexes locally so users can customize production display orders.
- **Act Nomenclature Alignment:** Updated sidebar navigation to strictly match the website's acts, renaming tabs to "Akt VII: Kontaktinfo" and "Akt VIII: Ridåfall". Spacing padding was tightened, and icon dimensions were locked using `flex-shrink-0` to protect sidebar layouts.
- **Safe Database Mutations:** Switched mutations to `.update().eq('id', 'main')` to avoid database null constraint violations when saving partial states.
- **Socials & Custom Link Styling:** Integrated custom selectors to pick descriptive icons for custom URLs, and expanded default social configurations to support YouTube and X profiles with custom visual branding.

