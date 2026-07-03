# Project Progress Log — theresejarvheden.se

This document tracks completed features, animation systems, layout updates, and localization states.

---

## Completed Phases & Features

### 1. Act-Based Structure (Cinematic Framing)

- Grouped the landing page sections into thematic **"Acts"** mimicking a theatrical play or film production:
  - **Akt I:** Nu aktuell (Hero / SVT documentary drama "En våldsam kärlek")
  - **Akt II:** Biografi (Biography & Mood script director toggle)
  - **Akt III:** Portfolio Bilder (Horizontal scrolling gallery on desktop, swipeable cards on mobile)
  - **Akt IV:** Meriter (Crawlable tabular credits for Film, TV, Theatre, Voice with interactive commentary audio hooks)
  - **Akt V:** Röst (Voice reels showcase)
  - **Akt VI:** Kontakt (Cinematic contact page)
  - **Akt XII:** Ridåfall / Slut på showen (End credits and post-credits scene)

### 2. Animated Intro Curtain & delayed Navigation

- Added a black intro "curtain" that rises upon initial load to simulate the beginning of a show.
- Fixed layout flash issues by hiding the language switcher, desktop nav list, and mobile hamburger menu until the curtain has fully cleared.

### 3. Theatrical Spotlight Searchlight Effect

- Developed the `SpotlightImage` component with custom radial masking (`maskImage`/`webkitMaskImage`).
- **Desktop Behavior:** Cursor tracks mouse movement on desaturated image overlays, dynamically revealing colors and details underneath the spotlight, and fading out clean when the mouse leaves.
- **Mobile/Tablet Behavior:** Detects pointer capabilities and automatically sweeps/glides a smaller spotlight beam across the images using viewport scroll position, providing standard interactive depth on touchscreens.

### 4. Swipeable Portfolio & Natural Page Scroll

- Designed a horizontal scrolling track on desktop using Framer Motion's `useScroll` and `useTransform`.
- Configured mobile/tablet viewports to use relative, natural heights (`h-auto`) to disable scroll locking, allowing standard vertical browsing without page jamming.

### 5. Mobile-First Layout Ordering

- Swapped the HTML order for columns in the **Biography** and **Voice** sections.
- Implemented responsive flex-ordering (`md:order-first`) so text is read first on mobile with images following directly beneath, preserving desktop side-by-side layouts.

### 6. Interactive End Credits & Outro

- Configured a vertical scrolling credits roll in the footer.
- Implemented a mini "post-credits" video reel card in the bottom-right corner that triggers once the user reaches the footer.
- Adjusted scroll timing, increased text size, changed the Swedish title to _"Slut på showen"_, and enhanced the final credits loop word to display a bold, white **"SLUT" / "THE END"**.

### 7. Responsive Navigation Header and Auto-Hiding Language Switcher

- Refactored navigation header and language switcher out of `src/routes/index.tsx` into modular files (`src/components/Nav.tsx` and `src/hooks/use-t.tsx`) to enforce codebase constraints (<400 lines per file).
- Shifted the logo/name _Therese Järvheden_ 8px further to the left on mobile screen sizes (`pl-4` vs `px-6`) to prevent overlap and ensure optimal spacing relative to the language switcher on large mobile devices.
- Added scroll-reactive behavior to the language switcher. As the user scrolls down, the switcher smoothly animates out of view (reducing opacity, scale, and width to 0), and morphs back to full visibility when scrolled back to the top.

### 8. Modularization & Codebase Cleanliness (400 Line Rule Compliance)

- Fully decomposed the previously monolithic `src/routes/index.tsx` (~1760 lines) into isolated, single-responsibility modules:
  - Localization logic extracted to `src/hooks/use-t.tsx`.
  - Navigation bar logic extracted to `src/components/Nav.tsx`.
  - Spotlight & image elements moved to `src/components/ui/SpotlightImage.tsx`, `src/components/ui/Spotlight.tsx`, `src/components/ui/CommentaryPlayer.tsx`, and `src/components/ui/Field.tsx`.
  - Core sections extracted to `src/components/sections/` (`Hero.tsx`, `Biography.tsx`, `Portfolio.tsx`, `Credits.tsx`, `Voice.tsx`, `Contact.tsx`, and `Footer.tsx`).
- Main page routing file reduced to **320 lines of clean, readable code**, complying fully with the repository-wide 400-line constraint.
- Type compile safety confirmed green across the entire modular layout.

### 9. Cinematic Showreels & Theater Mode (Akt III.V)

- Created a custom widescreen video showcase section supporting Vimeo embeds (e.g. `vimeoId: "1206764752"`) and native video files.
- Built a slow-morphing "Theater Mode" that scales the player canvas smoothly to an IMAX-style widescreen format (`w-[94vw] max-w-[1400px]`) over 2.2 seconds with a custom ease curve.
- Implemented delayed projection: the player keeps the video unmounted and displays a static poster image during expansion, gradually darkening the poster to black as the screen grows. Autoplay initiates only after the transition completes and the background dims to pitch black.
- Mapped dynamic background glow backlighting matching each reel's signature color.

