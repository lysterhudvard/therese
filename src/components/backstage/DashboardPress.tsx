import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, FileText } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface PressPageContent {
  ingress: string;
  bio_short: string;
  bio_long: string;
  fakta_text: string;
  presskontakt: string;
}

export function DashboardPress() {
  const [content, setContent] = useState<PressPageContent>({
    ingress: "Therese Järvheden är en svensk skådespelerska och röstskådespelare med bas i Malmö och Stockholm. På den här sidan samlas pressbilder i hög upplösning, showreels och pressmaterial — fritt att använda för redaktioner, casting directors och produktionsbolag i samband med omnämnanden av Therese. Ange fotograf där det anges vid bilden.",
    bio_short: "Therese Järvheden är svensk skådespelerska och röstskådespelare, verksam inom drama, komedi och voice over. Aktuell i SVT:s En våldsam kärlek. Baserad i Malmö och Stockholm.",
    bio_long: "Therese Järvheden är en svensk skådespelerska och röstskådespelare med bas i Malmö och Stockholm. Hon har spelat teater och musikal sedan barndomen och är i TV mest känd från humorproduktioner som Kristallennominerade Karatefylla, Jävla klåpare och Anna Blomberg show. Inom drama har hon setts i Beck-filmen Utan uppsåt som läraren Nora, och senast i SVT:s dramadokumentär En våldsam kärlek. Hon anlitas flitigt som röstskådespelare, bland annat för sin skånska reklamröst och som dubbningsröst i barnserien Familjen Valentin. Hon representeras av Schultzberg Agency.",
    fakta_text: "",
    presskontakt: "Agentur för skådespeleri: Schultzberg Agency. Direktkontakt för röstuppdrag och pressförfrågningar via formuläret. Svar normalt inom ett dygn."
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchPressContent = async () => {
      try {
        const { data, error } = await supabase
          .from("biography")
          .select("press_page_content")
          .eq("id", "main")
          .maybeSingle();

        if (data && data.press_page_content) {
          const parsed = typeof data.press_page_content === "string" 
            ? JSON.parse(data.press_page_content) 
            : data.press_page_content;
            
          setContent((prev) => ({
            ...prev,
            ...parsed
          }));
        }
      } catch (e) {
        console.error("Failed to fetch press page content:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPressContent();
  }, []);

  const handleChange = (field: keyof PressPageContent, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringarna sparas inte.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    try {
      const { error } = await supabase
        .from("biography")
        .update({ press_page_content: content })
        .eq("id", "main");

      if (error) throw error;
      toast.success("Presstexter har sparats!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara presstexter: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <span className="w-8 h-8 border-4 border-ember border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-bone/40">Laddar presstexter...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          <span className="italic text-ember">Press</span>-sidan SEO Texter
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Hantera brödtext, bio och SEO-optimerade sektioner för Press-sidan.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <FileText size={14} className="text-ember" /> Presstexter
        </h3>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Ingress (Avgör AI Overviews)</label>
            <textarea
              value={content.ingress}
              onChange={(e) => handleChange("ingress", (e.target as any).value)}
              rows={4}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
              placeholder="Therese Järvheden är en svensk skådespelerska..."
            />
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Kort biografi (30 ord)</label>
              <textarea
                value={content.bio_short}
                onChange={(e) => handleChange("bio_short", (e.target as any).value)}
                rows={4}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Lång biografi (90 ord)</label>
              <textarea
                value={content.bio_long}
                onChange={(e) => handleChange("bio_long", (e.target as any).value)}
                rows={4}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Presskontakt (Text under H2)</label>
            <textarea
              value={content.presskontakt}
              onChange={(e) => handleChange("presskontakt", (e.target as any).value)}
              rows={3}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
            />
          </div>
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
              Spara presstexter
            </>
          )}
        </button>
      </div>
    </form>
  );
}
