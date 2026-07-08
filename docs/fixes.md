# Problem Resolution Log — theresejarvheden.se

This document details critical bugs, layout errors, and interaction blocks found during development, alongside their architectural fixes.

---

## 1. Navigation Element Flash During Curtain Intro

- **Symptom:** On initial load, the navigation bar elements (Language Switcher, Desktop Links, Hamburger Menu) rendered immediately, appearing on top of the black intro curtain before it animated out of view.
- **Root Cause:** Navigation layout mounting was unsynced with the curtain’s animation states.
- **Resolution:** Delayed navigation rendering by introducing a state trigger that mounts/fades the navigation bar elements _only_ after the 2.3s curtain rise sequence completes.

## 2. Horizontal Scroll Lock on Mobile/Tablet

- **Symptom:** When scrolling into the _Portfolio Bilder_ (Akt III) section on a touch device, the page became jammed, locking standard vertical swipe gestures.
- **Root Cause:** Desktop horizontal scroll relies on a `sticky` container wrapper inside a `320vh` parent. Mobile browsers struggle to reconcile vertical touch swipes with fake horizontal scroll transformations.
- **Resolution:** Applied tailwind breakpoint configurations (`h-auto md:h-[320vh]` and `relative md:sticky`) to strip the sticky scrolling container from mobile. Mobile devices now render standard horizontal swiping cards (`overflow-x-auto`) while vertical page scrolls continue naturally.

## 3. Spotlight Image Blank/Dark on Touchscreens

- **Symptom:** Since the `SpotlightImage` masking coordinates are tied to mouse movement, mobile and tablet users saw pitch-black images unless they actively tapped on them.
- **Root Cause:** Touch devices lack a persistent mouse pointer position (`mousemove` events do not fire).
- **Resolution:** Implemented pointer capability checking via standard JavaScript media query matching:
  ```js
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  ```
  - On desktops, standard `mousemove` and `mouseleave` tracking is active.
  - On mobile/tablet screens, mouse event listeners are omitted. Instead, a scroll-progress listener (`window.addEventListener("scroll")`) triggers a soft sweep/glide effect across the desaturated image as the element passes through the active viewport.

## 4. Biography / Voice Image Precedence on Mobile

- **Symptom:** In Biography (Akt II) and Voice (Akt V), desaturated image columns rendered _above_ their respective text sections on mobile layout collapse, disrupting readability.
- **Root Cause:** Standard flex grid layouts render items in the order they appear in the DOM.
- **Resolution:** Re-ordered columns inside the DOM so text is defined first, and added responsive layout orders:
  ```html
  <!-- Column layout shifts -->
  <div className="md:col-span-5 md:order-first">...Image...</div>
  ```
  This keeps text on top for mobile viewports, while correctly layout-ordering the desaturated imagery on the left for desktop screens.

## 5. Post-Credits Video Overlapping Scrolling Text

- **Symptom:** The interactive "Post-Credits" card in the footer blocked the rolling credits text, rendering directly over it.
- **Root Cause:** Both the scrolling list and the loop card were sharing the same layout line space.
- **Resolution:** Re-positioned the loop card relative to the scroll container. Once the footer enters the viewport, the loop card scales down and slides cleanly to the bottom-right corner, allowing the credits list to scroll up unimpeded.

## 6. Footer Subtitle Wrapping on Mobile

- **Symptom:** The footer subtitle "Therese Järvheden — Skådespelerska · Röst" wrapped onto two lines on mobile, breaking layout alignment due to wide font tracking (`tracking-[0.35em]`).
- **Resolution:** Wrapped the dot separator and the second role ("Röst" / "Voice") inside responsive hiding classes:
  ```html
  Skådespelerska<span className="hidden md:inline"> · Röst</span>
  ```
  This truncates the subtitle to a single-line string on mobile devices while displaying the full text on tablets and desktops.

## 7. Backstage Admin Panel Cursor Disappearance
- **Symptom:** While navigating backstage, the cursor disappeared entirely when hovering over non-link sections or empty card areas.
- **Root Cause:** A global custom stylesheet rule `cursor: none` hid the default pointer across all routes, only displaying the spotlight searchlight follower (which is hidden on CMS panels).
- **Resolution:** Applied inline CSS overrides to inputs, text fields, selects, textareas, and buttons under the backstage route, restoring native browser text indicator bars and hand pointers for standard admin form usability.

