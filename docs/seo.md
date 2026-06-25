# SEO + GEO Deep-Dive — theresejarvheden.se

Note on the current site: `theresejarvheden.se` is live but built on a Webnode
template — minimal HTML, no `<title>`/meta/schema worth speaking of, images
served from a generic CDN with no alt text, no canonical, no sitemap, no `H1`
text (the "Om Therese" is the only heading). It is effectively invisible to
Google and AI engines today. Semrush has zero indexed keywords for the domain,
confirming this. The plan below assumes a rebuild on a crawlable stack (Next.js,
Astro, or the current TanStack Start template).

## 1. Competitor landscape (Sweden, database: se)

Source: Semrush, .se database.

| Site                  | Org. keywords (SE) | Est. traffic      | What works                                                                                                                                                        |
| --------------------- | ------------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| commercialactors.com  | 198                | ~3,000/mo         | Individual `/en/{actor-slug}` profile pages, bilingual (SE/EN), each profile is a crawlable HTML page with showreel + CV                                          |
| schultzbergagency.com | 125                | ~2,400/mo         | Clean `/{firstname-lastname}/` URLs, downloadable CV PDF (Malou Marnfeldt CV alone pulls 5.8% of all traffic — PDFs rank), individual actor pages dominate top 10 |
| stockholmsgruppen.com | 115                | ~1,900/mo         | Strong brand anchor + `/become-a-model` resource page; site-wide consistent template                                                                              |
| hammarstromagency.com | (small)            | n/a in SE top 100 | Grid-of-actors layout, minimal per-actor content — a weakness Therese can beat                                                                                    |

Patterns the winners share:

- One **dedicated, indexable URL per actor** with the actor's name in the slug
  and `<title>`.
- **Showreel embedded via Vimeo/YouTube `<iframe>`** (not background video) —
  gets picked up for Video SERP.
- **CV is real HTML** (or a parallel PDF). Image-of-CV is invisible to crawlers
  and AI.
- **Headshot has descriptive `alt` + filename** (`anna-svensson-headshot.jpg`,
  not `IMG_3421.jpg`).
- Agency wraps each actor in a `Person` schema with `sameAs` to IMDb.

Therese's competitive opening: she ranks #1–#10 for her own name today only via
Instagram/Facebook/IMDb (Semrush KD 28). Her own site is nowhere. Owning her
brand SERP is fast and cheap.

## 2. Keyword + intent map (Sweden)

Branded (high-priority, low-effort):

| Keyword                          | Vol/mo | KD |
| -------------------------------- | ------ | -- |
| therese järvheden                | 480    | 28 |
| therese järvheden skådespelerska | <10    | —  |
| therese järvheden imdb           | <10    | —  |
| therese järvheden röst           | <10    | —  |

Industry / casting-director intent:

| Keyword                       | Vol/mo | KD  | Notes                                                         |
| ----------------------------- | ------ | --- | ------------------------------------------------------------- |
| svenska skådespelerskor       | 1,900  | 26  | Wikipedia-dominated, list intent — hard                       |
| svensk skådespelerska         | 1,900  | 22  | Same — long-tail in, not direct                               |
| röstskådespelare              | 480    | 15  | Achievable cluster                                            |
| svenska röstskådespelare      | 140    | low | Easy to enter                                                 |
| voice over svenska            | 140    | 9   | Commercial intent, $3.10 CPC                                  |
| showreel                      | 170    | 13  | Educational/category                                          |
| schultzberg agency            | 110    | 21  | Capture via "Therese Järvheden – Schultzberg Agency" mentions |
| skånsk dialekt skådespelare   | n/a    | —   | Zero competition niche — Therese's USP (skånska)              |
| skådespelare agentur          | 30     | 0   | Trivial                                                       |
| casting sverige               | 30     | 22  | —                                                             |
| hur blir man röstskådespelare | 30     | low | FAQ / AEO opportunity                                         |

Strategic insight: head terms ("svensk skådespelerska") are owned by Wikipedia,
IMDb, MovieZine — not winnable. Win on (a) brand SERP, (b) skill+dialect
long-tail ("skånsk röstskådespelerska", "voice over skånska", "svensk röst
dubbning kvinna"), (c) credit/title long-tail ("en våldsam kärlek skådespelare",
"karatefylla skådespelare", "Beck Utan uppsåt Nora skådespelare") — these latch
onto existing search demand for her productions.

## 3. Technical + entity blueprint (GEO/AEO)

### URL structure

```
/                       (Home — bio + hero showreel)
/cv                     (Full credits — HTML, parseable)
/showreels              (Drama, Comedy, Voice — each with embedded video)
/voice                  (Voice samples + skånska USP)
/foton                  (Press/headshot gallery, hi-res download)
/press                  (Interviews, reviews, press kit PDF)
/kontakt                (Agency contact + direct)
/en/...                 (English mirror — international casting)
```

