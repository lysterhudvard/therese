// @ts-nocheck
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Image } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";
import { VoiceSample, parseVoiceSamples } from "../../lib/utils";
import { VoiceSamplesSection } from "./voice/VoiceSamplesSection";

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
  image_caption?: string;
  image_title?: string;
  image_filename?: string;
  image_description?: string;
  sample_url?: string;
  samples?: VoiceSample[];
  booking_email?: string;
}

const DEFAULT_SAMPLE = (): VoiceSample => ({
  id: "default-1",
  title_sv: "Röstprov",
  title_en: "Voice Sample",
  url: "",
});

export function DashboardVoice() {
  const [settings, setSettings] = useState<VoiceSettings>({
    heading_sv: "En skånsk röst — varm, naturlig och självklar.",
    heading_en: "A Scanian voice — warm, natural and genuine.",
    body_sv: "Therese är en professionell röstskådespelare och speakerröst som levererar både genuin skånska och ren rikssvenska för reklam, berättarröster, e-learning och dubbning (bland annat som mamman i SVT:s Familjen Valentin). Med egen studio i Malmö och Stockholm levereras torra eller färdigredigerade filer i högsta kvalitet (WAV/MP3) inom 1–3 arbetsdagar, med möjlighet till regi på distans.",
    body_en: "Therese is a professional voice actor and narrator delivering both authentic Scanian and standard Swedish for commercials, narration, e-learning, and dubbing (including the mother in SVT's Familjen Valentin). Operating from her own studios in Malmö and Stockholm, she delivers high-quality master files (WAV/MP3) within 1–3 business days, with options for remote live direction.",
    cta_sv: "Boka röst",
    cta_en: "Book voice",
    demo_sv: "Demo via e-post",
    demo_en: "Demo via email",
    image_url: "",
    image_alt: "",
    image_caption: "",
    image_title: "",
    image_filename: "",
    image_description: "",
    sample_url: "",
    samples: [DEFAULT_SAMPLE()],
    booking_email: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activeAudioSampleId, setActiveAudioSampleId] = useState<string | null>(null);

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
          const resolvedSamples = parseVoiceSamples(parsed);

          setSettings((prev) => ({
            ...prev,
            ...parsed,
            samples: resolvedSamples.length > 0 ? resolvedSamples : [DEFAULT_SAMPLE()],
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

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringarna sparas inte.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    const cleanSamples = (settings.samples || [])
      .filter((s) => s.url && s.url.trim())
      .map((s, idx) => ({
        ...s,
        title_sv: s.title_sv || s.title_en || `Röstprov ${idx + 1}`,
        title_en: s.title_en || s.title_sv || `Voice Sample ${idx + 1}`,
        url: s.url.trim(),
      }));

    const payload: VoiceSettings = {
      ...settings,
      samples: cleanSamples,
      sample_url: cleanSamples[0]?.url || "",
    };

    try {
      const { error } = await supabase
        .from("biography")
        .update({ voice_settings: payload })
        .eq("id", "main");

      if (error) throw error;
      setSettings((prev) => ({ ...prev, ...payload, samples: cleanSamples.length > 0 ? cleanSamples : [DEFAULT_SAMPLE()] }));
      toast.success("Akt VI (Röstinställningar) har sparats i Supabase!");
      alert("Akt VI (Röstinställningar) har sparats framgångsrikt!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara röstinställningar: ${err.message}`);
      alert(`Misslyckades med att spara Akt VI (Röstinställningar): ${err.message}`);
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
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono border-b border-bone/5 pb-2">
          Röst Texter
        </h3>

        {/* Rubrik, CTA och Demo info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "heading_sv" as const, id: "klick-voice-heading-sv", label: "Rubrik (Svenska)" },
            { key: "heading_en" as const, id: "klick-voice-heading-en", label: "Heading (English)" },
            { key: "cta_sv" as const, id: "klick-voice-cta-sv", label: "Knapptext (Svenska)" },
            { key: "cta_en" as const, label: "Button Text (English)" },
            { key: "demo_sv" as const, label: "Demo Information (Svenska)" },
            { key: "demo_en" as const, label: "Demo Info (English)" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">{field.label}</label>
              <input
                type="text"
                id={field.id}
                value={(settings[field.key] as string) || ""}
                onChange={(e) => handleChange(field.key, (e.target as any).value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
          ))}
        </div>

        {/* Beskrivning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: "body_sv" as const, id: "klick-voice-body-sv", label: "Beskrivningstext (Svenska)" },
            { key: "body_en" as const, id: "klick-voice-body-en", label: "Description Body (English)" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">{field.label}</label>
              <textarea
                id={field.id}
                value={(settings[field.key] as string) || ""}
                onChange={(e) => handleChange(field.key, (e.target as any).value)}
                rows={4}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Boknings-E-post (E-postlänk för Boka röst)</label>
          <input
            type="email"
            id="klick-voice-booking-email"
            value={settings.booking_email || ""}
            onChange={(e) => handleChange("booking_email", (e.target as any).value)}
            placeholder="exempel@domän.se (lämna tom för att skrolla till kontaktformuläret på startsidan)"
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>
      </div>


      {/* Röstprov (Audio Samples) */}
      <VoiceSamplesSection
        samples={settings.samples || []}
        onChangeSamples={(samples) =>
          setSettings((prev) => ({
            ...prev,
            samples,
            sample_url: samples[0]?.url || "",
          }))
        }
        onPickAudio={(sampleId) => setActiveAudioSampleId(sampleId)}
      />

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
                  onChange={(e) => handleChange("image_url", (e.target as any).value)}
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "image_alt" as const, label: "Bild Alt-text (SEO)", placeholder: "t.ex. Therese Järvheden — röstskådespelerska" },
                { key: "image_title" as const, label: "Titel (Title Tag)", placeholder: "t.ex. Therese Järvheden Röst" },
                { key: "image_caption" as const, label: "Bildtext (Caption)", placeholder: "Kort bildbeskrivning..." },
                { key: "image_filename" as const, label: "Sökoptimerat Filnamn", placeholder: "ex. therese-rost.webp", mono: true },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">{field.label}</label>
                  <input
                    type="text"
                    value={(settings[field.key] as string) || ""}
                    onChange={(e) => handleChange(field.key, (e.target as any).value)}
                    placeholder={field.placeholder}
                    className={`w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember${field.mono ? " font-mono" : ""}`}
                  />
                </div>
              ))}

              <div className="sm:col-span-2 space-y-2">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Beskrivning (Description - WordPress-stil)</label>
                <textarea
                  value={settings.image_description || ""}
                  onChange={(e) => handleChange("image_description", (e.target as any).value)}
                  placeholder="Längre beskrivning för mediabiblioteket/SEO..."
                  rows={2}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                />
              </div>
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
        onSelect={(url, metadata) => {
          setSettings((prev) => ({
            ...prev,
            image_url: url,
            image_alt: metadata?.alt || prev.image_alt || "",
            image_title: metadata?.title || prev.image_title || "",
            image_caption: metadata?.caption || prev.image_caption || "",
            image_description: metadata?.description || prev.image_description || "",
            image_filename: metadata?.filename || prev.image_filename || ""
          }));
          setIsMediaPickerOpen(false);
        }}
        typeFilter="image"
      />

      <MediaPickerModal
        isOpen={Boolean(activeAudioSampleId)}
        onClose={() => setActiveAudioSampleId(null)}
        onSelect={(url) => {
          setSettings((prev) => {
            const nextSamples = (prev.samples || []).map((s) =>
              s.id === activeAudioSampleId ? { ...s, url } : s
            );
            return {
              ...prev,
              samples: nextSamples,
              sample_url: nextSamples[0]?.url || "",
            };
          });
          setActiveAudioSampleId(null);
        }}
        typeFilter="audio"
      />
    </form>
  );
}
