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