## 8. Database Query Crash on Empty Tables
- **Symptom:** Calling `.single()` on newly connected tables failed, throwing unhandled exceptions and crashing client rendering because the database was empty.
- **Root Cause:** Supabase client `.single()` throws an error when exactly one row is not returned.
- **Resolution:** Swapped database requests to use `.maybeSingle()` which returns `null` safely, enabling component rendering layers to load fallback assets without throwing errors.

## 9. Supabase Storage Bucket Missing Exception
- **Symptom:** Portfolio image uploads failed with a cryptic bucket error when the user tried to load headshots before creating the public `portfolio` storage container.
- **Root Cause:** The bucket didn't exist in the remote Supabase project.
- **Resolution:** Caught bucket errors explicitly and updated dashboard feedback to instruct the user to create the public `portfolio` bucket in their console, while leaving raw text URL fields as immediate override options.

## 10. Credits Upsert Foreign Key / Deletion Conflicts

- **Symptom:** Saving credit rows threw integrity errors when deleting some items while adding or modifying others.
- **Root Cause:** Performing upsert lists asynchronously simultaneously with deletion queries caused layout key index collisions.
- **Resolution:** Rewrote save functions to await deletion transactions first before running upsert listings, preserving database indexes and row orders.

## 11. NOT-NULL Column Constraint Violation on CMS Save
- **Symptom:** Saving the Biografi or Ridåfall sections threw `null value in column "quote_sv" of relation "biography" violates not-null constraint`.
- **Root Cause:** Using `.upsert()` with partial fields when updating records caused missing fields to default to null, violating PostgreSQL column constraints.
- **Resolution:** Replaced all partial table upserts with targeted `.update().eq('id', 'main')` queries, preserving existing database field values safely.

## 12. Compressed/Shrunk Sidebar Icons in CMS Panel
- **Symptom:** Navigation icons in the admin backstage sidebar were compressed, appearing smaller and distorted when the menu link text was longer.
- **Root Cause:** Flexbox container layout defaults shrank the SVGs to accommodate the longer text labels inside the navigation item container.
- **Resolution:** Added `flex-shrink-0` to the sidebar navigation icons, and standardized all sizes to a fixed `16px` using Tailwind classes.

## 13. Blank Background Quotes After Initial Save
- **Symptom:** The Scrolling Background Quotes list in the Biografi CMS appeared empty on initial load after connecting a fresh database.
- **Root Cause:** The database initialized the `review_quotes` column with an empty JSON array (`[]`), which evaluated as valid data and overwrote the fallback frontend defaults.
- **Resolution:** Modified the fetch logic to only set state if the fetched array is non-empty (`data.review_quotes.length > 0`), ensuring fallback values remain visible until explicit user overrides are saved.

## 14. Parallax Quotes Overlapping and Overflowing Offscreen
- **Symptom:** Background citations (review quotes) rendered with random left-offsets sometimes overflowed the right screen edge (clipping offscreen) and overlapped vertically or horizontally during page scroll.
- **Root Cause:** Position offsets used generic percentages (`left: ... %`) and varying scroll-delta multipliers, causing layout collision as they scrolled at different speeds.
- **Resolution:** 
  * Alternated quotes to left/right alignments (`left: 6%` or `right: 20-24%` for right-aligned items) to keep them comfortably inside viewport bounds.
  * Increased layout width boundaries to `max-w-[70vw]` and enabled natural word-wrapping (removing `whitespace-nowrap`/`truncate`), preventing any missing words/last-word clippings.
  * Added `leading-[1.15]` to ensure multi-line wraps look highly aesthetic, dramatic, and readable.
  * Separated baseline vertical offsets by at least 18% and constrained parallax drift bounds (`y` translation) to prevent vertical overlap.

## 15. Contact Form Submission Crash (TypeError: t.contact.okBody is not a function)
- **Symptom:** Submitting the contact form threw a React render crash displaying "A line is missing" error.
- **Root Cause:** In `src/routes/index.tsx`, the static translation object `I18N[lang]` was deep-cloned using `JSON.parse(JSON.stringify(...))`. This serialization process stripped out the `okBody` function property (which dynamically generates the localized thank-you message), leaving it `undefined`.
- **Resolution:** Replaced the JSON serialization clone with a custom recursive `deepClone` utility in `src/routes/index.tsx` that replicates objects and arrays while preserving functional properties intact.

