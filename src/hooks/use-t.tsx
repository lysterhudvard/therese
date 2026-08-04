import { createContext, useContext, useState, useEffect, useMemo } from "react";

export type Lang = "sv" | "en";

export const I18N = {
  sv: {
    nav: {
      bio: "Start",
      portfolio: "Portfolio",
      showreels: "Showreels",
      credits: "Meriter",
      voice: "Röst & Dubbning",
      faq: "Vanliga frågor",
      contact: "Kontakt",
    },
    hero: {
      act: "Akt I — Ridåuppgång",
      line: '"En våldsam kärlek" — SVT dramadokumentär.',
      role: "Skådespelerska",
      base: "Malmö · Stockholm",
      scroll: "scrolla",
    },
    bio: {
      act: "Akt II — Biografi",
      heading: ["En skådespelerska med ", "bredd", " — från SVT-drama till komedi och röst."],
      director: "Regissörens manus · Stämning",
      moods: { Dramatic: "Dramatisk", Comedic: "Komisk", Classical: "Klassisk" },
      lines: {
        Dramatic: "Drama är något jag känner extra starkt för.",
        Comedic: "Komedi kräver samma precision som tragedi — bara snabbare.",
        Classical: "Scenen har lärt mig allt jag kan om tajming och tystnad.",
      },
      p1Pre: "Therese sågs senast i SVT:s uppmärksammade dramadokumentär ",
      p1Link: "En våldsam kärlek",
      p1Post:
        " i regi av Åsa Sandzén. Där gestaltar hon Victoria, en av de fyra kvinnor vars öden vi får följa. Serien handlar om våld i nära relationer — ett ämne som vi måste prata mer om, synliggöra och agera mot.",
      p2: [
        "Hon har spelat teater och musikal sedan barndomen. På TV har hon mest synts i humorproduktioner som Kristallennominerade ",
        "Karatefylla",
        ", komediserien ",
        "Jävla klåpare",
        " och andra humorprojekt — bland annat ",
        "Anna Blomberg show",
        " och ",
        "Jobbtjuven",
        ".",
      ],
      p3: [
        "Inom drama har vi även sett henne i Beck-filmen ",
        "Utan uppsåt",
        ", där hon gästspelade som läraren ",
        "Nora",
        ".",
      ],
      facts: [
        ["Bas", "Malmö / Stockholm"],
        ["Dialekt", "Skånsk · Rikssvenska"],
        ["Språk", "Svenska · Engelska"],
      ] as [string, string][],
    },
    portfolio: { act: "Akt III — Portfolio", title: ["Portfolio", "Bilder"], hint: "Scrolla för att se bilder." },
    credits: {
      act: "Akt V — Meriter",
      heading: ["Roller i ", "urval"],
      filters: {
        Alla: "Alla",
        Film: "Film",
        TV: "TV",
        Theater: "Teater",
        Voice: "Röst & Dubbning",
      } as Record<string, string>,
    },
    voice: {
      act: "Akt VI — Röst",
      heading: ["En ", "skånsk", " röst — warm, naturlig och självklar."],
      body: [
        "Therese är en professionell röstskådespelare och speakerröst som levererar både genuin skånska och ren rikssvenska för reklam, berättarröster, e-learning och dubbning (bland annat som mamman i SVT:s ",
        "Familjen Valentin",
        "). Med egen studio i Malmö och Stockholm levereras torra eller färdigredigerade filer i högsta kvalitet (WAV/MP3) inom 1–3 arbetsdagar, med möjlighet till regi på distans.",
      ],
      cta: "Boka röst",
      demo: "Demo via e-post",
    },
    contact: {
      act: "Akt VII — Kontakt",
      heading: ["Ta ett ", "möte", "."],
      agentLabel: "Skådespelerska — agentur",
      agentSub: "Schultzberg Agency",
      voiceLabel: "Röst — direkt",
      fields: { name: "Namn", email: "E-post", msg: "Meddelande" },
      submit: "Skicka",
      okTitle: "Ridån går upp.",
      okBody: (name: string) =>
        `Tack, ${name || "vän"}. Ditt meddelande är lämnat i regissörens händer. Återkoppling inom kort.`,
      again: "Skicka ytterligare ett meddelande",
    },
    footer: {
      act: "Akt VIII — Ridåfall",
      title: "Slut på showen",
      role: "Skådespelerska · Röst",
      agent: "Agent",
      social: "Sociala medier",
      photo: "Foto",
      end: "SLUT",
    },
    lang: { label: "Språk", sv: "Svenska", en: "English" },
  },
  en: {
    nav: {
      bio: "Home",
      portfolio: "Portfolio",
      showreels: "Showreels",
      credits: "Credits",
      voice: "Voice & Dubbing",
      faq: "FAQ",
      contact: "Contact",
    },
    hero: {
      act: "Act I — Rising Curtain",
      line: '"En våldsam kärlek" — SVT documentary drama.',
      role: "Actress",
      base: "Malmö · Stockholm",
      scroll: "scroll",
    },
    bio: {
      act: "Act II — Biography",
      heading: ["An actress with ", "range", " — from SVT drama to comedy and voice."],
      director: "Director's Script · Mood",
      moods: { Dramatic: "Dramatic", Comedic: "Comedic", Classical: "Classical" },
      lines: {
        Dramatic: "Drama is something I feel especially strongly about.",
        Comedic: "Comedy demands the same precision as tragedy — just faster.",
        Classical: "The stage taught me everything I know about timing and silence.",
      },
      p1Pre: "Therese was most recently seen in SVT's documentary drama ",
      p1Link: "En våldsam kärlek",
      p1Post:
        " where she played the role of Victoria, one of the four women whose fates we follow. The series is about intimate-partner violence — a societal issue we must talk about more, expose, and act on.",
      p2: [
        "She has performed theatre and musicals since childhood. On television she has appeared mostly in comedy productions such as the Kristallen-nominated ",
        "Karatefylla",
        ", the comedy series ",
        "Jävla klåpare",
        " and other comedy projects — including ",
        "Anna Blomberg show",
        " and ",
        "Jobbtjuven",
        ".",
      ],
      p3: [
        "Drama is something Therese feels especially strongly about. We have seen her in the Beck film ",
        "Utan uppsåt",
        ", where she guest-starred as the teacher ",
        "Nora",
        ".",
      ],
      facts: [
        ["Base", "Malmö / Stockholm"],
        ["Dialect", "Scanian · Standard Swedish"],
        ["Languages", "Swedish · English"],
      ] as [string, string][],
    },
    portfolio: { act: "Act III — Portfolio", title: ["Portfolio", "Images"], hint: "Scroll to view images." },
    credits: {
      act: "Act V — Credits",
      heading: ["Performance ", "Credits"],
      filters: {
        Alla: "All",
        Film: "Film",
        TV: "TV",
        Theater: "Theatre",
        Voice: "Voice",
      } as Record<string, string>,
    },
    voice: {
      act: "Act VI — Voice",
      heading: ["A ", "Scanian", " voice — warm, natural and genuine."],
      body: [
        "Therese is a professional voice actor and narrator delivering both authentic Scanian and standard Swedish for commercials, narration, e-learning, and dubbing (including the mother in SVT's ",
        "Familjen Valentin",
        "). Operating from her own studios in Malmö and Stockholm, she delivers high-quality master files (WAV/MP3) within 1–3 business days, with options for remote live direction.",
      ],
      cta: "Book voice",
      demo: "Demo via email",
    },
    contact: {
      act: "Act VII — Contact",
      heading: ["Take a ", "meeting", "."],
      agentLabel: "Actress — agency",
      agentSub: "Schultzberg Agency",
      voiceLabel: "Voice — direct",
      fields: { name: "Name", email: "Email", msg: "Message" },
      submit: "Send",
      okTitle: "Curtain rises.",
      okBody: (name: string) =>
        `Thank you, ${name || "friend"}. Your message is in the director's hands. You'll hear back shortly.`,
      again: "Send another message",
    },
    footer: {
      act: "Act VIII — Curtain Fall",
      title: "End of Show",
      role: "Actress · Voice",
      agent: "Agent",
      social: "Social",
      photo: "Photo",
      end: "THE END",
    },
    lang: { label: "Language", sv: "Svenska", en: "English" },
  },
};

