# SEO-innehåll: FAQ + filnamn för media

Kort sammanfattning av vad Semrush (databas `se`) visar just nu, sedan konkreta
leverabler: FAQ-frågor att lägga in på sajten (med `FAQPage`-schema) och 15+
SEO-optimerade filnamn för de 13 fotona och 2 ljudfilerna. Detta är en
**planerings-leverabel** — inga kodändringar görs förrän du godkänner den.

---

## 1. Vad Semrush visar (kort läsning)

Grundat på färska sökningar i .se-databasen (källa: Semrush):

- **"therese järvheden"** — 480/mån, KD 28. Realistiskt att äga
  varumärkes-SERP:en.
- **"thomas järvheden"** — 3 600/mån. **"thomas järvheden fru"** — 90/mån. Det
  här är trafik som Nyheter24/Hänt tar idag — vi kan kapa en del med rätt
  FAQ-svar.
- **"lyster hudvård"** — 110/mån, **"thess persson"** — 170/mån. Bekräftar "dual
  entity"-problemet från more-seo.md.
- **"skådespelerska"** — 480/mån, KD 17. **"svensk skådespelerska"** — 1 900/mån
  (Wikipedia-dominerat, långsvans är vägen in).
- **"röstskådespelare"** — 480/mån, KD 15. **"voice over svenska"** — 140/mån,
  CPC $3.10 (kommersiell). **"hur blir man röstskådespelare"** — 30/mån
  (frågeintent).
- **"röstskådespelare jobb"**, **"röstskådespelare utbildning"**, **"jobba som
  röstskådespelare"**, **"röstskådespelare lön"** — alla i 40–260-spannet, låg
  konkurrens.
- **"skånsk dialekt skådespelare"** — noll konkurrens (Thereses USP).

Slutsats: FAQ:n ska göra tre jobb samtidigt — (a) svara på vem-är-frågor för
varumärkes-SERP, (b) kapa "Thomas Järvheden fru"-trafik, (c) plocka
röst/dialekt-långsvansen.

---

## 2. Föreslagna FAQ-frågor (att lägga i `FAQPage` JSON-LD + synlig HTML)

Sorterade efter SEO-värde. Varje svar ska hållas kort (40–60 ord — AI
Overview-format).

**Entitet / vem-är (varumärkes-SERP)**

1. **Vem är Therese Järvheden?**
2. **Vilken dialekt talar Therese Järvheden?** — ankrar "skånsk dialekt
   skådespelare".
3. **Var är Therese Järvheden baserad?** — Malmö / Stockholm.
4. **Vilken agentur representerar Therese Järvheden?** — Schultzberg Agency
   (drama) + Commercial Actors (reklam) — kapar även "schultzberg agency"-sök.

**Meriter / titel-långsvans (konkurrerar med IMDb-scrapes)** 5. **Vilka serier
och filmer har Therese Järvheden varit med i?** 6. **Vem spelade Madeleine i
Kärlek & anarki?** 7. **Vem spelade läraren Nora i Beck – Utan uppsåt?** 8.
**Vem är kvinnan i SVT:s "En våldsam kärlek"?** 9. **Vem gjorde rösten till
mamman Alice i Familjen Valentin?** 10. **Var Therese Järvheden med i
Karatefylla?** — kopplar till YouTube-klippens 200k+ visningar.

**Relations-SERP (kapar Nyheter24/Hänt-trafik — 3 600 + 90/mån)** 11. **Är
Therese Järvheden gift med Thomas Järvheden?** 12. **Har Therese och Thomas
Järvheden barn?**

**Yrkes-/röst-långsvans (kommersiellt intent, låg KD)** 13. **Är Therese
Järvheden röstskådespelare?** — ankrar "röstskådespelare"-klustret (480/mån).
14. **Kan man boka Therese Järvheden för voice over på skånska?** — "voice over
svenska", $3.10 CPC. 15. **Kan Therese Järvheden anlitas för reklamröst?** 16.
**Talar Therese Järvheden engelska i roller?** — kryssar "acting jobs in
sweden"-intent.

**Casting / konvertering** 17. **Hur kontaktar man Therese Järvheden för
casting?** 18. **Var hittar jag Therese Järvhedens showreel?** 19. **Finns
pressbilder på Therese Järvheden att ladda ner?** — kopplar direkt till
nedladdningsfunktionen i Portfolio.

**"Dual entity"-disambiguering (löser problemet från more-seo.md)** 20. **Är
Therese Järvheden skådespelerska samma person som driver Lyster Hudvård?** —
svaret separerar entiteterna för Google, men behåller webbens fokus på
skådespeleri.

Rekommendation: kör 10–12 av dessa live i första launchen — börja med #1, #2,
#5, #11, #13, #14, #17 (starkast ROI), lägg resten över tid.

---

## 3. Filnamnsförslag — 13 foton