## 16. Cursor Not Showing on Touchscreen-enabled Laptops (Huawei MateBook, etc.)
- **Symptom:** The cursor was completely invisible on the home page on touchscreen laptops.
- **Root Cause:** In `Spotlight.tsx`, the custom spotlight cursor dot disabled itself if `window.matchMedia("(pointer: coarse)")` matched. At the same time, the CSS rule `html, body { cursor: none; }` hid the native cursor. Since touchscreen laptops have a touchscreen (coarse pointer) but also a trackpad/mouse (fine pointer), the custom cursor dot was hidden by Javascript, and the browser cursor remained hidden because the CSS `@media (pointer: coarse)` rule was either ignored or did not restore it correctly, resulting in no cursor at all.
- **Resolution:** 
  * Updated `Spotlight.tsx` to detect `window.matchMedia("(any-pointer: fine)")` and only disable the custom cursor if no fine pointer (mouse/trackpad) is present at all.
  * Updated `src/styles.css` cursor restoration rule to `@media (pointer: coarse) and (not (any-pointer: fine))` so that the native cursor is only restored on pure mobile/tablet touch screens, while keeping the native cursor hidden and rendering the custom cursor dot on touch-enabled laptops.
  * Preserved the admin backstage cursor overrides (`.backstage-root-container { cursor: auto !important; }`), ensuring the default browser cursor continues to work flawlessly in the backstage panel.

## 17. Old Images and Text Flash in CMS Panel on Mount
- **Symptom:** Opening the "Biografi" (or "Röst") sections in the backstage CMS panel briefly flashed the hardcoded fallback defaults (old pictures and Swedish heading texts) before switching to the user-saved settings.
- **Root Cause:** States for section fields (e.g. `dramaticImage`, `headingSv`, `settings`) were initialized to the hardcoded default strings. Because fetching data from Supabase is asynchronous, the form inputs initially rendered the default states on mount until the API request completed and updated the state variables.
- **Resolution:** Introduced an `isLoading` state (initialized to `true`) in `DashboardBio.tsx` and `DashboardVoice.tsx`. When loading, a clean spinning indicator is displayed instead of the form inputs. Once the database fetch finishes, the states are populated with the correct values and `isLoading` is set to `false`, eliminating any visual flashing.

## 18. Custom Spotlight Cursor Interference with Showreel Video Controls
- **Symptom:** When hovering over the showreel video players, the custom spotlight cursor dot would float over the player's control bars, blocking mouse clicks on play/pause and timeline scrubbing, or interfering with iframe (YouTube/Vimeo) interactions.
- **Root Cause:** The custom cursor component followed the mouse position globally on the window, and its pointer-events-none layer stayed on top of HTML5 iframe click regions.
- **Resolution:** Assigned the `data-no-spotlight` attribute to the video container block. The spotlight tracker checks `e.target.closest("[data-no-spotlight]")` on hover. If matched, it sets the custom spotlight dot's visibility to `hidden` and restores standard browser pointers, allowing seamless video control usage.

## 19. Scroll Leakage in Cinematic Showreel Theater Mode
- **Symptom:** When a showreel was expanded into Cinematic Theater Mode, users could still scroll the main page behind the dark backdrop using the mouse wheel, which broke layout centering and positioning.
- **Root Cause:** Standard browser scroll behavior remained active on the document body during viewport expansion.
- **Resolution:** Added a React `useEffect` inside `Showreels.tsx` that updates the document body style to `overflow = "hidden"` when theater mode is active (`isEnlarged === true`), and restores the default scroll behavior (`overflow = ""`) when exiting.

## 20. React Hook Order Violation in Showreels
- **Symptom:** Opening the page threw a console error: `React has detected a change in the order of Hooks called by Showreels`.
- **Root Cause:** An early-return check (`if (!activeVideo || videos.length === 0) return null`) was inserted before several React hook declarations (`useRef`, `useEffect`, `useScroll`), violating the Rules of Hooks.
- **Resolution:** Relocated the conditional early-return check to the very end of the `Showreels` component function, directly before the JSX return statement, ensuring all hook sequences run unconditionally on every render.

## 21. Framer Motion Hydration Ref Error & Mock Data Flash
- **Symptom:** Initial page reload crashed with `Uncaught Error: Target ref is defined but not hydrated`, and old mock videos briefly flashed on reload even if they were deleted in the CMS.
- **Root Cause:** If the database was loading or empty, returning `null` in `<Showreels>` skipped rendering the container element bound to `useScroll({ target: sectionRef })`, causing Framer Motion to fail. Additionally, the component parameter defaulted to mock data when prop was undefined.
- **Resolution:** Modified the parent page renderer in `src/routes/index.tsx` to conditionally mount `<Showreels>` only if database data has finished loading and contains at least one active video. Reverted internal component null-state guards to keep hook sequences stable.

