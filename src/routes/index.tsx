import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useT, type Lang, LangContext, I18N, type Dict } from "../hooks/use-t";
import { Nav } from "../components/Nav";
import { Spotlight } from "../components/ui/Spotlight";
import { CommentaryPlayer } from "../components/ui/CommentaryPlayer";
import { Hero } from "../components/sections/Hero";
import { Biography } from "../components/sections/Biography";
import { Portfolio } from "../components/sections/Portfolio";
import { Showreels } from "../components/sections/Showreels";
import { Credits } from "../components/sections/Credits";
import { Voice } from "../components/sections/Voice";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/sections/Footer";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { type VideoItem } from "../components/sections/ShowreelsData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Therese Järvheden — Skådespelerska" },
      {
        name: "description",
        content:
          "Swedish actress Therese Järvheden. Drama, comedy, voice. SVT 'En våldsam kärlek', 'Karatefylla', Beck — 'Utan uppsåt'.",
      },
      { property: "og:title", content: "Therese Järvheden — Skådespelerska" },
      {
        property: "og:description",
        content: "Swedish actress Therese Järvheden. Drama, comedy, voice.",
      },
      {
        property: "og:image",
        content:
          "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
      },
    ],
  }),
  component: Page,
});

/* ---------- Asset constants (scraped from theresejarvheden.se) ---------- */
export const IMG = {
  hero: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
  bioA: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000012-8d9138d916/Thess0822_lowres.jpg?ph=a6c2528650",
  voice:
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000001-a2d05a2d07/unnamed-5.jpg?ph=a6c2528650",
  feature:
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000031-558e7558ea/image-crop-200000013-8.jpeg?ph=a6c2528650",
  portfolio: [
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000028-5883458837/image-crop-200000014-6.jpeg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000032-c5f44c5f47/Thess0972_bw_highres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000015-689df689e2/Thess0903_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000036-5c2c05c2c2/Thess1110_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000013-289ef289f3/Thess0862_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000010-3743037433/Thess0609_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000037-4aeb44aeb6/Thess1093_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000044-20e3320e36/Thess0564_highres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000045-8549a8549d/Thess0972_highres-5.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000046-2484224845/Thess1078_lowres.jpg?ph=a6c2528650",
  ],
};

export type Credit = {
  year: string;
  title: string;
  role: { sv: string; en: string };
  type: "TV" | "Film" | "Voice" | "Theater";
  category: { sv: string; en: string };
  network: string;
  url?: string;
  img: string;
  is_current_production?: boolean;
  commentary?: {
    url: string;
    duration: string;
    svText: string;
    enText: string;
  };
  script?: {
    scene: string;
    dialogue: {
      char: string;
      line: { sv: string; en: string };
    };
  };
};