Use real routes, not anchor links (`/#cv`). Each page needs its own `<title>`,
meta description, canonical, og:image.

### HTML semantic hierarchy (per page)

```
<h1>Therese Järvheden — Skådespelerska & Röstskådespelare</h1>
<h2>Aktuellt</h2>
<h2>Filmografi</h2>
  <h3>Film</h3>
  <h3>TV</h3>
  <h3>Teater</h3>
  <h3>Röst & Dubbning</h3>
<h2>Showreels</h2>
<h2>Kontakt</h2>
```

One `<h1>` per page. CV entries inside `<table>` or `<ul>` — not as images.

### JSON-LD Person schema (paste in `<head>` of `/`)

```json
{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Therese Järvheden",
    "alternateName": "Therese Järvheden Persson",
    "jobTitle": "Skådespelerska, Röstskådespelare",
    "description": "Svensk skådespelerska och röstskådespelare. Aktuell i SVT:s En våldsam kärlek. Skånsk dialekt.",
    "url": "https://www.theresejarvheden.se",
    "image": "https://www.theresejarvheden.se/img/therese-jarvheden-headshot.jpg",
    "gender": "Female",
    "nationality": "Swedish",
    "knowsLanguage": ["sv", "en"],
    "sameAs": [
        "https://www.imdb.com/name/nm5098431/",
        "https://commercialactors.com/en/therese-jarvheden",
        "https://schultzbergagency.com/therese-jarvheden/",
        "https://www.instagram.com/theresejarvheden/",
        "https://www.facebook.com/therese.jarvhedenfdpersson",
        "https://sv.wikipedia.org/wiki/Therese_Järvheden"
    ],
    "knowsAbout": [
        "Acting",
        "Voice acting",
        "Dubbing",
        "Skånska dialect",
        "Comedy",
        "Drama"
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
        { "@type": "Movie", "name": "Beck – Utan uppsåt" }
    ]
}
```

Add `BreadcrumbList` on subpages and `VideoObject` schema per showreel:

```json
{
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "Therese Järvheden — Drama Showreel 2025",
    "description": "Drama-scener från SVT En våldsam kärlek, Beck Utan uppsåt m.fl.",
    "thumbnailUrl": "https://www.theresejarvheden.se/img/showreel-drama-thumb.jpg",
    "uploadDate": "2025-09-01",
    "contentUrl": "https://player.vimeo.com/video/xxxxxxxxx",
    "embedUrl": "https://player.vimeo.com/video/xxxxxxxxx",
    "duration": "PT2M45S"
}
```

### Image + video SEO

- Filenames: `therese-jarvheden-headshot-2025.jpg`, not CDN hashes.
- `alt`: descriptive Swedish — "Therese Järvheden, svensk skådespelerska,
  porträtt 2025".
- Serve `<picture>` with WebP + JPEG fallback, width/height set,
  `loading="lazy"` below the fold, eager on hero.