## 22. Close Button Screen Edge Cutoff & Header Alignment
- **Symptom:** The Close button (`X`) in Theater Mode was pushed too close to the screen ceiling, getting partially hidden. Additionally, margins for header labels (`SPELAS NU` / `SHOWREEL — THERESE JÄRVHEDEN`) did not align cleanly with the player canvas edges.
- **Root Cause:** The Close button was positioned relative to the centered player container and offset upwards, squeezing it near the viewport border, and right padding was applied to the headers to try to prevent overlaps.
- **Resolution:** Repositioned the Close button (`X`) absolute to the viewport space (`right-8 top-8 md:right-12 md:top-12 z-[110]`), moving it down and to the far right. Removed internal container offsets and paddings from the header bar, allowing the capitalized text labels to align exactly with the left and right edges of the player canvas.

## 23. Showreels Section Disappearance and Fallback Lock
- **Symptom:** The showreels section completely vanished when Supabase was not configured, making it impossible to open the player ("Teaterläge").
- **Root Cause:** A strict mount guard in `src/routes/index.tsx` hid the `<Showreels>` component when the database array was empty or undefined, forgetting that in local/preview environments without Supabase configured, the section should fall back to the default mock videos (`VIDEOS`).
- **Resolution:** Introduced a `dbLoaded` state variable tracking data load completion. If Supabase is not configured, the website immediately falls back to displaying the default mock video portfolio. If Supabase is configured, it waits for the data fetch to complete and only renders the section if the user has uploaded/saved at least one video in the CMS, properly hiding it if the list was explicitly cleared.

## 24. Broken Social Links and Missing Icon Placeholders on Empty Inputs

- **Symptom:** If the user did not set a specific social media link (like Facebook) in the database, the site would still display a broken icon pointing to a default fallback page, or show blank blocks in the contact section.
- **Root Cause:** Missing values or empty string inputs from the database were not correctly checked, resulting in broken URLs or empty anchors.
- **Resolution:** Refactored the links extractor inside `Contact.tsx` to conditionally render all social profile anchors. The component now performs strict checks (`if (field)`), ensuring only links with configured values are outputted to the page while empty values are hidden completely.

## 25. Hostinger Deployment Node Engine Warnings and Lockfile Mismatch
- **Symptom:** The Hostinger GitHub Actions CI/CD deployment failed during the dependency installation step (`npm ci`), throwing `EBADENGINE Unsupported engine` warnings (requesting Node >= 22.12.0) and a `Missing: lru-cache` package-lock discrepancy error.
- **Root Cause:** The runner was configured to execute on Node 20, whereas Astro 7 requires Node 22. Additionally, strict peer-dependency checks in `npm ci` crashed due to environment-specific lockfile resolution discrepancies.
- **Resolution:** Upgraded the Node.js setup version in `.github/workflows/deploy.yml` from `20` to `22` and replaced the strict `npm ci` installation command with `npm install` to gracefully resolve package dependencies on the fly.

## 26. FTP Deployment Domain Name Lookup Failure (getaddrinfo ENOTFOUND)
- **Symptom:** The FTP upload step in GitHub Actions failed immediately with `Error: getaddrinfo ENOTFOUND *** (control socket)` and did not connect to Hostinger.
- **Root Cause:** The `FTP_SERVER` secret in GitHub was configured with a protocol prefix (e.g. `ftp://191.101.104.182` or `ftp://ftp.theresejarvheden.se`), which caused the DNS client to treat the entire protocol string as part of the hostname, failing the resolution.
- **Resolution:** Removed the `ftp://` and `ftps://` prefixes from the GitHub Secrets configuration, leaving only the raw IP address (`191.101.104.182`) or hostname, allowing the DNS lookup to resolve correctly.

## 27. Nested public_html Subfolder Duplication on Hostinger Uploads
- **Symptom:** Files successfully uploaded over FTP, but the website remained blank or showed Hostinger's default landing page. Checking the server files showed a second `public_html` directory nested inside the main one (`public_html/public_html/...`).
- **Root Cause:** Hostinger FTP accounts created for specific domains are automatically mapped to that domain's `public_html/` root by default. Having `server-dir: ./public_html/` in the workflow config pushed the assets into a duplicate subdirectory rather than the actual web root.
- **Resolution:** Updated `.github/workflows/deploy.yml` to set `server-dir: ./`, directing files to upload directly into the FTP account's root directory, which correctly maps to the website's public web root.

