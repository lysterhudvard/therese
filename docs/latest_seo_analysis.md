Here is an unfiltered, end-to-end SEO analysis evaluating your strategy against the current live build of her new website (`http://localhost:4321/`).

---

### Strategic Evaluation: The SEO Plan vs. Current Build

**Your strategy is top-tier.** Addressing brand SERP hijacking, solving the dual-entity problem with *Lyster Hudvård*, leveraging her high-view YouTube assets, and prioritizing long-tail dialect queries over unbeatable Wikipedia head terms ("svensk skådespelerska") provides a precise roadmap to dominate her niche.

Looking at the current local build (`http://localhost:4321/`), the site has already made massive progress moving away from the old Webnode structure into a modern multi-act layout. However, to translate this design into search dominance and AI Overview (AEO) visibility, specific technical and content bridges must be built.

---

### 1. Entity & Brand SERP Defense

Google currently conflates her personal brand with tabloid coverage ("Thomas Järvheden fru") and her skincare clinic (*Lyster Hudvård*). Reclaiming her entity requires explicit signals.

* **Hijack Tabloid Traffic:** Implement Questions 11 and 12 from your FAQ plan directly into the visible FAQ section and `FAQPage` schema. Answering relationship queries directly on her official domain strips search share from *Nyheter24* and *Hänt*.
* **Disambiguate Dual Entities:** Add a discrete footer line or "Om" section note: *"Letar du efter min hudvårdsklinik? Besök Lyster Hudvård."* Include the skincare business in her `Person` schema under `sameAs`, while maintaining her primary `jobTitle` strictly as `"Skådespelerska, Röstskådespelare"`.
* **Wikidata Integration:** Instead of risking a Swedish Wikipedia stub deletion, create a **Wikidata** item linking her IMDb ID, spouse, agency, and official domain (`[https://www.theresejarvheden.se](https://www.theresejarvheden.se)`). This feeds Google's Knowledge Panel directly.

---

### 2. Technical Architecture & On-Page SEO Audit

The visual "Act" presentation (AKT I – AKT VIII) works well user-side, but requires technical scaffolding for crawlers:

* **Indexable Routes vs. Single-Page Anchors:** Ensure sub-sections like `/cv`, `/voice` (`/rost`), `/foton`, and `/kontakt` exist as real, indexable routes or fallbacks alongside the single-page scroll. Each route must render its own `<title>`, `<meta name="description">`, OpenGraph tags, and canonical URL.
* **Semantic CV Table:** Convert credits into a clean HTML `<table>` containing columns for **År**, **Titel**, **Roll/Karaktär**, **Regi**, and **Produktion**. AI crawlers (Perplexity, Gemini) parse HTML tables far more reliably than CSS grids or list blocks.
* **Audio Filenames & Markup:** For the voice section (AKT VI), use native `<audio>` elements with semantic filenames like `therese-jarvheden-rostprov-skanska-reklam.mp3` surrounded by explicit text descriptions ("Röstprov — skånsk reklamröst").

---

### 3. Schema & Structured Data Blueprint

Inject the following schema blocks in the `<head>` to ensure modern Answer Engines categorize her correctly.

#### Primary Entity (`Person` JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Therese Järvheden",
  "jobTitle": "Skådespelerska, Röstskådespelare",
  "description": "Svensk skådespelerska och röstskådespelare baserad i Malmö och Stockholm. Aktuell i SVT:s En våldsam kärlek. Skånsk dialekt.",
  "url": "https://www.theresejarvheden.se",
  "image": "https://www.theresejarvheden.se/therese-jarvheden-skadespelerska-portratt-2025.webp",
  "knowsLanguage": ["sv", "en"],
  "sameAs": [
    "https://www.imdb.com/name/nm5098431/",
    "https://commercialactors.com/en/therese-jarvheden",
    "https://schultzbergagency.com/therese-jarvheden/",
    "https://www.instagram.com/theresejarvheden/",
    "https://www.facebook.com/therese.jarvhedenfdpersson"
  ],
  "worksFor": [
    {
      "@type": "Organization",
      "name": "Schultzberg Agency",
      "url": "https://schultzbergagency.com"
    },
    {
      "@type": "Organization",
      "name": "Commercial Actors",
      "url": "https://commercialactors.com"
    }
  ],
  "performerIn": [
    {
      "@type": "TVSeries",
      "name": "En våldsam kärlek",
      "url": "https://www.svtplay.se/en-valdsam-karlek"
    },
    { "@type": "TVSeries", "name": "Karatefylla" },
    { "@type": "TVSeries", "name": "Jävla klåpare" },
    { "@type": "Movie", "name": "Beck – Utan uppsåt" },
    { "@type": "TVSeries", "name": "Kärlek & anarki" }
  ]
}

