import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { moveArrayItem } from "../../lib/utils";
import { FAQItem } from "./bio/types";
import { BioFaqBuilder } from "./bio/BioFaqBuilder";

export function DashboardFaq() {
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchFaqData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("faqs")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.warn("Could not load FAQ data:", error.message);
        setIsLoading(false);
        return;
      }

      if (data) {
        if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
          setFaqs(data.faqs as FAQItem[]);
        }
      }
      setIsLoading(false);
    };

    fetchFaqData();
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

  const moveFaq = (index: number, direction: "up" | "down") => {
    const updated = moveArrayItem(faqs, index, direction);
    if (updated !== faqs) {
      setFaqs(updated);
      toast.info("FAQ-ordning ändrad.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringen sparas endast lokalt.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    const { error } = await supabase.from("biography").update({
      faqs: faqs,
    }).eq('id', 'main');

    if (error) {
      setIsSaving(false);
      toast.error(`Kunde inte spara i databasen: ${error.message}`);
      alert(`Misslyckades med att spara FAQ: ${error.message}`);
    } else {
      setIsSaving(false);
      toast.success("FAQ har sparats framgångsrikt i Supabase!");
      alert("FAQ har sparats framgångsrikt!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <span className="w-8 h-8 border-4 border-ember border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-bone/40">Laddar FAQ...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          <span className="italic text-ember">Vanliga Frågor</span> (FAQ)
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Hantera vanliga frågor som visas på din /faq-sida. Frågorna märks automatiskt upp med JSON-LD struktur för Google.
        </p>
      </div>

      <BioFaqBuilder
        faqs={faqs}
        addFaq={addFaq}
        removeFaq={removeFaq}
        updateFaq={updateFaq}
        moveFaq={moveFaq}
      />

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-faq-save"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Spara FAQ</>
          )}
        </button>
      </div>
    </form>
  );
}
