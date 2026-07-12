interface GuideStep {
  target: string;
  instruction: string;
}

interface GuideResponse {
  message: string;
  steps: GuideStep[];
}

const FALLBACK_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite"
];

// System prompt explaining backstage element IDs and how to guide the user
const SYSTEM_PROMPT = `
You are Klick-guiden, a helpful interactive tour guide chatbot for Therese Järvheden's backstage CMS.
Your goal is to guide the user step-by-step through performing changes in the admin panel by generating structured tours.

You MUST respond strictly with a JSON object. Do not include markdown wraps or anything except the JSON payload itself.
The JSON object must follow this structure:
{
  "message": "En svensk förklarande text om vad vi ska göra (t.ex. 'Jag ska visa dig hur du uppdaterar biografin. Följ mina instruktioner!')",
  "steps": [
    {
      "target": "id-of-the-element",
      "instruction": "En kort instruktion i imperativ (t.ex. 'Klicka på Akt II i sidomenyn')"
    }
  ]
}

Available element targets (IDs) in the DOM:
- Sidebar tabs:
  * "klick-nav-hero" (Akt I: Nu aktuell / Hero)
  * "klick-nav-bio" (Akt II: Biografi)
  * "klick-nav-portfolio" (Akt III: Portfolio)
  * "klick-nav-showreels" (Akt IV: Showreels)
  * "klick-nav-credits" (Akt V: Meriter)
  * "klick-nav-voice" (Akt VI: Röst)
  * "klick-nav-contact" (Akt VII: Kontaktinfo)
  * "klick-nav-curtain" (Akt VIII: Ridåfall)
  * "klick-nav-seo" (SEO & Inställningar)
  * "klick-nav-media" (Mediebibliotek)

- Akt I: Nu aktuell (Hero) targets:
  * "klick-hero-sync" (Synk-knapp för automatisk hämtning)
  * "klick-hero-sv" (Svensk textruta)
  * "klick-hero-en" (Engelsk textruta)
  * "klick-hero-image" (Hero bakgrundsbild URL input)
  * "klick-hero-image-media" (Välj från mediebibliotek för Hero)
  * "klick-hero-image-alt" (Alt-text för Hero-bild)
  * "klick-hero-save" (Spara-knapp)

- Akt II: Biografi targets:
  * "klick-bio-quote-sv" (Svenskt citat)
  * "klick-bio-quote-en" (Engelskt citat)
  * "klick-bio-heading-sv" (Svensk rubrik)
  * "klick-bio-heading-en" (Engelsk rubrik)
  * "klick-bio-p1-sv" (Svensk paragraf 1)
  * "klick-bio-p1-en" (Engelsk paragraf 1)
  * "klick-bio-p2-sv" (Svensk paragraf 2)
  * "klick-bio-p2-en" (Engelsk paragraf 2)
  * "klick-bio-p3-sv" (Svensk paragraf 3)
  * "klick-bio-p3-en" (Engelsk paragraf 3)
  * "klick-bio-dialects-sv" (Svenska dialekter)
  * "klick-bio-dialects-en" (Engelska dialekter)
  * "klick-bio-languages-sv" (Svenska språk)
  * "klick-bio-languages-en" (Engelska språk)
  * "klick-bio-add-faq" (Lägg till ny FAQ rad knapp)
  * "klick-bio-image" (Biografi stående bild URL-inmatning)
  * "klick-bio-image-media" (Välj från mediebibliotek för biografi-bild)
  * "klick-bio-image-alt" (Alt-text för biografi-bild)
  * "klick-bio-save" (Spara-knapp)

- Akt III: Portfolio targets:
  * "klick-portfolio-upload" (Välj fil uppladdning för galleriet)
  * "klick-portfolio-url-input" (Url länk fält)
  * "klick-portfolio-url-add" (Lägg till från URL knapp)
  * "klick-portfolio-grid" (Bildgalleri behållare)
  * "klick-portfolio-save" (Spara-knapp)

- Akt IV: Showreels targets:
  * "klick-showreels-add" (Lägg till showreel knapp)
  * "klick-showreels-title-sv" (Svensk titel för showreel)
  * "klick-showreels-vimeo" (Vimeo ID textruta)
  * "klick-showreels-upload-poster" (Poster bild uppladdare)
  * "klick-showreels-save" (Spara-knapp)

- Akt V: Meriter targets:
  * "klick-credits-add" (Lägg till ny merit knapp)
  * "klick-credits-filters" (Kategorifilter tabs)
  * "klick-credits-row-0" (Första meritraden)
  * "klick-credits-advanced-toggle-0" (Visa Röst & Manus avancerat för rad 1)
  * "klick-credits-audio-upload-0" (Ljudfilsuppladdning för rad 1)
  * "klick-credits-save" (Spara-knapp)

- Akt VI: Röst targets:
  * "klick-voice-heading-sv" (Röstrubrik svenska)
  * "klick-voice-heading-en" (Röstrubrik engelska)
  * "klick-voice-body-sv" (Beskrivningstext svenska)
  * "klick-voice-body-en" (Beskrivningstext engelska)
  * "klick-voice-cta-sv" (Knapptext svenska)
  * "klick-voice-save" (Spara-knapp)

- SEO & Inställningar targets:
  * "klick-seo-title-sv" (Sajttitel svenska)
  * "klick-seo-desc-sv" (Sajtbeskrivning svenska)
  * "klick-seo-upload-img" (Social delningsbild uppladdare)
  * "klick-seo-save" (Spara-knapp)

- Akt VII: Kontaktinfo targets:
  * "klick-contact-agent-email" (Agent e-post)
  * "klick-contact-voice-email" (Röst e-post)
  * "klick-contact-instagram" (Instagram länk)
  * "klick-contact-imdb" (IMDb profil-länk)
  * "klick-contact-save" (Spara-knapp)

- Akt VIII: Ridåfall targets:
  * "klick-curtain-image" (Liten sidfotsbild URL)
  * "klick-curtain-image-media" (Välj från mediebibliotek för sidfotsbild)
  * "klick-curtain-image-alt" (Alt-text för bild)
  * "klick-curtain-end-sv" (Sluttext svenska)
  * "klick-curtain-add-credit" (Lägg till eftertextrad knapp)
  * "klick-curtain-save" (Spara-knapp)

- Mediebibliotek targets:
  * "klick-media-dropzone" (Uppladdningsyta för filer)
  * "klick-media-copy-0" (Kopiera URL knapp för första filen)
  * "klick-media-add-portfolio-0" (Lägg till i galleri knapp för första bilden)

IMPORTANT RULES:
1. Always start a tour by navigating the user to the correct tab. The first step target MUST be one of the sidebar tabs: "klick-nav-...".
2. Keep steps simple (usually 3 to 5 steps max).
3. Always end a tour with a save action pointing to "klick-...-save".
4. If you do not recognize the request or if it cannot be executed in the admin panel, return a friendly JSON response with steps empty, explaining how to ask.
5. If the request is vague (e.g., 'change image', 'upload picture', 'change photo') and could apply to multiple sections (Hero background, Portfolio, Biography portraits, Showreel poster, or Social share image), explain the options clearly in 'message', set 'steps' to an empty array [], and prompt the user to specify which section they want.
`;

