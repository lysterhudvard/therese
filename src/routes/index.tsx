import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useT, type Lang, LangContext, I18N } from "../hooks/use-t";
import { Nav } from "../components/Nav";
import { Spotlight } from "../components/ui/Spotlight";
import { CommentaryPlayer } from "../components/ui/CommentaryPlayer";
import { Biography } from "../components/sections/Biography";
import { Portfolio } from "../components/sections/Portfolio";
import { Showreels } from "../components/sections/Showreels";
import { Credits } from "../components/sections/Credits";
import { Voice } from "../components/sections/Voice";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/sections/Footer";
import { type VideoItem } from "../components/sections/ShowreelsData";


import { type Credit } from "../types";

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

/* ---------- Page ---------- */
export default function Page({ initialDbData }: { initialDbData?: any }) {
  const [lang, setLangState] = useState<Lang>("sv");
  const [isInPortfolio, setIsInPortfolio] = useState(false);
  const [activeCommentary, setActiveCommentary] = useState<{
    title: string;
    role: string;
    url: string;
    text: string;
  } | null>(null);

  const dbData = initialDbData as {
    biography: any;
    credits: Credit[];
    showreels: VideoItem[];
    seo: any;
    portfolioImages: any[];
  } | null;

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
    return lang === "sv" ? [
      "en närvaro som river ner väggar",
      "en av fyra kvinnor vi får följa",
      "skånsk röst — varm, rå, omedelbar",
      "drama som hon känner extra starkt för",
      "närvarande, sårbar, exakt",
    ] : [
      "a presence that tears down walls",
      "one of four women we follow",
      "Scanian voice — warm, raw, immediate",
      "drama she feels especially strongly about",
      "present, vulnerable, precise",
    ];
  }, [dbData, lang]);

  const parsedSections = useMemo(() => {
    if (dbData?.biography?.bio_sections) {
      try {
        const sections = typeof dbData.biography.bio_sections === "string"
          ? JSON.parse(dbData.biography.bio_sections)
          : dbData.biography.bio_sections;
        if (Array.isArray(sections) && sections.length > 0) {
          return sections;
        }
      } catch (e) {
        console.error("Failed to parse bio sections:", e);
      }
    }
    return undefined;
  }, [dbData]);

  const voiceImageData = useMemo(() => {
    let url = "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000001-a2d05a2d07/unnamed-5.jpg?ph=a6c2528650";
    let alt = "Therese — röst";
    let title = "";
    let caption = "";
    if (dbData?.biography?.voice_settings) {
      try {
        const vs = typeof dbData.biography.voice_settings === "string"
          ? JSON.parse(dbData.biography.voice_settings)
          : dbData.biography.voice_settings;
        if (vs) {
          if (vs.hasOwnProperty("image_url") && vs.image_url) {
            url = vs.image_url;
          }
          if (vs.image_alt) alt = vs.image_alt;
          if (vs.image_title) title = vs.image_title;
          if (vs.image_caption) caption = vs.image_caption;
        }
      } catch (e) {
        console.error("Failed to parse voice settings image:", e);
      }
    }
    return { url, alt, title, caption };
  }, [dbData]);

  const imageCredits = useMemo(() => {
    if (dbData?.biography?.bio_image_credits_sv || dbData?.biography?.bio_image_credits_en) {
      return {
        sv: dbData.biography.bio_image_credits_sv || "",
        en: dbData.biography.bio_image_credits_en || ""
      };
    }
    return undefined;
  }, [dbData]);

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
    
    return base;
  }, [dbData, lang]);

  const ctx = useMemo(() => ({ lang, setLang, t: mergedT }), [lang, mergedT]);

  return (
    <LangContext.Provider value={ctx}>
      <main className="relative bg-stage text-bone selection:bg-ember selection:text-ink">
        <Spotlight />
        <Nav />

        {/* Cinematic Anamorphic Scope Bars */}
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
        <Biography 
          sections={parsedSections} 
          imageCredits={imageCredits} 
          faqs={dbData?.biography?.faqs} 
        />
        <Portfolio images={dbData?.portfolioImages} />
        {dbData?.showreels && dbData.showreels.length > 0 ? (
          <Showreels videos={dbData.showreels} />
        ) : (
          <Showreels />
        )}
        <Credits
          credits={dbData?.credits}
          reviewQuotes={reviewQuotes}
          activeCommentaryUrl={activeCommentary?.url}
          onPlayCommentary={setActiveCommentary}
        />
        <Voice 
          imageUrl={voiceImageData.url} 
          imageAlt={voiceImageData.alt} 
          imageTitle={voiceImageData.title}
          imageCaption={voiceImageData.caption}
        />
        <Contact bioData={dbData?.biography} />
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
                  "image": dbData.portfolioImages?.[0]?.url || "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
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