### 10. Showreel Pagination & Merits Section Pagination (Load More)

- **Showreel Card Cap:** Restricted visible showreels to 3 items maximum by default. Added two mock reels to a new decoupled file `src/components/sections/ShowreelsData.ts` to test expansion logic.
- **Side Arrow Toggle Card:** Created a custom interactive selector card on the side with animate-loop arrow icons (`ArrowLeft` / `ArrowRight`) to let the user expand/collapse showreels with smooth transition styling.
- **Merits Count Limit:** Limited the credits list to show 10 items (5 on mobile screens, dynamically monitored on viewport resize). 
- **Load More / Less Button:** Styled an elegant, cinematic, borders-only button centered below the credits list that handles expanding or collapsing rows based on active category filtering.

### 11. Website Producer & Marquee Pause (Akt XII)

- **Website Producer Credit:** Appended "Sirin Öngörür" as Website Producer to the end of the credits list scrolling marquee in `Footer.tsx`.
- **CSS Marquee Pause:** Replaced Framer Motion's snap-back hover-reset with a pure CSS hardware-accelerated scroll keyframe. Set `animation-play-state: paused` on hover so the roll halts smoothly and continues scrolling exactly where it was without resetting.

### 12. Admin Console Cursor Bug Fix

- **Custom Spotlight Suppression:** Wrapped the backstage route rendering tree in a `data-no-spotlight` container. This tells the global cinematic `Spotlight` follower to hide, avoiding visual double-cursor noise in the admin panel.
- **Native Browser Cursor Restoration:** Implemented an inline CSS style override block specifically targeting backstage child elements (inputs, textareas, buttons, select menus, containers). This overrides the global `html, body { cursor: none; }` rules, restoring the native cursor, I-beam text editing indicators, and standard hand pointers over clickable CMS buttons.

### 13. Phase 3 — Live Database CMS Integration
- **Database Schema & SQL Migrations:** Created migrations to set up PostgreSQL tables matching site modules, including supporting columns for manual override sync flags and JSONB structures.
- **CMS Form Connection:** Rewrote all backstage dashboards (`Hero`, `Biography`, `Portfolio`, `Credits`, `SEO`) to execute real-time read and write operations.
- **Storage Bucket Support:** Configured the file upload controller to write headshots and SEO og-images to the Supabase `portfolio` bucket. Added exception fallbacks notifying the user to create the public bucket in their console, while offering a text field input fallback.
- **Force Sync System:** Added a **"Tvinga Synk till DB"** button in the backstage sidebar, triggering an automated seed function to write/override default site assets inside the database.

### 14. Phase 4 — Dynamic Landing Page Hookup
- **Dynamic Routing Controller:** Wired `src/routes/index.tsx` to pull data from Supabase on component mount, with a complete fallback to static assets if database tables are unpopulated.
- **Dynamic Translation Merger:** Built an in-memory dictionary merger that merges translated database fields dynamically into the localized translation dictionary (`t` object), maintaining standard translation bindings.
- **SEO Tag Management Injection:** Implemented a runtime observer that dynamically synchronizes the document tab title, description metadata tag, and Open Graph image tags with values configured in backstage.
- **Automatic Current Production Hero Sync:** Configured the Hero title line to automatically fetch and format text from the merit item marked as `is_current_production` in the credits table when auto-sync is enabled.
- **Clean Section Props:** Refactored Biography, Portfolio, Showreels, and Credits components to consume dynamic data sets via props, confirming a compiler-checked green build.

### 15. Backstage Media Library (Mediebibliotek)
- **Direct Storage Lists:** Added a new backstage dashboard module (`DashboardMedia.tsx`) that lists all uploaded files (images and videos) directly inside the Supabase `portfolio` storage hink.
- **Upload Controls**: Built drag-and-drop/local file picker controls supporting both local image files and video files.
- **Dynamic Clipboard Utility**: Added a copy helper to easily copy public URLs for any image or video asset.
- **Immediate Portfolio Push**: Added a "Plus/Add to Portfolio" quick trigger that inserts the image record directly into `portfolio_images` with descriptive alt tags.
- **External URL Link Manager**: Integrated URL link registers to save external images/showreels from direct paths.

### 16. Audio Commentary Uploads & Script Editor in Merits (Akt V)
- **Advanced Options Drawer:** Implemented a collapsable advanced section inside each merit row in `DashboardCredits.tsx` to handle voice recordings and script dialogue details.
- **Direct Audio File Upload:** Added a local file picker that uploads audio files (`audio/*`) directly to the Supabase `portfolio` storage bucket, auto-calculating the duration (mins:secs) dynamically.
- **Dialogue & Scene Transcription:** Added localized textareas for commentary descriptions and structured inputs for script scenes, character names, and dialogue lines in both Swedish and English.
