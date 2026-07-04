import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, ArrowUp, ArrowDown, Image as ImageIcon, Trash2, Plus, Upload, Link } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

import { MediaPickerModal } from "./MediaPickerModal";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  allow_download: boolean;
  sort_order: number;
}

export function DashboardPortfolio() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Optimizer Modal States
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  // Fetch data from Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchData = async () => {
      const { data: imgData } = await supabase
        .from("portfolio_images")
        .select("*")
        .order("sort_order", { ascending: true });

      if (imgData) {
        setImages(imgData as GalleryImage[]);
      }
    };

    fetchData();
  }, []);

  // Image manipulation operations
  const moveImage = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[nextIndex];
    newImages[nextIndex] = temp;

    // Recalculate sort orders
    const updated = newImages.map((img, i) => ({ ...img, sort_order: i }));
    setImages(updated);
    toast.info("Sorteringsordning ändrad.");
  };

  const handleAltChange = (id: string, newAlt: string) => {
    setImages(images.map((img) => (img.id === id ? { ...img, alt: newAlt } : img)));
  };

  const handleDownloadToggle = (id: string) => {
    setImages(images.map((img) => (img.id === id ? { ...img, allow_download: !img.allow_download } : img)));
  };

  const handleDeleteImage = async (id: string) => {
    setImages(images.filter((img) => img.id !== id));
    if (isSupabaseConfigured() && !id.startsWith("temp-")) {
      const { error } = await supabase.from("portfolio_images").delete().eq("id", id);
      if (error) {
        toast.error(`Kunde inte ta bort bilden: ${error.message}`);
      } else {
        toast.success("Bild borttagen.");
      }
    } else {
      toast.success("Bild borttagen.");
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl) {
      toast.error("Vänligen ange en giltig bild-URL.");
      return;
    }
    const newImg: GalleryImage = {
      id: `temp-${Date.now()}`,
      url: newImageUrl,
      alt: newImageAlt || "Therese Järvheden porträtt",
      allow_download: true,
      sort_order: images.length,
    };
    setImages([...images, newImg]);
    setNewImageUrl("");
    setNewImageAlt("");
    toast.success("Bild lagd till i listan. Klicka på Spara för att ladda upp.");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    if (file.type.startsWith("image/")) {
      setPendingUploadFile(file);
      setIsOptimizerOpen(true);
      return;
    }

    await proceedWithUpload(file);
  };

  const proceedWithUpload = async (fileToUpload: File) => {
    setIsOptimizerOpen(false);
    setPendingUploadFile(null);
    setIsUploading(true);
    toast.loading("Laddar upp bild till hink...", { id: "upload-toast" });

    try {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, fileToUpload);

      if (error) {
        if (error.message.includes("Bucket not found")) {
          throw new Error("Storage-hinken 'portfolio' saknas. Skapa en offentlig hink med namnet 'portfolio' i ditt Supabase Storage först.");
        }
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      
      const newImg: GalleryImage = {
        id: `temp-${Date.now()}`,
        url: urlData.publicUrl,
        alt: fileToUpload.name.split(".")[0],
        allow_download: true,
        sort_order: images.length,
      };

      setImages([...images, newImg]);
      toast.success("Bild uppladdad! Klicka på Spara för att bekräfta.", { id: "upload-toast" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Uppladdning misslyckades.", { id: "upload-toast" });
    } finally {
      setIsUploading(false);
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
      // Save images
      const imagesToUpsert = images.map(({ id, url, alt, allow_download, sort_order }) => {
        const item: any = { url, alt, allow_download, sort_order };
        if (!id.startsWith("temp-")) {
          item.id = id;
        }
        return item;
      });

      const { error: imgErr } = await supabase.from("portfolio_images").upsert(imagesToUpsert);
      if (imgErr) throw imgErr;

      toast.success("Akt III (Portfolio Bilder) har sparats i Supabase!");
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
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt III — <span className="italic text-ember">Portfolio Bilder</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Hantera portfoliobilder (ordning och alt-texter för sökoptimering).
        </p>
      </div>

      {/* Gallery Section */}
      <div className="space-y-4">
        <div className="border-b border-bone/5 pb-2">
          <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
            <ImageIcon size={14} className="text-ember" /> Gällande Portfoliobilder & Sortering
          </h3>
        </div>

        {/* Add photo tool */}
        <div className="bg-stage/15 border border-bone/5 p-4 rounded-sm space-y-4">
          <h4 className="text-[10px] uppercase tracking-widest text-bone/70 font-mono">Lägg till ny bild</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-widest text-bone/45 font-mono">Bild via URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="klick-portfolio-url-input"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://exempel.se/bild.jpg"
                  className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors cursor-pointer"
                  title="Välj från mediebibliotek"
                >
                  <ImageIcon size={12} />
                </button>
                <button
                  type="button"
                  id="klick-portfolio-url-add"
                  onClick={handleAddImageUrl}
                  className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors cursor-pointer"
                  title="Lägg till länk"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-widest text-bone/45 font-mono">Direkt Filuppladdning</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="portfolio-file-upload"
                />
                <label
                  htmlFor="portfolio-file-upload"
                  id="klick-portfolio-upload"
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-bone/20 hover:border-ember/40 bg-stage/20 py-1.5 rounded-sm text-xs font-mono text-bone/50 hover:text-bone cursor-pointer transition-colors"
                >
                  <Upload size={12} />
                  Välj bildfil
                </label>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-widest text-bone/45 font-mono">Alt-tag (Beskrivning för SEO)</label>
            <input
              type="text"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
              placeholder="Ex: Therese Järvheden - Svartvitt porträtt 2025"
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
        </div>

        <div id="klick-portfolio-grid" className="space-y-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="flex flex-col md:flex-row md:items-center justify-between border border-bone/10 bg-stage/10 p-4 rounded-sm gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Small thumbnail preview */}
                <div className="w-16 h-12 rounded bg-stage border border-bone/10 overflow-hidden shrink-0">
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover grayscale" />
                </div>
                {/* Alt-tag configuration */}
                <div className="flex-1">
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Alt-Text (För Google Images)
                  </label>
                  <input
                    type="text"
                    value={img.alt}
                    onChange={(e) => handleAltChange(img.id, e.target.value)}
                    placeholder="Beskriv bilden..."
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                </div>
              </div>

              {/* Sorting buttons and download toggle */}
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-bone/5 pt-2 md:pt-0 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={img.allow_download}
                    onChange={() => handleDownloadToggle(img.id)}
                    className="rounded border-bone/20 text-ember focus:ring-0 focus:ring-offset-0 bg-transparent w-3.5 h-3.5"
                  />
                  <span className="text-[10px] uppercase tracking-widest text-bone/60 font-mono">
                    Nedladdning
                  </span>
                </label>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveImage(index, "up")}
                    className="p-1.5 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, "down")}
                    className="p-1.5 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1.5 border border-bone/10 hover:border-red-400 text-bone/40 hover:text-red-400 transition-all rounded cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-portfolio-save"
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
      isOpen={isMediaPickerOpen}
      onClose={() => setIsMediaPickerOpen(false)}
      onSelect={(url) => setNewImageUrl(url)}
      typeFilter="image"
    />
    <ImageUploadOptimizer
      isOpen={isOptimizerOpen}
      file={pendingUploadFile}
      defaultSection="portfolio"
      onCancel={() => {
        setIsOptimizerOpen(false);
        setPendingUploadFile(null);
      }}
      onUpload={(finalFile) => {
        proceedWithUpload(finalFile);
      }}
    />
    </>
  );
}
