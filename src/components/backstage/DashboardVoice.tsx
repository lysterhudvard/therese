import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Volume2, Image } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";

interface VoiceSettings {
  heading_sv: string;
  heading_en: string;
  body_sv: string;
  body_en: string;
  cta_sv: string;
  cta_en: string;
  demo_sv: string;
  demo_en: string;
  image_url?: string;
  image_alt?: string;
}

export function DashboardVoice() {
  const [settings, setSettings] = useState<VoiceSettings>({
    heading_sv: "En skånsk röst — varm, rå, omedelbar.",
    heading_en: "A Scanian voice — warm, raw, immediate.",
    body_sv: "Therese har använts flitigt för sin skånska röst i många radio- och TV-reklamer. Hon har även dubbat rösten till mamman i barnserien Familjen Valentin.",
    body_en: "Therese is frequently booked for her Scanian voice in radio and TV commercials. She has also dubbed the mother in the children's series Familjen Valentin.",
    cta_sv: "Boka röst",
    cta_en: "Book voice",
    demo_sv: "Demo via e-post",
    demo_en: "Demo via email",
    image_url: "",
    image_alt: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const fetchVoice = async () => {
      try {
        const { data, error } = await supabase
          .from("biography")
          .select("voice_settings")
          .eq("id", "main")
          .maybeSingle();

        if (data && data.voice_settings) {
          const parsed = typeof data.voice_settings === "string" 
            ? JSON.parse(data.voice_settings) 
            : data.voice_settings;
            
          setSettings((prev) => ({
            ...prev,
            ...parsed
          }));
        }
      } catch (e) {
        console.error("Failed to fetch voice settings:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoice();
  }, []);

  const handleChange = (field: keyof VoiceSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
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
        .update({ voice_settings: settings })
        .eq("id", "main");

      if (error) throw error;
      toast.success("Akt VI (Röstinställningar) har sparats i Supabase!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara röstinställningar: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <span className="w-8 h-8 border-4 border-ember border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-bone/40">Laddar röst-inställningar...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt VI — <span className="italic text-ember">Röst</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Hantera texter, rubriker och knappar för Röst-sektionen.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Volume2 size={14} className="text-ember" /> Röst Texter
        </h3>

        {/* Rubrik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Rubrik (Svenska)</label>
            <input
              type="text"
              id="klick-voice-heading-sv"
              value={settings.heading_sv}
              onChange={(e) => handleChange("heading_sv", e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Heading (English)</label>
            <input
              type="text"
              id="klick-voice-heading-en"
              value={settings.heading_en}
              onChange={(e) => handleChange("heading_en", e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
        </div>

        {/* Beskrivning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Beskrivningstext (Svenska)</label>
            <textarea
              id="klick-voice-body-sv"
              value={settings.body_sv}
              onChange={(e) => handleChange("body_sv", e.target.value)}
              rows={4}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Description Body (English)</label>
            <textarea
              id="klick-voice-body-en"
              value={settings.body_en}
              onChange={(e) => handleChange("body_en", e.target.value)}
              rows={4}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
            />
          </div>
        </div>

        {/* CTA och Demo info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Knapptext (Svenska)</label>
            <input
              type="text"
              id="klick-voice-cta-sv"
              value={settings.cta_sv}
              onChange={(e) => handleChange("cta_sv", e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Button Text (English)</label>
            <input
              type="text"
              value={settings.cta_en}
              onChange={(e) => handleChange("cta_en", e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Demo Information (Svenska)</label>
            <input
              type="text"
              value={settings.demo_sv}
              onChange={(e) => handleChange("demo_sv", e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Demo Info (English)</label>
            <input
              type="text"
              value={settings.demo_en}
              onChange={(e) => handleChange("demo_en", e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
        </div>
      </div>

      {/* Röst Bild */}
      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Image size={14} className="text-ember" /> Röst Bild
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          <div className="md:col-span-3 space-y-4">
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Bild-URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.image_url || ""}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  placeholder="Skriv in bild-URL eller välj från mediabiblioteket"
                  className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="px-3 py-2 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Media
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Bild Alt-text (SEO)</label>
              <input
                type="text"
                value={settings.image_alt || ""}
                onChange={(e) => handleChange("image_alt", e.target.value)}
                placeholder="t.ex. Therese Järvheden — röstskådespelerska"
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>
          
          <div className="md:col-span-1 flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-2">Förhandsvisning</span>
            {settings.image_url ? (
              <img
                src={settings.image_url}
                alt={settings.image_alt || "Förhandsvisning"}
                className="h-24 w-24 object-cover border border-bone/15 rounded-sm"
              />
            ) : (
              <div className="h-24 w-24 border border-dashed border-bone/10 flex items-center justify-center text-bone/20 text-[8px] font-mono text-center px-2">
                Ingen bild vald (standardbild används)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-voice-save"
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
        onSelect={(url) => {
          handleChange("image_url", url);
          setIsMediaPickerOpen(false);
        }}
        typeFilter="image"
      />
    </form>
  );
}