// Local patterns simulation for fallback when API key is missing or offline
function localFallbackSimulate(prompt: string): GuideResponse {
  const p = prompt.toLowerCase();
  
  // A. Check for vague/ambiguous image requests first
  const isVagueImage = (
    (p.includes("bild") || p.includes("image") || p.includes("foto") || p.includes("picture") || p.includes("ladda upp") || p.includes("upload")) &&
    !p.includes("galleri") && !p.includes("portfolio") && !p.includes("bio") && !p.includes("om mig") &&
    !p.includes("seo") && !p.includes("delning") && !p.includes("og") && !p.includes("curtain") &&
    !p.includes("ridå") && !p.includes("eftertext") && !p.includes("showreel") && !p.includes("video") &&
    !p.includes("huvud") && !p.includes("main") && !p.includes("bakgrund") && !p.includes("background") &&
    !p.includes("startside") && !p.includes("kopiera") && !p.includes("länk") && !p.includes("url")
  );

  if (isVagueImage) {
    return {
      message: "Hemsidan har flera olika bilder. Vilken vill du ändra? Prova att fråga om:\n• 'ändra huvudbild' (för bakgrundsbilden i Akt I)\n• 'ändra biografi-bilder' (för porträtten i Akt II)\n• 'ladda upp till galleriet' (i portfolion under Akt III)\n• 'ändra delningsbild' (för sociala medier under SEO)",
      steps: []
    };
  }

  // B. Specific Hero main/background image requests
  if (p.includes("huvudbild") || p.includes("main image") || p.includes("startsidesbild") || p.includes("bakgrundsbild") || p.includes("hero image") || p.includes("bakgrunds-bild") || p.includes("huvud-bild")) {
    return {
      message: "Så här byter du den stora huvudbilden (bakgrundsbilden) på startsidan under Akt I:",
      steps: [
        { target: "klick-nav-hero", instruction: "Klicka på 'Akt I: Nu aktuell' i sidomenyn." },
        { target: "klick-hero-image", instruction: "Här kan du ange en bild-URL direkt, eller..." },
        { target: "klick-hero-image-media", instruction: "Klicka på 'Media'-knappen för att välja en bild från ditt mediebibliotek." },
        { target: "klick-hero-save", instruction: "Glöm inte att spara dina ändringar längst ner." }
      ]
    };
  }

  // C. Specific Biography Mood/Portrait image requests
  if ((p.includes("bio") || p.includes("biografi") || p.includes("mood") || p.includes("porträtt") || p.includes("portrait") || p.includes("dramatisk") || p.includes("komisk") || p.includes("klassisk")) && (p.includes("bild") || p.includes("image") || p.includes("foto") || p.includes("picture") || p.includes("byt") || p.includes("ändra") || p.includes("change"))) {
    return {
      message: "Så här byter du bilderna för dina biografisektioner (Dramatisk, Komisk, Klassisk) under Akt II:",
      steps: [
        { target: "klick-nav-bio", instruction: "Klicka på 'Akt II: Biografi' i sidomenyn." },
        { target: "klick-bio-image", instruction: "Här kan du ange en bild-URL direkt för den första biografisektionen." },
        { target: "klick-bio-image-media", instruction: "Eller klicka på 'Media'-knappen för att välja en uppladdad bild." },
        { target: "klick-bio-save", instruction: "Klicka på 'Spara ändringar' längst ner." }
      ]
    };
  }

  // D. Specific SEO Social sharing image requests
  if ((p.includes("seo") || p.includes("delning") || p.includes("og:") || p.includes("og ") || p.includes("opengraph") || p.includes("social")) && (p.includes("bild") || p.includes("image") || p.includes("foto") || p.includes("picture") || p.includes("byt") || p.includes("ändra") || p.includes("change"))) {
    return {
      message: "Så här ändrar du den sociala delningsbilden (OpenGraph) under SEO & Inställningar:",
      steps: [
        { target: "klick-nav-seo", instruction: "Klicka på 'SEO & Inställningar' i sidomenyn." },
        { target: "klick-seo-upload-img", instruction: "Klicka på 'Välj fil' eller 'Media' under 'Social delningsbild' för att ladda upp/välja bild." },
        { target: "klick-seo-save", instruction: "Klicka på 'Spara inställningar' längst ner för att slutföra." }
      ]
    };
  }

  // E. Specific Footer / Curtain scenskiss image requests
  if (p.includes("slutbild") || p.includes("slut-bild") || p.includes("ridåbild") || p.includes("ridå-bild") || p.includes("scenskiss") || ((p.includes("footer") || p.includes("sidfot") || p.includes("curtain") || p.includes("ridå")) && (p.includes("bild") || p.includes("image") || p.includes("foto") || p.includes("picture")))) {
    return {
      message: "Så här byter du den lilla sidfotsbilden (scenskiss) i eftertexterna under Akt VIII:",
      steps: [
        { target: "klick-nav-curtain", instruction: "Klicka på 'Akt VIII: Ridåfall' i sidomenyn." },
        { target: "klick-curtain-image", instruction: "Skriv in bildens URL här." },
        { target: "klick-curtain-image-media", instruction: "Eller klicka på 'Media' för att välja från ditt mediebibliotek." },
        { target: "klick-curtain-save", instruction: "Klicka på 'Spara ändringar' längst ner för att spara." }
      ]
    };
  }
  
  // 1. Hero (Akt I)
  if (p.includes("hero") || p.includes("aktuell") || p.includes("nu aktuell") || p.includes("framhäv") || p.includes("status")) {
    if (p.includes("sync") || p.includes("automatisk") || p.includes("hämta")) {
      return {
        message: "Så här slår du på automatisk hämtning av nuvarande produktion till Hero-rubriken:",
        steps: [
          { target: "klick-nav-hero", instruction: "Klicka på 'Akt I: Nu aktuell' i sidomenyn." },
          { target: "klick-hero-sync", instruction: "Slå på switch-knappen för 'Automatisk synkronisering med meriter'." },
          { target: "klick-hero-save", instruction: "Klicka på 'Spara ändringar' för att spara din inställning." }
        ]
      };
    }
    return {
      message: "Så här ändrar du din aktuella status (Hero-rubrik) manuellt på hemsidan:",
      steps: [
        { target: "klick-nav-hero", instruction: "Klicka på 'Akt I: Nu aktuell' i sidomenyn." },
        { target: "klick-hero-sv", instruction: "Skriv den text du vill visa på svenska för dina besökare." },
        { target: "klick-hero-save", instruction: "Klicka på 'Spara ändringar' för att spara." }
      ]
    };
  }

  // 2. Biografi & FAQ & Dialekter & Språk (Akt II)
  if (p.includes("bio") || p.includes("biografi") || p.includes("om mig") || p.includes("citat") || p.includes("faq") || p.includes("dialekt") || p.includes("språk") || p.includes("vanliga frågor")) {
    if (p.includes("faq") || p.includes("fråga") || p.includes("frågor") || p.includes("vanliga frågor")) {
      return {
        message: "Jag guidar dig gärna igenom hur du lägger till eller redigerar vanliga frågor (FAQ):",
        steps: [
          { target: "klick-nav-bio", instruction: "Klicka på 'Akt II: Biografi' i sidomenyn." },
          { target: "klick-bio-add-faq", instruction: "Rulla ner och klicka på '+ Lägg till fråga' för att lägga till ett nytt FAQ-par." },
          { target: "klick-bio-save", instruction: "Klicka på 'Spara ändringar' längst ner för att spara dina nya frågor." }
        ]
      };
    }
    if (p.includes("dialekt") || p.includes("språk") || p.includes("modersmål")) {
      return {
        message: "Så här ändrar du dina dialekter eller språkkunskaper på biografisidan:",
        steps: [
          { target: "klick-nav-bio", instruction: "Klicka på 'Akt II: Biografi' i sidomenyn." },
          { target: "klick-bio-dialects-sv", instruction: "Skriv dina talade dialekter här (t.ex. Rikssvenska, Norrländska)." },
          { target: "klick-bio-languages-sv", instruction: "Ange dina talade språk och kunskapsnivå här." },
          { target: "klick-bio-save", instruction: "Klicka på 'Spara ändringar' för att publicera uppgifterna." }
        ]
      };
    }
    if (p.includes("citat") || p.includes("quote")) {
      return {
        message: "Så här ändrar du det framhävda citatet under biografisektionen:",
        steps: [
          { target: "klick-nav-bio", instruction: "Klicka på 'Akt II: Biografi' i sidomenyn." },
          { target: "klick-bio-quote-sv", instruction: "Skriv eller ändra det svenska citatet i det här fältet." },
          { target: "klick-bio-save", instruction: "Klicka på 'Spara ändringar' för att spara citatet." }
        ]
      };
    }
    return {
      message: "Jag guidar dig gärna igenom hur du redigerar din Biografi. Följ dessa steg:",
      steps: [
        { target: "klick-nav-bio", instruction: "Klicka på 'Akt II: Biografi' i sidomenyn." },
        { target: "klick-bio-heading-sv", instruction: "Skriv eller ändra din svenska rubrik i det här textfältet." },
        { target: "klick-bio-p1-sv", instruction: "Fyll i den första svenska beskrivande paragrafen här." },
        { target: "klick-bio-save", instruction: "Klicka slutligen på 'Spara ändringar' för att publicera dina uppdateringar!" }
      ]
    };
  }

  // 3. Portfolio Bilder (Akt III)
  if (p.includes("bild") || p.includes("galleri") || p.includes("portfolio") || p.includes("foto")) {
    if (p.includes("länk") || p.includes("url") || p.includes("extern")) {
      return {
        message: "Så här lägger du till en portfolio-bild via en extern webblänk (URL):",
        steps: [
          { target: "klick-nav-portfolio", instruction: "Klicka på 'Akt III: Portfolio' i sidomenyn." },
          { target: "klick-portfolio-url-input", instruction: "Klistra in bildens webbadress (URL) i det här fältet." },
          { target: "klick-portfolio-url-add", instruction: "Klicka på 'Lägg till från URL' för att lägga in bilden i ditt galleri." },
          { target: "klick-portfolio-save", instruction: "Klicka på 'Spara ändringar' längst ner för att bekräfta." }
        ]
      };
    }
    return {
      message: "Så här lägger du till och redigerar dina bilder i ditt bildgalleri:",
      steps: [
        { target: "klick-nav-portfolio", instruction: "Klicka på 'Akt III: Portfolio' i sidomenyn." },
        { target: "klick-portfolio-upload", instruction: "Klicka på knappen 'Ladda upp från dator' under Lägg till ny bild för att välja en fil." },
        { target: "klick-portfolio-grid", instruction: "Här ser du alla dina uppladdade bilder där du kan sortera ordningen eller ange SEO alt-texter." },
        { target: "klick-portfolio-save", instruction: "Klicka på 'Spara ändringar' för att verkställa." }
      ]
    };
  }

  // 4. Showreels (Akt IV)
  if (p.includes("showreel") || p.includes("video") || p.includes("vimeo") || p.includes("youtube") || p.includes("film") || p.includes("rulle")) {
    if (p.includes("poster") || p.includes("tumnagel") || p.includes("miniatyr") || p.includes("bild") || p.includes("thumbnail")) {
      return {
        message: "Så här ändrar eller laddar du upp en posterbild (tumnagel) för din showreel:",
        steps: [
          { target: "klick-nav-showreels", instruction: "Klicka på 'Akt IV: Showreels' i sidomenyn." },
          { target: "klick-showreels-upload-poster", instruction: "Klicka på bild-ikonen eller välj fil för att ladda upp en ny posterbild." },
          { target: "klick-showreels-save", instruction: "Klicka på 'Spara ändringar' för att spara bilden." }
        ]
      };
    }
    return {
      message: "Så här lägger du till eller uppdaterar dina Showreels (filmer):",
      steps: [
        { target: "klick-nav-showreels", instruction: "Klicka på 'Akt IV: Showreels' i sidomenyn." },
        { target: "klick-showreels-add", instruction: "Klicka på '+ Lägg till showreel' för att lägga till en ny rad." },
        { target: "klick-showreels-vimeo", instruction: "Klistra in ditt Vimeo-ID eller YouTube-ID här." },
        { target: "klick-showreels-save", instruction: "Klicka på 'Spara ändringar' för att spara." }
      ]
    };
  }

  // 5. Meriter & Ljudprov på meriter (Akt V)
  if (p.includes("ljud") || p.includes("kommentar") || p.includes("röstinspelning") || p.includes("merit") || p.includes("meriter") || p.includes("manus") || p.includes("replik")) {
    if (p.includes("lägga till") || p.includes("ny") || p.includes("skapa") || p.includes("produktion")) {
      return {
        message: "Så här skapar och lägger du till en helt ny merit i din lista:",
        steps: [
          { target: "klick-nav-credits", instruction: "Klicka på 'Akt V: Meriter' i sidomenyn." },
          { target: "klick-credits-add", instruction: "Klicka på '+ Lägg till merit' för att skapa ett nytt tomt meritkort." },
          { target: "klick-credits-save", instruction: "Fyll i meritens uppgifter och klicka sedan på 'Spara ändringar' för att publicera." }
        ]
      };
    }
    return {
      message: "Låt oss lägga till en ljudinspelning eller manusdialog på dina meriter:",
      steps: [
        { target: "klick-nav-credits", instruction: "Öppna 'Akt V: Meriter' i sidomenyn." },
        { target: "klick-credits-row-0", instruction: "Leta upp den merit du vill lägga till ljud på." },
        { target: "klick-credits-advanced-toggle-0", instruction: "Klicka på 'Visa Röstkommentar & Manus (Avancerat)' för att fälla ut inställningarna." },
        { target: "klick-credits-audio-upload-0", instruction: "Ladda upp din ljudinspelning här (eller klistra in en länk)." },
        { target: "klick-credits-save", instruction: "Klicka på 'Spara ändringar' längst ner." }
      ]
    };
  }

  // 6. Röst (Akt VI)
  if (p.includes("röst") || p.includes("voiceover") || p.includes("boka")) {
    return {
      message: "Så här ändrar du rubrik, beskrivningstext och bokningsknapp i Röst-sektionen:",
      steps: [
        { target: "klick-nav-voice", instruction: "Klicka på 'Akt VI: Röst' i sidomenyn." },
        { target: "klick-voice-heading-sv", instruction: "Skriv den nya rubriken som lockar bokningar." },
        { target: "klick-voice-body-sv", instruction: "Redigera den svenska beskrivningstexten för dina röstprover här." },
        { target: "klick-voice-cta-sv", instruction: "Ändra texten på din bokningsknapp här." },
        { target: "klick-voice-save", instruction: "Klicka på 'Spara ändringar'." }
      ]
    };
  }

  // 7. Kontaktinfo (Akt VII)
  if (p.includes("contact") || p.includes("kontakt") || p.includes("epost") || p.includes("e-post") || p.includes("email") || p.includes("instagram") || p.includes("facebook") || p.includes("imdb") || p.includes("wikipedia") || p.includes("agent") || p.includes("sociala")) {
    return {
      message: "Så här ändrar du din kontaktinformation och dina sociala medier-länkar under Akt VII:",
      steps: [
        { target: "klick-nav-contact", instruction: "Klicka på 'Akt VII: Kontaktinfo' i sidomenyn." },
        { target: "klick-contact-agent-email", instruction: "Ange e-postadressen till din agent i det här fältet." },
        { target: "klick-contact-instagram", instruction: "Klistra in eller uppdatera din Instagram-profil här." },
        { target: "klick-contact-save", instruction: "Klicka på 'Spara ändringar' för att spara dina kontaktuppgifter." }
      ]
    };
  }

  // 8. Ridåfall & Eftertexter (Akt VIII)
  if (p.includes("curtain") || p.includes("ridå") || p.includes("eftertext") || p.includes("slutsida") || p.includes("slutbild") || p.includes("sluttext") || p.includes("credit-")) {
    if (p.includes("rad") || p.includes("lägga till rad") || p.includes("marq")) {
      return {
        message: "Så här lägger du till en ny rad i de rullande eftertexterna under Akt VIII:",
        steps: [
          { target: "klick-nav-curtain", instruction: "Klicka på 'Akt VIII: Ridåfall' i sidomenyn." },
          { target: "klick-curtain-add-credit", instruction: "Klicka på 'Lägg till rad' för att lägga in en ny rad i marquee-eftertexterna." },
          { target: "klick-curtain-save", instruction: "Skriv texten för raden och klicka på 'Spara ändringar' för att spara." }
        ]
      };
    }
    return {
      message: "Jag guidar dig gärna igenom hur du redigerar eftertexter och slutbild under Akt VIII:",
      steps: [
        { target: "klick-nav-curtain", instruction: "Klicka på 'Akt VIII: Ridåfall' i sidomenyn." },
        { target: "klick-curtain-image", instruction: "Här kan du ange en URL eller välja en bild för sidfoten via mediebiblioteket." },
        { target: "klick-curtain-end-sv", instruction: "Skriv den text du vill visa allra sist på svenska (t.ex. 'SLUT')." },
        { target: "klick-curtain-save", instruction: "Spara dina ändringar genom att klicka på 'Spara ändringar' längst ner." }
      ]
    };
  }

  // 9. SEO & Inställningar
  if (p.includes("seo") || p.includes("sök") || p.includes("titel") || p.includes("og") || p.includes("opengraph") || p.includes("social") || p.includes("delning") || p.includes("beskrivning") || p.includes("sökoptimera")) {
    return {
      message: "Jag visar dig hur du ställer in din sökmotorsoptimering (SEO) och byter din sociala delningsbild (OpenGraph):",
      steps: [
        { target: "klick-nav-seo", instruction: "Klicka på 'SEO & Inställningar' i sidomenyn." },
        { target: "klick-seo-title-sv", instruction: "Ange webbplatsens titel som visas på sökmotorer." },
        { target: "klick-seo-desc-sv", instruction: "Skriv din sajtbeskrivning (meta description) som visas i sökresultaten här." },
        { target: "klick-seo-upload-img", instruction: "Klicka på 'Välj fil' under 'Social delningsbild' för att ladda upp din nya OpenGraph-bild (t.ex. för Facebook/LinkedIn)." },
        { target: "klick-seo-save", instruction: "Klicka på 'Spara inställningar' längst ner för att verkställa dina SEO-ändringar!" }
      ]
    };
  }

  // 10. Mediebibliotek
  if (p.includes("media") || p.includes("mediebibliotek") || p.includes("fil") || p.includes("filer") || p.includes("ladda upp fil") || p.includes("flytta") || p.includes("mapp") || p.includes("mappar")) {
    if (p.includes("kopiera") || p.includes("länk") || p.includes("url")) {
      return {
        message: "Så här kopierar du en fil-URL från Mediebiblioteket:",
        steps: [
          { target: "klick-nav-media", instruction: "Klicka på 'Mediebibliotek' i sidomenyn." },
          { target: "klick-media-copy-0", instruction: "Hitta din fil och klicka på 'Kopiera URL' för att kopiera länkens adress till ditt urklipp." }
        ]
      };
    }
    if (p.includes("portfolio") || p.includes("galleri") || p.includes("skicka")) {
      return {
        message: "Så här lägger du till en uppladdad bild direkt till ditt portfolio-galleri från Mediebiblioteket:",
        steps: [
          { target: "klick-nav-media", instruction: "Klicka på 'Mediebibliotek' i sidomenyn." },
          { target: "klick-media-add-portfolio-0", instruction: "Leta upp din bild och klicka på '+ Lägg till i Portfolio' för att omedelbart infoga den i galleriet." }
        ]
      };
    }
    return {
      message: "Så här använder du Mediebiblioteket för att hantera dina filer:",
      steps: [
        { target: "klick-nav-media", instruction: "Klicka på 'Mediebibliotek' i sidomenyn." },
        { target: "klick-media-dropzone", instruction: "Dra och släpp en fil eller klicka här för att ladda upp en ny bild, video eller ljudfil." }
      ]
    };
  }

  return {
    message: "Jag förstår inte riktigt vilken sektion du vill ändra. Prova att fråga om 'biografi', 'ljud', 'vanliga frågor', 'bilder', 'showreels', 'meriter', 'kontakt', 'eftertexter' eller 'SEO'.",
    steps: []
  };
}

