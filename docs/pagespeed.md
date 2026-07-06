Here is the extracted text and code from the PageSpeed Insights report,
structured as a Markdown file:

````markdown
# PageSpeed Insights Report

**URL Analyzed**: `https://jarvheden.lovable.app/` **Date**: Jul 6, 2026,
10:45:41 PM **Platform**: Mobile (Emulated Moto G Power with Lighthouse 13.4.0,
Slow 4G throttling)

---

## 1. Overall Scores (Rankings)

- **Performance**: 64 / 100
- **Accessibility**: 90 / 100
- **Best Practices**: 100 / 100
- **SEO**: 100 / 100
- **Agentic Browsing**: 2 / 2

---

## 2. Performance Metrics

- **First Contentful Paint (FCP)**: 2.9 s
- **Largest Contentful Paint (LCP)**: 6.0 s
- **Total Blocking Time (TBT)**: 80 ms
- **Cumulative Layout Shift (CLS)**: 0
- **Speed Index**: 10.5 s

---

## 3. Performance Diagnostics & Insights

### Render-blocking requests

**Estimated savings:** 1,930 ms Requests are blocking the page's initial render,
which may delay LCP. Deferring or inlining can move these network requests out
of the critical path.

- `lovable.app` (`/assets/styles-BiSQGwIJ.css`): 19.4 KiB, 310 ms
- `Google Fonts` (`/css2?family=...`): 1.8 KiB, 750 ms

### Improve image delivery

**Estimated savings:** 3,533 KiB Reducing the download time of images can
improve the perceived load time of the page and LCP. Recommendations include
using modern image formats (WebP, AVIF) and properly sizing responsive images.

**Identified Image Code Snippets (`clvaw-cdnwnd.com` & others):**

```html
<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt=""
    aria-hidden="true"
    class="absolute inset-0 h-full w-full object-cover pointer-events-none transition…"
    style=""
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 4"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 5"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 6"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 1"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 8"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 2"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 3"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden"
    class="h-full w-full object-cover object-[50%_25%]"
    fetchpriority="high"
    style="opacity: 1; transform: none"
>

<img
    src="https://a6c2528650.clvaw-cdnwnd.com/..."
    alt="Therese Järvheden portfolio 7"
    loading="lazy"
    class="h-full w-full object-cover"
>

<img
    alt="Komedi & Humor"
    class="absolute inset-0 w-full h-full object-cover transition-transform duration-…"
    src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&amp;f…"
>

<img
    alt="Reklam & Röst"
    class="absolute inset-0 w-full h-full object-cover transition-transform duration-…"
    src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&amp;f…"
>

<img
    alt="Drama & Scen"
    class="absolute inset-0 w-full h-full object-cover transition-transform duration-…"
    src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&amp;f…"
>

<img
    alt="Huvudshowreel"
    class="w-full h-full object-cover select-none transition duration-[1500ms] group-…"
    src="https://img.youtube.com/vi/J9_4XQiQtNk/maxresdefault.jpg"
>
```
````

### Use efficient cache lifetimes

**Estimated savings:** 462 KiB A long cache lifetime can speed up repeat visits
to your page.

- Multiple images from `clvaw-cdnwnd.com` (Cache TTL: 7d)
- Thumbnail from `YouTube` (Cache TTL: 2h)

### Forced reflow

A forced reflow occurs when JavaScript queries geometric properties (such as
offsetWidth) after styles have been invalidated by a change to the DOM state.

- **Top function call:** `/assets/index-lFYAhQ8w.js:12:123756` (Total reflow
  time: 80 ms)

### LCP Breakdown

- **Time to first byte:** 10 ms
- **Element render delay:** 8,270 ms **Element Code Snippet:**

```html
"En våldsam kärlek" — SVT dramadokumentär.
<p class="mt-3 font-display text-xl md:text-2xl text-bone/90 italic leading-snug">
```

### Network dependency tree

**Maximum critical path latency:** 878 ms Preconnect hints help the browser
establish a connection earlier in the page load. **Preconnected origins code:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
```

### Reduce unused JavaScript

**Estimated savings:** 154 KiB

- `lovable.app` (`/assets/index-lFYAhQ8w.js`): 270.7 KiB (Transfer Size)

### Minimize main-thread work

**Total Time:** 3.4 s

- Other: 1,096 ms
- Script Evaluation: 969 ms
- Style & Layout: 922 ms
- Rendering: 202 ms
- Script Parsing & Compilation: 123 ms
- Parse HTML & CSS: 39 ms

### Minify JavaScript

**Estimated savings:** 2 KiB

- `lovable.app` (`/_/5e/events.js`): 9.3 KiB

### Avoid enormous network payloads

**Total size:** 4,814 KiB Large network payloads cost users real money and are
highly correlated with long load times.

- `clvaw-cdnwnd.com`: 3,940.0 KiB
- `lovable.app` (`/assets/index-lFYAhQ8w.js`): 271.8 KiB

---

## 4. Accessibility

**Score:** 90 / 100

### Issues Discovered:

- **Background and foreground colors do not have a sufficient contrast ratio.**
- **Links rely on color to be distinguishable.**
- **Touch targets do not have sufficient size or spacing.** Touch targets with
  sufficient size and spacing help users who may have difficulty targeting small
  controls to activate the targets.

**Failing Elements (Code Snippets):**

```html
<!-- KOMMENTAR -->
<button data-hover="true" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transit…">

<!-- 2024 En våldsam kärlek KOMMENTAR Ensemble — en av fyra kvinnor SVT · Drama -->
<a href="https://www.svtplay.se/en-valdsam-karlek" target="_blank" rel="noreferrer" data-hover="true" class="grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-bon…">

<!-- KOMMENTAR -->
<button data-hover="true" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transit…">

<!-- 2023 Beck — Utan uppsåt KOMMENTAR Nora (lärare) Filmlance / C More · Drama -->
<a href="#credits" data-hover="true" class="grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-bon…">
```

---

## 5. Best Practices

**Score:** 100 / 100

- **Passed Audits:** 25
- **General Note:** Missing source maps for large first-party JavaScript.

---

## 6. SEO

**Score:** 100 / 100

- **Passed Audits:** 8

---

## 7. Agentic Browsing

**Score:** 2 / 2 These checks ensure high-quality, browsable websites for AI
agents and validate the correctness of WebMCP integrations.

```
```
