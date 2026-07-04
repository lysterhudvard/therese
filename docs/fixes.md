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

