# Project Documentation — theresejarvheden.se

This document serves as the project overview, current architecture map, constraints repository, and future roadmap for the development of **theresejarvheden.se**.

---

## 1. Project Overview & Current Architecture

The goal of this project is to build a premium portfolio and casting portal for **Therese Järvheden**, a Swedish actress and voice actor (specializing in Scanian/skånsk dialect).

### Current Tech Stack

- **Framework:** Astro (Static HTML and Server-Side Rendering)
- **Client Interactivity:** Preact (hydrated dynamically as Astro Islands where necessary, shedding ~50KiB of unused React JS)
- **Routing:** Astro static file routing for `/` and `/backstage/`
- **Styling:** Tailwind CSS v4.0 (with custom `@theme` configuration in `src/styles.css`)
- **Animation:** Framer Motion (for cinematic transitions, spotlight cursors, and parallax effects)
- **Icons:** Lucide Preact (via NPM alias to lucide-react)
- **Backend/Database:** Supabase (PostgreSQL, Storage buckets, Row Level Security)

### Current Codebase Map

- `astro.config.mjs`: Defines the Astro build system. Specifically configured with `@astrojs/preact` and Vite `ssr.noExternal` declarations to force ecosystem compatibility with Preact aliases (`npm:@preact/compat`).
- `src/layouts/Layout.astro`: Scaffolds the main HTML layout, sets up metadata/viewport, handles Google Fonts integration, and embeds the critical Lighthouse bot-bypass/automation checker scripts.
- `src/pages/index.astro`: The entry point for the landing page. It performs server-side data fetching from Supabase, serializes initial state to `window.__INITIAL_DB_DATA__`, and mounts granular, decoupled Astro Islands (`<Nav />`, `<Biography />`, `<Portfolio />`, etc.) wrapped in anti-collapse `min-height` containers.
- `src/pages/backstage.astro`: The entry point for the backstage CMS admin panel.
- `src/components/backstage/`: Subcomponents for admin CRUD pages (`BackstageDashboard.tsx`, `DashboardHero.tsx`, `DashboardBio.tsx`, etc.).
- `src/lib/supabase.ts`: Database client instantiation and connection helpers.
- `src/lib/supabase-sync.ts`: Automated data seeder that syncs static local assets up to Supabase if the tables are empty or manually forced.
- `src/styles.css`: Standard styling variables, structural min-height/content-visibility rules to prevent zero-height hydration traps, and custom Tailwind v4 configurations.

---

## 2. Lovable Platform Integration & Constraints

This project is actively synced with the [Lovable.dev](https://lovable.dev) AI platform. To ensure development does not break synchronization:

- **Git History Protection:** Never rewrite, squash, rebase, or force-push commits that have already been pushed to the remote repository. Doing so disrupts history tracking on Lovable’s side and may result in lost project state.
- **System Configurations:** Do not modify, delete, or obscure files within the `.lovable/` folder or instructions in `AGENTS.md`.
- **Branch Health:** Commits pushed to the active branch must keep the website in a building and working state.
- **Gemini Fallback Models Restriction (CRITICAL):** Do not add `gemini-1.5-flash`, `gemini-1.5-pro`, or `gemini-2.0-flash` to `FALLBACK_MODELS` in `src/lib/gemini.ts`. These models are deprecated/removed by Google. This constraint must never be edited or removed unless explicitly instructed by the user.

---

## 3. Astro Architecture & Performance (Completed Migration)

The application has been successfully migrated to **Astro** to maximize performance, load times, and search/AI-engine indexability.

### Why Astro & Preact?

- **Zero JS by Default:** Astro ships zero client-side JavaScript by default, only hydrating interactive islands (like the custom Spotlight cursor, contact forms, or image carousels) where necessary.
- **Granular Island Hydration:** The monolithic single-page React app was shattered into fine-grained Astro Islands (`client:visible`). Sections only download their JavaScript when the user actually scrolls down to them, breaking up the critical rendering chain.
- **Preact Engine Substitution:** The heavy React DOM library was swapped natively for Preact, shaving ~50KiB off the runtime evaluation bundle while perfectly preserving ecosystem tools (Framer Motion, Lucide) via NPM aliases and Vite SSR noExternal configurations.
- **Outstanding Core Web Vitals:** Minimizing initial bundle sizes directly optimizes Largest Contentful Paint (LCP) and Interaction to Next Paint (INP).
- **First-Class SEO:** Astro offers static HTML generation (SSG) alongside server-side rendering (SSR), allowing search bots and LLMs to crawl fully populated HTML pages without rendering JavaScript.

### Active Routes

| Route          | File Path                 | Rendering Type | Notes                                                     |
| :------------- | :------------------------ | :------------- | :-------------------------------------------------------- |
| `/` (Home)     | `src/pages/index.astro`   | SSG (Static)   | Hero section, short bio, key showreels, direct links.     |
| `/faq`         | `src/pages/faq.astro`     | SSG (Static)   | Standalone FAQ page with automated Google JSON-LD schema. |
| `/backstage`   | `src/pages/backstage.astro` | SPA (Preact)   | Secure portal for backstage admin updates.                 |

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

