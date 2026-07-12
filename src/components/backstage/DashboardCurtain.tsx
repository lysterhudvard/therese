import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Plus, Trash2, List } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";

interface FooterCreditItem {
  id: string;
  label_sv: string;
  label_en: string;
  value_sv: string;
  value_en: string;
  href: string;
}

const SaveIcon = Save as any;
const PlusIcon = Plus as any;
const TrashIcon = Trash2 as any;
const ListIcon = List as any;

export function DashboardCurtain() {
  const [footerImage, setFooterImage] = useState("https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000028-5883458837/image-crop-200000014-6.jpeg?ph=a6c2528650");
  const [footerImageAlt, setFooterImageAlt] = useState("");
  const [footerImageCaption, setFooterImageCaption] = useState("");
  const [footerImageTitle, setFooterImageTitle] = useState("");
  const [footerImageFilename, setFooterImageFilename] = useState("");
  const [footerImageDescription, setFooterImageDescription] = useState("");
  const [footerEndSv, setFooterEndSv] = useState("SLUT");
  const [footerEndEn, setFooterEndEn] = useState("END");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  
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

    const fetchCurtainData = async () => {
      const { data, error } = await supabase
        .from("biography")
        .select("footer_image, footer_image_alt, footer_image_caption, footer_image_title, footer_image_filename, footer_image_description, footer_end_sv, footer_end_en, footer_credits")
        .eq("id", "main")
        .maybeSingle();

      if (error) {
        console.error("Failed to load curtain data:", error.message);
        return;
      }

      if (data) {
        setFooterImage(data.footer_image !== null && data.footer_image !== undefined ? data.footer_image : "");
        setFooterImageAlt(data.footer_image_alt !== null && data.footer_image_alt !== undefined ? data.footer_image_alt : "");
        setFooterImageCaption(data.footer_image_caption !== null && data.footer_image_caption !== undefined ? data.footer_image_caption : "");
        setFooterImageTitle(data.footer_image_title !== null && data.footer_image_title !== undefined ? data.footer_image_title : "");
        setFooterImageFilename(data.footer_image_filename !== null && data.footer_image_filename !== undefined ? data.footer_image_filename : "");
        setFooterImageDescription(data.footer_image_description !== null && data.footer_image_description !== undefined ? data.footer_image_description : "");
        setFooterEndSv(data.footer_end_sv !== null && data.footer_end_sv !== undefined ? data.footer_end_sv : "");
        setFooterEndEn(data.footer_end_en !== null && data.footer_end_en !== undefined ? data.footer_end_en : "");
        if (data.footer_credits && Array.isArray(data.footer_credits)) {
          setFooterCredits(data.footer_credits as FooterCreditItem[]);
        }
      }
    };

    fetchCurtainData();
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

    const { error } = await supabase.from("biography").update({
      footer_image: footerImage,
      footer_image_alt: footerImageAlt,
      footer_image_caption: footerImageCaption,
      footer_image_title: footerImageTitle,
      footer_image_filename: footerImageFilename,
      footer_image_description: footerImageDescription,
      footer_end_sv: footerEndSv,
      footer_end_en: footerEndEn,
      footer_credits: footerCredits,
    }).eq("id", "main");

    setIsSaving(false);
    if (error) {
      toast.error(`Kunde inte spara eftertexter: ${error.message}`);
      alert(`Misslyckades med att spara Akt VIII (Ridåfall): ${error.message}`);
    } else {
      toast.success("Akt VIII (Ridåfall) har sparats framgångsrikt!");
      alert("Akt VIII (Ridåfall) har sparats framgångsrikt!");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt VIII — <span className="italic text-ember">Ridåfall</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Anpassa den rullande texten och slutskärmen för eftertexterna.
        </p>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
          Slutskärm / Tiny Image
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Liten Sidfotsbild URL</label>
              <div className="flex gap-2">
                <input
                  id="klick-curtain-image"
                  type="text"
                  value={footerImage}
                  onChange={(e) => setFooterImage(e.target.value)}
                  className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
                <button
                  id="klick-curtain-image-media"
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="px-3 py-2 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[9px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Media
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Alt-Text (SEO)</label>
                <input
                  id="klick-curtain-image-alt"
                  type="text"
                  value={footerImageAlt}
                  onChange={(e) => setFooterImageAlt(e.target.value)}
                  placeholder="Alt-text..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Titel (Title Tag)</label>
                <input
                  type="text"
                  value={footerImageTitle}
                  onChange={(e) => setFooterImageTitle(e.target.value)}
                  placeholder="Titel..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Bildtext (Caption)</label>
                <input
                  type="text"
                  value={footerImageCaption}
                  onChange={(e) => setFooterImageCaption(e.target.value)}
                  placeholder="Bildtext..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Sökoptimerat Filnamn</label>
                <input
                  type="text"
                  value={footerImageFilename}
                  onChange={(e) => setFooterImageFilename(e.target.value)}
                  placeholder="ex. therese-slutsida.webp"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[8px] uppercase tracking-widest text-bone/40 font-mono mb-1">Beskrivning (Description)</label>
                <textarea
                  value={footerImageDescription}
                  onChange={(e) => setFooterImageDescription(e.target.value)}
                  placeholder="Längre beskrivning..."
                  rows={2}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                />
              </div>
            </div>

            {footerImage && (
              <img src={footerImage} alt="Sidfot förhandsvisning" className="w-full h-32 object-contain mt-2 rounded border border-bone/5 opacity-80" />
            )}
          </div>
          
          <div className="space-y-4 font-mono">
            <div className="space-y-2 font-sans">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">Sluttext (Svenska)</label>
              <input
                id="klick-curtain-end-sv"
                type="text"
                value={footerEndSv}
                onChange={(e) => setFooterEndSv(e.target.value)}
                placeholder="SLUT"
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div className="space-y-2 font-sans">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono">End text (English)</label>
              <input
                type="text"
                value={footerEndEn}
                onChange={(e) => setFooterEndEn(e.target.value)}
                placeholder="END"
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-2 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-stage/5 border border-bone/10 p-6 rounded-sm space-y-6">
        <div className="flex justify-between items-center border-b border-bone/5 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
            <ListIcon size={14} className="text-ember" /> Rullande Eftertext-rader (Scrolling Text)
          </h3>
          <button
            id="klick-curtain-add-credit"
            type="button"
            onClick={addFooterCredit}
            className="flex items-center gap-1 px-3 py-1 bg-bone/10 hover:bg-bone/20 text-bone hover:text-ember text-[9px] font-mono uppercase tracking-wider transition-colors duration-300 rounded-sm cursor-pointer"
          >
            <PlusIcon size={10} /> Lägg till rad
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
                <TrashIcon size={12} />
              </button>
              
              <span className="text-[8px] font-mono text-bone/45 uppercase tracking-wider">Rad #{index + 1}</span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          id="klick-curtain-save"
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <SaveIcon size={12} />
              Spara ändringar
            </>
          )}
        </button>
      </div>
    <MediaPickerModal
      isOpen={isMediaPickerOpen}
      onClose={() => setIsMediaPickerOpen(false)}
      onSelect={(url, metadata) => {
        setFooterImage(url);
        if (metadata) {
          if (metadata.alt) setFooterImageAlt(metadata.alt);
          if (metadata.title) setFooterImageTitle(metadata.title);
          if (metadata.caption) setFooterImageCaption(metadata.caption);
          if (metadata.description) setFooterImageDescription(metadata.description);
          if (metadata.filename) setFooterImageFilename(metadata.filename);
        }
      }}
      typeFilter="image"
    />
    </form>
  );
}
