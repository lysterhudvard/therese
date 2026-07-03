import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, HelpCircle, FileText, Quote, Image, Link2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

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
  const [quoteSv, setQuoteSv] = useState("Drama är något jag känner extra starkt för.");
  const [quoteEn, setQuoteEn] = useState("Drama is something I feel especially strongly about.");
  const [quoteComedicSv, setQuoteComedicSv] = useState("Komedi kräver samma precision som tragedi — bara snabbare.");
  const [quoteComedicEn, setQuoteComedicEn] = useState("Comedy demands the same precision as tragedy — just faster.");
  const [quoteClassicalSv, setQuoteClassicalSv] = useState("Scenen lärde mig allt jag vet om timing och tystnad.");
  const [quoteClassicalEn, setQuoteClassicalEn] = useState("The stage taught me everything I know about timing and silence.");
  
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

  // Biography Section Images
  const [dramaticImage, setDramaticImage] = useState("https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650");
  const [comedicImage, setComedicImage] = useState("https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000015-689df689e2/Thess0903_lowres.jpg?ph=a6c2528650");
  const [classicalImage, setClassicalImage] = useState("https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000032-c5f44c5f47/Thess0972_bw_highres.jpg?ph=a6c2528650");

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

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchBioData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("quote_sv, quote_en, dialects_sv, dialects_en, languages_sv, languages_en, faqs, heading_sv, heading_en, paragraph1_sv, paragraph1_en, paragraph2_sv, paragraph2_en, paragraph3_sv, paragraph3_en, review_quotes, quote_comedic_sv, quote_comedic_en, quote_classical_sv, quote_classical_en, mood_images, footer_image, footer_end_sv, footer_end_en, footer_credits")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.warn("Could not load full biography schema, trying fallback to core schema:", error.message);
        
        toast.warning(
          "Vissa biografi-kolumner saknas i databasen. För full funktionalitet, kör 'supabase_migration_3.sql' och 'supabase_migration_2.sql' i din Supabase SQL Editor.",
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
          return;
        }

        if (fallbackData) {
          setQuoteSv(fallbackData.quote_sv || "");
          setQuoteEn(fallbackData.quote_en || "");
          setDialectsSv(fallbackData.dialects_sv || "");
          setDialectsEn(fallbackData.dialects_en || "");
          setLanguagesSv(fallbackData.languages_sv || "");
          setLanguagesEn(fallbackData.languages_en || "");
        }
        return;
      }

      if (data) {
        setQuoteSv(data.quote_sv || "");
        setQuoteEn(data.quote_en || "");
        setQuoteComedicSv(data.quote_comedic_sv || "");
        setQuoteComedicEn(data.quote_comedic_en || "");
        setQuoteClassicalSv(data.quote_classical_sv || "");
        setQuoteClassicalEn(data.quote_classical_en || "");
        
        setHeadingSv(data.heading_sv || "");
        setHeadingEn(data.heading_en || "");
        setParagraph1Sv(data.paragraph1_sv || "");
        setParagraph1En(data.paragraph1_en || "");
        setParagraph2Sv(data.paragraph2_sv || "");
        setParagraph2En(data.paragraph2_en || "");
        setParagraph3Sv(data.paragraph3_sv || "");
        setParagraph3En(data.paragraph3_en || "");

        setDialectsSv(data.dialects_sv || "");
        setDialectsEn(data.dialects_en || "");
        setLanguagesSv(data.languages_sv || "");
        setLanguagesEn(data.languages_en || "");
        
        if (data.faqs && Array.isArray(data.faqs)) {
          setFaqs(data.faqs as FAQItem[]);
        }
        if (data.review_quotes && Array.isArray(data.review_quotes)) {
          setReviewQuotes(data.review_quotes as ReviewQuoteItem[]);
        }
        if (data.mood_images) {
          try {
            const moodImgs = typeof data.mood_images === "string" ? JSON.parse(data.mood_images) : data.mood_images;
            if (moodImgs.dramatic) setDramaticImage(moodImgs.dramatic);
            if (moodImgs.comedic) setComedicImage(moodImgs.comedic);
            if (moodImgs.classical) setClassicalImage(moodImgs.classical);
          } catch (e) {
            console.error("Failed to parse mood images:", e);
          }
        }
      }
    };

    fetchBioData();
  }, []);

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

    const moodImagesPayload = {
      dramatic: dramaticImage,
      comedic: comedicImage,
      classical: classicalImage,
    };

    const { error } = await supabase.from("biography").upsert({
      id: "main",
      quote_sv: quoteSv,
      quote_en: quoteEn,
      quote_comedic_sv: quoteComedicSv,
      quote_comedic_en: quoteComedicEn,
      quote_classical_sv: quoteClassicalSv,
      quote_classical_en: quoteClassicalEn,
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
      mood_images: moodImagesPayload,
    });

    if (error) {
      console.warn("Full biography upsert failed, trying core upsert fallback:", error.message);
      
      const { error: coreError } = await supabase.from("biography").upsert({
        id: "main",
        quote_sv: quoteSv,
        quote_en: quoteEn,
        dialects_sv: dialectsSv,
        dialects_en: dialectsEn,
        languages_sv: languagesSv,
        languages_en: languagesEn,
      });

      setIsSaving(false);
      if (coreError) {
        toast.error(`Kunde inte spara i databasen: ${coreError.message}`);
      } else {
        toast.warning("Sparade endast grundläggande fält (citat, dialekter, språk). För full funktionalitet, kör 'supabase_migration_3.sql' och 'supabase_migration_2.sql' i din Supabase SQL Editor.");
      }
    } else {
      setIsSaving(false);
      toast.success("Akt II (Biografi & FAQ) har sparats framgångsrikt i Supabase!");
    }
  };

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

      {/* Mood Quotes Section */}
      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Quote size={14} className="text-ember" /> Stämningscitat / Manuskriptcitat (Mood Quotes)
        </h3>
        
        {/* Dramatic Quote (Core) */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider text-ember font-mono font-semibold">Dramatiskt Citat (Akt II Drama)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Svenska</label>
              <input
                type="text"
                id="klick-bio-quote-sv"
                value={quoteSv}
                onChange={(e) => setQuoteSv(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">English</label>
              <input
                type="text"
                id="klick-bio-quote-en"
                value={quoteEn}
                onChange={(e) => setQuoteEn(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>

        {/* Comedic Quote */}
        <div className="space-y-3 pt-2 border-t border-bone/5">
          <h4 className="text-[10px] uppercase tracking-wider text-ember font-mono font-semibold">Komiskt Citat (Akt II Komedi)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Svenska</label>
              <input
                type="text"
                id="klick-bio-quote-comedic-sv"
                value={quoteComedicSv}
                onChange={(e) => setQuoteComedicSv(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">English</label>
              <input
                type="text"
                id="klick-bio-quote-comedic-en"
                value={quoteComedicEn}
                onChange={(e) => setQuoteComedicEn(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>

        {/* Classical Quote */}
        <div className="space-y-3 pt-2 border-t border-bone/5">
          <h4 className="text-[10px] uppercase tracking-wider text-ember font-mono font-semibold">Klassiskt Citat (Akt II Klassisk)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Svenska</label>
              <input
                type="text"
                id="klick-bio-quote-classical-sv"
                value={quoteClassicalSv}
                onChange={(e) => setQuoteClassicalSv(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">English</label>
              <input
                type="text"
                id="klick-bio-quote-classical-en"
                value={quoteClassicalEn}
                onChange={(e) => setQuoteClassicalEn(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Biography Mood Images Section */}
      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Image size={14} className="text-ember" /> Sektionsbilder (Biografi)
        </h3>
        <p className="text-[9px] text-bone/45 font-mono uppercase tracking-wider">
          Ange bildlänkar för de tre biografisektionerna (Dramatisk, Komisk, Klassisk).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Dramatisk Sektion Bild-URL</label>
            <input
              type="text"
              value={dramaticImage}
              onChange={(e) => setDramaticImage(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
            {dramaticImage && (
              <img src={dramaticImage} alt="Dramatisk förhandsvisning" className="w-full h-20 object-cover mt-2 rounded border border-bone/5 opacity-80" />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Komisk Sektion Bild-URL</label>
            <input
              type="text"
              value={comedicImage}
              onChange={(e) => setComedicImage(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
            {comedicImage && (
              <img src={comedicImage} alt="Komisk förhandsvisning" className="w-full h-20 object-cover mt-2 rounded border border-bone/5 opacity-80" />
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Klassisk Sektion Bild-URL</label>
            <input
              type="text"
              value={classicalImage}
              onChange={(e) => setClassicalImage(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
            {classicalImage && (
              <img src={classicalImage} alt="Klassisk förhandsvisning" className="w-full h-20 object-cover mt-2 rounded border border-bone/5 opacity-80" />
            )}
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
    </form>
  );
}
