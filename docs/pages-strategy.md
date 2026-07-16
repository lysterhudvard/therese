Here is the adjusted SEO strategy, completely stripped of the
international/English SEO requirements.

I have also added a new **Section 4** specifically addressing how you should
handle your existing JavaScript language toggle now that we are focusing 100% on
the Swedish market.

---

Since the site is already built in Astro, you are in the absolute best technical
position possible. Astro is statically generated, ships zero unnecessary
JavaScript by default, and boasts perfect Core Web Vitals (which Google loves).

However, staying as a one-pager is an SEO bottleneck. Search engines and AI
models rank pages based on specific search intents, not entire websites. If
everything is on one page, Google has to guess if the page is about her acting
CV, her voice-over services, or her relationship with Thomas Järvheden.

By splitting the site into targeted pages, you allow each URL to aggressively
target a specific keyword cluster and intent. Here is the strategy for
transitioning your Astro one-pager into a multi-page SEO powerhouse, focusing
entirely on dominating the Swedish search market.

### 1. The Multi-Page Architecture (How to Think About URLs)

When creating these files in your Astro `src/pages/` directory, think of each
page as a "container" for a specific search intent.

**Page 1: The Brand Anchor**

- **URL:** `/` (`index.astro`)
- **Primary Search Intent:** "Vem är Therese Järvheden?", "Thomas Järvheden
  fru", Dual-entity disambiguation.
- **Title Tag:** `Therese Järvheden | Skådespelerska & Röstskådespelare`
- **What goes here:**
  - Hero section with her main drama showreel.
  - "Aktuellt just nu" (Freshness signal).
  - The highest ROI FAQs (Tabloid hijacking: _"Är Therese gift med Thomas?"_,
    and Dual Entity: _"Är detta Lyster Hudvård?"_).
  - **Schema:** The massive `Person` JSON-LD schema goes in the `<head>` of this
    page only.

**Page 2: The Data & AI Hub**

- **URL:** `/cv` (or `/filmografi`)
- **Primary Search Intent:** "Therese Järvheden filmer och tv-program", "Kärlek
  och Anarki Madeleine skådespelare".
- **Title Tag:** `CV & Filmografi – Therese Järvheden | Roller i urval`
- **What goes here:**
  - This is your GEO (Generative Engine Optimization) page.
  - Use strict, semantic HTML `<table>` for her roles.
  - Include columns for: _År, Produktion, Roll (Karaktär), Bolag/Kanal_.
  - **Crucial GEO trick:** Hyperlink the productions (e.g., "SVT") to their
    official pages to provide AI with verifiable citations.

**Page 3: The Commercial Service Page**

- **URL:** `/voice` (or `/rost`)
- **Primary Search Intent:** Commercial ($3.10 CPC) – "Voice over svenska",
  "Skånsk röstskådespelare", "Dubbning".
- **Title Tag:**
  `Röstskådespelare & Voice Over (Skånska/Svenska) | Therese Järvheden`
- **What goes here:**
  - This is a B2B sales page for casting directors.
  - Embed the 2 semantic audio files
    (`therese-jarvheden-rostprov-skanska-reklam.mp3`) using native `<audio>`
    tags.
  - Add FAQs specifically about voice acting (_"Kan man boka Therese för
    reklamröst?"_).
  - Add the client reviews/testimonials here for E-E-A-T signals.

**Page 4: The Asset Hub**

- **URL:** `/media` (or `/foton` or `/press`)
- **Primary Search Intent:** Image searches, "Therese Järvheden pressbilder",
  "Karatefylla Therese Järvheden video".
- **Title Tag:** `Pressbilder, Foton & Showreels | Therese Järvheden`
- **What goes here:**
  - This is where the 13 optimized `.webp` images live. Use Astro's `<Image />`
    component to automatically optimize them, but keep the semantic filenames.
  - Include explicit text: _"Högupplösta pressbilder för nedladdning"_.
  - Embed her viral YouTube clips (like Karatefylla) here.
  - **Schema:** `VideoObject` schemas for the embedded videos.

**Page 5: The Conversion Page**

- **URL:** `/kontakt`
- **Primary Search Intent:** "Boka Therese Järvheden", "Therese Järvheden
  agentur".
- **Title Tag:** `Kontakt & Agentur | Therese Järvheden`
- **What goes here:**
  - Clear text separating her drama representation (Schultzberg Agency) from her
    commercial representation (Commercial Actors).
  - Link to their respective websites.

### 2. How to Distribute Your Assets (Astro Implementation)

Now that you have multiple pages, do not put the same JSON-LD schema on every
page. Google wants specific schemas on specific pages.

In Astro, you likely have a `<Layout>` component (e.g., `Layout.astro`). You
should pass specific schema objects as props to the layout depending on the
page.

- **Global Layout (`Layout.astro`):** Should handle Canonical URLs (e.g.,
  `https://theresejarvheden.se/voice`), Open Graph images, and meta
  descriptions. Ensure your document language is strictly set to Swedish:
  `<html lang="sv">`.
- **Index Page (`/`):** Gets the `Person` schema and the brand `FAQPage` schema.
- **Voice Page (`/voice`):** Gets `FAQPage` schema (only for the voice FAQs) and
  `Service` schema.
- **Media Page (`/media`):** Gets `VideoObject` schemas.

### 3. The Power of Internal Linking (The "Silo" Effect)

When you break a one-pager into multiple pages, you must weave them together so
Googlebot can crawl them efficiently.

- **Header Nav:** Needs clear text links:
  `Start | CV | Röst & Voice Over | Media & Foton | Kontakt`.
- **Contextual Links:** This is where the magic happens.
  - On the homepage, write: _"Therese är även en flitigt anlitad [länk till
    /voice: röstskådespelare för skånsk voice-over]."_
  - On the media page: _"Se fullständig lista över produktioner i [länk till
    /cv: mitt CV]."_
  - **Why?** The anchor text (the clickable words) tells Google exactly what the
    target page is about.

### 4. Handling Your Existing JS Language Toggle (UX vs. SEO)

Since you already have a JavaScript language switch and we are dropping the
English SEO strategy, you do _not_ need to worry about Astro routing or
`hreflang` tags.

- **Keep it as a "Courtesy Feature":** You can leave your JS toggle exactly as
  it is. When an international casting director receives a link and clicks the
  button, the text translates for their convenience.
- **The SEO Benefit:** Because the JS toggle doesn't change the URL and the
  default server-rendered text is Swedish, Google and AI bots will _only_ see
  the Swedish version. This is exactly what we want. It perfectly concentrates
  100% of your domain authority into the Swedish search market without diluting
  it.

### Summary of the Astro Shift

Moving from an Astro one-pager to a 5-page site takes very little development
time but **10x's your SEO surface area**. By giving "Röstskådespelare", "CV",
and "Pressbilder" their own dedicated URLs, `<title>` tags, and isolated
schemas, you go from trying to rank one heavy page for 50 different keywords, to
deploying 5 sniper-precise pages that dominate their specific Swedish search
intents.
