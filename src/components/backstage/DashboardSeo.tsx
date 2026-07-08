import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save, Search, Share2, Globe, AlertTriangle, Upload, Link, Image as ImageIcon } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { MediaPickerModal } from "./MediaPickerModal";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";

export function DashboardSeo() {
  const [titleSv, setTitleSv] = useState("");
  const [descSv, setDescSv] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogImageAlt, setOgImageAlt] = useState("");
  const [ogImageCaption, setOgImageCaption] = useState("");
  const [ogImageTitle, setOgImageTitle] = useState("");
  const [ogImageFilename, setOgImageFilename] = useState("");
  const [ogImageDescription, setOgImageDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [activePreviewLang, setActivePreviewLang] = useState<"sv" | "en">("sv");
  const [isSaving, setIsSaving] = useState(false);

  // Optimizer Modal States
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchSeo = async () => {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .eq("id", "main")
        .maybeSingle();

      if (data) {
        setTitleSv(data.title_sv || "");
        setDescSv(data.description_sv || "");
        setTitleEn(data.title_en || "");
        setDescEn(data.description_en || "");
        setOgImage(data.og_image || "");
        setOgImageAlt(data.og_image_alt || "");
        setOgImageCaption(data.og_image_caption || "");
        setOgImageTitle(data.og_image_title || "");
        setOgImageFilename(data.og_image_filename || "");
        setOgImageDescription(data.og_image_description || "");
      }
    };

    fetchSeo();
  }, []);

  const getTitleLengthColor = (len: number) => {
    if (len >= 45 && len <= 60) return "text-emerald-400";
    if (len > 60 && len <= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getDescLengthColor = (len: number) => {
    if (len >= 120 && len <= 160) return "text-emerald-400";
    if (len > 160 && len <= 180) return "text-yellow-400";
    return "text-red-400";
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
    toast.loading("Laddar upp OpenGraph-bild...", { id: "seo-upload" });

    try {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `og-${Date.now()}.${fileExt}`;
      const filePath = `og/${fileName}`;

      const { error } = await supabase.storage
        .from("portfolio")
        .upload(filePath, fileToUpload, { cacheControl: "31536000", upsert: true });

      if (error) {
        if (error.message.includes("Bucket not found")) {
          throw new Error("Storage-hinken 'portfolio' saknas. Skapa en offentlig hink med namnet 'portfolio' i ditt Supabase Storage först.");
        }
        throw error;
      }

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
      setOgImage(urlData.publicUrl);
      toast.success("Bild uppladdad! Klicka på Spara för att bekräfta.", { id: "seo-upload" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Uppladdning misslyckades.", { id: "seo-upload" });
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

    const { error } = await supabase.from("seo_settings").upsert({
      id: "main",
      title_sv: titleSv,
      description_sv: descSv,
      title_en: titleEn,
      description_en: descEn,
      og_image: ogImage,
      og_image_alt: ogImageAlt,
      og_image_caption: ogImageCaption,
      og_image_title: ogImageTitle,
      og_image_filename: ogImageFilename,
      og_image_description: ogImageDescription,
    });

    setIsSaving(false);
    if (error) {
      toast.error(`Kunde inte spara SEO-inställningar: ${error.message}`);
    } else {
      toast.success("SEO-inställningar och meta-taggar har sparats i Supabase!");
    }
  };

  const currentTitle = activePreviewLang === "sv" ? titleSv : titleEn;
  const currentDesc = activePreviewLang === "sv" ? descSv : descEn;

  return (
    <>
      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      <div className="border-b border-bone/10 pb-4 mb-6">
        <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
          Akt V — <span className="italic text-ember">Sökmotoroptimering (SEO)</span>
        </h2>
        <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
          Konfigurera webbplatsens meta-taggar, synlighet och förhandsgranskningar.
        </p>
      </div>

      {/* Editor Layout: Forms on Left, Previews on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Metadata Editors */}
        <div className="lg:col-span-6 space-y-6">
          {/* Language Tabs */}
          <div className="flex gap-2 border-b border-bone/5 pb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-bone mr-4 self-center">
              Språkversion:
            </span>
            <button
              type="button"
              onClick={() => setActivePreviewLang("sv")}
              className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activePreviewLang === "sv" ? "bg-ember text-ink font-semibold" : "text-bone/50 hover:text-bone"
              }`}
            >
              Svenska
            </button>
            <button
              type="button"
              onClick={() => setActivePreviewLang("en")}
              className={`px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activePreviewLang === "en" ? "bg-ember text-ink font-semibold" : "text-bone/50 hover:text-bone"
              }`}
            >
              English
            </button>
          </div>

          {activePreviewLang === "sv" ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-bone/50 font-mono">
                    Meta-Titel (Svenska)
                  </label>
                  <span className={`font-mono text-[10px] ${getTitleLengthColor(titleSv.length)}`}>
                    {titleSv.length} / 60 tecken
                  </span>
                </div>
                <input
                  type="text"
                  id="klick-seo-title-sv"
                  value={titleSv}
                  onChange={(e) => setTitleSv(e.target.value)}
                  className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-bone/50 font-mono">
                    Meta-Beskrivning (Svenska)
                  </label>
                  <span className={`font-mono text-[10px] ${getDescLengthColor(descSv.length)}`}>
                    {descSv.length} / 160 tecken
                  </span>
                </div>
                <textarea
                  id="klick-seo-desc-sv"
                  value={descSv}
                  onChange={(e) => setDescSv(e.target.value)}
                  rows={4}
                  className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-bone/50 font-mono">
                    Meta-Title (English)
                  </label>
                  <span className={`font-mono text-[10px] ${getTitleLengthColor(titleEn.length)}`}>
                    {titleEn.length} / 60 tecken
                  </span>
                </div>
                <input
                  type="text"
                  id="klick-seo-title-en"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-bone/50 font-mono">
                    Meta-Description (English)
                  </label>
                  <span className={`font-mono text-[10px] ${getDescLengthColor(descEn.length)}`}>
                    {descEn.length} / 160 tecken
                  </span>
                </div>
                <textarea
                  id="klick-seo-desc-en"
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={4}
                  className="w-full bg-stage/35 border border-bone/10 text-bone p-3 rounded-sm text-sm focus:outline-none focus:border-ember resize-none"
                />
              </div>
            </div>
          )}

          {/* Social share image setup */}
          <div className="border border-bone/5 bg-stage/10 p-4 rounded-sm space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-ember font-mono">OpenGraph Delningsbild</h4>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Delningsbild (URL)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://exempel.se/og.jpg"
                  className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 bg-bone/5 hover:bg-bone/10 border border-bone/10 hover:border-bone/20 text-bone hover:text-ember rounded-sm text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
                  title="Välj från mediebibliotek"
                >
                  <ImageIcon size={14} />
                  <span className="sr-only">Välj</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Alt-Text (SEO)</label>
                <input
                  type="text"
                  value={ogImageAlt}
                  onChange={(e) => setOgImageAlt(e.target.value)}
                  placeholder="Alt-text..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Titel (Title Tag)</label>
                <input
                  type="text"
                  value={ogImageTitle}
                  onChange={(e) => setOgImageTitle(e.target.value)}
                  placeholder="Titel..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Bildtext (Caption)</label>
                <input
                  type="text"
                  value={ogImageCaption}
                  onChange={(e) => setOgImageCaption(e.target.value)}
                  placeholder="Bildtext..."
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Sökoptimerat Filnamn</label>
                <input
                  type="text"
                  value={ogImageFilename}
                  onChange={(e) => setOgImageFilename(e.target.value)}
                  placeholder="T.ex: therese-jarvheden-og.webp"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Beskrivning (Description - WordPress-stil)</label>
                <textarea
                  value={ogImageDescription}
                  onChange={(e) => setOgImageDescription(e.target.value)}
                  placeholder="Längre beskrivning för mediabiblioteket/SEO..."
                  rows={2}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
                />
              </div>
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="og-file-upload"
              />
              <label
                htmlFor="og-file-upload"
                id="klick-seo-upload-img"
                className="w-full flex items-center justify-center gap-2 border border-dashed border-bone/20 hover:border-ember/40 bg-stage/20 py-2 rounded-sm text-xs font-mono text-bone/50 hover:text-bone cursor-pointer transition-colors"
              >
                <Upload size={12} />
                Ladda upp ny OpenGraph-bild
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Real-Time Previews (Google & Facebook) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Google Preview Widget */}
          <div className="border border-bone/10 bg-stage/10 p-5 rounded-sm space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest text-bone/45 font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
              <Search size={12} className="text-blue-400" /> Google Sökresultat (Snippet)
            </h4>
            
            <div className="space-y-1 font-sans text-left max-w-lg">
              <span className="text-[11px] text-gray-400 block truncate">
                https://theresejarvheden.se
              </span>
              <span className="text-[18px] text-[#8ab4f8] hover:underline cursor-pointer block leading-tight font-medium truncate">
                {currentTitle || "Saknar titel..."}
              </span>
              <p className="text-[13px] text-[#bdc1c6] leading-relaxed line-clamp-2">
                {currentDesc || "Saknar beskrivning. Skriv en beskrivning till vänster..."}
              </p>
            </div>
          </div>

          {/* Social Media Card Widget */}
          <div className="border border-bone/10 bg-stage/10 p-5 rounded-sm space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest text-bone/45 font-mono flex items-center gap-1.5 border-b border-bone/5 pb-2">
              <Share2 size={12} className="text-purple-400" /> Socialt Delningskort (OpenGraph)
            </h4>

            <div className="border border-bone/10 rounded-md overflow-hidden bg-stage/30 max-w-sm mx-auto">
              <div className="aspect-[1.91/1] bg-stage relative">
                {ogImage ? (
                  <img
                    src={ogImage}
                    alt="Social share preview"
                    className="w-full h-full object-cover grayscale"
                  />
                ) : (
                  <div className="w-full h-full bg-stage/60 flex items-center justify-center text-[10px] font-mono text-bone/30">
                    Ingen bild vald
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-ink/80 px-2 py-0.5 text-[8px] font-mono tracking-widest text-bone rounded-sm">
                  1200 x 630 px
                </div>
              </div>
              <div className="p-4 space-y-1 font-sans text-left border-t border-bone/5 bg-[#121212]">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-mono block">
                  theresejarvheden.se
                </span>
                <span className="text-sm font-semibold text-bone block truncate">
                  {currentTitle}
                </span>
                <p className="text-[11px] text-bone/50 line-clamp-1 leading-normal">
                  {currentDesc}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-bone/10">
        <button
          type="submit"
          id="klick-seo-save"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-ember/90 hover:bg-ember text-ink font-semibold font-mono text-[10px] uppercase tracking-widest rounded-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-ember/15"
        >
          {isSaving ? (
            <span className="w-3.5 h-3.5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={12} />
              Spara inställningar
            </>
          )}
        </button>
      </div>
    </form>
    <MediaPickerModal
      isOpen={isPickerOpen}
      onClose={() => setIsPickerOpen(false)}
      onSelect={(url, metadata) => {
        setOgImage(url);
        if (metadata) {
          if (metadata.alt) setOgImageAlt(metadata.alt);
          if (metadata.title) setOgImageTitle(metadata.title);
          if (metadata.caption) setOgImageCaption(metadata.caption);
          if (metadata.description) setOgImageDescription(metadata.description);
          if (metadata.filename) setOgImageFilename(metadata.filename);
        }
      }}
      typeFilter="image"
    />
    <ImageUploadOptimizer
      isOpen={isOptimizerOpen}
      file={pendingUploadFile}
      defaultSection="seo"
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
