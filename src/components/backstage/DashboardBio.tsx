import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, HelpCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface FAQItem {
  id: string;
  q: { sv: string; en: string };
  a: { sv: string; en: string };
}

export function DashboardBio() {
  const [quoteSv, setQuoteSv] = useState("");
  const [quoteEn, setQuoteEn] = useState("");
  
  // Facts
  const [dialectsSv, setDialectsSv] = useState("");
  const [dialectsEn, setDialectsEn] = useState("");
  const [languagesSv, setLanguagesSv] = useState("");
  const [languagesEn, setLanguagesEn] = useState("");

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

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchBioData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("quote_sv, quote_en, dialects_sv, dialects_en, languages_sv, languages_en, faqs")
        .eq("id", "main")
        .maybeSingle();

      if (data) {
        setQuoteSv(data.quote_sv || "");
        setQuoteEn(data.quote_en || "");
        setDialectsSv(data.dialects_sv || "");
        setDialectsEn(data.dialects_en || "");
        setLanguagesSv(data.languages_sv || "");
        setLanguagesEn(data.languages_en || "");
        if (data.faqs && Array.isArray(data.faqs)) {
          setFaqs(data.faqs as FAQItem[]);
        }
      }
    };

    fetchBioData();
  }, []);

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

    const { error } = await supabase.from("biography").upsert({
      id: "main",
      quote_sv: quoteSv,
      quote_en: quoteEn,
      dialects_sv: dialectsSv,
      dialects_en: dialectsEn,
      languages_sv: languagesSv,
      languages_en: languagesEn,
      faqs: faqs,
    });

    setIsSaving(false);
    if (error) {
      toast.error(`Kunde inte spara i databasen: ${error.message}`);
    } else {
      toast.success("Akt II (Biografi & FAQ) har sparats framgångsrikt i Supabase!");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt II — <span className="italic text-ember">Biografi & Entity AEO</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Här redigerar du Theresa's biografi, egenskaper, samt sökmotorernas FAQ-frågor (AEO/GEO).
        </p>
      </div>

      {/* Main Quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-ember mb-2 font-mono">
            🇸🇪 Huvudcitat (Svenska)
          </label>
          <input
            type="text"
            value={quoteSv}
            onChange={(e) => setQuoteSv(e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-bone/45 mb-2 font-mono">
            🇬🇧 Main Quote (English)
          </label>
          <input
            type="text"
            value={quoteEn}
            onChange={(e) => setQuoteEn(e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
          />
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
              value={languagesEn}
              onChange={(e) => setLanguagesEn(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
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
