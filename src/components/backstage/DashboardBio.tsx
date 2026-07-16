import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { moveArrayItem } from "../../lib/utils";
import { MediaPickerModal } from "./MediaPickerModal";
import { BioSection, FAQItem, ReviewQuoteItem } from "./bio/types";
import { BioSectionsList } from "./bio/BioSectionsList";
import { BioImageCredits } from "./bio/BioImageCredits";
import { BioTextsForm } from "./bio/BioTextsForm";
import { BioQuickFacts } from "./bio/BioQuickFacts";
import { BioReviewQuotes } from "./bio/BioReviewQuotes";

export function DashboardBio() {
  // Biography Headings & Paragraphs
  const [headingSv, setHeadingSv] = useState("En skådespelerska med bredd — från SVT-drama till komedi och röst.");
  const [headingEn, setHeadingEn] = useState("An actress with range — from SVT drama to comedy and voice.");
  const [paragraph1Sv, setParagraph1Sv] = useState("Therese var senast aktuell i SVT:s dramadokumentär En våldsam kärlek där hon spelade en av de fyra kvinnor vi fick följa. Serien handlar om våld i nära relationer — en samhällsfråga vi måste prata mer om, belysa dess problematik och börja agera.");
  const [paragraph1En, setParagraph1En] = useState("Therese was most recently seen in SVT's documentary drama En våldsam kärlek where she played one of the four women we follow. The series is about intimate-partner violence — a societal issue we must talk about more, expose, and act on.");
  const [paragraph2Sv, setParagraph2Sv] = useState("Hon har spelat teater och musikal sedan hon var barn. I TV har hon mestadels medverkat i humorproduktioner som Kristallennominerade Karatefylla, humorserien Jävla klåpare samt andra humorprojekt — bl.a. Anna Blomberg show och Jobbtjuven.");
  const [paragraph2En, setParagraph2En] = useState("She has performed theatre and musicals since childhood. On television she has appeared mostly in comedy productions such as the Kristallen-nominated Karatefylla, the comedy series Jävla klåpare, and other comedy projects — including the Anna Blomberg show and Jobbtjuven.");
  const [paragraph3Sv, setParagraph3Sv] = useState("Drama är något som Therese känner extra starkt för. Vi har seen henne bland annat i Beck-filmen Utan uppsåt, där hon gästspelade rollen som läraren Nora.");
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
        .select("quote_sv, quote_en, dialects_sv, dialects_en, languages_sv, languages_en, heading_sv, heading_en, paragraph1_sv, paragraph1_en, paragraph2_sv, paragraph2_en, paragraph3_sv, paragraph3_en, review_quotes, quote_comedic_sv, quote_comedic_en, quote_classical_sv, quote_classical_en, mood_images, footer_image, footer_end_sv, footer_end_en, footer_credits, bio_image_credits_sv, bio_image_credits_en, bio_sections")
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringen sparas endast lokalt.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

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
        alert(`Misslyckades med att spara Akt II (Biografi): ${coreError.message}`);
      } else {
        toast.warning("Sparade endast grundläggande fält (citat, dialekter, språk). För full funktionalitet, kör 'supabase_migration_5.sql' i din Supabase SQL Editor.");
        alert("Sparade grundläggande fält framgångsrikt (vissa tabellkolumner saknas i din Supabase-databas)!");
      }
    } else {
      setIsSaving(false);
      toast.success("Akt II (Biografi) har sparats framgångsrikt i Supabase!");
      alert("Akt II (Biografi) har sparats framgångsrikt!");
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
          Här redigerar du Thereses biografi och egenskaper.
        </p>
      </div>

      <BioSectionsList
        bioSections={bioSections}
        addBioSection={addBioSection}
        removeBioSection={removeBioSection}
        updateBioSection={updateBioSection}
        openMediaPickerForSection={openMediaPickerForSection}
      />

      <BioImageCredits
        imageCreditsSv={imageCreditsSv}
        setImageCreditsSv={setImageCreditsSv}
        imageCreditsEn={imageCreditsEn}
        setImageCreditsEn={setImageCreditsEn}
      />

      <BioTextsForm
        headingSv={headingSv}
        setHeadingSv={setHeadingSv}
        headingEn={headingEn}
        setHeadingEn={setHeadingEn}
        paragraph1Sv={paragraph1Sv}
        setParagraph1Sv={setParagraph1Sv}
        paragraph1En={paragraph1En}
        setParagraph1En={setParagraph1En}
        paragraph2Sv={paragraph2Sv}
        setParagraph2Sv={setParagraph2Sv}
        paragraph2En={paragraph2En}
        setParagraph2En={setParagraph2En}
        paragraph3Sv={paragraph3Sv}
        setParagraph3Sv={setParagraph3Sv}
        paragraph3En={paragraph3En}
        setParagraph3En={setParagraph3En}
      />

      <BioQuickFacts
        dialectsSv={dialectsSv}
        setDialectsSv={setDialectsSv}
        dialectsEn={dialectsEn}
        setDialectsEn={setDialectsEn}
        languagesSv={languagesSv}
        setLanguagesSv={setLanguagesSv}
        languagesEn={languagesEn}
        setLanguagesEn={setLanguagesEn}
      />

      <BioReviewQuotes
        reviewQuotes={reviewQuotes}
        addReviewQuote={addReviewQuote}
        removeReviewQuote={removeReviewQuote}
        updateReviewQuote={updateReviewQuote}
      />

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
