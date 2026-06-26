# Project Progress Log — theresejarvheden.se

This document tracks completed features, animation systems, layout updates, and localization states.

---

## Completed Phases & Features

### 1. Act-Based Structure (Cinematic Framing)
* Grouped the landing page sections into thematic **"Acts"** mimicking a theatrical play or film production:
  * **Akt I:** Nu aktuell (Hero / SVT documentary drama "En våldsam kärlek")
  * **Akt II:** Biografi (Biography & Mood script director toggle)
  * **Akt III:** Portfolio Bilder (Horizontal scrolling gallery on desktop, swipeable cards on mobile)
  * **Akt IV:** Meriter (Crawlable tabular credits for Film, TV, Theatre, Voice with interactive commentary audio hooks)
  * **Akt V:** Röst (Voice reels showcase)
  * **Akt VI:** Kontakt (Cinematic contact page)
  * **Akt XII:** Ridåfall / Slut på showen (End credits and post-credits scene)

### 2. Animated Intro Curtain & delayed Navigation
* Added a black intro "curtain" that rises upon initial load to simulate the beginning of a show.
* Fixed layout flash issues by hiding the language switcher, desktop nav list, and mobile hamburger menu until the curtain has fully cleared.

### 3. Theatrical Spotlight Searchlight Effect
* Developed the `SpotlightImage` component with custom radial masking (`maskImage`/`webkitMaskImage`).
* **Desktop Behavior:** Cursor tracks mouse movement on desaturated image overlays, dynamically revealing colors and details underneath the spotlight, and fading out clean when the mouse leaves.
* **Mobile/Tablet Behavior:** Detects pointer capabilities and automatically sweeps/glides a smaller spotlight beam across the images using viewport scroll position, providing standard interactive depth on touchscreens.

### 4. Swipeable Portfolio & Natural Page Scroll
* Designed a horizontal scrolling track on desktop using Framer Motion's `useScroll` and `useTransform`.
* Configured mobile/tablet viewports to use relative, natural heights (`h-auto`) to disable scroll locking, allowing standard vertical browsing without page jamming.

### 5. Mobile-First Layout Ordering
* Swapped the HTML order for columns in the **Biography** and **Voice** sections.
* Implemented responsive flex-ordering (`md:order-first`) so text is read first on mobile with images following directly beneath, preserving desktop side-by-side layouts.

### 6. Interactive End Credits & Outro
* Configured a vertical scrolling credits roll in the footer.
* Implemented a mini "post-credits" video reel card in the bottom-right corner that triggers once the user reaches the footer.
* Adjusted scroll timing, increased text size, changed the Swedish title to *"Slut på showen"*, and enhanced the final credits loop word to display a bold, white **"SLUT" / "THE END"**.

### 7. Responsive Navigation Header and Auto-Hiding Language Switcher
* Refactored navigation header and language switcher out of `src/routes/index.tsx` into modular files (`src/components/Nav.tsx` and `src/hooks/use-t.tsx`) to enforce codebase constraints (<400 lines per file).
* Shifted the logo/name *Therese Järvheden* 8px further to the left on mobile screen sizes (`pl-4` vs `px-6`) to prevent overlap and ensure optimal spacing relative to the language switcher on large mobile devices.
* Added scroll-reactive behavior to the language switcher. As the user scrolls down, the switcher smoothly animates out of view (reducing opacity, scale, and width to 0), and morphs back to full visibility when scrolled back to the top.

### 8. Modularization & Codebase Cleanliness (400 Line Rule Compliance)
* Fully decomposed the previously monolithic `src/routes/index.tsx` (~1760 lines) into isolated, single-responsibility modules:
  * Localization logic extracted to `src/hooks/use-t.tsx`.
  * Navigation bar logic extracted to `src/components/Nav.tsx`.
  * Spotlight & image elements moved to `src/components/ui/SpotlightImage.tsx`, `src/components/ui/Spotlight.tsx`, `src/components/ui/CommentaryPlayer.tsx`, and `src/components/ui/Field.tsx`.
  * Core sections extracted to `src/components/sections/` (`Hero.tsx`, `Biography.tsx`, `Portfolio.tsx`, `Credits.tsx`, `Voice.tsx`, `Contact.tsx`, and `Footer.tsx`).
* Main page routing file reduced to **320 lines of clean, readable code**, complying fully with the repository-wide 400-line constraint.
* Type compile safety confirmed green across the entire modular layout.


