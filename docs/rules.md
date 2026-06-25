# AI Coding Agent Instructions & Constraints

## 1. Context & File Management Constraints

- **Hard File Limit:** Never create or expand any single file past 400 lines of
  code. If a file approaches this limit, stop and plan a refactoring strategy to
  break it into modular sub-components.
- **No Code Truncation:** Never output code containing placeholders like
  `// TODO: Rest of the code here` or `// ... existing logic ...`. You must
  output the entire modified block or file fully written out.

## 2. Scope & Modification Constraints

- **Strict Task Isolation:** Modify _only_ the specific lines of code required
  to fulfill the user's prompt. Do not reformat, refactor, or touch adjacent or
  unrelated files unless explicitly instructed.
- **No Spontaneous Abstractions:** Prioritize simple, readable, copy-pasteable,
  and idiomatic code over complex architectural patterns. Do not create new
  utility functions or wrapper components unless the same logic is repeated in
  at least three distinct places.
- **Check Existing Assets:** Before writing a utility or custom UI element,
  search the codebase (`/utils`, `/components`, etc.) to see if a matching
  solution already exists.

## 3. Code Correctness & Common AI Pitfalls

- **No Blind Agreements (Anti-Sycophancy):** If the user proposes a solution,
  architecture, or fix that introduces security flaws, performance degradation,
  or violates project patterns, you are required to object and suggest the
  correct approach.
- **Defensive Error Handling:** You must write explicit try/catch blocks, handle
  null/undefined states proactively, and define type-safe interfaces. Do not
  assume APIs or database queries will always succeed.
- **Silent Failure Prevention:** Ensure your functions return explicit
  success/error states or logs. Avoid state mutations that run completely in the
  background without user or system feedback.

## 4. Verification Workflow

Before declaring a task complete, you must mentally or via terminal execution
(if tool access is available):

1. Run linting/formatting checks (`npm run lint` / `pnpm lint`).
2. Verify all TypeScript types compile perfectly without `any` overrides.
3. Review your own changes line-by-line specifically looking for missing access
   controls or input sanitization flaws.

## 5. Performance & Core Web Vitals Enforcement

- **Zero CLS (Cumulative Layout Shift):** Every `<img>`, `<video>`, and skeleton
  fallback container _must_ have explicit `width` and `height` attributes, or
  utilize a Tailwind/CSS `aspect-ratio` layout. Never let content shift
  dynamically during asset loads.
- **LCP (Largest Contentful Paint) Rules:**
  - Any image asset visible above the fold (Hero banners, main UI headers)
    _must_ use the framework's native optimized Image component and be marked
    with `priority` or `fetchpriority="high"`.
  - Do not use client-side fetching for critical above-the-fold text; render it
    server-side or statically to minimize initial blank screen time.
- **Code Splitting & Lazy Loading:** Any third-party library or heavy component
  exceeding 30kb (e.g., complex charting libraries, rich-text editors, maps,
  modals) _must_ be isolated behind a dynamic import / lazy load boundary.
- **INP (Interaction to Next Paint) Safeguards:** Never execute heavy
  synchronous data processing loops directly inside UI click/interaction
  handlers. Offload data transformations to backend endpoints, utility web
  workers, or wrap them appropriately to keep main thread response time under
  200ms.
