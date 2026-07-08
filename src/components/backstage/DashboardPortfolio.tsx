import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Image as ImageIcon, Plus, Upload } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

import { MediaPickerModal } from "./MediaPickerModal";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";
import { GalleryImage } from "./portfolio/types";
import { PortfolioCardItem } from "./portfolio/PortfolioCardItem";

export function DashboardPortfolio() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activePickingImageId, setActivePickingImageId] = useState<string | null>(null);

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
      download_url: newImageUrl,
      alt: newImageAlt || "Therese Järvheden porträtt",
      caption: "",
      title: "",
      filename: newImageUrl.split("/").pop() || "",
      allow_download: true,
      sort_order: images.length,
    };
    setImages([...images, newImg]);
    setNewImageUrl("");
    setNewImageAlt("");
    toast.success("Bild lagd till i listan. Klicka på Spara för att bekräfta.");
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
    const originalFile = pendingUploadFile; // Keep reference to original file before we reset it
    setIsOptimizerOpen(false);
    setPendingUploadFile(null);
    setIsUploading(true);
    toast.loading("Laddar upp bild(er) till hink...", { id: "upload-toast" });

    try {
      let optimizedUrl = "";
      let originalUrl = "";

      // 1. Upload display image (optimized WebP or original raw file)
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `portfolio/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, fileToUpload, { cacheControl: "public, max-age=31536000", upsert: true });

      if (error) {
        if (error.message.includes("Bucket not found")) {
          throw new Error("Storage-hinken 'portfolio' saknas. Skapa en offentlig hink med namnet 'portfolio' i ditt Supabase Storage först.");
        }
        throw error;
      }

      // Get display image public URL
      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      optimizedUrl = urlData.publicUrl;

      // 2. If it is an optimized file, also upload the original file for the high-res download
      const isOptimized = fileToUpload.name.includes("-optimized.");
      if (isOptimized && originalFile) {
        const origExt = originalFile.name.split(".").pop();
        const origFileName = `${Math.random().toString(36).substring(2)}-original.${origExt}`;
        const origFilePath = `portfolio/${origFileName}`;

        const { error: origErr } = await supabase.storage
          .from("portfolio")
          .upload(origFilePath, originalFile, { cacheControl: "public, max-age=31536000", upsert: true });

        if (!origErr) {
          const { data: origUrlData } = supabase.storage.from("portfolio").getPublicUrl(origFilePath);
          originalUrl = origUrlData.publicUrl;
        } else {
          console.warn("Could not upload original download file, falling back to display URL:", origErr);
          originalUrl = optimizedUrl;
        }
      } else {
        originalUrl = optimizedUrl;
      }
      
      const newImg: GalleryImage = {
        id: `temp-${Date.now()}`,
        url: optimizedUrl,
        download_url: originalUrl,
        alt: fileToUpload.name.split("-optimized")[0].split(".")[0],
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
      const imagesToUpsert = images.map(({ id, url, alt, caption, title, filename, description, allow_download, download_url, sort_order }) => {
        const item: any = { 
          url, 
          alt: alt || "Therese Järvheden portfolio", 
          caption: caption || "", 
          title: title || "", 
          filename: filename || "", 
          description: description || "",
          allow_download, 
          download_url: download_url || url, 
          sort_order 
        };
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
          <div className="bg-stage/15 border border-bone/10 p-6 rounded-md space-y-4">
            <h4 className="text-[11px] uppercase tracking-widest text-bone font-mono text-center">
              Lägg till ny bild i portfolion
            </h4>
            <p className="text-[10px] text-bone/50 max-w-sm mx-auto pb-2 text-center">
              Välj om du vill ladda upp en helt ny fil från din dator, hämta en bild du redan laddat upp i
              Mediebiblioteket, eller ange en direktlänk.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative w-full sm:w-auto">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="portfolio-file-upload-main"
                />
                <label
                  htmlFor="portfolio-file-upload-main"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-ember/10 hover:bg-ember/20 border border-ember/30 text-ember text-[10px] font-mono uppercase tracking-widest rounded-sm cursor-pointer transition-colors w-full"
                >
                  <Upload size={14} />
                  {isUploading ? "Laddar upp..." : "Ladda upp från dator"}
                </label>
              </div>

              <span className="text-bone/30 text-xs italic">eller</span>

              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-bone/5 hover:bg-bone/10 border border-bone/10 text-bone text-[10px] font-mono uppercase tracking-widest rounded-sm cursor-pointer transition-colors w-full sm:w-auto"
              >
                <ImageIcon size={14} />
                Välj från Mediebibliotek
              </button>
            </div>

            {/* Direct URL Inputs */}
            <div className="border-t border-bone/5 pt-4 mt-2 max-w-lg mx-auto text-left space-y-3">
              <h5 className="text-[9px] uppercase tracking-widest text-bone/60 font-mono">
                Eller ange en direkt länk:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Bild-URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://exempel.se/bild.jpg"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                    Alt-text (SEO)
                  </label>
                  <input
                    type="text"
                    placeholder="Therese Järvheden porträtt..."
                    value={newImageAlt}
                    onChange={(e) => setNewImageAlt(e.target.value)}
                    className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="w-full py-1.5 bg-bone/10 hover:bg-bone/20 text-bone text-[9px] font-mono uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                Lägg till URL
              </button>
            </div>
          </div>

          <div id="klick-portfolio-grid" className="space-y-3">
            {images.map((img, index) => (
              <PortfolioCardItem
                key={img.id}
                img={img}
                index={index}
                images={images}
                setImages={setImages}
                handleAltChange={handleAltChange}
                handleDownloadToggle={handleDownloadToggle}
                handleDeleteImage={handleDeleteImage}
                moveImage={moveImage}
                setActivePickingImageId={setActivePickingImageId}
                setIsMediaPickerOpen={setIsMediaPickerOpen}
              />
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
        onClose={() => {
          setIsMediaPickerOpen(false);
          setActivePickingImageId(null);
        }}
        onSelect={(url, metadata) => {
          if (activePickingImageId) {
            setImages(
              images.map((img) =>
                img.id === activePickingImageId
                  ? {
                      ...img,
                      url,
                      alt: metadata?.alt || img.alt || "",
                      title: metadata?.title || img.title || "",
                      caption: metadata?.caption || img.caption || "",
                      description: metadata?.description || img.description || "",
                      filename: metadata?.filename || img.filename || "",
                    }
                  : img
              )
            );
            setActivePickingImageId(null);
          } else {
            const newImg: GalleryImage = {
              id: `temp-${Date.now()}`,
              url: url,
              download_url: url,
              alt: metadata?.alt || "Porträtt från mediebibliotek",
              title: metadata?.title || "",
              caption: metadata?.caption || "",
              description: metadata?.description || "",
              filename: metadata?.filename || "",
              allow_download: true,
              sort_order: images.length,
            };
            setImages([...images, newImg]);
            toast.success("Bild tillagd från mediebiblioteket. Klicka på Spara för att bekräfta.");
          }
        }}
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