## 28. Portfolio Bilder flaggade som "Oversized" i Google PageSpeed
- **Symptom:** PageSpeed-analysen klagade på att bilderna i det horisontella rullningsgalleriet var mycket större än nödvändigt för visningsytan (filstorlekar på runt `899x1200` men visades på endast `417x557` i CSS-layouten).
- **Root Cause:** I `src/pages/index.astro` var Astros inbyggda bildoptimerare inställd på att skala ner alla portföljbilder till en fast bredd på `1000px`. På grund av bildernas stående porträttformat resulterade detta i onödigt stora och tunga bildfiler för mobila enheter.
- **Resolution:** Ändrade målupplösningsparametern i `index.astro` från `1000` till `600`. Astros byggprocess skalar nu ner visningsversionerna perfekt till galleriboxens storlek, vilket dramatiskt krymper filvikten och eliminerar PageSpeed-varningarna.

## 29. Lågupplösta pressbilder vid nedladdning för castare
- **Symptom:** Castare och agenter som laddade ner pressbilder via nedladdningsknappen fick de webb-optimerade, lågupplösta WebP-filerna istället för tryckfärdiga originalbilder.
- **Root Cause:** Samma bild-URL användes till både rendering i sidans layout och till nedladdningslänken. Eftersom vi optimerade bilderna hårt för webbprestanda, blev även de nedladdade bilderna komprimerade och små.
- **Resolution:** Lagt till en ny kolumn `download_url` i tabellen `portfolio_images` i Supabase. Uppdaterat CMS-panelen så att när du laddar upp en bild laddas **både** en optimerad WebP-kopia (för snabb laddning) och den orörda originalfilen (för nedladdning) upp till lagringshinken. Frontend-knappen pekar nu direkt på originalfilen via `download_url`.

## 30. Portfolio Image Vertically Cropped / Aspect Ratio Distortion Bug
- **Symptom:** Portrait images uploaded to the portfolio section with a 3:4 aspect ratio (e.g. 460x613 px or 899x1200 px) were severely vertically cropped, cutting off the subject's head and feet. Additionally, thumbnails in the CMS dashboard list appeared distorted.
- **Root Cause:** 
  1. **Astro Image Optimizer Distortion:** In `src/pages/index.astro`, Astro's `getImage` function was used to re-optimize portfolio images by passing `width = 600`. Because no target height was provided and the source was a remote URL, Astro scaled the width to 600px but kept the original height of 1200px (resulting in a distorted 1:2 aspect ratio). The CSS `object-cover` property then chopped off the top and bottom of the distorted image to fit the 3:4 container.
  2. **CMS Thumbnail Aspect Ratio:** In `DashboardPortfolio.tsx` (and `DashboardBio.tsx`), the image previews in the list were hardcoded to landscape aspect ratios (`w-16 h-12` / `h-14 w-14`), forcing the browser to crop the top/bottom of uploaded 3:4 portraits just to display them in the CMS dashboard list.
- **Resolution:** 
  * Skipped Astro's redundant server-side re-optimization on database-sourced images (since the client-side `ImageUploadOptimizer.tsx` already formats and compresses them to WebP perfectly upon upload).
  * Redesigned the CMS list thumbnail styles to use matching vertical ratios (e.g., `w-12 aspect-[3/4]` for portfolio and `w-10 aspect-[3/4] h-auto` for biography), preventing distortion and visual cropping in the admin interface.

## 31. Persistent Placeholder Images Despite Deleting in CMS
- **Symptom:** After clearing the portfolio and deleting all images via the CMS dashboard, the default mock/placeholder photos would still render in the portfolio section.
- **Root Cause:** A multi-layered fallback system was checking if the database returned an empty array (`[]`) and, if so, dynamically injected the fallback array `IMG.portfolio`. This fallback existed in three separate places: the client-side data mapper (`src/routes/index.tsx`), the visual container mapping (`src/components/sections/Portfolio.tsx`), and the server-side rendering loader (`src/lib/supabase-server.ts`).
- **Resolution:** Removed the fallback assignment to `IMG.portfolio` in all three places. Now, if the database returns an empty array, it correctly passes `[]` all the way to the UI template, which gracefully hides the portfolio section when empty.