export const CREDITS: Credit[] = [
  {
    year: "2024",
    title: "En våldsam kärlek",
    role: { sv: "Ensemble — en av fyra kvinnor", en: "Ensemble — one of four women" },
    type: "TV",
    category: { sv: "Drama", en: "Drama" },
    network: "SVT",
    url: "https://www.svtplay.se/en-valdsam-karlek",
    img: IMG.hero,
    commentary: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "0:15",
      svText:
        "Det var en emotionellt utmanande roll, men oerhört viktig att berätta för att uppmärksamma kvinnofrid och våld i nära relationer.",
      enText:
        "It was an emotionally challenging role, but incredibly important to tell to draw attention to domestic abuse and relationship violence.",
    },
    script: {
      scene: "SCENE 4 - INT. APARTMENT - NIGHT",
      dialogue: {
        char: "THERESE",
        line: {
          sv: "Vi måste prata om det här. Vi kan inte låtsas som ingenting längre.",
          en: "We need to talk about this. We can't pretend it's nothing anymore.",
        },
      },
    },
  },
  {
    year: "2023",
    title: "Beck — Utan uppsåt",
    role: { sv: "Nora (lärare)", en: "Nora (teacher)" },
    type: "Film",
    category: { sv: "Drama", en: "Drama" },
    network: "Filmlance / C More",
    img: IMG.bioA,
    commentary: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "0:12",
      svText:
        "Att spela Nora i Beck var fantastiskt. Hon bär på en tyst intensitet som gör varje blick laddad.",
      enText:
        "Playing Nora in Beck was fantastic. She carries a quiet intensity that makes every look charged.",
    },
    script: {
      scene: "SCENE 17 - INT. CLASSROOM - DAY",
      dialogue: {
        char: "NORA",
        line: {
          sv: "Alla slår upp sidan fyrtiotvå. Vi har inte mycket tid kvar.",
          en: "Everyone open to page forty-two. We don't have much time left.",
        },
      },
    },
  },
  {
    year: "2021",
    title: "Karatefylla",
    role: { sv: "Återkommande roll", en: "Recurring role" },
    type: "TV",
    category: { sv: "Komedi", en: "Comedy" },
    network: "SVT",
    img: IMG.feature,
    script: {
      scene: "SCENE 8 - INT. BAR - NIGHT",
      dialogue: {
        char: "TJEJEN",
        line: {
          sv: "Ska du ha en stor stark eller ska du bara stå där och titta?",
          en: "Are you having a big beer or are you just going to stand there and watch?",
        },
      },
    },
  },
  {
    year: "2020",
    title: "Jävla klåpare",
    role: { sv: "Återkommande roll", en: "Recurring role" },
    type: "TV",
    category: { sv: "Komedi", en: "Comedy" },
    network: "SVT",
    img: IMG.portfolio[3],
    script: {
      scene: "SCENE 12 - INT. OFFICE - DAY",
      dialogue: {
        char: "KUNDEN",
        line: {
          sv: "Det här är helt oacceptabelt. Vem är ansvarig här?",
          en: "This is completely unacceptable. Who is in charge here?",
        },
      },
    },
  },
  {
    year: "2019",
    title: "Anna Blomberg show",
    role: { sv: "Sketch ensemble", en: "Sketch ensemble" },
    type: "TV",
    category: { sv: "Komedi", en: "Comedy" },
    network: "SVT",
    img: IMG.portfolio[5],
  },
  {
    year: "2018",
    title: "Jobbtjuven",
    role: { sv: "Återkommande roll", en: "Recurring role" },
    type: "TV",
    category: { sv: "Komedi", en: "Comedy" },
    network: "SVT",
    img: IMG.portfolio[7],
  },
  {
    year: "—",
    title: "Familjen Valentin",
    role: { sv: "Mamman (röst, dubb)", en: "The mother (voice, dub)" },
    type: "Voice",
    category: { sv: "Animation", en: "Animation" },
    network: "Barnkanalen",
    img: IMG.voice,
  },
  {
    year: "—",
    title: "Radio- & TV-reklam",
    role: { sv: "Röst (skånsk dialekt)", en: "Voice (Scanian dialect)" },
    type: "Voice",
    category: { sv: "Reklam", en: "Commercials" },
    network: "Diverse",
    img: IMG.portfolio[1],
  },
  {
    year: "—",
    title: "Teater & Musikal",
    role: { sv: "Diverse roller", en: "Various roles" },
    type: "Theater",
    category: { sv: "Scen", en: "Stage" },
    network: "Diverse uppsättningar",
    img: IMG.portfolio[10],
  },
];

export const REVIEW_QUOTES_SV = [
  "en närvaro som river ner väggar",
  "en av fyra kvinnor vi får följa",
  "skånsk röst — varm, rå, omedelbar",
  "drama som hon känner extra starkt för",
  "närvarande, sårbar, exakt",
];
export const REVIEW_QUOTES_EN = [
  "a presence that tears down walls",
  "one of four women we follow",
  "Scanian voice — warm, raw, immediate",
  "drama she feels especially strongly about",
  "present, vulnerable, precise",
];

export const MOOD_DATA = {
  Dramatic: { image: IMG.hero, weight: 300 },
  Comedic: {
    image:
      "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000044-20e3320e36/Thess0564_highres.jpg?ph=a6c2528650",
    weight: 500,
  },
  Classical: { image: IMG.feature, weight: 400 },
} as const;

export type Mood = keyof typeof MOOD_DATA;
export type FilterKey = "Alla" | "Film" | "TV" | "Theater" | "Voice";

