import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, HelpCircle, FileText, Quote, Image, Link2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";

interface BioSection {
  id: string;
  title_sv: string;
  title_en: string;
  quote_sv: string;
  quote_en: string;
  image: string;
  image_alt?: string;
  image_caption?: string;
  image_title?: string;
  image_filename?: string;
  description?: string;
  weight?: number;
}

interface FAQItem {
  id: string;
  q: { sv: string; en: string };
  a: { sv: string; en: string };
}

interface ReviewQuoteItem {
  id: string;
  sv: string;
  en: string;
}

interface ReviewQuoteItem {
  id: string;
  sv: string;
  en: string;
}

export function DashboardBio() {
  // Biography Headings & Paragraphs
  const [headingSv, setHeadingSv] = useState("En skådespelerska med bredd — från SVT-drama till komedi och röst.");
  const [headingEn, setHeadingEn] = useState("An actress with range — from SVT drama to comedy and voice.");
  const [paragraph1Sv, setParagraph1Sv] = useState("Therese var senast aktuell i SVT:s dramadokumentär En våldsam kärlek där hon spelade en av de fyra kvinnor vi fick följa. Serien handlar om våld i nära relationer — en samhällsfråga vi måste prata mer om, belysa dess problematik och börja agera.");
  const [paragraph1En, setParagraph1En] = useState("Therese was most recently seen in SVT's documentary drama En våldsam kärlek where she played one of the four women we follow. The series is about intimate-partner violence — a societal issue we must talk about more, expose, and act on.");
  const [paragraph2Sv, setParagraph2Sv] = useState("Hon har spelat teater och musikal sedan hon var barn. I TV har hon mestadels medverkat i humorproduktioner som Kristallennominerade Karatefylla, humorserien Jävla klåpare samt andra humorprojekt — bl.a. Anna Blomberg show och Jobbtjuven.");
  const [paragraph2En, setParagraph2En] = useState("She has performed theatre and musicals since childhood. On television she has appeared mostly in comedy productions such as the Kristallen-nominated Karatefylla, the comedy series Jävla klåpare, and other comedy projects — including the Anna Blomberg show and Jobbtjuven.");
  const [paragraph3Sv, setParagraph3Sv] = useState("Drama är något som Therese känner extra starkt för. Vi har sett henne bland annat i Beck-filmen Utan uppsåt, där hon gästspelade rollen som läraren Nora.");
  const [paragraph3En, setParagraph3En] = useState("Drama is something Therese feels especially strongly about. We've seen her in the Beck film Utan uppsåt, where she guest-starred as the teacher Nora.");

  // Facts
  const [dialectsSv, setDialectsSv] = useState("Skånsk · Rikssvenska");
  const [dialectsEn, setDialectsEn] = useState("Scanian · Standard Swedish");
  const [languagesSv, setLanguagesSv] = useState("Svenska · Engelska");
  const [languagesEn, setLanguagesEn] = useState("Swedish · English");

  // Dynamic Biography Sections (Dramatisk, Komisk, Klassisk, or custom)
  const [bioSections, setBioSections] = useState<BioSection[]>([
    {
      id: "Dramatic",
      title_sv: "Dramatisk",
      title_en: "Dramatic",
      quote_sv: "Drama är något jag känner extra starkt för.",
      quote_en: "Drama is something I feel especially strongly about.",
      image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
      weight: 300
    },
    {
      id: "Comedic",
      title_sv: "Komisk",
      title_en: "Comedic",
      quote_sv: "Komedi kräver samma precision som tragedi — bara snabbare.",
      quote_en: "Comedy demands the same precision as tragedy — just faster.",
      image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
      weight: 500
    },
    {
      id: "Classical",
      title_sv: "Klassisk",
      title_en: "Classical",
      quote_sv: "Scenen lärde mig allt jag vet om timing och tystnad.",
      quote_en: "The stage taught me everything I know about timing and silence.",
      image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
      weight: 400
    }
  ]);

  // Image credits
  const [imageCreditsSv, setImageCreditsSv] = useState("Foto: Robert Eldrim\nSmink: Sara Zetterström");
  const [imageCreditsEn, setImageCreditsEn] = useState("Photo: Robert Eldrim\nMakeup: Sara Zetterström");

  // Media picker helpers
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activePickingSectionId, setActivePickingSectionId] = useState<string | null>(null);

  // FAQs List for AEO Schema
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: "faq-1",
      q: { sv: "Vilka serier har Therese medverkat i?", en: "What series has Therese appeared in?" },
      a: {
        sv: "Therese har medverkat i Karatefylla (SVT), Jävla klåpare (SVT), Anna Blomberg show och Beck — Utan uppsåt.",
        en: "Therese has appeared in Karatefylla (SVT), Jävla klåpare (SVT), Anna Blomberg show, and Beck — Utan uppsåt.",
      },
    },
  ]);

  // Background Quotes
  const [reviewQuotes, setReviewQuotes] = useState<ReviewQuoteItem[]>([
    { id: "quote-1", sv: "en närvaro som river ner väggar", en: "a presence that tears down walls" },
    { id: "quote-2", sv: "en av fyra kvinnor vi får följa", en: "one of four women we follow" },
    { id: "quote-3", sv: "skånsk röst — varm, rå, omedelbar", en: "Scanian voice — warm, raw, immediate" },
    { id: "quote-4", sv: "drama som hon känner extra starkt för", en: "drama she feels especially strongly about" },
    { id: "quote-5", sv: "närvarande, sårbar, exakt", en: "present, vulnerable, precise" }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchBioData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("quote_sv, quote_en, dialects_sv, dialects_en, languages_sv, languages_en, faqs, heading_sv, heading_en, paragraph1_sv, paragraph1_en, paragraph2_sv, paragraph2_en, paragraph3_sv, paragraph3_en, review_quotes, quote_comedic_sv, quote_comedic_en, quote_classical_sv, quote_classical_en, mood_images, footer_image, footer_end_sv, footer_end_en, footer_credits, bio_image_credits_sv, bio_image_credits_en, bio_sections")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.warn("Could not load full biography schema, trying fallback to core schema:", error.message);
        
        toast.warning(
          "Vissa biografi-kolumner saknas i databasen. För full funktionalitet, kör 'supabase_migration_5.sql' i din Supabase SQL Editor.",
          { duration: 6000 }
        );

        // Fallback to core biography schema query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("biography")
          .select("quote_sv, quote_en, dialects_sv, dialects_en, languages_sv, languages_en")
          .eq("id", "main")
          .maybeSingle();

        if (fallbackError) {
          console.error("Core schema load failed:", fallbackError);
          toast.error(`Kunde inte ladda biografi: ${fallbackError.message}`);
          setIsLoading(false);
          return;
        }

        if (fallbackData) {
          setDialectsSv(fallbackData.dialects_sv || "");
          setDialectsEn(fallbackData.dialects_en || "");
          setLanguagesSv(fallbackData.languages_sv || "");
          setLanguagesEn(fallbackData.languages_en || "");
        }
        setIsLoading(false);
        return;
      }

      if (data) {
        if (data.heading_sv) setHeadingSv(data.heading_sv);
        if (data.heading_en) setHeadingEn(data.heading_en);
        if (data.paragraph1_sv) setParagraph1Sv(data.paragraph1_sv);
        if (data.paragraph1_en) setParagraph1En(data.paragraph1_en);
        if (data.paragraph2_sv) setParagraph2Sv(data.paragraph2_sv);
        if (data.paragraph2_en) setParagraph2En(data.paragraph2_en);
        if (data.paragraph3_sv) setParagraph3Sv(data.paragraph3_sv);
        if (data.paragraph3_en) setParagraph3En(data.paragraph3_en);

        if (data.dialects_sv) setDialectsSv(data.dialects_sv);
        if (data.dialects_en) setDialectsEn(data.dialects_en);
        if (data.languages_sv) setLanguagesSv(data.languages_sv);
        if (data.languages_en) setLanguagesEn(data.languages_en);
        
        if (data.bio_image_credits_sv) setImageCreditsSv(data.bio_image_credits_sv);
        if (data.bio_image_credits_en) setImageCreditsEn(data.bio_image_credits_en);

        if (data.bio_sections) {
          try {
            const parsed = typeof data.bio_sections === "string"
              ? JSON.parse(data.bio_sections)
              : data.bio_sections;
            if (Array.isArray(parsed) && parsed.length > 0) {
              setBioSections(parsed);
            }
          } catch (e) {
            console.error("Failed to parse bio sections:", e);
          }
        } else if (data.mood_images) {
          // Backward compatibility import from mood_images
          try {
            const moodImgs = typeof data.mood_images === "string" ? JSON.parse(data.mood_images) : data.mood_images;
            const updated = [
              {
                id: "Dramatic",
                title_sv: "Dramatisk",
                title_en: "Dramatic",
                quote_sv: data.quote_sv || "Drama är något jag känner extra starkt för.",
                quote_en: data.quote_en || "Drama is something I feel especially strongly about.",
                image: moodImgs.dramatic || "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
                weight: 300
              },
              {
                id: "Comedic",
                title_sv: "Komisk",
                title_en: "Comedic",
                quote_sv: data.quote_comedic_sv || "Komedi kräver samma precision som tragedi — bara snabbare.",
                quote_en: data.quote_comedic_en || "Comedy demands the same precision as tragedy — just faster.",
                image: moodImgs.comedic || "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
                weight: 500
              },
              {
                id: "Classical",
                title_sv: "Klassisk",
                title_en: "Classical",
                quote_sv: data.quote_classical_sv || "Scenen lärde mig allt jag vet om timing och tystnad.",
                quote_en: data.quote_classical_en || "The stage taught me everything I know about timing and silence.",
                image: moodImgs.classical || "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
                weight: 400
              }
            ];
            setBioSections(updated);
          } catch (e) {
            console.error("Failed to merge legacy data:", e);
          }
        }
        
        if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs as FAQItem[]);
        }
        if (data.review_quotes && Array.isArray(data.review_quotes) && data.review_quotes.length > 0) {
          setReviewQuotes(data.review_quotes as ReviewQuoteItem[]);
        }
      }
      setIsLoading(false);
    };

    fetchBioData();
  }, []);

  const addBioSection = () => {
    const newSection: BioSection = {
      id: `section-${Date.now()}`,
      title_sv: "Ny Sektion",
      title_en: "New Section",
      quote_sv: "Skriv citat här...",
      quote_en: "Write quote here...",
      image: "",
      weight: 300
    };
    setBioSections([...bioSections, newSection]);
  };

  const removeBioSection = (id: string) => {
    setBioSections(bioSections.filter(s => s.id !== id));
  };

  const updateBioSection = (id: string, updates: Partial<BioSection>) => {
    setBioSections(bioSections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const openMediaPickerForSection = (id: string) => {
    setActivePickingSectionId(id);
    setIsMediaPickerOpen(true);
  };

  const handleMediaSelect = (url: string, metadata?: any) => {
    if (activePickingSectionId) {
      updateBioSection(activePickingSectionId, {
        image: url,
        image_alt: metadata?.alt || "",
        image_title: metadata?.title || "",
        image_caption: metadata?.caption || "",
        description: metadata?.description || "",
        image_filename: metadata?.filename || ""
      });
      setActivePickingSectionId(null);
    }
  };

  const addReviewQuote = () => {
    const newItem: ReviewQuoteItem = {
      id: `quote-${Date.now()}`,
      sv: "",
      en: "",
    };
    setReviewQuotes([...reviewQuotes, newItem]);
  };

  const removeReviewQuote = (id: string) => {
    setReviewQuotes(reviewQuotes.filter((q) => q.id !== id));
  };

  const updateReviewQuote = (id: string, lang: "sv" | "en", value: string) => {
    setReviewQuotes(
      reviewQuotes.map((q) => {
        if (q.id !== id) return q;
        return {
          ...q,
          [lang]: value,
        };
      })
    );
  };

  const addFaq = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      q: { sv: "", en: "" },
      a: { sv: "", en: "" },
    };
    setFaqs([...faqs, newItem]);
  };

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const updateFaq = (id: string, field: "q" | "a", lang: "sv" | "en", value: string) => {
    setFaqs(
      faqs.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          [field]: {
            ...f[field],
            [lang]: value,
          },
        };
      })
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringen sparas endast lokalt.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    // Prepare legacy fallback columns
    const quote_sv = bioSections[0]?.quote_sv || "";
    const quote_en = bioSections[0]?.quote_en || "";
    const quote_comedic_sv = bioSections[1]?.quote_sv || "";
    const quote_comedic_en = bioSections[1]?.quote_en || "";
    const quote_classical_sv = bioSections[2]?.quote_sv || "";
    const quote_classical_en = bioSections[2]?.quote_en || "";
    const mood_images = {
      dramatic: bioSections[0]?.image || "",
      comedic: bioSections[1]?.image || "",
      classical: bioSections[2]?.image || "",
    };

    const { error } = await supabase.from("biography").update({
      quote_sv,
      quote_en,
      quote_comedic_sv,
      quote_comedic_en,
      quote_classical_sv,
      quote_classical_en,
      heading_sv: headingSv,
      heading_en: headingEn,
      paragraph1_sv: paragraph1Sv,
      paragraph1_en: paragraph1En,
      paragraph2_sv: paragraph2Sv,
      paragraph2_en: paragraph2En,
      paragraph3_sv: paragraph3Sv,
      paragraph3_en: paragraph3En,
      dialects_sv: dialectsSv,
      dialects_en: dialectsEn,
      languages_sv: languagesSv,
      languages_en: languagesEn,
      faqs: faqs,
      review_quotes: reviewQuotes,
      mood_images,
      bio_image_credits_sv: imageCreditsSv,
      bio_image_credits_en: imageCreditsEn,
      bio_sections: bioSections,
    }).eq('id', 'main');

    if (error) {
      console.warn("Full biography update failed, trying core update fallback:", error.message);
      
      const { error: coreError } = await supabase.from("biography").update({
        quote_sv,
        quote_en,
        dialects_sv: dialectsSv,
        dialects_en: dialectsEn,
        languages_sv: languagesSv,
        languages_en: languagesEn,
      }).eq('id', 'main');

      setIsSaving(false);
      if (coreError) {
        toast.error(`Kunde inte spara i databasen: ${coreError.message}`);
      } else {
        toast.warning("Sparade endast grundläggande fält (citat, dialekter, språk). För full funktionalitet, kör 'supabase_migration_5.sql' i din Supabase SQL Editor.");
      }
    } else {
      setIsSaving(false);
      toast.success("Akt II (Biografi & FAQ) har sparats framgångsrikt i Supabase!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <span className="w-8 h-8 border-4 border-ember border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-bone/40">Laddar biografi-inställningar...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt II — <span className="italic text-ember">Biografi</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Här redigerar du Thereses biografi, egenskaper, samt sökmotorernas FAQ-frågor (AEO/GEO).
        </p>
      </div>

      {/* Biography Sections List */}
      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <div className="flex items-center justify-between border-b border-bone/5 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
            <Quote size={14} className="text-ember" /> Biografisektioner (Dynamic Sections)
          </h3>
          <button
            type="button"
            onClick={addBioSection}
            className="px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[9px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
          >
            + Lägg till sektion
          </button>
        </div>
        <p className="text-[9px] text-bone/45 font-mono uppercase tracking-wider">
          Anpassa befintliga sektioner eller lägg till nya. Sektionerna sorteras efter vikt (lägre visas först).
        </p>

        <div className="space-y-6">
          {[...bioSections]
            .sort((a, b) => (a.weight || 300) - (b.weight || 300))
            .map((section, idx) => (
              <div key={section.id} className="border border-bone/10 bg-stage/15 p-4 rounded-sm space-y-4 relative">
                <div className="flex justify-between items-center border-b border-bone/5 pb-2">
                  <span className="text-[10px] font-mono text-ember uppercase tracking-wider">Sektion #{idx + 1}: {section.title_sv || "Namnlös"}</span>
                  <button
                    type="button"
                    onClick={() => removeBioSection(section.id)}
                    className="text-bone/35 hover:text-red-400 transition-colors cursor-pointer animate-pulse-slow"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Rubrik (Svenska)</label>
                    <input
                      type="text"
                      value={section.title_sv}
                      onChange={(e) => updateBioSection(section.id, { title_sv: e.target.value })}
                      placeholder="t.ex. Dramatisk"
                      className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Rubrik (Engelska)</label>
                    <input
                      type="text"
                      value={section.title_en}
                      onChange={(e) => updateBioSection(section.id, { title_en: e.target.value })}
                      placeholder="t.ex. Dramatic"
                      className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Citat (Svenska)</label>
                    <textarea
                      value={section.quote_sv}
                      onChange={(e) => updateBioSection(section.id, { quote_sv: e.target.value })}
                      rows={2}
                      placeholder="Drama är något jag..."
                      className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Citat (Engelska)</label>
                    <textarea
                      value={section.quote_en}
                      onChange={(e) => updateBioSection(section.id, { quote_en: e.target.value })}
                      rows={2}
                      placeholder="Drama is something..."
                      className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-3 space-y-4">
                    <div className="space-y-2">
                      <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Bild-URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={section.image}
                          onChange={(e) => updateBioSection(section.id, { image: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPickerForSection(section.id)}
                          className="px-3 py-2 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                        >
                          Media
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Alt-Text (SEO)</label>
                        <input
                          type="text"
                          value={section.image_alt || ""}
                          onChange={(e) => updateBioSection(section.id, { image_alt: e.target.value })}
                          placeholder="Alt-text för Google..."
                          className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Titel (Title Tag)</label>
                        <input
                          type="text"
                          value={section.image_title || ""}
                          onChange={(e) => updateBioSection(section.id, { image_title: e.target.value })}
                          placeholder="Titel..."
                          className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Bildtext (Caption)</label>
                        <input
                          type="text"
                          value={section.image_caption || ""}
                          onChange={(e) => updateBioSection(section.id, { image_caption: e.target.value })}
                          placeholder="Bildtext..."
                          className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Sökoptimerat Filnamn</label>
                        <input
                          type="text"
                          value={section.image_filename || ""}
                          onChange={(e) => updateBioSection(section.id, { image_filename: e.target.value })}
                          placeholder="ex. therese-comedic.webp"
                          className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Beskrivning (Description)</label>
                        <textarea
                          value={section.description || ""}
                          onChange={(e) => updateBioSection(section.id, { description: e.target.value })}
                          placeholder="Längre beskrivning..."
                          rows={2}
                          className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-1 flex flex-col items-center">
                    <span className="text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Förhandsvisning</span>
                    {section.image ? (
                      <img src={section.image} alt={section.title_sv} className="w-10 aspect-[3/4] h-auto object-cover border border-bone/15 rounded-sm" />
                    ) : (
                      <div className="h-14 w-14 border border-dashed border-bone/10 flex items-center justify-center text-bone/20 text-[8px] font-mono">Ingen bild</div>
                    )}
                  </div>
                </div>

                <div className="w-32">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Sorteringsvikt</label>
                  <input
                    type="number"
                    value={section.weight || 300}
                    onChange={(e) => updateBioSection(section.id, { weight: parseInt(e.target.value) || 300 })}
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Biography Image Credits Section */}
      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <FileText size={14} className="text-ember" /> Fotokredd (Biografibild undertext)
        </h3>
        <p className="text-[9px] text-bone/45 font-mono uppercase tracking-wider">
          Fotokredd som visas direkt under den stående biografibilden till vänster om texten.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-2">Kreditering (Svenska)</label>
            <textarea
              value={imageCreditsSv}
              onChange={(e) => setImageCreditsSv(e.target.value)}
              rows={2}
              placeholder="Foto: Robert Eldrim..."
              className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-2">Credit (English)</label>
            <textarea
              value={imageCreditsEn}
              onChange={(e) => setImageCreditsEn(e.target.value)}
              rows={2}
              placeholder="Photo: Robert Eldrim..."
              className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Biography Texts Editor */}
      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <FileText size={14} className="text-ember" /> Biografiska Texter
        </h3>

        {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Rubrik (Svenska)</label>
            <input
              type="text"
              id="klick-bio-heading-sv"
              value={headingSv}
              onChange={(e) => setHeadingSv(e.target.value)}
              placeholder="En skådespelerska med bredd..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Heading (English)</label>
            <input
              type="text"
              id="klick-bio-heading-en"
              value={headingEn}
              onChange={(e) => setHeadingEn(e.target.value)}
              placeholder="An actress with range..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
        </div>

        {/* Paragraph 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Paragraf 1 (Svenska)</label>
            <textarea
              id="klick-bio-p1-sv"
              value={paragraph1Sv}
              onChange={(e) => setParagraph1Sv(e.target.value)}
              rows={4}
              placeholder="Therese var senast aktuell i..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Paragraph 1 (English)</label>
            <textarea
              id="klick-bio-p1-en"
              value={paragraph1En}
              onChange={(e) => setParagraph1En(e.target.value)}
              rows={4}
              placeholder="Therese was most recently seen in..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
        </div>

        {/* Paragraph 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Paragraf 2 (Svenska)</label>
            <textarea
              id="klick-bio-p2-sv"
              value={paragraph2Sv}
              onChange={(e) => setParagraph2Sv(e.target.value)}
              rows={4}
              placeholder="Hon har spelat teater och musikal sedan..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Paragraph 2 (English)</label>
            <textarea
              id="klick-bio-p2-en"
              value={paragraph2En}
              onChange={(e) => setParagraph2En(e.target.value)}
              rows={4}
              placeholder="She has performed theatre and musicals since..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
        </div>

        {/* Paragraph 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Paragraf 3 (Svenska)</label>
            <textarea
              id="klick-bio-p3-sv"
              value={paragraph3Sv}
              onChange={(e) => setParagraph3Sv(e.target.value)}
              rows={3}
              placeholder="Drama är något som Therese känner..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Paragraph 3 (English)</label>
            <textarea
              id="klick-bio-p3-en"
              value={paragraph3En}
              onChange={(e) => setParagraph3En(e.target.value)}
              rows={3}
              placeholder="Drama is something Therese feels..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="bg-stage/10 border border-bone/5 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono border-b border-bone/5 pb-2">
          Fakta & Egenskaper (Quick Facts)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
              Dialekter (Svenska)
            </label>
            <input
              type="text"
              id="klick-bio-dialects-sv"
              value={dialectsSv}
              onChange={(e) => setDialectsSv(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
              Dialects (English)
            </label>
            <input
              type="text"
              id="klick-bio-dialects-en"
              value={dialectsEn}
              onChange={(e) => setDialectsEn(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
              Språk (Svenska)
            </label>
            <input
              type="text"
              id="klick-bio-languages-sv"
              value={languagesSv}
              onChange={(e) => setLanguagesSv(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
              Languages (English)
            </label>
            <input
              type="text"
              id="klick-bio-languages-en"
              value={languagesEn}
              onChange={(e) => setLanguagesEn(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
        </div>
      </div>

      {/* Background Quotes Section */}
      <div className="space-y-4 bg-stage/10 border border-bone/5 p-6 rounded-sm">
        <div className="flex items-center justify-between border-b border-bone/5 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
            <Quote size={14} className="text-ember" /> Bakgrundscitat (Scrolling Background Quotes)
          </h3>
          <button
            type="button"
            onClick={addReviewQuote}
            className="px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[9px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
          >
            + Lägg till citat
          </button>
        </div>
        <p className="text-[9px] text-bone/40 font-mono">
          Citat och pressröster som rullar i bakgrunden i meriter-sektionen på hemsidan.
        </p>

        <div className="space-y-3 mt-4">
          {reviewQuotes.map((qItem, index) => (
            <div key={qItem.id} className="flex gap-4 items-center border border-bone/10 bg-stage/15 p-3 rounded-sm relative">
              <span className="text-[9px] font-mono text-ember/65 select-none w-4">{index + 1}</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={qItem.sv}
                  onChange={(e) => updateReviewQuote(qItem.id, "sv", e.target.value)}
                  placeholder="Citat på svenska..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
                <input
                  type="text"
                  value={qItem.en}
                  onChange={(e) => updateReviewQuote(qItem.id, "en", e.target.value)}
                  placeholder="Quote in English..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <button
                type="button"
                onClick={() => removeReviewQuote(qItem.id)}
                className="text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Ta bort"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Builder Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-bone/5 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
            <HelpCircle size={14} className="text-ember" /> FAQ Builder & AEO Scheman
          </h3>
          <button
            type="button"
            id="klick-bio-add-faq"
            onClick={addFaq}
            className="px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[9px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
          >
            + Lägg till FAQ
          </button>
        </div>
        <p className="text-[9px] text-bone/40 font-mono">
          Frågor och svar här genereras automatiskt som ett FAQPage JSON-LD schema för att ge direkt svar i Google AI Overviews & ChatGPT.
        </p>

        <div className="space-y-6 mt-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border border-bone/5 bg-stage/5 p-4 rounded-sm relative space-y-4">
              <button
                type="button"
                onClick={() => removeFaq(faq.id)}
                className="absolute top-4 right-4 text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
                aria-label="Ta bort"
              >
                <Trash2 size={14} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {/* SV FAQ */}
                <div className="space-y-3">
                  <span className="text-[8px] font-mono text-ember uppercase tracking-wider">🇸🇪 SVENSKA #{index + 1}</span>
                  <input
                    type="text"
                    value={faq.q.sv}
                    onChange={(e) => updateFaq(faq.id, "q", "sv", e.target.value)}
                    placeholder="Skriv fråga på svenska..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                  <textarea
                    value={faq.a.sv}
                    onChange={(e) => updateFaq(faq.id, "a", "sv", e.target.value)}
                    placeholder="Skriv svar på svenska..."
                    rows={2}
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>

                {/* EN FAQ */}
                <div className="space-y-3">
                  <span className="text-[8px] font-mono text-bone/40 uppercase tracking-wider">🇬🇧 ENGLISH #{index + 1}</span>
                  <input
                    type="text"
                    value={faq.q.en}
                    onChange={(e) => updateFaq(faq.id, "q", "en", e.target.value)}
                    placeholder="Write question in English..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                  <textarea
                    value={faq.a.en}
                    onChange={(e) => updateFaq(faq.id, "a", "en", e.target.value)}
                    placeholder="Write answer in English..."
                    rows={2}
                    className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-bio-save"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={12} />
              Spara ändringar
            </>
          )}
        </button>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        typeFilter="image"
      />
    </form>
  );
}