## 32. Configurable Credit Images and Removed Hardcoded Unsplash Fallbacks in Meriter (Credits)
- **Symptom:** Newly created credits in "Meriter" defaulted to a hardcoded Unsplash camera/film image fallback, with no input field or media picker in the CMS to edit or replace it.
- **Root Cause:** In `DashboardCredits.tsx`, the `img` field was initialized to a default Unsplash placeholder during row creation (`addCredit`) and mapped to this fallback on save (`handleSave`). No UI field existed to let the user select a different image.
- **Resolution:** Added a new `Bild-URL` input field and media picker button directly inside the credit item card in `DashboardCredits.tsx`, using `MediaPickerModal` set to image filter. Removed all hardcoded Unsplash default fallbacks from the CMS initialization and save pipeline.

## 33. Graceful Fallbacks and Layouts for Missing Posters in Showreels and Voice
- **Symptom:** When a user cleared or deleted the poster image for a showreel video or the background image for the voice section, the frontend would display broken image frames or fall back to the hardcoded `IMG.voice` asset.
- **Root Cause:** In both client/server loaders, the showreel mapping logic fell back to an Unsplash poster URL if none was set in the database, and the voice settings mapper overrode empty strings with `IMG.voice`.
- **Resolution:** Removed the hardcoded Unsplash fallback for showreels and modified the voice settings image parser in `index.tsx` to preserve empty image URLs. Updated `Showreels.tsx` to render clean, dark background layouts with generic video icons when no posters exist. Refactored both `Voice.tsx` and `Biography.tsx` to dynamically switch to a beautiful centered single-column layout when their respective section images are deleted or cleared in the CMS, preventing broken links and blank visual gaps while maintaining high-end visual aesthetics. Also set the default image URL for new custom biography sections in `DashboardBio.tsx` to a blank string `""` instead of forcing a default portrait URL.

## 34. Media Upload 'Invalid key' Error on Swedish Named Folders
- **Symptom:** Uploading files under "Röst", "Ridåfall", "Meriter", and "Allmänt" options failed with `StorageApiError: Invalid key` and status 400.
- **Root Cause:** Supabase Storage rejected paths containing non-ASCII characters (e.g. `ö` in `röst` or `å` in `ridåfall`).
- **Resolution:** Standardized backend storage folders to pure ASCII (`voice`, `curtain`, `credits`, `general`). Transformed `file.folder` assignments to keep files mapped using ASCII folders, while introducing a `folderLabels` translation helper to cleanly present the Swedish equivalents ("Röst", "Ridåfall", "Meriter", "Allmänt") in the UI.

## 35. Media Moving Dropdown Default Value and Roten Relocation Issue
- **Symptom:** When uploading a file, the "Flytta till:" select menu showed "Roten" (the root directory) as the default selection, preventing users from actually relocating the file to the root.
- **Root Cause:** The file list parsed folder paths using translated Swedish labels, but the option tags used ASCII values. Because the values didn't match, the browser fell back to selecting the first option ("Roten").
- **Resolution:** Unified the components to track and select folders strictly using ASCII keys, and mapped UI rendering tags to Swedish display strings. This aligns the select values and lets the user relocate files to "Roten" as intended.

## 36. TypeScript Import Errors from index.tsx Refactoring
- **Symptom:** Rerunning the TypeScript check crashed with multiple `TS2614` errors: `Module '"../routes/index"' has no exported member 'IMG' / 'CREDITS' / 'FilterKey' / 'MOOD_DATA'`.
- **Root Cause:** Moving all static values and typings out of `src/routes/index.tsx` into `src/routes/fallbackData.ts` broke old imports in multiple sections (`Biography.tsx`, `Credits.tsx`, `Footer.tsx`, `Hero.tsx`, `Portfolio.tsx`, `Voice.tsx`) and database helpers (`supabase-server.ts`, `supabase-sync.ts`) which still tried to fetch from `index.tsx`.
- **Resolution:** Re-pointed all instances of static variables and structural types (`IMG`, `CREDITS`, `FilterKey`, `MOOD_DATA`, `Mood`, etc.) to import from the clean `fallbackData.ts` file. Removed redundant unused imports, successfully returning compilation errors to zero (Exit code 0).

