import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, Link2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface FooterCreditItem {
  id: string;
  label_sv: string;
  label_en: string;
  value_sv: string;
  value_en: string;
  href: string;
}

export function DashboardContact() {
  const [footerCredits, setFooterCredits] = useState<FooterCreditItem[]>([
    {
      id: "credit-1",
      label_sv: "Agent",
      label_en: "Agent",
      value_sv: "Schultzberg Agency",
      value_en: "Schultzberg Agency",
      href: "mailto:jonas@schultzbergagency.com",
    },
    {
      id: "credit-2",
      label_sv: "KONTAKT",
      label_en: "CONTACT",
      value_sv: "theresejarvheden@gmail.com",
      value_en: "theresejarvheden@gmail.com",
      href: "mailto:theresejarvheden@gmail.com",
    },
    {
      id: "credit-3",
      label_sv: "INSTAGRAM",
      label_en: "INSTAGRAM",
      value_sv: "@theresejarvheden",
      value_en: "@theresejarvheden",
      href: "https://www.instagram.com/theresejarvheden/",
    },
    {
      id: "credit-4",
      label_sv: "FACEBOOK",
      label_en: "FACEBOOK",
      value_sv: "Therese Järvheden",
      value_en: "Therese Järvheden",
      href: "https://www.facebook.com/therese.jarvhedenfdpersson",
    },
    {
      id: "credit-5",
      label_sv: "Foto",
      label_en: "Photo",
      value_sv: "Robert Eldrim",
      value_en: "Robert Eldrim",
      href: "https://www.instagram.com/roberteldrim/",
    },
    {
      id: "credit-6",
      label_sv: "SMINK",
      label_en: "MAKEUP",
      value_sv: "Sara Zetterström",
      value_en: "Sara Zetterström",
      href: "",
    },
    {
      id: "credit-7",
      label_sv: "SCENBILDER",
      label_en: "STILLS",
      value_sv: "SVT · Filmlance · C More",
      value_en: "SVT · Filmlance · C More",
      href: "",
    },
    {
      id: "credit-8",
      label_sv: "PRODUCENT HEMSIDA",
      label_en: "WEBSITE PRODUCER",
      value_sv: "Sirin Öngörür",
      value_en: "Sirin Öngörür",
      href: "",
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchContactData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("footer_credits")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.error("Failed to load contact data:", error.message);
        return;
      }

      if (data && data.footer_credits && Array.isArray(data.footer_credits)) {
        setFooterCredits(data.footer_credits as FooterCreditItem[]);
      }
    };

    fetchContactData();
  }, []);

  const addFooterCredit = () => {
    const newItem: FooterCreditItem = {
      id: `credit-${Date.now()}`,
      label_sv: "",
      label_en: "",
      value_sv: "",
      value_en: "",
      href: "",
    };
    setFooterCredits([...footerCredits, newItem]);
  };

  const removeFooterCredit = (id: string) => {
    setFooterCredits(footerCredits.filter((c) => c.id !== id));
  };

  const updateFooterCredit = (id: string, field: keyof Omit<FooterCreditItem, "id">, value: string) => {
    setFooterCredits(
      footerCredits.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          [field]: value,
        };
      })
    );
  };

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
      footer_credits: footerCredits,
    });

    setIsSaving(false);
    if (error) {
      toast.error(`Kunde inte spara kontaktinfo: ${error.message}`);
    } else {
      toast.success("Akt VII (Kontaktinfo) har sparats framgångsrikt!");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt VII — <span className="italic text-ember">Kontaktinfo</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Hantera dina kontaktuppgifter, sociala medier och medverkande som ska visas i eftertexterna.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <div className="flex justify-between items-center border-b border-bone/5 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
            <Link2 size={14} className="text-ember" /> Eftertext-rader & Kontakter
          </h3>
          <button
            type="button"
            onClick={addFooterCredit}
            className="flex items-center gap-1 px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone hover:text-ember text-[9px] font-mono uppercase tracking-wider transition-colors duration-300 rounded-sm cursor-pointer"
          >
            <Plus size={10} /> Lägg till kontakt/eftertext
          </button>
        </div>

        <div className="space-y-3">
          {footerCredits.map((credit, index) => (
            <div key={credit.id} className="p-4 bg-stage/20 border border-bone/5 rounded-sm space-y-3 relative">
              <button
                type="button"
                onClick={() => removeFooterCredit(credit.id)}
                className="absolute top-3 right-3 text-bone/30 hover:text-ember transition-colors cursor-pointer"
                title="Ta bort eftertext"
              >
                <Trash2 size={12} />
              </button>
              
              <span className="text-[8px] font-mono text-bone/45 uppercase tracking-wider">Eftertext #{index + 1}</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Labels (SV / EN) */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[7px] uppercase tracking-widest text-bone/40 font-mono">Titel/Label (SV)</label>
                      <input
                        type="text"
                        value={credit.label_sv}
                        onChange={(e) => updateFooterCredit(credit.id, "label_sv", e.target.value)}
                        placeholder="t.ex. INSTAGRAM"
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[7px] uppercase tracking-widest text-bone/40 font-mono">Title/Label (EN)</label>
                      <input
                        type="text"
                        value={credit.label_en}
                        onChange={(e) => updateFooterCredit(credit.id, "label_en", e.target.value)}
                        placeholder="e.g. INSTAGRAM"
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                  </div>
                </div>

                {/* Values (SV / EN) */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[7px] uppercase tracking-widest text-bone/40 font-mono">Värde/Text (SV)</label>
                      <input
                        type="text"
                        value={credit.value_sv}
                        onChange={(e) => updateFooterCredit(credit.id, "value_sv", e.target.value)}
                        placeholder="t.ex. @theresejarvheden"
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[7px] uppercase tracking-widest text-bone/40 font-mono">Value/Text (EN)</label>
                      <input
                        type="text"
                        value={credit.value_en}
                        onChange={(e) => updateFooterCredit(credit.id, "value_en", e.target.value)}
                        placeholder="e.g. @theresejarvheden"
                        className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional href/link */}
              <div className="space-y-1">
                <label className="block text-[7px] uppercase tracking-widest text-bone/40 font-mono">Länk (Optional URL, t.ex. mailto:, tel:, eller https://)</label>
                <input
                  type="text"
                  value={credit.href}
                  onChange={(e) => updateFooterCredit(credit.id, "href", e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-2 py-1 rounded-sm text-[11px] focus:outline-none focus:border-ember"
                />
              </div>
            </div>
          ))}
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
