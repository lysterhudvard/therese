import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { moveArrayItem } from "../../lib/utils";
import { MediaPickerModal } from "./MediaPickerModal";
import { CreditRow } from "./credits/types";
import { CreditItemCard } from "./credits/CreditItemCard";

export function DashboardCredits() {
  const [credits, setCredits] = useState<CreditRow[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState("Alla");
  
  // Track which rows have advanced features expanded
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isUploadingAudio, setIsUploadingAudio] = useState<string | null>(null);
  const [activePickerId, setActivePickerId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*");

      if (data) {
        const sorted = (data as CreditRow[]).sort((a, b) => {
          if (a.year === "—" && b.year !== "—") return 1;
          if (b.year === "—" && a.year !== "—") return -1;
          if (a.year !== b.year) {
             return b.year.localeCompare(a.year);
          }
          return a.sort_order - b.sort_order;
        });
        setCredits(sorted);
      }
    };

    fetchCredits();
  }, []);

  const moveCredit = (index: number, direction: "up" | "down") => {
    const updated = moveArrayItem(credits, index, direction);
    if (updated !== credits) {
      setCredits(updated);
      toast.info("Sorteringsordning ändrad.");
    }
  };

  const filteredCredits = filterType === "Alla" 
    ? credits 
    : credits.filter(c => c.type === filterType);

  const addCredit = () => {
    const newCredit: CreditRow = {
      id: `temp-${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: "",
      role_sv: "",
      role_en: "",
      category_sv: "",
      category_en: "",
      network: "",
      type: "Film",
      img: "",
      img_alt: "",
      img_caption: "",
      img_title: "",
      img_filename: "",
      img_description: "",
      is_current_production: false,
      sort_order: credits.length,
      commentary_url: "",
      commentary_duration: "0:10",
      commentary_sv: "",
      commentary_en: "",
      script_scene: "",
      script_char: "",
      script_line_sv: "",
      script_line_en: "",
    };
    setCredits([newCredit, ...credits]);
    setExpandedRowId(newCredit.id); // Expand immediately to let them edit voice/script
    toast.success("Ny tom merit tillagd högst upp.");
  };

  const removeCredit = (id: string) => {
    if (!id.startsWith("temp-")) {
      setDeletedIds([...deletedIds, id]);
    }
    setCredits(credits.filter(c => c.id !== id));
    toast.error("Merit borttagen ur listan.");
  };

  const updateCredit = (id: string, field: keyof CreditRow, value: any) => {
    setCredits((prevCredits) =>
      prevCredits.map((c) => {
        if (c.id !== id) return c;
        
        // If setting this credit to is_current_production, disable all others
        if (field === "is_current_production" && value === true) {
          setTimeout(() => {
            setCredits(prev => prev.map(item => ({
              ...item,
              is_current_production: item.id === id
            })));
          }, 0);
        }
        
        return { ...c, [field]: value };
      })
    );
  };

  const handleAudioUpload = async (id: string, e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(id);
    toast.loading("Laddar upp röstinspelning...", { id: "audio-upload" });

    try {
      const fileExt = file.name.split(".").pop();
      const baseName = file.name.substring(0, file.name.lastIndexOf(".")).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      const fileName = `${baseName}-${Math.random().toString(36).substring(2, 6)}.${fileExt}`;
      const filePath = `audio/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, { cacheControl: "public, max-age=31536000", upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);

      // Set audio url
      updateCredit(id, "commentary_url", urlData.publicUrl);
      
      // Auto-detect audio duration if browser supports it
      try {
        const audio = new Audio(urlData.publicUrl);
        audio.addEventListener("loadedmetadata", () => {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.round(audio.duration % 60);
          const computedDuration = `${mins}:${secs.toString().padStart(2, "0")}`;
          updateCredit(id, "commentary_duration", computedDuration);
        });
      } catch (e) {
        console.warn("Could not determine duration dynamically", e);
      }

      toast.success("Röstfil uppladdad framgångsrikt!", { id: "audio-upload" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Ljuduppladdning misslyckades.", { id: "audio-upload" });
    } finally {
      setIsUploadingAudio(null);
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet. Ändringarna sparas ej.");
      setTimeout(() => setIsSaving(false), 500);
      return;
    }

    try {
      // 1. Process deletes
      if (deletedIds.length > 0) {
        const { error: delErr } = await supabase.from("credits").delete().in("id", deletedIds);
        if (delErr) throw delErr;
        setDeletedIds([]);
      }

      // UUID generator for new items
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

      // 2. Process upserts
      const itemsToUpsert = credits.map((c, index) => {
        const item: any = {
          year: c.year,
          title: c.title,
          role_sv: c.role_sv,
          role_en: c.role_en,
          category_sv: c.category_sv,
          category_en: c.category_en,
          network: c.network,
          type: c.type,
          img: c.img || "",
          img_alt: c.img_alt || "",
          img_caption: c.img_caption || "",
          img_title: c.img_title || "",
          img_filename: c.img_filename || "",
          img_description: c.img_description || "",
          is_current_production: c.is_current_production,
          sort_order: index,
          url: c.url || null,
          commentary_url: c.commentary_url || null,
          commentary_duration: c.commentary_duration || null,
          commentary_sv: c.commentary_sv || null,
          commentary_en: c.commentary_en || null,
          script_scene: c.script_scene || null,
          script_char: c.script_char || null,
          script_line_sv: c.script_line_sv || null,
          script_line_en: c.script_line_en || null,
        };
        
        item.id = c.id.startsWith("temp-") ? generateUUID() : c.id;
        
        return item;
      });

      const { error: upsertErr } = await supabase.from("credits").upsert(itemsToUpsert);
      if (upsertErr) throw upsertErr;

      // Reload to get actual UUIDs for any newly inserted temp items
      const { data: freshData } = await supabase
        .from("credits")
        .select("*")
        .order("sort_order", { ascending: true });
        
      if (freshData) {
        setCredits(freshData as CreditRow[]);
      }

      toast.success("Akt V (Meriter & Ljudfiler) har sparats framgångsrikt i Supabase!");
      alert("Akt V (Meriter & Ljudfiler) har sparats framgångsrikt!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara meriter: ${err.message}`);
      alert(`Misslyckades med att spara Akt V (Meriter & Ljudfiler): ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  return (
    <>
    <form onSubmit={handleSave} className="space-y-8 max-w-7xl">
      <div className="border-b border-bone/10 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
            Akt V — <span className="italic text-ember">Meritförteckning & Röstfiler</span>
          </h2>
          <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
            Hantera produktioner, roller samt tillhörande röstinspelningar, kommentarer och manusrader.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            id="klick-credits-add"
            onClick={addCredit}
            className="px-4 py-2 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[10px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
          >
            + Lägg till merit
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center min-w-[80px] gap-2 px-4 py-2 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            ) : (
              "Spara"
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div id="klick-credits-filters" className="flex flex-wrap gap-1 border-b border-bone/5 pb-4">
        {["Alla", "Film", "TV", "Theater", "Voice"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest transition-colors ${
              filterType === t 
                ? "text-ember border border-ember bg-ember/5" 
                : "text-bone/50 hover:text-bone border border-transparent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Credits Editor Rows */}
      <div className="space-y-6">
        {filteredCredits.map((c, index) => (
          <CreditItemCard
            key={c.id}
            c={c}
            index={index}
            creditsCount={credits.length}
            isExpanded={expandedRowId === c.id}
            toggleExpandRow={toggleExpandRow}
            moveCredit={moveCredit}
            removeCredit={removeCredit}
            updateCredit={updateCredit}
            handleAudioUpload={handleAudioUpload}
            isUploadingAudio={isUploadingAudio === c.id}
            setActivePickerId={setActivePickerId}
          />
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t border-bone/10">
        <button
          type="button"
          onClick={addCredit}
          className="px-4 py-2 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[10px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          + Lägg till merit
        </button>
        <button
          type="submit"
          id="klick-credits-save"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
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
          if (activePickerId.endsWith("-img")) {
            const actualId = activePickerId.substring(0, activePickerId.length - 4);
            setCredits((prev) =>
              prev.map((c) =>
                c.id === actualId
                  ? {
                      ...c,
                      img: url,
                      img_alt: metadata?.alt || c.img_alt || "",
                      img_title: metadata?.title || c.img_title || "",
                      img_caption: metadata?.caption || c.img_caption || "",
                      img_description: metadata?.description || c.img_description || "",
                      img_filename: metadata?.filename || c.img_filename || "",
                    }
                  : c
              )
            );
          } else {
            updateCredit(activePickerId, "commentary_url", url);
          }
        }
        setActivePickerId(null);
      }}
      typeFilter={activePickerId?.endsWith("-img") ? "image" : "audio"}
    />
    </>
  );
}