```

#### Video & Showreel (`VideoObject` JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Therese Järvheden — Showreel",
  "description": "Scener och klipp från SVT En våldsam kärlek, Beck – Utan uppsåt, Karatefylla och Jävla klåpare.",
  "thumbnailUrl": "https://www.theresejarvheden.se/therese-jarvheden-beck-utan-uppsat-nora-hd.webp",
  "uploadDate": "2025-01-01",
  "embedUrl": "https://www.youtube.com/embed/..."
}

```

---

### 4. Media Asset Optimization

Your proposed asset-naming framework is correctly formatted for ASCII compliance, keyword targeting, and image search ranking.

| Asset Type | Filename | Primary Target Keyword | Visible Context / Alt Text |
| --- | --- | --- | --- |
| **Hero Image** | `therese-jarvheden-skadespelerska-portratt-2025.webp` | therese järvheden skådespelerska | Therese Järvheden, svensk skådespelerska, porträtt 2025 |
| **Drama Photo** | `therese-jarvheden-beck-utan-uppsat-nora.webp` | Beck Utan uppsåt Nora | Therese Järvheden som Nora i Beck – Utan uppsåt |
| **Comedy Photo** | `therese-jarvheden-komedi-karatefylla-svt.webp` | Karatefylla Therese Järvheden | Therese Järvheden i komedi — Karatefylla, SVT |
| **Audio File A1** | `therese-jarvheden-rostprov-skanska-reklam.mp3` | voice over svenska skånska | Röstprov — skånsk reklamröst, Therese Järvheden |
| **Audio File A2** | `therese-jarvheden-voice-over-svenska-dubbning.mp3` | röstskådespelare dubbning | Röstprov — svensk dubbning & berättarröst |

*Note: Ensure all `.webp` image assets are backed up with standard `.jpg` fallbacks via `<picture>` elements for legacy parser compatibility.*

---

### 5. High-Leverage Off-Page Backlink Execution

1. **YouTube Channel Description Edit:** Update all 31 video descriptions on her YouTube channel (`@theresejarvheden7066`) to place `[https://www.theresejarvheden.se](https://www.theresejarvheden.se)` in the top line. This immediately passes authority from high-traffic videos (e.g., *Konferansligg* with 211k views).
2. **Agency Profile Cross-Links:** Request outbound hyperlinks to her new domain from her agency profiles on [Schultzberg Agency](https://schultzbergagency.com) and [Commercial Actors](https://commercialactors.com).
3. **IMDb Official Site Listing:** Add `https://www.theresejarvheden.se` under the "Official Sites" section on her [IMDb Profile](https://www.imdb.com/name/nm5098431/).

---

### Launch-Day Verification Checklist

* [ ] **Google Search Console:** Verify DNS TXT record, submit `sitemap.xml`, and request indexing for `/`.
* [ ] **Bing Webmaster Tools / IndexNow:** Import GSC profile to trigger immediate indexing for ChatGPT Search.
* [ ] **Rich Results Test:** Verify zero errors across `Person`, `VideoObject`, and `FAQPage` schemas.
* [ ] **OpenGraph Validation:** Test link previews on LinkedIn, WhatsApp, and Facebook to ensure headshot images render correctly.
* [ ] **Hreflang Configuration:** Confirm `sv-SE` and `en` meta tags are properly mapped for international casting queries.

Would you like to move forward with generating the exact React/Astro component code for the `FAQPage` schema and HTML table build next?