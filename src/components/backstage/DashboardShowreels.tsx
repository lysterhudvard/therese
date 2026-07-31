import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";
import { ShowreelItem } from "./showreels/types";
import { ShowreelCardItem } from "./showreels/ShowreelCardItem";

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
      const { data } = await supabase
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
    setShowreels(
      showreels.map((reel) => {
        if (reel.id !== id) return reel;

        let updatedReel = { ...reel, [field]: value };

        // Smart parsing for YouTube and Vimeo URLs pasted in the main URL field
        if (field === "url" && typeof value === "string") {
          const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/||user\/(?:[^\/]+)\/)|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
          const ytMatch = value.match(ytRegex);

          const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
          const vimeoMatch = value.match(vimeoRegex);

          if (ytMatch) {
            updatedReel.youtube_id = ytMatch[1];
            updatedReel.vimeo_id = "";
          } else if (vimeoMatch) {
            updatedReel.vimeo_id = vimeoMatch[1];
            updatedReel.youtube_id = "";
          }
        }

        // Clean up full URLs pasted into specific video ID fields
        if (field === "vimeo_id" && typeof value === "string" && value) {
          const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
          const vimeoMatch = value.match(vimeoRegex);
          if (vimeoMatch) {
            updatedReel.vimeo_id = vimeoMatch[1];
            updatedReel.youtube_id = "";
          }
        }

        if (field === "youtube_id" && typeof value === "string" && value) {
          const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/||user\/(?:[^\/]+)\/)|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/;
          const ytMatch = value.match(ytRegex);
          if (ytMatch) {
            updatedReel.youtube_id = ytMatch[1];
            updatedReel.vimeo_id = "";
          }
        }

        return updatedReel;
      })
    );
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
      poster: "",
      poster_alt: "",
      poster_caption: "",
      poster_title: "",
      poster_filename: "",
      poster_description: "",
      genre: "DRAMA / SCENKLIPP",
      specs: "16:9 // HD",
      glow: "rgba(235, 94, 40, 0.15)",
      sort_order: showreels.length,
    };
    setShowreels([...showreels, newReel]);
    toast.success("Ny showreel lagt till i listan. Konfigurera den nedan och klicka på Spara.");
  };

  const handlePosterUpload = async (id: string, e: any) => {
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
      const baseName = fileToUpload.name.substring(0, fileToUpload.name.lastIndexOf(".")).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      const fileName = `poster-${baseName}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, fileToUpload, { cacheControl: "public, max-age=31536000", upsert: true });

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

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringarna sparas inte.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    try {
      const generateUUID = () => {
        if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
          return window.crypto.randomUUID();
        }
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      const reelsToUpsert = showreels.map((reel) => {
        const item: any = { ...reel };
        if (item.id.startsWith("temp-")) {
          item.id = generateUUID();
        }
        return item;
      });

      const { error } = await supabase.from("showreels").upsert(reelsToUpsert);
      if (error) throw error;

      toast.success("Akt IV (Showreels) har sparats i Supabase!");
      alert("Akt IV (Showreels) har sparats framgångsrikt!");
      
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
      alert(`Misslyckades med att spara Akt IV (Showreels): ${err.message}`);
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
            <ShowreelCardItem
              key={reel.id}
              reel={reel}
              index={index}
              showreelsLength={showreels.length}
              handleReelChange={handleReelChange}
              moveReel={moveReel}
              handleDeleteReel={handleDeleteReel}
              handlePosterUpload={handlePosterUpload}
              isUploadingPoster={isUploadingPoster === reel.id}
              setActivePickerId={setActivePickerId}
            />
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
        onSelect={(url, metadata) => {
          if (activePickerId) {
            handleReelChange(activePickerId, "poster", url);
            if (metadata) {
              if (metadata.alt) handleReelChange(activePickerId, "poster_alt", metadata.alt);
              if (metadata.title) handleReelChange(activePickerId, "poster_title", metadata.title);
              if (metadata.caption) handleReelChange(activePickerId, "poster_caption", metadata.caption);
              if (metadata.description) handleReelChange(activePickerId, "poster_description", metadata.description);
              if (metadata.filename) handleReelChange(activePickerId, "poster_filename", metadata.filename);
            }
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
