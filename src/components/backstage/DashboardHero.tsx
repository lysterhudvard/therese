import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Sparkles, ToggleLeft, ToggleRight, Save, Image } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";

export function DashboardHero() {
  const [currentTextSv, setCurrentTextSv] = useState("");
  const [currentTextEn, setCurrentTextEn] = useState("");
  const [isAutomated, setIsAutomated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [heroImage, setHeroImage] = useState("");
  const [heroRoleSv, setHeroRoleSv] = useState("Skådespelerska");
  const [heroRoleEn, setHeroRoleEn] = useState("Actress");
  const [heroBaseSv, setHeroBaseSv] = useState("Malmö · Stockholm");
  const [heroBaseEn, setHeroBaseEn] = useState("Malmö · Stockholm");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchHeroData = async () => {
      const { data: bioData } = await supabase
        .from("biography")
        .select("hero_text_sv, hero_text_en, is_automated, hero_image, hero_role_sv, hero_role_en, hero_base_sv, hero_base_en")
        .eq("id", "main")
        .maybeSingle();

      if (bioData) {
        setIsAutomated(bioData.is_automated || false);
        if (bioData.hero_image) setHeroImage(bioData.hero_image);
        if (bioData.hero_role_sv) setHeroRoleSv(bioData.hero_role_sv);
        if (bioData.hero_role_en) setHeroRoleEn(bioData.hero_role_en);
        if (bioData.hero_base_sv) setHeroBaseSv(bioData.hero_base_sv);
        if (bioData.hero_base_en) setHeroBaseEn(bioData.hero_base_en);
        
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

    const { error } = await supabase
      .from("biography")
      .update({
        hero_text_sv: currentTextSv,
        hero_text_en: currentTextEn,
        is_automated: isAutomated,
        hero_image: heroImage,
        hero_role_sv: heroRoleSv,
        hero_role_en: heroRoleEn,
        hero_base_sv: heroBaseSv,
        hero_base_en: heroBaseEn,
      })
      .eq("id", "main");

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
          id="klick-hero-sync"
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
              id="klick-hero-sv"
              value={currentTextSv}
              onChange={(e) => {
                setCurrentTextSv(e.target.value);
                setIsAutomated(false);
              }}
              disabled={isAutomated}
              rows={3}
              placeholder="Skriv vad Therese är aktuell med på svenska..."
              className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300 resize-none animate-guide-glow"
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
              id="klick-hero-en"
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

      {/* Hero Bakgrundsbild Section */}
      <div className="border border-bone/10 p-5 bg-ink/10 rounded-sm space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-bone border-b border-bone/5 pb-2">Hero Bakgrundsbild</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-3 space-y-2">
            <label className="block text-[9px] uppercase tracking-widest text-bone/40 font-mono">
              Bild-URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
              />
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="px-4 py-3 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-xs font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                Media
              </button>
            </div>
            <p className="text-[10px] text-bone/40 font-mono">
              Den bild som visas i fullskärm i Akt I. Klicka på Media för att välja från uppladdade bilder.
            </p>
          </div>
          <div className="md:col-span-1 flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-widest text-bone/40 font-mono mb-2">Förhandsvisning</span>
            {heroImage ? (
              <div className="aspect-video w-32 border border-bone/10 bg-stage/10 rounded-sm overflow-hidden relative group">
                <img src={heroImage} alt="Förhandsvisning hero" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="aspect-video w-32 border border-dashed border-bone/10 bg-stage/5 rounded-sm flex flex-col items-center justify-center text-bone/20 font-mono text-[9px]">
                <Image size={18} className="mb-1" />
                Ingen bild
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Subtitle / Location Section */}
      <div className="border border-bone/10 p-5 bg-ink/10 rounded-sm space-y-6">
        <h3 className="text-xs font-mono uppercase tracking-widest text-bone border-b border-bone/5 pb-2">Hero Undertitel & Bas (Akt I)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Subtitle / Role (Svenska & Engelska) */}
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
                Roll / Titel (Svenska)
              </label>
              <input
                type="text"
                value={heroRoleSv}
                onChange={(e) => setHeroRoleSv(e.target.value)}
                placeholder="Skådespelerska"
                className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
                Roll / Titel (Engelska)
              </label>
              <input
                type="text"
                value={heroRoleEn}
                onChange={(e) => setHeroRoleEn(e.target.value)}
                placeholder="Actress"
                className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
              />
            </div>
          </div>

          {/* Base Location (Svenska & Engelska) */}
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
                Stad / Region (Svenska)
              </label>
              <input
                type="text"
                value={heroBaseSv}
                onChange={(e) => setHeroBaseSv(e.target.value)}
                placeholder="Malmö · Stockholm"
                className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-bone/40 mb-2 font-mono">
                Stad / Region (Engelska)
              </label>
              <input
                type="text"
                value={heroBaseEn}
                onChange={(e) => setHeroBaseEn(e.target.value)}
                placeholder="Malmö · Stockholm"
                className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember transition-colors duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-hero-save"
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
        onSelect={(url) => setHeroImage(url)}
        typeFilter="image"
      />
    </form>
  );
}
