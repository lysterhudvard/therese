import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, Star, Volume2, AlignLeft, Upload, ChevronDown, ChevronUp, Link as LinkIcon, ArrowUp, ArrowDown, Music } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";

interface CreditRow {
  id: string;
  year: string;
  title: string;
  role_sv: string;
  role_en: string;
  category_sv: string;
  category_en: string;
  network: string;
  type: string;
  url?: string;
  img: string;
  is_current_production: boolean;
  sort_order: number;
  // Audio commentary / röst
  commentary_url?: string;
  commentary_duration?: string;
  commentary_sv?: string;
  commentary_en?: string;
  // Script dialogue
  script_scene?: string;
  script_char?: string;
  script_line_sv?: string;
  script_line_en?: string;
}

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
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= credits.length) return;

    const newCredits = [...credits];
    const temp = newCredits[index];
    newCredits[index] = newCredits[nextIndex];
    newCredits[nextIndex] = temp;
    setCredits(newCredits);
    toast.info("Sorteringsordning ändrad.");
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
      img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300",
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
    setCredits(
      credits.map((c) => {
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

  const handleAudioUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(id);
    toast.loading("Laddar upp röstinspelning...", { id: "audio-upload" });

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `audio-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `audio/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, file, { cacheControl: "31536000", upsert: true });

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

  const handleSave = async (e: React.FormEvent) => {
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
          img: c.img || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300",
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
        if (!c.id.startsWith("temp-")) {
          item.id = c.id;
        }
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
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara meriter: ${err.message}`);
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

        <button
          type="button"
          id="klick-credits-add"
          onClick={addCredit}
          className="px-4 py-2 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[10px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          + Lägg till merit
        </button>
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
        {filteredCredits.map((c, index) => {
          const isExpanded = expandedRowId === c.id;

          return (
            <div
              key={c.id}
              id={index === 0 ? "klick-credits-row-0" : undefined}
              className="border border-bone/10 bg-stage/5 p-5 rounded-sm relative space-y-4 transition-all duration-300"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveCredit(index, "up")}
                  className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={index === credits.length - 1}
                  onClick={() => moveCredit(index, "down")}
                  className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeCredit(c.id)}
                  className="p-1 text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Radera"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Grid structure for inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Year */}
                <div className="md:col-span-1">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    År
                  </label>
                  <input
                    type="text"
                    value={c.year}
                    onChange={(e) => updateCredit(c.id, "year", e.target.value)}
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                  />
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Produktionstitel
                  </label>
                  <input
                    type="text"
                    value={c.title}
                    onChange={(e) => updateCredit(c.id, "title", e.target.value)}
                    placeholder="Titel..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-semibold"
                  />
                </div>

                {/* Type */}
                <div className="md:col-span-2">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Huvudtyp
                  </label>
                  <select
                    value={c.type}
                    onChange={(e) => updateCredit(c.id, "type", e.target.value)}
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                  >
                    <option value="Film">Film</option>
                    <option value="TV">TV</option>
                    <option value="Theater">Teater</option>
                    <option value="Voice">Röst / Voiceover</option>
                  </select>
                </div>

                {/* Network */}
                <div className="md:col-span-3">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Kanal / Nätverk / Scen
                  </label>
                  <input
                    type="text"
                    value={c.network}
                    onChange={(e) => updateCredit(c.id, "network", e.target.value)}
                    placeholder="SVT, Dramaten..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                </div>

                {/* Active current production flag */}
                <div className="md:col-span-2 flex items-center justify-start gap-2 pt-4 md:pt-2">
                  <button
                    type="button"
                    onClick={() => updateCredit(c.id, "is_current_production", !c.is_current_production)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[9px] uppercase font-mono tracking-wider transition-colors cursor-pointer border ${
                      c.is_current_production
                        ? "bg-ember/20 border-ember text-ember"
                        : "bg-transparent border-bone/10 text-bone/40 hover:text-bone/70"
                    }`}
                  >
                    <Star size={11} fill={c.is_current_production ? "currentColor" : "none"} />
                    Aktuell
                  </button>
                </div>
              </div>

              {/* Translated role & category details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-bone/5 pt-3">
                {/* Swedish values */}
                <div className="space-y-3">
                  <span className="text-[8px] font-mono text-ember uppercase tracking-wider">🇸🇪 SVENSKA</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                        Roll
                      </label>
                      <input
                        type="text"
                        value={c.role_sv}
                        onChange={(e) => updateCredit(c.id, "role_sv", e.target.value)}
                        placeholder="Huvudroll..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                        Kategori (detaljerad)
                      </label>
                      <input
                        type="text"
                        value={c.category_sv}
                        onChange={(e) => updateCredit(c.id, "category_sv", e.target.value)}
                        placeholder="Humorserie..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                  </div>
                </div>

                {/* English values */}
                <div className="space-y-3">
                  <span className="text-[8px] font-mono text-bone/40 uppercase tracking-wider">🇬🇧 ENGLISH</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={c.role_en}
                        onChange={(e) => updateCredit(c.id, "role_en", e.target.value)}
                        placeholder="Lead role..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">
                        Category (detailed)
                      </label>
                      <input
                        type="text"
                        value={c.category_en}
                        onChange={(e) => updateCredit(c.id, "category_en", e.target.value)}
                        placeholder="Comedy series..."
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced collapsable: Audio recordings and scripts */}
              <div className="border-t border-bone/5 pt-3">
                <button
                  type="button"
                  id={index === 0 ? "klick-credits-advanced-toggle-0" : undefined}
                  onClick={() => toggleExpandRow(c.id)}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-bone/40 hover:text-ember transition-colors font-mono cursor-pointer"
                >
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {isExpanded 
                    ? "Dölj Röstkommentar & Manus (Avancerat)" 
                    : "Visa Röstkommentar & Manus (Avancerat)"
                  }
                  {(c.commentary_url || c.script_scene) && (
                    <span className="ml-2 px-1.5 py-0.5 bg-ember/15 text-ember text-[8px] rounded-sm font-semibold">
                      Aktiv
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 bg-stage/15 p-4 rounded border border-bone/5 animate-fadeIn">
                    
                    {/* Audio commentary section */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-ember flex items-center gap-1.5 border-b border-bone/5 pb-1">
                        <Volume2 size={12} /> Röstkommentar / Audio clip
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Ljudfil (URL)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={c.commentary_url || ""}
                              onChange={(e) => updateCredit(c.id, "commentary_url", e.target.value)}
                              placeholder="https://exempel.se/ljud.mp3"
                              className="flex-1 bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setActivePickerId(c.id)}
                              className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors cursor-pointer"
                              title="Välj från mediebibliotek"
                            >
                              <Music size={12} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Ljudfil Uppladdning
                          </label>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => handleAudioUpload(c.id, e)}
                            disabled={isUploadingAudio === c.id}
                            className="hidden"
                            id={`audio-file-upload-${c.id}`}
                          />
                          <label
                            htmlFor={`audio-file-upload-${c.id}`}
                            id={index === 0 ? "klick-credits-audio-upload-0" : undefined}
                            className="w-full flex items-center justify-center gap-1 border border-dashed border-bone/20 hover:border-ember bg-stage/20 py-1.5 rounded-sm text-[10px] font-mono text-bone/50 hover:text-bone cursor-pointer transition-colors"
                          >
                            <Upload size={11} />
                            Välj Ljudfil
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                          Längd (t.ex. "0:45" eller "1:15")
                        </label>
                        <input
                          type="text"
                          value={c.commentary_duration || ""}
                          onChange={(e) => updateCredit(c.id, "commentary_duration", e.target.value)}
                          placeholder="0:10"
                          className="w-32 bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Kommentartext (Svenska)
                          </label>
                          <textarea
                            value={c.commentary_sv || ""}
                            onChange={(e) => updateCredit(c.id, "commentary_sv", e.target.value)}
                            placeholder="Therese berättar om rollen..."
                            rows={3}
                            className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Commentary Text (English)
                          </label>
                          <textarea
                            value={c.commentary_en || ""}
                            onChange={(e) => updateCredit(c.id, "commentary_en", e.target.value)}
                            placeholder="Therese talks about the role..."
                            rows={3}
                            className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Script dialogue section */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono uppercase tracking-widest text-ember flex items-center gap-1.5 border-b border-bone/5 pb-1">
                        <AlignLeft size={12} /> Manusrader / Script Dialogue
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Scennamn (t.ex. "SCEN 12")
                          </label>
                          <input
                            type="text"
                            value={c.script_scene || ""}
                            onChange={(e) => updateCredit(c.id, "script_scene", e.target.value)}
                            placeholder="SCEN 12 — Teater"
                            className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Karaktär / Rollfigur
                          </label>
                          <input
                            type="text"
                            value={c.script_char || ""}
                            onChange={(e) => updateCredit(c.id, "script_char", e.target.value)}
                            placeholder="Nora"
                            className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Manus Repliker (Svenska)
                          </label>
                          <textarea
                            value={c.script_line_sv || ""}
                            onChange={(e) => updateCredit(c.id, "script_line_sv", e.target.value)}
                            placeholder="Det fanns ingen återvändo..."
                            rows={3}
                            className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                            Script Line (English)
                          </label>
                          <textarea
                            value={c.script_line_en || ""}
                            onChange={(e) => updateCredit(c.id, "script_line_en", e.target.value)}
                            placeholder="There was no turning back..."
                            rows={3}
                            className="w-full bg-stage/35 border border-bone/10 text-bone p-2 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
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
          updateCredit(activePickerId, "commentary_url", url);
        }
      }}
      typeFilter="audio"
    />
    </>
  );
}
