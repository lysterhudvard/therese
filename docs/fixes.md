# Problem Resolution Log — theresejarvheden.se

This document details critical bugs, layout errors, and interaction blocks found during development, alongside their architectural fixes.

---

## 1. Navigation Element Flash During Curtain Intro
* **Symptom:** On initial load, the navigation bar elements (Language Switcher, Desktop Links, Hamburger Menu) rendered immediately, appearing on top of the black intro curtain before it animated out of view.
* **Root Cause:** Navigation layout mounting was unsynced with the curtain’s animation states.
* **Resolution:** Delayed navigation rendering by introducing a state trigger that mounts/fades the navigation bar elements *only* after the 2.3s curtain rise sequence completes.

## 2. Horizontal Scroll Lock on Mobile/Tablet
* **Symptom:** When scrolling into the *Portfolio Bilder* (Akt III) section on a touch device, the page became jammed, locking standard vertical swipe gestures.
* **Root Cause:** Desktop horizontal scroll relies on a `sticky` container wrapper inside a `320vh` parent. Mobile browsers struggle to reconcile vertical touch swipes with fake horizontal scroll transformations.
* **Resolution:** Applied tailwind breakpoint configurations (`h-auto md:h-[320vh]` and `relative md:sticky`) to strip the sticky scrolling container from mobile. Mobile devices now render standard horizontal swiping cards (`overflow-x-auto`) while vertical page scrolls continue naturally.

## 3. Spotlight Image Blank/Dark on Touchscreens
* **Symptom:** Since the `SpotlightImage` masking coordinates are tied to mouse movement, mobile and tablet users saw pitch-black images unless they actively tapped on them.
* **Root Cause:** Touch devices lack a persistent mouse pointer position (`mousemove` events do not fire).
* **Resolution:** Implemented pointer capability checking via standard JavaScript media query matching:
  ```js
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  ```
  * On desktops, standard `mousemove` and `mouseleave` tracking is active.
  * On mobile/tablet screens, mouse event listeners are omitted. Instead, a scroll-progress listener (`window.addEventListener("scroll")`) triggers a soft sweep/glide effect across the desaturated image as the element passes through the active viewport.

## 4. Biography / Voice Image Precedence on Mobile
* **Symptom:** In Biography (Akt II) and Voice (Akt V), desaturated image columns rendered *above* their respective text sections on mobile layout collapse, disrupting readability.
* **Root Cause:** Standard flex grid layouts render items in the order they appear in the DOM.
* **Resolution:** Re-ordered columns inside the DOM so text is defined first, and added responsive layout orders:
  ```html
  <!-- Column layout shifts -->
  <div className="md:col-span-5 md:order-first">...Image...</div>
  ```
  This keeps text on top for mobile viewports, while correctly layout-ordering the desaturated imagery on the left for desktop screens.

## 5. Post-Credits Video Overlapping Scrolling Text
* **Symptom:** The interactive "Post-Credits" card in the footer blocked the rolling credits text, rendering directly over it.
* **Root Cause:** Both the scrolling list and the loop card were sharing the same layout line space.
* **Resolution:** Re-positioned the loop card relative to the scroll container. Once the footer enters the viewport, the loop card scales down and slides cleanly to the bottom-right corner, allowing the credits list to scroll up unimpeded.

## 6. Footer Subtitle Wrapping on Mobile
* **Symptom:** The footer subtitle "Therese Järvheden — Skådespelerska · Röst" wrapped onto two lines on mobile, breaking layout alignment due to wide font tracking (`tracking-[0.35em]`).
* **Resolution:** Wrapped the dot separator and the second role ("Röst" / "Voice") inside responsive hiding classes:
  ```html
  Skådespelerska<span className="hidden md:inline"> · Röst</span>
  ```
  This truncates the subtitle to a single-line string on mobile devices while displaying the full text on tablets and desktops.
