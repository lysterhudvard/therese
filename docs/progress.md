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

### 17. Admin Navigation & Sidebar Spacing Optimization
- **Naming Alignment:** Synchronized sidebar navigation labels to precisely match the website's acts: "Akt VII: Kontaktinfo" and "Akt VIII: Ridåfall" (replacing any generic or mismatched titles).
- **Text Wrapping & Padding:** Resolved navigation layout breakage on sidebar labels (prevented multi-line wrapping using `whitespace-nowrap`). Optimized sidebar spacing by reducing paddings to `p-4` and button paddings to `px-3 py-2` to maximize available content width.
- **Icon Sizing & Scale Lock:** Added `flex-shrink-0` to all sidebar icons to prevent browser rendering engines from shrinking icons when text runs long. Locked icon sizes to an uniform `16px`.

### 18. Supabase Update Queries & Database Constraint Resolutions
- **Partial Database Updates:** Replaced partial Supabase `.upsert()` operations with targeted `.update().eq('id', 'main')` queries in the Bio, Contact, and Curtain/Ridåfall panels. This bypasses NOT-NULL constraints on non-edited fields (such as `quote_sv` in biography) when saving unrelated tabs.
- **Empty Array Initialization Safeguard:** Fixed biography's background quotes loader. It now properly preserves fallback original values if the loaded database JSON array is empty (`[]`), rather than wiping out the editor interface.

### 19. Media Library Integration, Previews & Merit Ordering Controls
- **Shared Media Picker Dialog:** Built a modular, responsive `MediaPickerModal` that overlays the CMS. It retrieves direct files from the `portfolio` Supabase storage bucket, categorized by type (images, video, audio).
- **Inline Media Selectors:** Attached media picker launchers next to the URL input fields in **Portfolio CMS** (for images), **Showreels CMS** (for poster images), **Meriter CMS** (for advanced audio commentary tracks), and **SEO CMS** (for OpenGraph sharing images), enabling direct selection of pre-uploaded media assets.
- **Showreel Poster Preview:** Added immediate image thumbnail previews underneath the poster URL input boxes inside the Showreels list.
- **Automatic Year Sorting & Move Controls:** Configured the Merit list to sort dynamically by year (`year` descending, latest first) and then by user-controlled `sort_order`. Added up and down arrow control keys on each merit row, enabling fine-grained order tweaking of items within a single year.

### 20. Parallax Quotes Layout Alignment & Prevention of Overlaps
- **Alternating Positioning:** Configured the background citations inside `Credits.tsx` to automatically alternate between left-aligned (`left: 6%`) and right-aligned (`right: 20-24%` for rightmost items) anchors, ensuring they stay safely inside viewport bounds on all screen sizes.
- **Natural Wrapping & Max-Width Expansion:** Expanded layout boundaries to `max-w-[70vw]` and removed string truncation rules. Quotes now wrap naturally to multiple lines with a tight `leading-[1.15]` format, ensuring that last words are never clipped or hidden from view.
- **Vertical Spacing & Translation Clamping:** Standardized vertical separation values and clamped the range of motion (reduced vertical travel range in Framer Motion transforms) to guarantee citations never collide vertically.

### 21. Translation Deep-Clone Function Preservation
- **Custom deepClone implementation:** Replaced `JSON.parse(JSON.stringify(...))` inside `src/routes/index.tsx` with a custom recursive cloning helper. This prevents Javascript/TypeScript functional attributes inside translation dictionaries (such as `t.contact.okBody`) from being silently omitted, resolving a React crash upon contact form submission.

### 22. Custom Cursor Support for Touch-Enabled Laptops
- **Dual pointer detection:** Refactored touch detection in `Spotlight.tsx` to check for `any-pointer: fine` rather than just `pointer: coarse`. This allows the beautiful custom cursor dot to be rendered on touch-enabled laptops (which have both a touchscreen and a mouse/touchpad pointer).
- **CSS cursor synchronization:** Adjusted `@media` queries in `src/styles.css` so that the default browser cursor is only restored on pure touch devices (phones/tablets) and stays hidden on touch-enabled laptops. This avoids both cursor duplication and invisible cursor issues on touchscreen laptops, while leaving the admin backstage panel's native cursors fully working.

### 23. CMS Loading Indicators
- **Asynchronous loading spinner wrappers:** Introduced `isLoading` states and conditional spinner rendering in `DashboardBio.tsx` and `DashboardVoice.tsx`. This avoids displaying fallback/original hardcoded settings in input forms while Supabase requests are in flight, removing visual mount-flickering.

### 24. Showreel-laddningshantering och Teaterläge-fallback
- **Felsäker laddningsstatus:** Skapade ett `dbLoaded`-tillstånd i `src/routes/index.tsx` för att spåra datahämtningens livscykel från Supabase. Det motverkar oväntade renderingar medan anropen pågår.
- **Miljöoberoende fallback:** Om hemsidan körs i en miljö utan konfigurerad Supabase (t.ex. lokalt eller under demo-granskning utan `.env`-miljövariabler), faller gränssnittet direkt tillbaka på de inbyggda mock-showreel-videorna, vilket gör att "Teaterläge" (Theater Mode) alltid går att visa och testa.
- **Rensningssynk:** Om databasen är ansluten men har tömts helt på showreels i CMS, döljs sektionen sömlöst från startsidan istället för att visa raderade mock-data.

