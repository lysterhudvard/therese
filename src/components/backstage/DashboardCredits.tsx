import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, ListOrdered, Calendar, Star } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

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
}

export function DashboardCredits() {
  const [credits, setCredits] = useState<CreditRow[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState("Alla");

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchCredits = async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data) {
        setCredits(data as CreditRow[]);
      }
    };

    fetchCredits();
  }, []);

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
    };
    setCredits([newCredit, ...credits]);
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
          // Disable on other credits in state
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
          url: c.url || null
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

      toast.success("Akt IV (Meriter) har sparats framgångsrikt i Supabase!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara meriter: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-7xl">
      <div className="border-b border-bone/10 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
            Akt IV — <span className="italic text-ember">Meritförteckning</span>
          </h2>
          <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
            Hantera den fullständiga listan över skådespelarmeriter, produktioner och roller.
          </p>
        </div>

        <button
          type="button"
          onClick={addCredit}
          className="px-4 py-2 bg-bone/10 hover:bg-bone/20 text-bone font-mono text-[10px] uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
        >
          + Lägg till merit
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-bone/5 pb-4">
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
        {filteredCredits.map((c) => (
          <div
            key={c.id}
            className="border border-bone/10 bg-stage/5 p-5 rounded-sm relative space-y-4"
          >
            <button
              type="button"
              onClick={() => removeCredit(c.id)}
              className="absolute top-4 right-4 text-bone/35 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Radera"
            >
              <Trash2 size={14} />
            </button>

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
          </div>
        ))}
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
