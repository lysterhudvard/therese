# Astro Conversion Plan (Draft) — theresejarvheden.se

This document outlines the migration plan to convert the website from its current **React-Start (TanStack Start)** stack to **Astro**. The main goals of this conversion are faster load times, optimized SEO/AEO performance via Astro's Island Architecture, and a cleaner compilation system, all while preserving 100% of the existing animations, custom layouts, and CMS integrations.

> [!IMPORTANT]
> **Safety First:** We will not perform any destructive changes to the existing project files. We will use git branches, local backups, and side-by-side component mapping to ensure we can revert immediately if anything does not match our planned outcomes.

---

## 🗺️ Architectural Comparison

| Feature | Current Stack (React-Start) | Planned Stack (Astro) |
| :--- | :--- | :--- |
| **Framework Engine** | TanStack Start (Vinxi + Nitro) | Astro |
| **Component Rendering** | 100% Client/Hydrated React | Astro Islands (Static HTML + Selective React Hydration) |
| **Styling** | TailwindCSS v4 via `@tailwindcss/vite` | TailwindCSS v4 via Astro Vite Config |
| **Client Routing** | TanStack Router (`src/routes/*`) | Astro File-based Routing (`src/pages/*`) |
| **Database Fetching** | Client-side/Server-side React Hooks | Astro Server-side (`Astro.request` / SSR queries) |
| **Backstage CMS** | React Client SPA in Subroute | Client-only React Island (`client:only="react"`) |

---

## 🛡️ Cautious Migration Strategy

To ensure zero risk, we will follow these safety rules:
1. **Branch Isolation:** All migration work will happen on a new git branch: `feature/astro-migration`. The `main` branch will remain completely untouched.
2. **Local Archive Backup:** Before running any install scripts, we will create a compressed archive of the current codebase (`.backup/react-start-original.zip`) so we have a physical snapshot of the workspace.
3. **Component Reusability:** Astro supports React components natively. We will NOT rewrite our beautiful React components (e.g. `Spotlight`, `CommentaryPlayer`, `Credits`, `Showreels`, CMS panels). They will be imported into Astro as-is.
4. **Gradual Hydration:** We will load the page sections using Astro hydration directives (`client:load`, `client:visible`, `client:only`) to incrementally test interactions like the custom cursor and theater-mode video transitions.

---

## 📋 Step-by-Step Implementation Plan

### Step 1: Branch Creation & Snapshot
1. Create and check out the new branch:
   ```bash
   git checkout -b feature/astro-migration
   ```
2. Archive the current project state to a backup directory.
3. Lock all dependencies in a safe file for reference.

### Step 2: Astro Setup & Dependency Integration
1. Initialize Astro in a staging environment. We will add the Astro core and configuration files side-by-side with our existing React structure.
2. Install the Astro-React integration:
   ```bash
   npx astro add react
   ```
3. Configure `astro.config.mjs` to support React, TailwindCSS v4, and enable SSR mode (Server-Side Rendering) to talk to Supabase.
4. Ensure typescript definitions are mapped.

### Step 3: Layouts and Global Configurations
1. Create a master Astro layout `src/layouts/Layout.astro`.
2. Port all global HTML head tags, meta tags, and Web Fonts (Inter).
3. Import global stylesheets (`src/styles.css`) into the Astro layout.

### Step 4: Porting the Main Page (`src/pages/index.astro`)
1. Create the index page at `src/pages/index.astro`.
2. Extract Supabase data loading logic from `src/routes/index.tsx` and place it at the top of `index.astro` in the server-frontmatter block. This guarantees all initial database queries execute on the server before the page is served to the user (removing client-side loading flashes entirely).
3. Pass database data down to the React section components as standard props.
4. Render the page using Astro's high-performance Islands:
   ```astro
   ---
   // Server-side fetching from Supabase
   import { getPageData } from '../lib/supabase-server';
   const dbData = await getPageData();
   ---
   <Layout title="Therese Järvheden">
     <Hero client:load />
     <Biography moodData={mergedMoodData} client:visible />
     <Portfolio images={dbData.portfolioImages} client:visible />
     <Showreels videos={dbData.showreels} client:visible />
     <Credits credits={dbData.credits} client:visible />
     <Voice client:visible />
     <Contact client:visible />
     <Footer client:visible />
   </Layout>
   ```

### Step 5: Porting the Backstage CMS
1. Create the admin route at `src/pages/backstage.astro`.
2. Since the Backstage panel is highly interactive, requires authentication state, and uses complex form libraries, we will mount it as a client-only React application:
   ```astro
   <Layout title="Backstage CMS">
     <BackstageDashboard client:only="react" />
   </Layout>
   ```
3. Verify that all dashboard save/update commands execute correctly against Supabase from the Astro-rendered wrapper.

### Step 6: Porting API Endpoints
1. Convert any server functions (such as the Gemini-powered Klick-guiden tour generator) into standard Astro API endpoint routes under `src/pages/api/`.

### Step 7: Dual Validation & Verification
1. Run local builds using both the old setup and the new Astro setup on different local ports to cross-compare:
   * Widescreen expansion (Teaterläge) transition and glow effect.
   * Scrolling end credits speed and marquee pause on hover.
   * Spotlight cursor tracking on desktops and touchscreen laptops.
   * CMS Klick-guiden interactive tours.
2. If any discrepancy or bug occurs, analyze the branch differences and fix them without affecting production.
3. Once 100% verified, merge the branch back into `main`.

---

## ⚡ Key Benefits of the Astro Stack

1. **Near-Zero JS Baseline:** Pages will load instantly because section containers (Biography, Credits table, Contact text) render as static HTML on the server. JavaScript is sent only for the specific components that need it (like the video player or custom cursor).
2. **Improved Core Web Vitals:** First Contentful Paint (FCP) and Largest Contentful Paint (LCP) will improve significantly, boosting SEO ranking.
3. **No Flashing Content:** Because data fetching happens server-side, the user will never experience a layout shift or see mock data flashing while the client queries Supabase.
