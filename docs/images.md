# Bild- & SEO-guide — theresejarvheden.se

Detta dokument är en guide för redaktörer och testare som hanterar bilder och
media via Backstage CMS. Den visar vilka bildstorlekar, proportioner (aspect
ratios) och filformat som rekommenderas för varje enskild sektion på hemsidan,
samt hur du optimerar bilderna för sökmotorer (SEO/AEO).

---

## 📸 Bildstorlekar per sektion

Följande tabell visar de optimala specifikationerna för varje sektion:

| Sektion / Akt                    | Funktion                                     | Faktiskt format (Aspect Ratio)                                 | Faktisk visningsstorlek på hemsidan (px)                                                                                                           | Rekommenderad upplösning (px)                                                    | Max filstorlek |
| :------------------------------- | :------------------------------------------- | :------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :------------- |
| **Akt I: Hero (Nu aktuell)**     | Stor bakgrundsbild i sajtens topp            | Fullskärm (Flexibel / object-cover)                            | **Fullskärm (100vw × 100svh)**<br>• _Dator (t.ex.):_ `1920 × 1080`<br>• _Mobil (t.ex.):_ `375 × 812`                                               | `2000 × 1125` eller `2560 × 1440`                                                | ~300 KB        |
| **Akt II: Biografi (Moods)**     | Porträttbilder för Dramatisk/Komisk/Klassisk | Stående (3:4)                                                  | **Skalas efter grid (`aspect-[3/4]`)**<br>• _Dator:_ Max `460 × 614`<br>• _Mobil:_ Ca `327 × 436`                                                  | `1000 × 1333`                                                                    | ~150 KB        |
| **Akt III: Portfolio Bilder**    | Bilder i det horisontella bildgalleriet      | Stående (3:4)                                                  | **Breddlåst bildkarusell**<br>• _Dator:_ Max `460 × 613` _(visas oftast runt `417 × 557` depending on screen)_<br>• _Mobil:_ Fast `240 × 320`      | `600 × 800` eller `900 × 1200`<br>_(Astro optimerar bredd till 600px vid build)_ | ~150 KB        |
| **Akt IV: Showreels (Poster)**   | Stillbild som visas innan videon startas     | Liggande (21:9 för startsidan, 16:9 för teaterläge/miniatyrer) | **Widescreen-spelare**<br>• _Inline:_ Max `1400 × 600` (21:9)<br>• _Teaterläge:_ Max `1400 × 788` (16:9)<br>• _Miniatyrer:_ Max `466 × 262` (16:9) | `1920 × 820` (21:9) eller `1920 × 1080` (16:9)                                   | ~200 KB        |
| **Akt V: Meriter (Miniatyr)**    | Hover-bild per meritrad i listan             | Stående (3:4)                                                  | **Svävande popup-kort (enbart dator)**<br>• _Dator:_ Fast `256 × 341`<br>• _Mobil:_ Visas ej                                                       | `600 × 800` eller `450 × 600`                                                    | ~50 KB         |
| **Akt VI: Röst (Banner)**        | Sidobild för röstsektionen                   | Flexibel (Kvadratisk/Stående ~1:1 eller 4:5)                   | **Skalas efter grid/viewport**<br>• _Dator:_ Ca `960 × 972` (50vw × 90vh)<br>• _Mobil:_ Ca `375 × 487` (100vw × 60vh)                              | `1000 × 1000` eller `1000 × 1250`                                                | ~150 KB        |
| **Akt XII: Ridåfall (Miniatyr)** | Bild för post-credits scenskiss i sidfot     | Liggande (~3:2 / 1.6:1)                                        | **Animerad minispelare**<br>• _Dator (normal):_ `320 × 208`<br>• _Dator (scroll-läge):_ `112 × 80`<br>• _Mobil (normal):_ `256 × 160`              | `960 × 600` eller `600 × 400`                                                    | ~100 KB        |
| **SEO: Delningsbild (OG Image)** | Bilden som visas när sajtlänken delas        | Socialt landskap (1.91:1)                                      | **Rendreras av externa plattformar**<br>• _Facebook/LinkedIn:_ `1200 × 630`                                                                        | `1200 × 630`                                                                     | ~250 KB        |