Regler: gemener, bindestreck, ASCII (`å→a`, `ä→a`, `ö→o`), primärt keyword
först, kontext sedan, år sist. Alla i `.webp` primärt med `.jpg` fallback via
`<picture>`. Motsvarande `alt`-text ges på svenska.

| #  | Filnamn (foto)                                            | Primärt SEO-keyword                | Föreslagen `alt`                                        |
| -- | --------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------- |
| 1  | `therese-jarvheden-skadespelerska-portratt-2025.webp`     | therese järvheden + skådespelerska | Therese Järvheden, svensk skådespelerska, porträtt 2025 |
| 2  | `therese-jarvheden-headshot-drama-2025.webp`              | headshot + drama                   | Therese Järvheden headshot — drama, 2025                |
| 3  | `therese-jarvheden-headshot-komedi-2025.webp`             | headshot + komedi                  | Therese Järvheden headshot — komedi                     |
| 4  | `therese-jarvheden-pressbild-svt-en-valdsam-karlek.webp`  | pressbild + produktion             | Pressbild Therese Järvheden — SVT En våldsam kärlek     |
| 5  | `therese-jarvheden-rostskadespelare-studio.webp`          | röstskådespelare                   | Therese Järvheden i röststudio — röstskådespelare       |
| 6  | `therese-jarvheden-skansk-skadespelare-malmo.webp`        | skånsk dialekt + Malmö             | Skånsk skådespelerska Therese Järvheden i Malmö         |
| 7  | `therese-jarvheden-teater-scen-portratt.webp`             | teater + scen                      | Therese Järvheden på scen — teaterporträtt              |
| 8  | `therese-jarvheden-svartvit-portratt-skadespelerska.webp` | svartvitt porträtt                 | Svartvitt porträtt av skådespelerskan Therese Järvheden |
| 9  | `therese-jarvheden-narbild-drama-utstryck.webp`           | närbild + drama                    | Närbild Therese Järvheden — dramatiskt uttryck          |
| 10 | `therese-jarvheden-komedi-karatefylla-svt.webp`           | Karatefylla                        | Therese Järvheden i komedi — Karatefylla, SVT           |
| 11 | `therese-jarvheden-jarva-klapare-cissi.webp`              | Jävla klåpare + karaktär           | Therese Järvheden som Cissi i Jävla klåpare             |
| 12 | `therese-jarvheden-beck-utan-uppsat-nora.webp`            | Beck + karaktär Nora               | Therese Järvheden som Nora i Beck – Utan uppsåt         |
| 13 | `therese-jarvheden-karlek-och-anarki-madeleine.webp`      | Kärlek & anarki + Madeleine        | Therese Järvheden som Madeleine i Kärlek & anarki       |

**Extra reservnamn** (om något foto inte matchar rollistan):

- `therese-jarvheden-officiell-pressbild-2025.webp`
- `therese-jarvheden-agentur-schultzberg-headshot.webp`
- `therese-jarvheden-voice-over-svenska-rost.webp`

---

## 4. Filnamnsförslag — 2 ljudfiler

Här räknar Google filnamnet + omgivande text som primär signal (audio har ingen
alt-text).

| #  | Filnamn (audio)                                     | Primärt SEO-keyword           | Föreslagen synlig text intill spelaren            |
| -- | --------------------------------------------------- | ----------------------------- | ------------------------------------------------- |
| A1 | `therese-jarvheden-rostprov-skanska-reklam.mp3`     | voice over svenska + skånska  | "Röstprov — skånsk reklamröst, Therese Järvheden" |
| A2 | `therese-jarvheden-voice-over-svenska-dubbning.mp3` | voice over svenska + dubbning | "Röstprov — svensk dubbning & berättarröst"       |

**Extra reservnamn** för när du utökar biblioteket:

- `therese-jarvheden-rostskadespelare-berattarrost-sv.mp3`
- `therese-jarvheden-voice-over-skanska-radio.mp3`
- `therese-jarvheden-dubbning-mamma-familjen-valentin.mp3`
- `therese-jarvheden-narration-engelska-voice-over.mp3`

Totalt: **13 fotonamn + 3 reserv + 2 ljudnamn + 4 ljudreserv = 22 förslag**
(kravet var minst 15).

---

## 5. Vad detta blir när det byggs (för referens — inte del av denna leverabel)

När du godkänner, nästa steg (separat plan/bygg) blir:

- Bygga `FAQ`-komponent + `FAQPage` JSON-LD på `/` och `/om`.
- Byta filnamn i uploads (Supabase storage) + uppdatera `alt` på `<img>` i
  `Portfolio.tsx` och kommande `Voice.tsx` audio-taggar.
- Lägga in `<audio>`-taggar med semantiska filnamn på `/voice`.

Säg till om du vill (a) justera/lägga till FAQ-frågor, (b) byta språkton, eller
(c) gå direkt till bygg-steget.
