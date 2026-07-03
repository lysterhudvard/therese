import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Image } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export function DashboardCurtain() {
  const [footerImage, setFooterImage] = useState("https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000028-5883458837/image-crop-200000014-6.jpeg?ph=a6c2528650");
  const [footerEndSv, setFooterEndSv] = useState("SLUT");
  const [footerEndEn, setFooterEndEn] = useState("END");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchCurtainData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("footer_image, footer_end_sv, footer_end_en")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.error("Failed to load curtain data:", error.message);
        return;
      }

      if (data) {
        if (data.footer_image) setFooterImage(data.footer_image);
        if (data.footer_end_sv) setFooterEndSv(data.footer_end_sv);
        if (data.footer_end_en) setFooterEndEn(data.footer_end_en);
      }
    };

    fetchCurtainData();
  }, []);

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
      footer_image: footerImage,
      footer_end_sv: footerEndSv,
      footer_end_en: footerEndEn,
    });

    setIsSaving(false);
    if (error) {
      toast.error(`Kunde inte spara ridåfallsdata: ${error.message}`);
    } else {
      toast.success("Akt VIII (Ridåfall) har sparats framgångsrikt!");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt VIII — <span className="italic text-ember">Ridåfall</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Anpassa eftertexternas slutskärm, inklusive den lilla rullande bilden och sluttexten.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          <Image size={14} className="text-ember" /> Ridåfall & Slutskärm
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Liten Sidfotsbild URL (Eftertexter - Tiny Image)</label>
            <input
              type="text"
              value={footerImage}
              onChange={(e) => setFooterImage(e.target.value)}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
            {footerImage && (
              <img src={footerImage} alt="Sidfot förhandsvisning" className="w-20 h-14 object-cover mt-2 rounded border border-bone/5 opacity-80" />
            )}
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Sluttext (Svenska)</label>
              <input
                type="text"
                value={footerEndSv}
                onChange={(e) => setFooterEndSv(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">End text (English)</label>
              <input
                type="text"
                value={footerEndEn}
                onChange={(e) => setFooterEndEn(e.target.value)}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
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