---

## ⚡ Filformat & Komprimering

För att säkerställa att webbplatsen laddar blixtsnabbt (vilket är en avgörande
SEO-rankingfaktor för Google) bör alla bilder komprimeras och konverteras till
moderna webbformat innan de laddas upp i **Mediebiblioteket**.

### 1. Rekommenderade format

- **WebP (`.webp`)** — **Bästa valet för nästan alla bilder.** Det ger 30 %
  högre komprimering än JPEG med bibehållen bildkvalitet.
- **JPEG (`.jpg` / `.jpeg`)** — Bra fallback för fotografier om du inte kan
  exportera till WebP. Se till att spara med "spara för webben" (kvalitet
  70–80%).
- **PNG (`.png`)** — Använd **endast** för bilder med transparent bakgrund
  (t.ex. logotyper). PNG-filer är betydligt tyngre än WebP/JPEG och sänker
  sajtens prestanda om de används för vanliga foton.

### 2. Verktyg för komprimering

Innan du laddar upp en bild i CMS, kör den genom något av följande gratisverktyg
för att reducera filstorleken utan att förlora synbar kvalitet:

- **TinyPNG / TinyJPG** (https://tinypng.com) — Automatisk komprimering av WebP,
  PNG och JPEG.
- **Squoosh** (https://squoosh.app) — Googles egna webbverktyg där du kan
  beskära, ändra storlek och konvertera bilder direkt i webbläsaren.

---

## 🔍 SEO & Tillgänglighet (Alt-text)

En **Alt-text** (alternativ text) är en textbeskrivning av en bild som läses upp
av skärmläsare för synskadade besökare, och som indexeras av sökmotorernas
sökrobotar (t.ex. Googlebot).

### Regler för att skriva bra Alt-texter:

1. **Var beskrivande och specifik:** Beskriv exakt vad bilden föreställer.
   - _Dålig alt-text:_ `alt="bild"` eller `alt="Therese"`
   - _Bra alt-text:_
     `alt="Skådespelerskan Therese Järvheden i ett dramatiskt porträtt i svartvitt"`
2. **Inkludera sökord naturligt:** Använd relevanta sökord som
   `"skådespelerska"`, `"Therese Järvheden"`, `"portfolio"`, men undvik att rada
   upp ord (s.k. keyword stuffing).
   - _Bra exempel:_
     `alt="Teaterproduktion med Therese Järvheden på scen i Stockholm"`
3. **Skriv som en vanlig mening:** Skriv på det språk som sidan visas på. I vårt
   CMS sparar vi alt-texter under portfoliosektionen för att hjälpa sökmotorerna
   att förstå bildens kontext.
4. **Undvik orden "Bild på" eller "Foto av":** Sökmotorerna och skärmläsarna vet
   redan att det är en bild. Gå direkt på motivet.
   - _Undvik:_ `alt="Foto av Therese Järvheden"`
   - _Använd:_ `alt="Therese Järvheden ler under en utomhusfotografering"`

---

## 🚀 Prestanda & LCP-optimering (Largest Contentful Paint)

- **Eager Loading på Hero-bilden:** Sajtens första bild (Hero-bilden på Therese)
  laddas direkt vid sidöppning med `loading="eager"` och `fetchpriority="high"`.
  Ladda inte upp onödigt tunga filer här (max 300 KB) eftersom det påverkar
  sajtens upplevda laddningstid negativt.
- **Lazy Loading på övriga bilder:** Alla bilder längre ner på sidan (Biography,
  Portfolio, Showreels) använder automatisk `loading="lazy"`. De laddas bara in
  när besökaren scrollar ner till dem, vilket sparar data och gör det första
  sidbesöket mycket snabbare.
