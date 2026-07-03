import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles, ToggleLeft, ToggleRight, Save } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export function DashboardHero() {
  const [currentTextSv, setCurrentTextSv] = useState("");
  const [currentTextEn, setCurrentTextEn] = useState("");
  const [isAutomated, setIsAutomated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchHeroData = async () => {
      const { data: bioData } = await supabase
        .from("biography")
        .select("hero_text_sv, hero_text_en, is_automated")
        .eq("id", "main")
        .maybeSingle();

      if (bioData) {
        setIsAutomated(bioData.is_automated || false);
        
        if (bioData.is_automated) {
          const { data: creditData } = await supabase
            .from("credits")
            .select("title, role_sv, role_en")
            .eq("is_current_production", true)
            .maybeSingle();
            
          if (creditData) {
            setCurrentTextSv(`"${creditData.title}" — SVT dramadokumentär.`);
            setCurrentTextEn(`"${creditData.title}" — SVT documentary drama.`);
          } else {
            setCurrentTextSv(bioData.hero_text_sv || "");
            setCurrentTextEn(bioData.hero_text_en || "");
          }
        } else {
          setCurrentTextSv(bioData.hero_text_sv || "");
          setCurrentTextEn(bioData.hero_text_en || "");
        }
      }
    };

    fetchHeroData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringen sparas endast lokalt i gränssnittet.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    const { error } = await supabase.from("biography").upsert({
      id: "main",
      hero_text_sv: currentTextSv,
      hero_text_en: currentTextEn,
      is_automated: isAutomated,
    });

    setIsSaving(false);
    if (error) {
      toast.error(`Kunde inte spara i databasen: ${error.message}`);
    } else {
      toast.success("Akt I (Nu aktuell) har sparats framgångsrikt i Supabase!");
    }
  };

  const triggerAutoSync = async () => {
    setIsAutomated(true);
    
    if (isSupabaseConfigured()) {
      const { data: creditData } = await supabase
        .from("credits")
        .select("title, role_sv, role_en")
        .eq("is_current_production", true)
        .maybeSingle();
        
      if (creditData) {
        setCurrentTextSv(`"${creditData.title}" — SVT dramadokumentär.`);
        setCurrentTextEn(`"${creditData.title}" — SVT documentary drama.`);
        toast.info("Synkroniserade text från senaste aktiva merit i databasen.");
        return;
      }
    }
    
    setCurrentTextSv('"En våldsam kärlek" — SVT dramadokumentär.');
    setCurrentTextEn('"En våldsam kärlek" — SVT documentary drama.');
    toast.info("Synkroniserade text från standardmerit (lokal backup).");
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt I — <span className="italic text-ember">Nu aktuell (Hero)</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Redigera den framhävda texten som visas på webbplatsens startsida.
        </p>
      </div>

      {/* Sync toggle */}
      <div className="bg-stage/20 border border-bone/5 p-4 rounded-sm flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono">
            Automatisk synkronisering
          </h3>
          <p className="text-[10px] text-bone/45 mt-1">
            Hämta automatiskt från den merit i listan som har flaggan "Aktuell produktion" markerad.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (isAutomated) {
              setIsAutomated(false);
            } else {
              triggerAutoSync();
            }
          }}
          className="text-bone/60 hover:text-ember transition-colors cursor-pointer"
        >
          {isAutomated ? (
            <ToggleRight size={38} className="text-ember" />
          ) : (
            <ToggleLeft size={38} className="text-bone/25" />
          )}
        </button>
      </div>

      {/* Side by side translation inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Swedish translation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-bone/5 pb-2">
            <span className="text-[10px] font-mono tracking-widest text-ember uppercase flex items-center gap-1.5">
              🇸🇪 Svenska
            </span>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
              Framhävd Text (Aktuell produktion)
            </label>
            <textarea
              value={currentTextSv}
              onChange={(e) => {
                setCurrentTextSv(e.target.value);
                setIsAutomated(false);
              }}
              disabled={isAutomated}
              rows={3}
              placeholder="Skriv vad Therese är aktuell med på svenska..."
              className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300 resize-none"
            />
          </div>
        </div>

        {/* English translation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-bone/5 pb-2">
            <span className="text-[10px] font-mono tracking-widest text-bone/50 uppercase flex items-center gap-1.5">
              🇬🇧 English
            </span>
            <button
              type="button"
              disabled={isAutomated}
              onClick={() => {
                setCurrentTextEn(currentTextSv ? `"${currentTextSv.replace(/"/g, "")}" — SVT documentary drama.` : "");
                toast.info("Mottog auto-översättning.");
              }}
              className="text-[8px] font-mono tracking-widest text-ember/60 hover:text-ember uppercase transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-20"
            >
              <Sparkles size={8} /> Auto-översätt
            </button>
          </div>
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
              Featured Text (Current production)
            </label>
            <textarea
              value={currentTextEn}
              onChange={(e) => {
                setCurrentTextEn(e.target.value);
                setIsAutomated(false);
              }}
              disabled={isAutomated}
              rows={3}
              placeholder="Write current activity in English..."
              className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300 resize-none"
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
              Spara ändringar
            </>
          )}
        </button>
      </div>
    </form>
  );
}