/* ---------- Page ---------- */
function Page() {
  const [heroDone, setHeroDone] = useState(false);
  const [lang, setLangState] = useState<Lang>("sv");
  const [isInPortfolio, setIsInPortfolio] = useState(false);
  const [activeCommentary, setActiveCommentary] = useState<{
    title: string;
    role: string;
    url: string;
    text: string;
  } | null>(null);

  const [dbData, setDbData] = useState<{
    biography: any;
    credits: Credit[];
    showreels: VideoItem[];
    seo: any;
    portfolioImages: string[];
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("portfolio");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInPortfolio(entry.isIntersecting);
      },
      {
        rootMargin: "-10% 0px -10% 0px",
        threshold: 0.05,
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("tj-lang") as Lang | null;
    if (saved === "sv" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("tj-lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  // Load all live Supabase data
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const loadAllData = async () => {
      try {
        const [bioRes, credsRes, reelsRes, seoRes, portRes] = await Promise.all([
          supabase.from("biography").select("*").eq("id", "main").maybeSingle(),
          supabase.from("credits").select("*").order("sort_order", { ascending: true }),
          supabase.from("showreels").select("*").order("sort_order", { ascending: true }),
          supabase.from("seo_settings").select("*").eq("id", "main").maybeSingle(),
          supabase.from("portfolio_images").select("*").order("sort_order", { ascending: true })
        ]);

        // Map credits
        const mappedCredits = (credsRes.data || []).map((c: any): Credit => {
          const credit: Credit = {
            year: c.year || "—",
            title: c.title || "",
            role: { sv: c.role_sv || "", en: c.role_en || "" },
            type: c.type as "TV" | "Film" | "Voice" | "Theater",
            category: { sv: c.category_sv || "", en: c.category_en || "" },
            network: c.network || "",
            url: c.url || undefined,
            img: c.img || "",
            is_current_production: c.is_current_production
          };
          if (c.commentary_url) {
            credit.commentary = {
              url: c.commentary_url,
              duration: c.commentary_duration || "0:10",
              svText: c.commentary_sv || "",
              enText: c.commentary_en || ""
            };
          }
          if (c.script_scene) {
            credit.script = {
              scene: c.script_scene,
              dialogue: {
                char: c.script_char || "CHARACTER",
                line: {
                  sv: c.script_line_sv || "",
                  en: c.script_line_en || ""
                }
              }
            };
          }
          return credit;
        });

        // Map showreels
        const mappedShowreels = (reelsRes.data || []).map((r: any): VideoItem => {
          return {
            id: r.id || String(r.sort_order),
            title: { sv: r.title_sv || "", en: r.title_en || "" },
            sub: { sv: r.sub_sv || "", en: r.sub_en || "" },
            url: r.url || undefined,
            vimeoId: r.vimeo_id || undefined,
            youtubeId: r.youtube_id || undefined,
            poster: r.poster || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
            genre: r.genre || "SHOWREEL",
            specs: r.specs || "16:9 // HD",
            glow: r.glow || "rgba(235, 94, 40, 0.15)"
          };
        });

        // Map portfolio images
        const mappedImages = (portRes.data || []).map((p: any) => p.url);

        setDbData({
          biography: bioRes.data,
          credits: mappedCredits,
          showreels: mappedShowreels,
          seo: seoRes.data,
          portfolioImages: mappedImages.length > 0 ? mappedImages : IMG.portfolio
        });
      } catch (e) {
        console.error("Failed to load live Supabase data:", e);
      }
    };

    loadAllData();
  }, []);

  // Dynamically update head tags for SEO optimization based on DB settings
  useEffect(() => {
    if (!dbData?.seo) return;
    const seo = dbData.seo;
    const title = lang === "sv" ? seo.title_sv : seo.title_en;
    const desc = lang === "sv" ? seo.description_sv : seo.description_en;
    if (title) {
      document.title = title;
    }
    if (desc) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', desc);
    }
    if (seo.og_image) {
      let metaOgImg = document.querySelector('meta[property="og:image"]');
      if (!metaOgImg) {
        metaOgImg = document.createElement('meta');
        metaOgImg.setAttribute('property', 'og:image');
        document.head.appendChild(metaOgImg);
      }
      metaOgImg.setAttribute('content', seo.og_image);
    }
  }, [dbData, lang]);

  const reviewQuotes = useMemo(() => {
    if (dbData?.biography?.review_quotes) {
      try {
        const parsed = typeof dbData.biography.review_quotes === "string"
          ? JSON.parse(dbData.biography.review_quotes)
          : dbData.biography.review_quotes;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((q: any) => lang === "sv" ? q.sv : q.en);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return lang === "sv" ? REVIEW_QUOTES_SV : REVIEW_QUOTES_EN;
  }, [dbData, lang]);

  const mergedMoodData = useMemo(() => {
    const base = { ...MOOD_DATA };
    if (dbData?.biography?.mood_images) {
      try {
        const parsed = typeof dbData.biography.mood_images === "string"
          ? JSON.parse(dbData.biography.mood_images)
          : dbData.biography.mood_images;
        if (parsed) {
          if (parsed.dramatic) base.Dramatic = { ...base.Dramatic, image: parsed.dramatic };
          if (parsed.comedic) base.Comedic = { ...base.Comedic, image: parsed.comedic };
          if (parsed.classical) base.Classical = { ...base.Classical, image: parsed.classical };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return base;
  }, [dbData]);

  const mergedT = useMemo(() => {
    // Start with static translations
    const base = JSON.parse(JSON.stringify(I18N[lang]));
    
    // Override biography fields if available in database
    if (dbData?.biography) {
      const bio = dbData.biography;
      
      // 1. Hero text (either static hero_text, or sync'ed from active production)
      let heroLine = lang === "sv" ? bio.hero_text_sv : bio.hero_text_en;
      
      if (bio.is_automated && dbData.credits && dbData.credits.length > 0) {
        // Find current production credit
        const currentProd = dbData.credits.find((c) => c.is_current_production);
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
      
      // 2. Biography headings and texts
      const heading = lang === "sv" ? bio.heading_sv : bio.heading_en;
      if (heading) {
        base.bio.heading = [heading, "", ""];
      }
      
      // Paragraphs
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
      
      // Facts
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

      // Dialogues/mood lines
      const dramaticQuote = lang === "sv" ? (bio.quote_sv || bio.quote_dramatic_sv) : (bio.quote_en || bio.quote_dramatic_en);
      if (dramaticQuote) base.bio.lines.Dramatic = dramaticQuote;
      
      const comedicQuote = lang === "sv" ? bio.quote_comedic_sv : bio.quote_comedic_en;
      if (comedicQuote) base.bio.lines.Comedic = comedicQuote;
      
      const classicalQuote = lang === "sv" ? bio.quote_classical_sv : bio.quote_classical_en;
      if (classicalQuote) base.bio.lines.Classical = classicalQuote;

      // 3. Voice settings
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
    
    return base;
  }, [dbData, lang]);

  const ctx = useMemo(() => ({ lang, setLang, t: mergedT }), [lang, mergedT]);

  return (
    <LangContext.Provider value={ctx}>
      <main className="relative bg-stage text-bone selection:bg-ember selection:text-ink">
        <Spotlight />
        <Nav heroDone={heroDone} />

        {/* Cinematic Anamorphic Scope Bars (Point 1) */}
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[65] bg-ink transition-transform duration-[750ms] ease-in-out h-[8vh] md:h-[12vh]"
          style={{
            transform: isInPortfolio ? "translateY(0)" : "translateY(-100%)",
          }}
        />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[65] bg-ink transition-transform duration-[750ms] ease-in-out h-[8vh] md:h-[12vh]"
          style={{
            transform: isInPortfolio ? "translateY(0)" : "translateY(100%)",
          }}
        />

        <Hero onDone={() => setHeroDone(true)} heroDone={heroDone} />
        <Biography moodData={mergedMoodData} faqs={dbData?.biography?.faqs} />
        <Portfolio images={dbData?.portfolioImages} />
        <Showreels videos={dbData?.showreels} />
        <Credits
          credits={dbData?.credits}
          reviewQuotes={reviewQuotes}
          activeCommentaryUrl={activeCommentary?.url}
          onPlayCommentary={setActiveCommentary}
        />
        <Voice />
        <Contact />
        <Footer bioData={dbData?.biography} />

        {/* Dynamic JSON-LD structured data for SEO/AEO search optimization */}
        {dbData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify([
                {
                  "@context": "https://schema.org",
                  "@type": "Person",
                  "name": "Therese Järvheden",
                  "jobTitle": lang === "sv" ? "Skådespelerska" : "Actress",
                  "description": lang === "sv" ? dbData.seo?.description_sv : dbData.seo?.description_en,
                  "image": dbData.portfolioImages?.[0] || IMG.hero,
                  "url": "https://theresejarvheden.se",
                  "knowsLanguage": ["sv", "en"],
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Malmö",
                    "addressCountry": "SE"
                  },
                  "sponsor": {
                    "@type": "Organization",
                    "name": "Schultzberg Agency",
                    "url": "https://schultzbergagency.com"
                  }
                },
                ...(dbData.biography?.faqs && Array.isArray(dbData.biography.faqs) && dbData.biography.faqs.length > 0
                  ? [
                      {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": dbData.biography.faqs.map((faq: any) => ({
                          "@type": "Question",
                          "name": lang === "sv" ? faq.q_sv : faq.q_en,
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": lang === "sv" ? faq.a_sv : faq.a_en
                          }
                        }))
                      }
                    ]
                  : [])
              ])
            }}
          />
        )}

        <AnimatePresence>
          {activeCommentary && (
            <CommentaryPlayer
              title={activeCommentary.title}
              role={activeCommentary.role}
              url={activeCommentary.url}
              text={activeCommentary.text}
              onClose={() => setActiveCommentary(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </LangContext.Provider>
  );
}