## 37. Missing Export 'CREDITS' during Hostinger Build / Deployment
- **Symptom:** Deployment failed at the `npm run build` step with a `MISSING_EXPORT` error: `[MISSING_EXPORT] "CREDITS" is not exported by "src/routes/index.tsx"` imported in `src/pages/index.astro`.
- **Root Cause:** In the initial refactoring phase, static fallback constants were moved out of `src/routes/index.tsx` into `src/routes/fallbackData.ts`. However, the root entry point `src/pages/index.astro` was still trying to import `CREDITS` from `src/routes/index.tsx` instead of `src/routes/fallbackData.ts`.
- **Resolution:** Re-pointed the `CREDITS` import in `src/pages/index.astro` to load from `../routes/fallbackData` and removed the unused `IMG` and `MOOD_DATA` import tokens, allowing the production build to compile successfully.

## 38. Biography & Credits Tab Buttons Wrapping and Distorting Layout on Mobile
- **Symptom:** On mobile screens, tab buttons ("Dramatisk", "Komisk", "Klassisk" in Biography, and merit categories in Credits) wrapped onto multiple lines. Because Biography uses an outline container with an absolute-positioned active sliding pill indicator (`moodPill`), wrapping the buttons broke the layout box bounds, text alignments, and indicator animations.
- **Root Cause:** The tab containers utilized `flex-wrap` and lacked constraints to preserve a single-line horizontal layout when screen space was restricted.
- **Resolution:** Removed the `flex-wrap` properties from the button containers in `Biography.tsx` and `Credits.tsx`, replacing them with horizontal scroll utilities (`overflow-x-auto no-scrollbar whitespace-nowrap max-w-full`). Added `flex-shrink-0` to the button elements to prevent font compression on small viewports, ensuring the buttons remain on a clean single line.
## 39. Inconsistent Section Padding, Large Spacing around Reels/Showreels Section, and Compressed Mobile Player
- **Symptom:** The vertical space (gaps) between some sections looked uneven, especially on mobile where the Reels section had a very large gap before and after it compared to other sections. Additionally, the video player aspect ratio looked extremely squished/compressed on mobile screens.
- **Root Cause:** 
  1. Section containers used mixed padding values. Some sections used `py-28 md:py-40`, others used `py-16` on mobile.
  2. The `TheaterPlayer` container had a hardcoded `aspect-[21/9]` ratio, which makes the player height extremely small on narrow vertical mobile viewports.
  3. When only one video was present, an empty selector grid container was still rendered under the video player, adding an extra `mt-12` margin-top placeholder.
  4. The scroll transitions faded sections out as early as `0.5` scroll progress, which left empty dark gaps as the page scrolled.
- **Resolution:** 
  1. Standardized vertical section padding across all sections (Biography, Portfolio mobile, Showreels, Credits, Voice, and Contact) to a consistent **`py-16`** on mobile/tablet and **`py-36`** on desktop.
  2. Adjusted the video player element to use a responsive aspect ratio (**`aspect-[16/9] md:aspect-[21/9]`**), preserving the premium ultrawide format on desktop while scaling the video height up on mobile.
  3. Added a conditional check (`displayedVideos.length > 0`) to completely omit the thumbnails grid when no additional videos exist.
  4. Deferred the scroll exit animation start threshold from `0.5` to `0.75`, keeping sections fully opaque until they are nearly scrolled off-screen.

## 40. Tablet Layout and Responsive Breakpoint Optimizations
- **Symptom:** On tablet view (768px to 1023px, typical iPad portrait sizes), multiple layout issues occurred:
  1. The navigation header displayed the full desktop list of links, which clashed with the logo and looked cluttered.
  2. The `Portfolio` section locked scroll and forced a desktop-style horizontal track, which is clumsy and unintuitive on touch tablets.
  3. Grid columns split into dual-column layouts too early (using `md:`), causing text overlay and element collisions (such as the contact form card overlapping the contact emails).
  4. Large font size clamp rules caused text to look oversized and wrap awkwardly on tablet screens.
- **Root Cause:** Responsive layout and grid columns switched from stacked mobile view to multi-column desktop formats at the `md` (768px) breakpoint instead of the `lg` (1024px) breakpoint.
- **Resolution:**
  1. **Navigation:** Shifted the menu collapse breakpoint in `Nav.tsx` from `md` to `lg`. The hamburger menu now remains active on all tablet widths, keeping the header clean.
  2. **Portfolio Scroll:** Moved the horizontal scroll-lock layout breakpoint in `Portfolio.tsx` from `md` to `lg`. Tablets now use the same natural height, touch-friendly vertical scroll as mobile devices.
  3. **Grid Layout Splits:** Postponed multi-column grid splits in `Biography.tsx`, `Voice.tsx`, and `Contact.tsx` to `lg` and above. Elements stack vertically on tablets, providing full screen width for content blocks.
  4. **Email & Heading Sizes:** Adjusted typography classes across all headings (`Showreels.tsx`, `Credits.tsx`, `Voice.tsx`, and `Contact.tsx`) to scale smoothly from mobile to tablet and desktop sizes. Added `break-all` styling to contact emails to guarantee they never overflow container margins.

