import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, ArrowUp, ArrowDown, Video, Trash2, Plus, Upload, Link, Eye, Image as ImageIcon } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";

interface ShowreelItem {
  id: string;
  title_sv: string;
  title_en: string;
  sub_sv: string;
  sub_en: string;
  vimeo_id?: string;
  youtube_id?: string;
  url?: string;
  poster: string;
  genre: string;
  specs: string;
  glow: string;
  sort_order: number;
}

export function DashboardShowreels() {
  const [showreels, setShowreels] = useState<ShowreelItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState<string | null>(null);
  const [activePickerId, setActivePickerId] = useState<string | null>(null);

  // Optimizer Modal States
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [targetReelId, setTargetReelId] = useState<string | null>(null);

  // Fetch showreels on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchReels = async () => {
      const { data, error } = await supabase
        .from("showreels")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data) {
        setShowreels(data as ShowreelItem[]);
      }
    };

    fetchReels();
  }, []);

  const handleReelChange = (id: string, field: keyof ShowreelItem, value: any) => {
    setShowreels(showreels.map((reel) => (reel.id === id ? { ...reel, [field]: value } : reel)));
  };

  const moveReel = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= showreels.length) return;

    const newReels = [...showreels];
    const temp = newReels[index];
    newReels[index] = newReels[nextIndex];
    newReels[nextIndex] = temp;

    // Recalculate sort orders
    const updated = newReels.map((reel, i) => ({ ...reel, sort_order: i }));
    setShowreels(updated);
    toast.info("Sorteringsordning ändrad.");
  };

  const handleDeleteReel = async (id: string) => {
    const isConfirmed = window.confirm("Är du säker på att du vill ta bort denna showreel?");
    if (!isConfirmed) return;

    setShowreels(showreels.filter((reel) => reel.id !== id));
    if (isSupabaseConfigured() && !id.startsWith("temp-")) {
      const { error } = await supabase.from("showreels").delete().eq("id", id);
      if (error) {
        toast.error(`Kunde inte ta bort showreel: ${error.message}`);
      } else {
        toast.success("Showreel borttagen.");
      }
    } else {
      toast.success("Showreel borttagen.");
    }
  };

  const handleAddReel = () => {
    const newReel: ShowreelItem = {
      id: `temp-${Date.now()}`,
      title_sv: "Ny Showreel",
      title_en: "New Showreel",
      sub_sv: "Kort beskrivning",
      sub_en: "Short description",
      vimeo_id: "",
      youtube_id: "",
      url: "",
      poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
      genre: "DRAMA / SCENKLIPP",
      specs: "16:9 // HD",
      glow: "rgba(235, 94, 40, 0.15)",
      sort_order: showreels.length,
    };
    setShowreels([...showreels, newReel]);
    toast.success("Ny showreel lagt till i listan. Konfigurera den nedan och klicka på Spara.");
  };

  const handlePosterUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (file.type.startsWith("image/")) {
      setTargetReelId(id);
      setPendingUploadFile(file);
      setIsOptimizerOpen(true);
      return;
    }

    await proceedWithUpload(id, file);
  };

  const proceedWithUpload = async (id: string, fileToUpload: File) => {
    setIsOptimizerOpen(false);
    setPendingUploadFile(null);
    setTargetReelId(null);
    setIsUploadingPoster(id);
    toast.loading("Laddar upp posterbild...", { id: "poster-upload" });

    try {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `poster-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, fileToUpload, { cacheControl: "31536000", upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      handleReelChange(id, "poster", urlData.publicUrl);
      toast.success("Posterbild uppladdad!", { id: "poster-upload" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Uppladdning misslyckades.", { id: "poster-upload" });
    } finally {
      setIsUploadingPoster(null);
    }
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
      // Prepare items for saving (remove temporary IDs if they exist)
      const reelsToUpsert = showreels.map((reel) => {
        const item: any = { ...reel };
        if (item.id.startsWith("temp-")) {
          delete item.id;
        }
        return item;
      });

      // Simple bulk upsert
      const { error } = await supabase.from("showreels").upsert(reelsToUpsert);
      if (error) throw error;

      toast.success("Akt IV (Showreels) har sparats i Supabase!");
      
      // Re-fetch to get real database IDs
      const { data } = await supabase
        .from("showreels")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data) {
        setShowreels(data as ShowreelItem[]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Fel vid sparning: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <>
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6 flex justify-between items-end gap-4">
        <div>
          <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
            Akt IV — <span className="italic text-ember">Showreels</span>
          </h2>
          <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
            Hantera showreels, vimeo-klipp och direkta videofiler.
          </p>
        </div>
        <button
          type="button"
          id="klick-showreels-add"
          onClick={handleAddReel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-ember text-ink font-semibold font-mono text-[9px] uppercase tracking-widest rounded-sm hover:bg-ember/90 transition-all cursor-pointer"
        >
          <Plus size={11} />
          Lägg till video
        </button>
      </div>

      <div className="space-y-6">
        {showreels.map((reel, index) => (
          <div key={reel.id} className="border border-bone/10 bg-stage/5 p-6 rounded-sm space-y-4 relative">
            <div className="flex items-center justify-between border-b border-bone/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-ember uppercase">Video #{index + 1}</span>
                <span className="text-[9px] font-mono text-bone/40">{reel.specs || "16:9 // HD"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveReel(index, "up")}
                  className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
                >
                  <ArrowUp size={11} />
                </button>
                <button
                  type="button"
                  disabled={index === showreels.length - 1}
                  onClick={() => moveReel(index, "down")}
                  className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
                >
                  <ArrowDown size={11} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteReel(reel.id)}
                  className="p-1 border border-bone/10 hover:border-red-400 text-bone/40 hover:text-red-400 transition-all rounded cursor-pointer"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Titel (Svenska)</label>
                <input
                  type="text"
                  id={index === 0 ? "klick-showreels-title-sv" : undefined}
                  value={reel.title_sv}
                  onChange={(e) => handleReelChange(reel.id, "title_sv", e.target.value)}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Title (English)</label>
                <input
                  type="text"
                  value={reel.title_en}
                  onChange={(e) => handleReelChange(reel.id, "title_en", e.target.value)}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Undertext (Svenska)</label>
                <input
                  type="text"
                  value={reel.sub_sv}
                  onChange={(e) => handleReelChange(reel.id, "sub_sv", e.target.value)}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Subtitle (English)</label>
                <input
                  type="text"
                  value={reel.sub_en}
                  onChange={(e) => handleReelChange(reel.id, "sub_en", e.target.value)}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Vimeo Video ID (Rekommenderat)</label>
                <input
                  type="text"
                  id={index === 0 ? "klick-showreels-vimeo" : undefined}
                  value={reel.vimeo_id || ""}
                  onChange={(e) => handleReelChange(reel.id, "vimeo_id", e.target.value)}
                  placeholder="T.ex: 1042732987"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Direkt Video-URL (Moln/Backup)</label>
                <input
                  type="text"
                  value={reel.url || ""}
                  onChange={(e) => handleReelChange(reel.id, "url", e.target.value)}
                  placeholder="https://uhdzswnawlqpsaajsjpo.supabase.co/storage/v1/..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Genre / Kategori</label>
                <input
                  type="text"
                  value={reel.genre}
                  onChange={(e) => handleReelChange(reel.id, "genre", e.target.value)}
                  placeholder="T.ex: FILM / TV-DRAMA"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Teknisk Spec</label>
                <input
                  type="text"
                  value={reel.specs}
                  onChange={(e) => handleReelChange(reel.id, "specs", e.target.value)}
                  placeholder="T.ex: 16:9 // HD"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Glöd färg (CSS glow)</label>
                <input
                  type="text"
                  value={reel.glow}
                  onChange={(e) => handleReelChange(reel.id, "glow", e.target.value)}
                  placeholder="T.ex: rgba(235, 94, 40, 0.15)"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">YouTube Video ID (Alternativt)</label>
                <input
                  type="text"
                  value={reel.youtube_id || ""}
                  onChange={(e) => handleReelChange(reel.id, "youtube_id", e.target.value)}
                  placeholder="T.ex: dQw4w9WgXcQ"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Posterbild (URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reel.poster}
                    onChange={(e) => handleReelChange(reel.id, "poster", e.target.value)}
                    className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                  <button
                    type="button"
                    onClick={() => setActivePickerId(reel.id)}
                    className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors cursor-pointer"
                    title="Välj från mediebibliotek"
                  >
                    <ImageIcon size={12} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePosterUpload(reel.id, e)}
                    disabled={isUploadingPoster === reel.id}
                    className="hidden"
                    id={`poster-upload-${reel.id}`}
                  />
                  <label
                    htmlFor={`poster-upload-${reel.id}`}
                    id={index === 0 ? "klick-showreels-upload-poster" : undefined}
                    className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <Upload size={12} />
                  </label>
                </div>
                {reel.poster && (
                  <img src={reel.poster} alt="Poster preview" className="w-48 aspect-video object-cover rounded mt-2 border border-bone/10" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-showreels-save"
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

    <MediaPickerModal
      isOpen={activePickerId !== null}
      onClose={() => setActivePickerId(null)}
      onSelect={(url) => {
        if (activePickerId) {
          handleReelChange(activePickerId, "poster", url);
        }
      }}
      typeFilter="image"
    />
    <ImageUploadOptimizer
      isOpen={isOptimizerOpen}
      file={pendingUploadFile}
      defaultSection="showreel"
      onCancel={() => {
        setIsOptimizerOpen(false);
        setPendingUploadFile(null);
        setTargetReelId(null);
      }}
      onUpload={(finalFile) => {
        if (targetReelId) {
          proceedWithUpload(targetReelId, finalFile);
        }
      }}
    />
    </>
  );
}
