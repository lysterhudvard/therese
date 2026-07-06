# Bild- & SEO-guide — theresejarvheden.se

Detta dokument är en guide för redaktörer och testare som hanterar bilder och media via Backstage CMS. Den visar vilka bildstorlekar, proportioner (aspect ratios) och filformat som rekommenderas för varje enskild sektion på hemsidan, samt hur du optimerar bilderna för sökmotorer (SEO/AEO).

---

## 📸 Bildstorlekar per sektion

Följande tabell visar de optimala specifikationerna för varje sektion:

| Sektion / Akt | Funktion | Rekommenderat format (Aspect Ratio) | Rekommenderad upplösning (px) | Max filstorlek |
| :--- | :--- | :--- | :--- | :--- |
| **Akt I: Hero (Nu aktuell)** | Stor bakgrundsbild i sajtens topp | Liggande (16:9 / 21:9) | `2000 × 1125` eller `2560 × 1440` | ~300 KB |
| **Akt II: Biografi (Moods)** | Porträttbilder för Dramatisk/Komisk/Klassisk | Stående (3:4 eller 4:5) | `1000 × 1333` eller `1000 × 1250` | ~150 KB |
| **Akt III: Portfolio Bilder** | Bilder i det horisontella bildgalleriet | Flexibelt (Kombination av 16:9 / 3:4) | `1200 px` på längsta sidan | ~150 KB |
| **Akt IV: Showreels (Poster)** | Stillbild som visas innan videon startas | Widescreen (21:9 eller 16:9) | `1920 × 820` (21:9) eller `1920 × 1080` (16:9) | ~200 KB |
| **Akt V: Meriter (Miniatyr)** | Liten presentationsbild per meritrad | Liggande (16:9) | `600 × 338` | ~50 KB |
| **Akt VI: Röst (Banner)** | Bakgrunds- eller sidobild för röstsektionen | Kvadratiskt eller stående (1:1 / 4:5) | `1000 × 1000` eller `1000 × 1250` | ~150 KB |
| **SEO: Delningsbild (OG Image)** | Bilden som visas när sajtlänken delas | Socialt landskap (1.91:1) | `1200 × 630` | ~250 KB |

---

## ⚡ Filformat & Komprimering

För att säkerställa att webbplatsen laddar blixtsnabbt (vilket är en avgörande SEO-rankingfaktor för Google) bör alla bilder komprimeras och konverteras till moderna webbformat innan de laddas upp i **Mediebiblioteket**.

### 1. Rekommenderade format
* **WebP (`.webp`)** — **Bästa valet för nästan alla bilder.** Det ger 30 % högre komprimering än JPEG med bibehållen bildkvalitet.
* **JPEG (`.jpg` / `.jpeg`)** — Bra fallback för fotografier om du inte kan exportera till WebP. Se till att spara med "spara för webben" (kvalitet 70–80%).
* **PNG (`.png`)** — Använd **endast** för bilder med transparent bakgrund (t.ex. logotyper). PNG-filer är betydligt tyngre än WebP/JPEG och sänker sajtens prestanda om de används för vanliga foton.

### 2. Verktyg för komprimering
Innan du laddar upp en bild i CMS, kör den genom något av följande gratisverktyg för att reducera filstorleken utan att förlora synbar kvalitet:
* **TinyPNG / TinyJPG** (https://tinypng.com) — Automatisk komprimering av WebP, PNG och JPEG.
* **Squoosh** (https://squoosh.app) — Googles egna webbverktyg där du kan beskära, ändra storlek och konvertera bilder direkt i webbläsaren.

---

## 🔍 SEO & Tillgänglighet (Alt-text)

En **Alt-text** (alternativ text) är en textbeskrivning av en bild som läses upp av skärmläsare för synskadade besökare, och som indexeras av sökmotorernas sökrobotar (t.ex. Googlebot).

### Regler för att skriva bra Alt-texter:
1. **Var beskrivande och specifik:** Beskriv exakt vad bilden föreställer.
   * *Dålig alt-text:* `alt="bild"` eller `alt="Therese"`
   * *Bra alt-text:* `alt="Skådespelerskan Therese Järvheden i ett dramatiskt porträtt i svartvitt"`
2. **Inkludera sökord naturligt:** Använd relevanta sökord som `"skådespelerska"`, `"Therese Järvheden"`, `"portfolio"`, men undvik att rada upp ord (s.k. keyword stuffing).
   * *Bra exempel:* `alt="Teaterproduktion med Therese Järvheden på scen i Stockholm"`
3. **Skriv som en vanlig mening:** Skriv på det språk som sidan visas på. I vårt CMS sparar vi alt-texter under portfoliosektionen för att hjälpa sökmotorerna att förstå bildens kontext.
4. **Undvik orden "Bild på" eller "Foto av":** Sökmotorerna och skärmläsarna vet redan att det är en bild. Gå direkt på motivet.
   * *Undvik:* `alt="Foto av Therese Järvheden"`
   * *Använd:* `alt="Therese Järvheden ler under en utomhusfotografering"`

---

## 🚀 Prestanda & LCP-optimering (Largest Contentful Paint)

* **Eager Loading på Hero-bilden:** Sajtens första bild (Hero-bilden på Therese) laddas direkt vid sidöppning med `loading="eager"` och `fetchpriority="high"`. Ladda inte upp onödigt tunga filer här (max 300 KB) eftersom det påverkar sajtens upplevda laddningstid negativt.
* **Lazy Loading på övriga bilder:** Alla bilder längre ner på sidan (Biography, Portfolio, Showreels) använder automatisk `loading="lazy"`. De laddas bara in när besökaren scrollar ner till dem, vilket sparar data och gör det första sidbesöket mycket snabbare.