### 25. Bildkomprimering & SEO-varningar i Backstage CMS
- **ImageUploadOptimizer-komponent:** Skapat en återanvändbar optimerings- och valideringsmodul (`ImageUploadOptimizer.tsx`) som körs lokalt i webbläsaren vid bilduppladdning. Den använder HTML5 Canvas för att skala ner bilder till sektionens rekommenderade maxgränser och konvertera dem till det moderna **WebP**-formatet (eller JPEG för SEO social delningsbild) med 82% kvalitet.
- **Prestandajämförelse & SEO-råd:** Visar originalfilens egenskaper (upplösning, filstorlek, typ) sida-vid-sida med den komprimerade versionen, beräknar storleksbesparingar (ofta 90-98%) och flaggar tunga bilder med varningar. Visar sektionsspecifika SEO-riktlinjer och tips för alt-text baserat på `docs/images.md`.
- **Global integration i Backstage:** Integrerat optimeraren i samtliga fyra bildkällor i CMS:
  - `DashboardMedia.tsx` (Mediebibliotek)
  - `DashboardPortfolio.tsx` (Galleri / Portfolio)
  - `DashboardShowreels.tsx` (Showreel Poster)
  - `DashboardSeo.tsx` (OpenGraph Delningsbild)
- **Flexibla uppladdningsval:** Låter redaktören välja mellan att ladda upp den optimerade WebP-filen för bästa SEO-prestanda eller ladda upp originalfilen oförändrad om så önskas.

### 26. Utökade Länkar och Anpassade Ikoner i Kontakt-sektionen (Akt VII)
- **Fler Standardkanaler:** Lagt till fullt stöd för **YouTube** och **X (Twitter)** i kontaktlänks-sektionen med skräddarsydda, högupplösta varumärkes-SVG-ikoner.
- **Valbara Ikoner för Anpassade Länkar:** Lagt till en ny funktion i CMS:et för att kunna välja bland en uppsättning fördefinierade ikoner för de två anpassade länkarna (t.ex. Glob/Webbplats, Video, Pris, Portfölj, Musik/Röst, E-post, Telefon eller standardlänk).
- **Säker villkorlig rendering:** Uppdaterat kontaktsidan så att alla sociala medier samt externa/anpassade länkar döljs helt från layouten om fälten lämnas tomma, vilket förhindrar trasiga länkar och tomma ikoner.

### 27. Bild- & Laddningsoptimering för Portfölj
- **Målupplösning vid kompilering:** Justerat målbredden för Astro-byggda portföljbilder i `src/pages/index.astro` från `1000px` till `600px`. Detta gör att de färdiga bildfilerna i `_astro/` matchar de faktiska visningsdimensionerna i layouten, vilket höjer Google PageSpeed-poängen på mobil och minskar onödig nedladdningsvikt.
- **Dual-Upload med högkvalitativ originalnedladdning:** Konfigurerat CMS-gränssnittet (`DashboardPortfolio.tsx`) och databasschemat (`portfolio_images`) för att stödja en separat `download_url`. När du laddar upp en bild skapas en lättviktig WebP-version för visning, medan den orörda, högupplösta originalbilden sparas separat och länkas till nedladdningsknappen för castare.
- **Säker SQL-migrering:** Lagt till ALTER TABLE-skript och uppdaterat det kompletta schemat för att inkludera `download_url TEXT` i Supabase.
- **SSR- & Klient-mappning:** Uppdaterat datahämtningen på både servernivå (Astro SSR i `supabase-server.ts`) och klientnivå (`index.tsx`) för att skicka vidare nedladdningslänken.

### 28. Svensk namngivning för mediamappar
- **Lokalisering till svenska:** Justerat namnen på mapparna i mediebiblioteket från engelska till svenska i gränssnittet och API-förfrågningarna (`Credits` -> `Meriter`, `Curtain` -> `Ridåfall`, `Voice` -> `Röst`, `General` -> `Allmänt`, `Hero` -> `Akt I (Hero)`).
- **Synkroniserad lagring:** Säkerställt att mapparna matchar Supabase-databasschemat och lagringsstrukturen för att undvika filförlust.

### 29. Återställd och utökad SEO-bildinmatning
- **Återställda SEO-fält i Portfölj-CMS:** Lagt tillbaka inmatningsfält för alt-text, title-tagg, bildtext (caption) och sökoptimerat filnamn i `DashboardPortfolio.tsx` som tidigare raderats.
- **SEO-rendering på front-end:** Kopplat fälten (`alt`, `title`, `filename`, `caption`) på startsidan och i galleriet (`Portfolio.tsx`, `Voice.tsx` och `Footer.tsx`) så att webbläsare och sökmotorer får fullständig tillgång till SEO-metadata.
- **Högkvalitativ nedladdning:** Nedladdningsknappen i portföljen använder nu det sökoptimerade filnamnet för nedladdade pressbilder.

### 30. Synkronisering av ASCII-namngivna mediamappar
- **ASCII-sökvägar i bakgrunden:** Standardiserat Supabase Storage-mappsökvägar till ren ASCII (`voice`, `curtain`, `credits`, `general`) för att helt förhindra "Invalid key"-felmeddelanden (statuskod 400) vid bilduppladdning från gränssnittet.
- **Lokalisering och etiketter:** Implementerat en global `folderLabels`-ordlista som översätter ASCII-nycklarna till vackra svenska etiketter ("Röst", "Ridåfall", "Meriter", "Allmänt") på alla ställen i gränssnittet och medieplockaren.

### 31. Åtgärdad dropdown-matchning för att flytta filer
- **ASCII-baserad select-matchning:** Uppdaterat flytta-mapp-dropdowns och flikfilter att arbeta direkt med ASCII-nycklar. Detta löser problemet där uppladdade filer felaktigt tolkades ligga i "Roten" (vilket hindrade flytt till Roten) och gör flytt av filer helt driftsäkert och användarvänligt.