- Hi-res versions reachable at stable URLs (casting directors download them —
  that's a feature, not a leak).
- Showreels: host on Vimeo (better metadata) or YouTube, embed via `<iframe>`.
  Add `VideoObject` schema. Mirror the same description in the page body —
  Google does not read the iframe.
- Provide an `ImageObject` schema on the headshot so AI Overviews can pull the
  right photo.

## 4. Content + AEO strategy

### Parseable CV block (drop into `/cv`)

```html
<h2>Filmografi</h2>
<table>
    <thead>
        <tr>
            <th>År</th>
            <th>Titel</th>
            <th>Roll</th>
            <th>Regi</th>
            <th>Produktion</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>2025</td>
            <td>En våldsam kärlek</td>
            <td>Huvudroll</td>
            <td>—</td>
            <td>SVT</td>
        </tr>
        <tr>
            <td>2023</td>
            <td>Karatefylla</td>
            <td>—</td>
            <td>—</td>
            <td>SVT</td>
        </tr>
        <tr>
            <td>2022</td>
            <td>Beck – Utan uppsåt</td>
            <td>Nora (lärare)</td>
            <td>—</td>
            <td>Filmlance</td>
        </tr>
        <tr>
            <td>—</td>
            <td>Familjen Valentin</td>
            <td>Mamman (röst/dubb)</td>
            <td>—</td>
            <td>—</td>
        </tr>
    </tbody>
</table>
```

Tables + the `Person.performerIn` schema is what lets Gemini / Perplexity / AI
Overviews answer "What has Therese Järvheden been in?" with a clean list and a
citation back to the site.

### FAQ block (`<h2>Vanliga frågor</h2>` + FAQPage schema)

Suggested Q&A, each answered in 40–60 words (AI Overview sweet spot):

1. **Vem är Therese Järvheden?** — One-sentence definition + one credit
   sentence. Wins "vem är"-style entity queries.
2. **Vilka serier och filmer har Therese Järvheden varit med i?** — List the
   four flagship credits inline. Direct competitor to IMDb scrape.
3. **Vilken dialekt talar Therese Järvheden?** — "Skånska, samt rikssvenska och
   engelska." Anchors the dialect long-tail nobody else owns.
4. **Hur kontaktar man Therese Järvheden för casting?** — Agent email + direct
   voice email. Conversion-critical.
5. **Är Therese Järvheden röstskådespelare?** — Yes, with two examples (Familjen
   Valentin, reklamröster). Anchors the röstskådespelare cluster.

Wrap as `FAQPage` JSON-LD. Put the same Q&A in visible HTML — schema without
visible content gets ignored.

## 5. Launch-day Search Console checklist

Do all of these the day the new site is published:

- [ ] Verify property in GSC (DNS TXT preferred over HTML tag — survives
      redesigns)
- [ ] Submit `sitemap.xml` (must list every route incl. `/cv`, `/showreels`,
      `/voice`, `/foton`, `/press`, `/kontakt`, `/en/*`)
- [ ] Submit `robots.txt` — confirm it does **not** contain `Disallow: /`
      (current Webnode often blocks)
- [ ] URL Inspection → "Request indexing" for `/`, `/cv`, each showreel page
- [ ] Confirm `hreflang` if you publish `/en/*` (`sv-SE` ↔ `en`)
- [ ] Rich Results Test for the Person + VideoObject + FAQPage schemas (zero
      errors)
- [ ] Mobile-Friendly Test on `/` and `/cv`
- [ ] PageSpeed Insights: LCP < 2.5s (hero image is the usual offender — serve
      WebP, set width/height)
- [ ] Coverage report 48h later: every submitted URL = "Indexed"
- [ ] Set up GSC → BigQuery export or weekly email so you see queries from day
      one
- [ ] In Bing Webmaster Tools: import GSC property (Bing → IndexNow → ChatGPT
      search visibility)
- [ ] Add the site URL to her IMDb "Official Sites", Schultzberg Agency profile,
      Commercial Actors profile, Instagram bio, Facebook page (these `sameAs`
      backlinks are what tie the entity together for Google's Knowledge Graph)
- [ ] Create / claim a Wikidata item for "Therese Järvheden" linking IMDb ID +
      official site (Wikidata feeds the Knowledge Panel)

## 6. Things you didn't ask about but matter

**Current site audit (theresejarvheden.se today):**

- No `<title>` keyword (just default Webnode chrome).
- No meta description.
- Images from `a6c2528650.clvaw-cdnwnd.com` — third-party CDN, no alt, no
  semantic filename. **None of these images can rank in Google Images.**
- No `<h1>` containing "Therese Järvheden" — "Om Therese" is the only heading.
- Email link in HTML reads `jonas@schultzbergagency.com` but `href` points to
  `jonas@commercialactors.com` — bug, fix on rebuild.
- Single-page layout with no internal links means crawl depth = 1, link equity
  has nowhere to flow.
- No Open Graph tags → links shared on WhatsApp/LinkedIn/Slack look broken.

**Entity authority quick wins (do these even before the rebuild):**

1. Create a Swedish Wikipedia stub (3–4 sentences, cited to SVT + Kristallen
   nomination) — single biggest Knowledge-Graph lever.
2. Update IMDb with "Official Sites" → theresejarvheden.se.
3. Ask Schultzberg + Commercial Actors to add an outbound link to her official
   site from her agency profile.
4. Get one press piece (Resumé, Sydsvenskan, Aftonbladet Nöje) with a hyperlink
   to the official URL — single news backlink usually triggers Google to index a
   new site within days.

**AI engine specifics:**

- Perplexity and ChatGPT browse heavily favor sites with clean
  `<article>`/`<table>` markup and FAQ schema. The CV table above is built for
  this.
- Google AI Overviews prefer pages where the answer is in the first 200 words.
  Open every section with a one-sentence definition.
- Multimodal AI Overviews pick images with matching `alt`, schema `ImageObject`,
  and stable URLs — the headshot setup above is built for this.

**Tech stack note:** Webnode is the bottleneck. The biggest single SEO
improvement is moving off it. The current TanStack Start template in this
Lovable project is a fine target — every recommendation above maps cleanly to
file-based routes + per-route `head()` + JSON-LD via `scripts` in the route's
`head()`.

---

If you want, the next step is to scaffold the rebuild in this Lovable project:
route files for `/`, `/cv`, `/showreels`, `/voice`, `/foton`, `/press`,
`/kontakt`, with the Person + VideoObject + FAQPage schemas wired in and a
sitemap.xml/robots.txt ready for launch day.
