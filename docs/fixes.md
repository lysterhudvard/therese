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