// Perform generation with fallbacks
export async function getInteractiveGuide(prompt: string, apiKey: string): Promise<GuideResponse> {
  const cleanKey = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || "";
  
  if (!cleanKey) {
    // If no key is configured anywhere, default directly to mock simulation
    return localFallbackSimulate(prompt);
  }

  // Iterate models in order
  for (const model of FALLBACK_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nUser request: "${prompt}"`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} using ${model}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
        const cleanJson = JSON.parse(rawText);
        if (cleanJson && cleanJson.message) {
          return cleanJson as GuideResponse;
        }
      }
    } catch (e) {
      console.warn(`Failed to generate guide with model ${model}, trying fallback...`, e);
    }
  }

  // Final fallback to offline simulator if API request fails
  return localFallbackSimulate(prompt);
}

const GENERAL_SYSTEM_PROMPT = `
Du är Therese Järvhedens backstage-assistent för theresejarvheden.se.
Svara på allmänna frågor om hur man använder CMS-panelen på ett trevligt, pedagogiskt och koncist sätt.
Svara alltid på svenska. Håll svaret lagom långt och begränsa det till ungefär 5-6 meningar. Undvik alltför långa utläggningar.
Inkludera ALDRIG JSON-kod eller målobjekt (target IDs) i dina svar.

Här är en översikt av hur webbplatsens CMS och dess sektioner fungerar:
- **Inloggning**: Sker på '/backstage' med ditt konfigurerade lösenord.
- **Akt I: Nu aktuell (Hero)**: Styr den rullande/framhävda texten i toppen (nu aktuell produktion) samt den stora bakgrundsbilden. Kan synkas automatiskt med aktuella meriter.
- **Akt II: Biografi**: Ändrar biografitexter, egenskaper, dialekter, rullande citat, samt vanliga frågor (FAQ) för sökmotoroptimering (AEO/GEO).
- **Akt III: Portfolio**: Hanterar bildgalleriet. Du kan ladda upp bilder från din dator, ange externa URL-länkar eller välja från Mediebiblioteket.
- **Akt IV: Showreels**: Hanterar Vimeo/YouTube/direkta videor med posterbilder, undertexter och glödfärger.
- **Akt V: Meriter**: Din meritförteckning (Film, TV, Teater, Röst) sorterad på år. Innehåller avancerade val för röstklipp (ljudfiler) och manusdialog.
- **Akt VI: Röst**: Styr rubrik, text och bokningsknapp i Röst-sektionen.
- **Akt VII: Kontaktinfo**: Hanterar sociala medier-länkar (Instagram, IMDb, etc.) samt kontaktuppgifter.
- **Akt VIII: Ridåfall**: Styr eftertexterna (marquee) och slutskärmens lilla sidfotsbild (scenskiss).
- **SEO & Inställningar**: Hanterar sajttitel, sajtbeskrivning och den sociala delningsbilden (OG-bild) för sociala medier.
- **Mediebibliotek**: Lagrar alla dina uppladdade bilder, videor och ljudfiler i Supabase Storage. Du kan kopiera filer, byta mapp eller lägga till dem i Portfolion direkt.
- **Bildoptimering**: Bilder konverteras automatiskt till WebP för snabbare laddtid med smarta SEO-varningar för tunga filer.
`;

export async function getGeneralChatResponse(prompt: string, apiKey: string): Promise<string> {
  const cleanKey = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || "";
  
  if (!cleanKey) {
    // Simulated offline responses for general questions
    const p = prompt.toLowerCase();
    
    // 1. SEO/delningsbild
    if (p.includes("seo") || p.includes("opengraph") || p.includes("og") || p.includes("delning") || p.includes("sökopt") || p.includes("social image")) {
      return "Inställningar för SEO och din sociala delningsbild (OpenGraph-bild) styrs under 'SEO & Inställningar' i sidomenyn, under fältet 'Social delningsbild'. Ladda INTE upp den i Portfolio-galleriet då delningsbilden kräver en dedikerad plats för att visas rätt på t.ex. Facebook och LinkedIn.";
    }
    
    // 2. Bakgrundsbild / Huvudbild (Hero)
    if (p.includes("huvudbild") || p.includes("startsidesbild") || p.includes("bakgrundsbild") || p.includes("hero-bild") || p.includes("herobild") || (p.includes("hero") && p.includes("bild"))) {
      return "För att byta sajtens huvudbild (bakgrundsbild i Akt I), klicka på 'Akt I: Nu aktuell' i sidomenyn. Där hittar du fältet 'Bakgrundsbild' där du kan skriva en URL eller välja en bild från ditt Mediebibliotek.";
    }
    
    // 3. Biografibilder
    if (p.includes("bio") || p.includes("biografi") || p.includes("mood") || p.includes("porträtt")) {
      if (p.includes("bild") || p.includes("foto") || p.includes("porträtt")) {
        return "För att ändra porträttbilderna för dina biografisektioner (Dramatisk, Komisk, Klassisk), gå till 'Akt II: Biografi' i sidomenyn. På varje sektionskort finns fältet 'Bild-URL' och en 'Media'-knapp för att välja bilder.";
      }
    }
    
    // 4. Showreel poster/tumnagel
    if ((p.includes("showreel") || p.includes("video")) && (p.includes("poster") || p.includes("tumnagel") || p.includes("thumbnail") || p.includes("bild"))) {
      return "För att byta tumnageln (posterbilden) för en video, gå till 'Akt IV: Showreels' och klicka på bild- eller uppladdningsknappen under 'Posterbild (URL)'.";
    }
    
    // 5. Sidfotsbild/Slutbild (Curtain)
    if (p.includes("slutbild") || p.includes("ridåbild") || p.includes("scenskiss") || ((p.includes("footer") || p.includes("sidfot") || p.includes("curtain")) && p.includes("bild"))) {
      return "Sidfotsbilden (scenskiss i Akt VIII) styrs under 'Akt VIII: Ridåfall' i sidomenyn. Där kan du ange bildens URL eller välja den via mediebiblioteket.";
    }
    
    // 6. Lösenord
    if (p.includes("lösenord") || p.includes("logga in")) {
      return "För att logga in på admin-panelen använder du ditt registrerade lösenord i inloggningsskärmen. Kontakta administratören om du glömt lösenordet.";
    }
    
    // 7. Ljud/Röst
    if (p.includes("röst") || p.includes("ljud") || p.includes("ljudklipp") || p.includes("inspelning")) {
      return "Du kan ladda upp röstinspelningar och ljudklipp under sektionen 'Akt V: Meriter' genom att klicka på 'Visa Röstkommentar & Manus (Avancerat)' för respektive merit.";
    }
    
    // 8. Allmänna bilder/galleriet
    if (p.includes("bild") || p.includes("portfolio") || p.includes("galleri")) {
      return "Bilder till bildgalleriet hanteras i 'Akt III: Portfolio'. Du kan ladda upp direkt från din enhet eller ange en länk från ditt Mediebibliotek.";
    }
    
    return `[Offline-svar] Jag har ingen Gemini API-nyckel konfigurerad just nu, men angående din fråga "${prompt}": Du hittar detaljerad vägledning för alla sektioner i docs/manual.md. Spara en API-nyckel i inställningarna (kugghjulet/sliders) för fullt intelligenta svar!`;
  }

  for (const model of FALLBACK_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${GENERAL_SYSTEM_PROMPT}\n\nAnvändarens fråga: "${prompt}"`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status} using ${model}`);
      }

      const resData = await response.json();
      const rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
        return rawText.trim();
      }
    } catch (e) {
      console.warn(`Failed to get general response with model ${model}, trying fallback...`, e);
    }
  }

  return "Tyvärr kunde jag inte ansluta till Gemini-modellerna för tillfället. Kontrollera din anslutning eller försök igen senare.";
}
