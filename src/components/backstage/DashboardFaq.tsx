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
      q: { sv: "Vem är Therese Järvheden?", en: "Who is Therese Järvheden?" },
      a: {
        sv: "Therese Järvheden är en svensk skådespelerska och röstskådespelare verksam inom drama, komedi och röst. Hon har medverkat i produktioner som SVT:s dramadokumentär En våldsam kärlek, Beck – Utan uppsåt och humorprogrammet Karatefylla.",
        en: "Therese Järvheden is a Swedish actress and voice actress active in drama, comedy, and voice acting. She has appeared in productions such as SVT's documentary drama En våldsam kärlek, Beck – Utan uppsåt, and the comedy show Karatefylla.",
      },
    },
    {
      id: "faq-2",
      q: { sv: "Vilka serier har Therese medverkat i?", en: "What series has Therese appeared in?" },
      a: {
        sv: "Therese har medverkat i SVT:s dramadokumentär En våldsam kärlek, humorproduktionerna Karatefylla och Jävla klåpare, samt gästspelat i Anna Blomberg show, Jobbtjuven och Beck — Utan uppsåt.",
        en: "Therese has appeared in SVT's documentary drama En våldsam kärlek, comedy productions Karatefylla and Jävla klåpare, and guest-starred in Anna Blomberg show, Jobbtjuven, and Beck — Utan uppsåt.",
      },
    },
    {
      id: "faq-3",
      q: { sv: "Är Therese Järvheden gift med Thomas Järvheden?", en: "Is Therese Järvheden married to Thomas Järvheden?" },
      a: {
        sv: "Ja, Therese Järvheden är gift med den svenska komikern och artisten Thomas Järvheden. Tillsammans har de tre barn.",
        en: "Yes, Therese Järvheden is married to the Swedish comedian and artist Thomas Järvheden. They have three children together.",
      },
    },
    {
      id: "faq-4",
      q: { sv: "Vilken dialekt talar Therese Järvheden?", en: "What dialect does Therese Järvheden speak?" },
      a: {
        sv: "Therese Järvheden talar skånska som modersmål. I sitt arbete som röstskådespelare och skådespelerska växlar hon även obehindrat till rikssvenska (neutral standardsvenska) och engelska.",
        en: "Therese Järvheden speaks Scanian (skånska) as her native dialect. In her work as a voice actress and actress, she also switches fluently to standard Swedish and English.",
      },
    },
    {
      id: "faq-5",
      q: { sv: "Är Therese Järvheden röstskådespelare?", en: "Is Therese Järvheden a voice actor?" },
      a: {
        sv: "Ja, Therese är en professionell röstskådespelerska och speakerröst med egen studio. Hon levererar reklamröster, berättarröster och dubbning (bland annat som mamman Alice i SVT-barnserien Familjen Valentin) på både skånska och rikssvenska.",
        en: "Yes, Therese is a professional voice actress and narrator with her own studio. She records commercials, voice overs, and dubbing (including the mother Alice in the SVT series Familjen Valentin) in both Scanian and standard Swedish.",
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

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringen sparas endast lokalt.");
      setIsSaving(false);
      return;
    }

    try {
      const { error } = await supabase.from("biography").update({
        faqs: faqs,
      }).eq('id', 'main');

      if (error) {
        toast.error(`Kunde inte spara i databasen: ${error.message}`);
        alert(`Misslyckades med att spara FAQ: ${error.message}`);
      } else {
        toast.success("FAQ har sparats framgångsrikt i Supabase!");
        alert("FAQ har sparats framgångsrikt!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Ett fel uppstod: ${err.message || err}`);
      alert(`Misslyckades med att spara FAQ: ${err.message || err}`);
    } finally {
      setIsSaving(false);
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
