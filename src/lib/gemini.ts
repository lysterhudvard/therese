interface GuideStep {
  target: string;
  instruction: string;
}

interface GuideResponse {
  message: string;
  steps: GuideStep[];
}

const FALLBACK_MODELS = [
  "gemini-2.0-flash",
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
  * "klick-nav-seo" (SEO & Inställningar)
  * "klick-nav-media" (Mediebibliotek)

- Akt I: Nu aktuell (Hero) targets:
  * "klick-hero-sync" (Synk-knapp för automatisk hämtning)
  * "klick-hero-sv" (Svensk textruta)
  * "klick-hero-en" (Engelsk textruta)
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

- Mediebibliotek targets:
  * "klick-media-dropzone" (Uppladdningsyta för filer)
  * "klick-media-copy-0" (Kopiera URL knapp för första filen)
  * "klick-media-add-portfolio-0" (Lägg till i galleri knapp för första bilden)

IMPORTANT RULES:
1. Always start a tour by navigating the user to the correct tab. The first step target MUST be one of the sidebar tabs: "klick-nav-...".
2. Keep steps simple (usually 3 to 5 steps max).
3. Always end a tour with a save action pointing to "klick-...-save".
4. If you do not recognize the request or if it cannot be executed in the admin panel, return a friendly JSON response with steps empty, explaining how to ask.
`;

// Local patterns simulation for fallback when API key is missing or offline
function localFallbackSimulate(prompt: string): GuideResponse {
  const p = prompt.toLowerCase();
  
  if (p.includes("bio") || p.includes("biografi") || p.includes("om mig") || p.includes("citat") || p.includes("faq")) {
    return {
      message: "Jag guidar dig gärna igenom hur du redigerar din Biografi och FAQ. Följ dessa steg:",
      steps: [
        { target: "klick-nav-bio", instruction: "Klicka på 'Akt II: Biografi' i sidomenyn." },
        { target: "klick-bio-heading-sv", instruction: "Skriv eller ändra din svenska rubrik i det här textfältet." },
        { target: "klick-bio-p1-sv", instruction: "Fyll i den första svenska beskrivande paragrafen här." },
        { target: "klick-bio-save", instruction: "Klicka slutligen på 'Spara ändringar' för att publicera dina uppdateringar!" }
      ]
    };
  }

  if (p.includes("hero") || p.includes("aktuell") || p.includes("nu aktuell") || p.includes("framhäv")) {
    return {
      message: "Så här ändrar du din aktuella status (Hero-rubrik) på hemsidan:",
      steps: [
        { target: "klick-nav-hero", instruction: "Klicka på 'Akt I: Nu aktuell' i sidomenyn." },
        { target: "klick-hero-sync", instruction: "Om du vill att den hämtas automatiskt från meriter, slå på auto-synk. Annars, stäng av den." },
        { target: "klick-hero-sv", instruction: "Skriv den text du vill visa för dina besökare." },
        { target: "klick-hero-save", instruction: "Klicka på 'Spara ändringar' för att spara." }
      ]
    };
  }

  if (p.includes("ljud") || p.includes("kommentar") || p.includes("röstinspelning") || p.includes("merit") || p.includes("meriter") || p.includes("manus") || p.includes("replik")) {
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

  if (p.includes("seo") || p.includes("sök") || p.includes("titel") || p.includes("og") || p.includes("opengraph") || p.includes("social") || p.includes("delning")) {
    return {
      message: "Jag visar dig hur du ställer in din sökmotorsoptimering (SEO) och byter din sociala delningsbild (OpenGraph):",
      steps: [
        { target: "klick-nav-seo", instruction: "Klicka på 'SEO & Inställningar' i sidomenyn." },
        { target: "klick-seo-title-sv", instruction: "Ange webbplatsens titel som visas på sökmotorer." },
        { target: "klick-seo-upload-img", instruction: "Klicka på 'Välj fil' under 'Social delningsbild' för att ladda upp din nya OpenGraph-bild (t.ex. för Facebook/LinkedIn)." },
        { target: "klick-seo-save", instruction: "Klicka på 'Spara inställningar' längst ner för att verkställa dina SEO-ändringar!" }
      ]
    };
  }

  if (p.includes("bild") || p.includes("galleri") || p.includes("portfolio") || p.includes("foto")) {
    return {
      message: "Så här lägger du till och redigerar dina bilder i ditt bildgalleri:",
      steps: [
        { target: "klick-nav-portfolio", instruction: "Klicka på 'Akt III: Portfolio' i sidomenyn." },
        { target: "klick-portfolio-upload", instruction: "Klicka här för att ladda upp en ny bild från din dator." },
        { target: "klick-portfolio-grid", instruction: "Här ser du alla dina uppladdade bilder där du kan sortera ordningen eller ange SEO alt-texter." },
        { target: "klick-portfolio-save", instruction: "Klicka på 'Spara ändringar' för att verkställa." }
      ]
    };
  }

  if (p.includes("showreel") || p.includes("video") || p.includes("vimeo") || p.includes("youtube")) {
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

  if (p.includes("röst") || p.includes("voiceover") || p.includes("boka")) {
    return {
      message: "Så här ändrar du rubrik och bokningsknapp i Röst-sektionen:",
      steps: [
        { target: "klick-nav-voice", instruction: "Klicka på 'Akt VI: Röst' i sidomenyn." },
        { target: "klick-voice-heading-sv", instruction: "Skriv den nya rubriken som lockar bokningar." },
        { target: "klick-voice-save", instruction: "Klicka på 'Spara ändringar'." }
      ]
    };
  }

  return {
    message: "Jag förstår inte riktigt vilken sektion du vill ändra. Prova att fråga om 'biografi', 'ljud', 'bilder', 'showreels', 'meriter' eller 'SEO'.",
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
Du är Therese Järvhedens backstage-assistent.
Svara på allmänna frågor om hur man använder CMS-panelen på ett trevligt, pedagogiskt och koncist sätt.
Svara alltid på svenska. Håll svaret lagom långt och begränsa det till ungefär 5-6 meningar. Undvik alltför långa utläggningar.
Inkludera ALDRIG JSON-kod eller målobjekt (target IDs) i dina svar.
`;

export async function getGeneralChatResponse(prompt: string, apiKey: string): Promise<string> {
  const cleanKey = apiKey.trim() || import.meta.env.VITE_GEMINI_API_KEY || "";
  
  if (!cleanKey) {
    // Simulated offline responses for general questions
    const p = prompt.toLowerCase();
    if (p.includes("seo") || p.includes("opengraph") || p.includes("og") || p.includes("delning") || p.includes("sökopt") || p.includes("social image")) {
      return "Inställningar för SEO och din sociala delningsbild (OpenGraph-bild) styrs under 'SEO & Inställningar' i sidomenyn, under fältet 'Social delningsbild'. Ladda INTE upp den i Portfolio-galleriet då delningsbilden kräver en dedikerad plats för att visas rätt på t.ex. Facebook och LinkedIn.";
    }
    if (p.includes("lösenord") || p.includes("logga in")) {
      return "För att logga in på admin-panelen använder du ditt registrerade lösenord i inloggningsskärmen. Kontakta administratören om du glömt lösenordet.";
    }
    if (p.includes("röst") || p.includes("ljud")) {
      return "Du kan ladda upp röstinspelningar och ljudklipp under sektionen 'Akt V: Meriter' genom att klicka på 'Visa Röstkommentar & Manus (Avancerat)' för respektive merit.";
    }
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