## 41. Theater Player Overlay, Transition Flickering, and Navbar Heights
- **Symptom:** Three minor visual bugs occurred on mobile and tablet views:
  1. The close (`X`) button of the expanded theater video player rendered behind the fixed navigation bar, making it impossible to close the player.
  2. Brief glimpses or flashes of the underlying poster image occurred during the video loading transition when cinema mode was activated.
  3. The navbar height on mobile/tablet screens was too short, making links feel cramped.
- **Root Cause:**
  1. The overlay z-index (`z-[100]`) inside the `Showreels` nested stacking context was lower than the fixed header (`z-[70]`).
  2. The widescreen canvas container lacked a background color, and the static poster image instantly disappeared when switching branches instead of fading out smoothly.
  3. The vertical padding on the mobile/tablet navigation bar was too tight.
- **Resolution:**
  1. **Z-Index:** Raised the enlarged player overlay z-index to `z-[9999]` and the close button to `z-[99999]`. Raised the parent `Showreels` section and inner motion block to `z-[9999]` when enlarged.
  2. **Poster Transition:** Set a solid `bg-black` background on the player screen canvas and converted the static poster image to a `motion.img` that fades out smoothly over 2.2 seconds as the screen enlarges, leaving a solid black canvas behind the video fade-in.
  3. **Navbar Height:** Increased the mobile/tablet vertical padding in `Nav.tsx` from `py-3.5` to `py-5` (when scrolled) and `py-5` to `py-7` (when unscrolled), while keeping desktop heights untouched (`lg:py-3.5` / `lg:py-5`).

## 42. Mobile Landscape Staggering and Aspect Distortion Fixes
- **Symptom:** Two visual scaling bugs occurred when viewing the enlarged video player on mobile:
  1. Turning the device to landscape view stretched the player out of bounds, hiding controls.
  2. Rotating back from landscape to portrait view while a video was playing distorted the layout, exposing the underlying page content.
- **Root Cause:** In CSS, any ancestor containing a `transform`, `scale`, or `opacity` attribute (such as Framer Motion's wrappers in `Showreels.tsx`) establishes a new stacking context. This causes `position: fixed` elements to anchor relative to that container rather than the browser window viewport, making the layout break and distort during orientation shifts.
- **Resolution:**
  1. **React Portal Integration:** Refactored `TheaterPlayer.tsx` to mount the enlarged modal via a React Portal directly inside `document.body` (on the client side). This isolates the player from any container `transform` constraints.
  2. **Shared Layout Animation:** Retained Framer Motion's shared transition logic by matching the `layoutId="theater-player-canvas"` across the inline box and the portal element, resulting in clean viewport-relative scaling.
  3. **Snappy Timers:** Accelerated the layout scaling transition to a snappy `0.5s` duration, syncing the video start trigger to match.
  4. **Landscape Resilience:** Ensured that standard video player resizing and close hooks adjust dynamically to portrait/landscape viewport measurements. Added `controls` to the local HTML5 `<video>` player in enlarged mode to enable native browser playback interface.

## 43. Page Content Hiding in Enlarged Cinema Mode
- **Symptom:** Elements like the navigation header, spotlight cursors, and other page sections could bleed, flicker, or show visual overlap when the video player expanded.
- **Root Cause:** Standard overlay rendering covers background content visually, but underlying elements still draw, consuming rendering cycles and risking subpixel positioning conflicts (e.g., headers or scroll layouts peeking through at the edges of the screen).
- **Resolution:**
  - Added a DOM toggle within the `isEnlarged` layout hook inside `TheaterPlayer.tsx`.
  - When the player is active, the `<main>` root element is styled with `visibility: hidden`. Since the enlarged player mounts via React Portal directly into `document.body` (outside the `<main>` tag), it remains fully visible.
  - When closed, `<main>` visibility is restored to default. Using `visibility: hidden` hides all page contents while preserving scroll offsets, preventing jumpiness when the overlay is dismissed.