export type Dict = typeof I18N.sv;

declare global {
  interface Window {
    __INITIAL_DB_DATA__?: any;
    Lighthouse?: any;
    __lighthouse__?: any;
  }
}

// Global reactive states for Astro independent islands
let currentLang: Lang = "sv";
let globalDbData: any = null;
const langListeners = new Set<(l: Lang) => void>();
const dbDataListeners = new Set<(d: any) => void>();

if (typeof window !== "undefined") {
  const saved = window.localStorage.getItem("tj-lang") as Lang | null;
  if (saved === "sv" || saved === "en") {
    currentLang = saved;
    document.documentElement.lang = saved;
  }
  if (window.__INITIAL_DB_DATA__) {
    globalDbData = window.__INITIAL_DB_DATA__;
  }
}

export const setGlobalDbData = (data: any) => {
  globalDbData = data;
  dbDataListeners.forEach((lis) => lis(data));
};

export const useT = (componentDbData?: any) => {
  const [lang, setLangState] = useState<Lang>(currentLang);
  
  const getInitialDbData = () => {
    if (globalDbData) return globalDbData;
    if (componentDbData) return componentDbData;
    if (typeof window !== "undefined" && window.__INITIAL_DB_DATA__) return window.__INITIAL_DB_DATA__;
    return null;
  };

  const [dbData, setDbData] = useState<any>(getInitialDbData);

  if (componentDbData && !globalDbData) {
    globalDbData = componentDbData;
  }

  useEffect(() => {
    const handleLangUpdate = (l: Lang) => setLangState(l);
    langListeners.add(handleLangUpdate);
    return () => {
      langListeners.delete(handleLangUpdate);
    };
  }, []);

  useEffect(() => {
    const handleDataUpdate = (d: any) => setDbData(d);
    dbDataListeners.add(handleDataUpdate);
    return () => {
      dbDataListeners.delete(handleDataUpdate);
    };
  }, []);

  const setLang = (l: Lang) => {
    if (currentLang === l) return;
    currentLang = l;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tj-lang", l);
      document.documentElement.lang = l;
    }
    langListeners.forEach((lis) => lis(l));
  };

  // Merge the translations exactly as before
  const mergedT = useMemo(() => {
    const deepClone = (obj: any): any => {
      if (obj === null || typeof obj !== "object") return obj;
      if (typeof obj === "function") return obj;
      if (Array.isArray(obj)) return obj.map(deepClone);
      const cloned: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = deepClone(obj[key]);
        }
      }
      return cloned;
    };

    const base = deepClone(I18N[lang]);
    
    if (dbData?.biography) {
      const bio = dbData.biography;
      
      let heroLine = lang === "sv" ? bio.hero_text_sv : bio.hero_text_en;
      
      if (bio.is_automated && dbData.credits && dbData.credits.length > 0) {
        const currentProd = dbData.credits.find((c: any) => c.is_current_production);
        if (currentProd) {
          const title = currentProd.title;
          const role = lang === "sv" ? currentProd.role.sv : currentProd.role.en;
          const details = currentProd.network || (lang === "sv" ? currentProd.category.sv : currentProd.category.en);
          heroLine = `"${title}" — ${role} (${details}).`;
        }
      }
      
      if (heroLine) {
        base.hero.line = heroLine;
      }

      const heroRole = lang === "sv" ? bio.hero_role_sv : bio.hero_role_en;
      if (heroRole) {
        base.hero.role = heroRole;
      }
      
      const heroBase = lang === "sv" ? bio.hero_base_sv : bio.hero_base_en;
      if (heroBase) {
        base.hero.base = heroBase;
      }
      
      const heading = lang === "sv" ? bio.heading_sv : bio.heading_en;
      if (heading) {
        base.bio.heading = [heading, "", ""];
      }
      
      const p1 = lang === "sv" ? bio.paragraph1_sv : bio.paragraph1_en;
      if (p1) {
        base.bio.p1Post = p1;
        base.bio.p1Pre = "";
        base.bio.p1Link = "";
      }
      const p2 = lang === "sv" ? bio.paragraph2_sv : bio.paragraph2_en;
      if (p2) {
        base.bio.p2 = [p2, "", "", "", "", "", "", "", ""];
      }
      const p3 = lang === "sv" ? bio.paragraph3_sv : bio.paragraph3_en;
      if (p3) {
        base.bio.p3 = [p3, "", "", "", ""];
      }
      
      if (bio.dialects_sv || bio.languages_sv) {
        const dialects = lang === "sv" ? bio.dialects_sv : bio.dialects_en;
        const languages = lang === "sv" ? bio.languages_sv : bio.languages_en;
        
        base.bio.facts = [
          [lang === "sv" ? "Bas" : "Base", "Malmö / Stockholm"],
          [lang === "sv" ? "Dialekt" : "Dialect", dialects || ""],
          [lang === "sv" ? "Språk" : "Language", languages || ""],
        ];
      } else if (bio.facts) {
        try {
          const parsedFacts = typeof bio.facts === "string" ? JSON.parse(bio.facts) : bio.facts;
          if (Array.isArray(parsedFacts)) {
            base.bio.facts = parsedFacts.map((f: any) => {
              const key = lang === "sv" ? f.key_sv : f.key_en;
              const val = lang === "sv" ? f.val_sv : f.val_en;
              return [key, val];
            });
          }
        } catch (e) {
          console.error("Failed to parse bio facts:", e);
        }
      }

      const dramaticQuote = lang === "sv" ? (bio.quote_sv || bio.quote_dramatic_sv) : (bio.quote_en || bio.quote_dramatic_en);
      if (dramaticQuote) base.bio.lines.Dramatic = dramaticQuote;
      
      const comedicQuote = lang === "sv" ? bio.quote_comedic_sv : bio.quote_comedic_en;
      if (comedicQuote) base.bio.lines.Comedic = comedicQuote;
      
      const classicalQuote = lang === "sv" ? bio.quote_classical_sv : bio.quote_classical_en;
      if (classicalQuote) base.bio.lines.Classical = classicalQuote;

      if (bio.voice_settings) {
        try {
          const vs = typeof bio.voice_settings === "string" ? JSON.parse(bio.voice_settings) : bio.voice_settings;
          if (vs) {
            if (lang === "sv") {
              if (vs.heading_sv) base.voice.heading = [vs.heading_sv, "", ""];
              if (vs.body_sv) base.voice.body = [vs.body_sv, "", ""];
              if (vs.cta_sv) base.voice.cta = vs.cta_sv;
              if (vs.demo_sv) base.voice.demo = vs.demo_sv;
            } else {
              if (vs.heading_en) base.voice.heading = [vs.heading_en, "", ""];
              if (vs.body_en) base.voice.body = [vs.body_en, "", ""];
              if (vs.cta_en) base.voice.cta = vs.cta_en;
              if (vs.demo_en) base.voice.demo = vs.demo_en;
            }
          }
        } catch (e) {
          console.error("Failed to parse voice settings:", e);
        }
      }
    }
    
    return base as Dict;
  }, [dbData, lang]);

  return { lang, setLang, t: mergedT };
};

// Global reactive store for CommentaryPlayer
export interface CommentaryData {
  title: string;
  role: string;
  url: string;
  text: string;
}

let activeCommentary: CommentaryData | null = null;
const commentaryListeners = new Set<(c: CommentaryData | null) => void>();

export function getActiveCommentary() {
  return activeCommentary;
}

export function playCommentary(data: CommentaryData) {
  activeCommentary = data;
  commentaryListeners.forEach((lis) => lis(data));
}

export function stopCommentary() {
  activeCommentary = null;
  commentaryListeners.forEach((lis) => lis(null));
}

export function useCommentaryStore() {
  const [active, setActive] = useState<CommentaryData | null>(activeCommentary);
  useEffect(() => {
    const handleCommentaryUpdate = (c: CommentaryData | null) => setActive(c);
    commentaryListeners.add(handleCommentaryUpdate);
    return () => {
      commentaryListeners.delete(handleCommentaryUpdate);
    };
  }, []);
  return { active, playCommentary, stopCommentary };
}

// Keep LangContext for backward compatibility
export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "sv",
  setLang: () => {},
  t: I18N.sv as Dict,
});
