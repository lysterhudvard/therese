import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Upload, Link as LinkIcon, Copy, Trash2, Video, Image as ImageIcon, ExternalLink, Plus, RefreshCw, FileText } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";

interface StorageFile {
  name: string;
  path: string;
  id: string;
  url: string;
  isImage: boolean;
  isVideo: boolean;
  size?: number;
  created_at?: string;
  folder?: string;
  alt?: string;
  title?: string;
  caption?: string;
  description?: string;
  filename?: string;
}

export function DashboardMedia() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalType, setExternalType] = useState<"image" | "video">("image");
  const [externalAlt, setExternalAlt] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Optimizer Modal States
  const [pendingUploadFile, setPendingUploadFile] = useState<File | null>(null);
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);

  // Metadata Edit States
  const [editingMetaPath, setEditingMetaPath] = useState<string | null>(null);
  const [editMetaValues, setEditMetaValues] = useState({
    alt: "",
    title: "",
    caption: "",
    description: "",
    filename: ""
  });

  const fetchFiles = async () => {
    if (!isSupabaseConfigured()) return;
    setIsLoading(true);
    try {
      // Fetch metadata from DB
      const { data: metaRows } = await supabase.from("media_metadata").select("*");
      const metaMap = new Map();
      if (metaRows) {
        metaRows.forEach((row) => {
          metaMap.set(row.file_path, row);
        });
      }

      const folders = ["", "hero", "bio", "portfolio", "showreel", "seo", "credits", "voice", "curtain", "general", "meriter", "röst", "ridåfall", "allmänt"];
      const results = await Promise.all(
        folders.map(async (folder) => {
          const { data, error } = await supabase.storage.from("portfolio").list(folder, {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" },
          });
          if (error) {
            console.warn(`Could not list folder '${folder}':`, error.message);
            return [];
          }
          return (data || []).map((file) => ({ ...file, folder }));
        })
      );

      const allFiles = results.flat();

      if (allFiles) {
        const folderMapping: Record<string, string> = {
          credits: "meriter",
          voice: "röst",
          curtain: "ridåfall",
          general: "allmänt"
        };

        const mapped: StorageFile[] = allFiles
          .filter((file) => file.name !== ".emptyFolderPlaceholder" && file.id !== null && file.metadata)
          .map((file) => {
            const filePath = file.folder ? `${file.folder}/${file.name}` : file.name;
            const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
            const ext = file.name.split(".").pop()?.toLowerCase() || "";
            const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext);
            const isVideo = ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext);

            const normalizedFolder = folderMapping[file.folder || ""] || file.folder || "allmänt";
            const fileMeta = metaMap.get(filePath) || {};

            return {
              name: file.name,
              path: filePath,
              id: file.id || "",
              url: urlData.publicUrl,
              isImage,
              isVideo,
              size: file.metadata?.size,
              created_at: file.created_at || undefined,
              folder: normalizedFolder,
              alt: fileMeta.alt || "",
              title: fileMeta.title || "",
              caption: fileMeta.caption || "",
              description: fileMeta.description || "",
              filename: fileMeta.filename || ""
            };
          });

        mapped.sort((a, b) => {
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return timeB - timeA;
        });

        setFiles(mapped);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte ladda media: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value so same file can be selected again
    e.target.value = "";

    // Intercept images for optimization
    if (file.type.startsWith("image/")) {
      setPendingUploadFile(file);
      setIsOptimizerOpen(true);
      return;
    }

    // Non-images (e.g. videos) go straight to upload
    await proceedWithUpload(file, "allmänt");
  };

  const proceedWithUpload = async (fileToUpload: File, category: string = "allmänt") => {
    setIsOptimizerOpen(false);
    setPendingUploadFile(null);
    setIsUploading(true);
    const toastId = toast.loading(`Laddar upp ${fileToUpload.name}...`);

    try {
      const fileExt = fileToUpload.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const fileFullPath = `${category}/${fileName}`;
      
      const { error } = await supabase.storage.from("portfolio").upload(fileFullPath, fileToUpload, { cacheControl: "31536000", upsert: true });

      if (error) throw error;

      toast.success("Fil uppladdad till Supabase Storage!", { id: toastId });
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Uppladdning misslyckades: ${err.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    const isConfirmed = window.confirm(`Är du säker på att du vill ta bort "${filePath}" permanent från lagringen?`);
    if (!isConfirmed) return;

    const toastId = toast.loading("Tar bort fil...");
    try {
      const { error } = await supabase.storage.from("portfolio").remove([filePath]);
      if (error) throw error;

      toast.success("Filen har tagits bort.", { id: toastId });
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte ta bort fil: ${err.message}`, { id: toastId });
    }
  };

  const handleMoveFile = async (file: StorageFile, newFolder: string) => {
    if (!isSupabaseConfigured()) return;
    
    const newPath = newFolder ? `${newFolder}/${file.name}` : file.name;
    if (file.path === newPath) return;

    const FOLDER_LABELS: Record<string, string> = {
      hero: "Hero",
      bio: "Bio (Moods)",
      portfolio: "Portfolio",
      showreel: "Showreel",
      seo: "SEO",
      meriter: "Meriter",
      röst: "Röst",
      ridåfall: "Ridåfall",
      allmänt: "Allmänt"
    };
    const folderLabel = FOLDER_LABELS[newFolder] || newFolder || "roten";
    const toastId = toast.loading(`Flyttar ${file.name} till ${folderLabel}...`);
    try {
      const { error } = await supabase.storage
        .from("portfolio")
        .move(file.path, newPath);

      if (error) throw error;

      toast.success(`Filen flyttades till ${folderLabel}.`, { id: toastId });
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte flytta fil: ${err.message}`, { id: toastId });
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL kopierad till urklipp!");
  };

  const handleSaveMetadata = async (filePath: string) => {
    try {
      const { error } = await supabase
        .from("media_metadata")
        .upsert({
          file_path: filePath,
          alt: editMetaValues.alt,
          title: editMetaValues.title,
          caption: editMetaValues.caption,
          description: editMetaValues.description,
          filename: editMetaValues.filename,
          updated_at: new Date().toISOString()
        }, { onConflict: "file_path" });

      if (error) throw error;
      toast.success("Metadata sparad för filen!");
      setEditingMetaPath(null);
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara metadata: ${err.message}`);
    }
  };

  const handleAddToPortfolio = async (file: StorageFile) => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase är inte anslutet.");
      return;
    }

    const toastId = toast.loading("Lägger till bild i Portfolio-galleri...");
    try {
      // Get current max sort order
      const { data: currentImages } = await supabase
        .from("portfolio_images")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextOrder = currentImages && currentImages.length > 0 ? currentImages[0].sort_order + 1 : 0;

      const { error } = await supabase.from("portfolio_images").insert({
        url: file.url,
        alt: file.alt || file.name.split(".")[0],
        title: file.title || "",
        caption: file.caption || "",
        description: file.description || "",
        filename: file.filename || file.name,
        allow_download: true,
        sort_order: nextOrder,
      });

      if (error) throw error;
      toast.success("Bild tillagd i Portfolio! Kontrollera 'Akt III: Galleri' för att sortera.", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte lägga till bild: ${err.message}`, { id: toastId });
    }
  };

  const handleAddExternal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl) {
      toast.error("Vänligen ange en URL.");
      return;
    }

    if (externalType === "image") {
      const toastId = toast.loading("Lägger till extern bild...");
      try {
        const { data: currentImages } = await supabase
          .from("portfolio_images")
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1);

        const nextOrder = currentImages && currentImages.length > 0 ? currentImages[0].sort_order + 1 : 0;

        const { error } = await supabase.from("portfolio_images").insert({
          url: externalUrl,
          alt: externalAlt || "Extern galleribild",
          allow_download: true,
          sort_order: nextOrder,
        });

        if (error) throw error;
        toast.success("Extern bild tillagd i Portfolio!", { id: toastId });
        setExternalUrl("");
        setExternalAlt("");
      } catch (err: any) {
        console.error(err);
        toast.error(`Misslyckades: ${err.message}`, { id: toastId });
      }
    } else {
      // Add video to showreels list
      const toastId = toast.loading("Lägger till extern video...");
      try {
        const { data: currentReels } = await supabase
          .from("showreels")
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1);

        const nextOrder = currentReels && currentReels.length > 0 ? currentReels[0].sort_order + 1 : 0;

        const isVimeo = externalUrl.includes("vimeo.com");
        const vimeoId = isVimeo ? externalUrl.split("/").pop()?.split("?")[0] : undefined;

        const { error } = await supabase.from("showreels").insert({
          title_sv: externalAlt || "Ny Video",
          title_en: externalAlt || "New Video",
          sub_sv: "Direktlänk",
          sub_en: "Direct link",
          vimeo_id: vimeoId,
          url: isVimeo ? undefined : externalUrl,
          poster: "",
          genre: "VIDEO",
          specs: "16:9 // HD",
          glow: "rgba(235, 94, 40, 0.15)",
          sort_order: nextOrder,
        });

        if (error) throw error;
        toast.success("Extern video tillagd i Showreels!", { id: toastId });
        setExternalUrl("");
        setExternalAlt("");
      } catch (err: any) {
        console.error(err);
        toast.error(`Misslyckades: ${err.message}`, { id: toastId });
      }
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "—";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="border-b border-bone/10 pb-4 flex justify-between items-end gap-4">
        <div>
          <h2 className="font-display text-2xl text-bone uppercase tracking-wider">
            Mediebibliotek — <span className="italic text-ember">Supabase Storage</span>
          </h2>
          <p className="text-[10px] text-bone/40 mt-1 font-mono uppercase tracking-wider">
            Ladda upp och hantera råa bild- och videofiler direkt i din Supabase cloud storage.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchFiles}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember transition-all rounded text-[10px] font-mono uppercase tracking-widest cursor-pointer disabled:opacity-30"
        >
          <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} />
          Uppdatera
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Supabase Upload */}
          <div className="bg-stage/15 border border-bone/5 p-6 rounded-sm space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
              <Upload size={14} className="text-ember" /> Molnuppladdning
            </h3>
            <p className="text-[10px] text-bone/50 leading-relaxed">
              Välj filer från din lokala hårddisk för att spara dem permanent i Supabase molnlagring. Både bilder och videor stöds.
            </p>

            <div className="relative">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="media-library-upload"
              />
              <label
                htmlFor="media-library-upload"
                id="klick-media-dropzone"
                className={`w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-bone/20 hover:border-ember/40 bg-stage/20 py-8 rounded-sm text-xs font-mono text-bone/50 hover:text-bone cursor-pointer transition-colors ${
                  isUploading ? "pointer-events-none opacity-55" : ""
                }`}
              >
                {isUploading ? (
                  <RefreshCw size={24} className="animate-spin text-ember" />
                ) : (
                  <Upload size={24} className="text-bone/30" />
                )}
                <div className="text-center">
                  <span className="block text-bone font-semibold">Välj en fil</span>
                  <span className="block text-[9px] text-bone/35 mt-0.5">Bilder eller MP4-videor</span>
                </div>
              </label>
            </div>
          </div>

          {/* External URL Form */}
          <form onSubmit={handleAddExternal} className="bg-stage/15 border border-bone/5 p-6 rounded-sm space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
              <LinkIcon size={14} className="text-ember" /> Lägg till extern URL
            </h3>
            <p className="text-[10px] text-bone/50 leading-relaxed">
              Lägg till media från externa länkar direkt till hemsidan (t.ex. bilder från casting-byråer eller videolänkar).
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Medietyp</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExternalType("image")}
                    className={`py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      externalType === "image" ? "border-ember text-ember bg-ember/5" : "border-bone/10 text-bone/50 hover:text-bone"
                    }`}
                  >
                    Bild (Portfolio)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExternalType("video")}
                    className={`py-1 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                      externalType === "video" ? "border-ember text-ember bg-ember/5" : "border-bone/10 text-bone/50 hover:text-bone"
                    }`}
                  >
                    Video (Showreel)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Medie-URL</label>
                <input
                  type="text"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://exempel.com/media.mp4"
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>

              <div>
                <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
                  {externalType === "image" ? "Alt-beskrivning (SEO)" : "Titel (Svenska)"}
                </label>
                <input
                  type="text"
                  value={externalAlt}
                  onChange={(e) => setExternalAlt(e.target.value)}
                  placeholder={externalType === "image" ? "T.ex: Therese svartvitt porträtt" : "T.ex: Beck - Scenklipp"}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 bg-ember text-ink font-semibold font-mono text-[9px] uppercase tracking-widest rounded-sm hover:bg-ember/90 transition-all cursor-pointer"
              >
                <Plus size={11} />
                Skapa Länkpost
              </button>
            </div>
          </form>
        </div>

        {/* Media Grid Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-bone/5 pb-3 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
                Filförteckning ({files.filter(f => selectedFilter === "all" || f.folder === selectedFilter).length} / {files.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Alla" },
                { id: "hero", label: "Hero" },
                { id: "bio", label: "Bio" },
                { id: "portfolio", label: "Portfolio" },
                { id: "showreel", label: "Showreel" },
                { id: "seo", label: "SEO" },
                { id: "meriter", label: "Meriter" },
                { id: "röst", label: "Röst" },
                { id: "ridåfall", label: "Ridåfall" },
                { id: "allmänt", label: "Allmänt" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`px-2 py-1 rounded-sm font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer border ${
                    selectedFilter === tab.id
                      ? "border-ember text-ember bg-ember/5"
                      : "border-bone/5 text-bone/40 hover:text-bone hover:border-bone/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 border border-bone/5 bg-stage/5 rounded-sm gap-4">
              <RefreshCw size={24} className="animate-spin text-ember" />
              <span className="text-xs font-mono text-bone/40 uppercase tracking-widest">Hämtar mediafiler...</span>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-bone/10 bg-stage/5 rounded-sm gap-2">
              <ImageIcon size={28} className="text-bone/20" />
              <span className="text-xs font-mono text-bone/40 uppercase tracking-widest">Inga sparade filer i molnet</span>
              <span className="text-[9px] font-mono text-bone/30 uppercase">Ladda upp en fil till vänster för att starta</span>
            </div>
          ) : files.filter(f => selectedFilter === "all" || f.folder === selectedFilter).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-bone/10 bg-stage/5 rounded-sm text-center">
              <span className="text-xs font-mono text-bone/40 uppercase tracking-widest">Inga filer i denna kategori</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files
                .filter(f => selectedFilter === "all" || f.folder === selectedFilter)
                .map((file, index) => (
                  <div key={file.id} className="border border-bone/10 bg-stage/10 rounded-sm overflow-hidden flex flex-col justify-between">
                    {/* File preview box */}
                    <div className="relative aspect-video bg-stage flex items-center justify-center overflow-hidden border-b border-bone/10 group">
                      {file.folder && (
                        <div className="absolute top-2 left-2 bg-ember text-ink font-mono text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm z-10 shadow-sm">
                          {file.folder.toUpperCase()}
                        </div>
                      )}
                      {file.isImage ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-all duration-300" />
                      ) : file.isVideo ? (
                        <video src={file.url} controls className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-bone/35">
                          <FileText size={32} />
                          <span className="text-[10px] font-mono">{file.name.split(".").pop()?.toUpperCase()} Fil</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-ink/75 px-2 py-0.5 rounded text-[8px] font-mono text-bone/60">
                        {formatSize(file.size)}
                      </div>
                    </div>

                    {/* Details and Operations */}
                    <div className="p-4 space-y-3">
                      <div className="truncate">
                        <span className="block text-[10px] font-mono text-bone/85 truncate" title={file.name}>
                          {file.name}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          id={index === 0 ? "klick-media-copy-0" : undefined}
                          onClick={() => handleCopyUrl(file.url)}
                          className="flex items-center justify-center gap-1.5 py-1.5 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember transition-colors rounded text-[9px] font-mono uppercase tracking-wider cursor-pointer"
                          title="Kopiera länk till urklipp"
                        >
                          <Copy size={10} />
                          Kopiera URL
                        </button>
                        
                        {file.isImage ? (
                          <button
                            type="button"
                            id={index === 0 ? "klick-media-add-portfolio-0" : undefined}
                            onClick={() => handleAddToPortfolio(file)}
                            className="flex items-center justify-center gap-1.5 py-1.5 bg-ember/15 border border-ember/25 text-ember hover:bg-ember hover:text-ink transition-all rounded text-[9px] font-mono uppercase tracking-wider cursor-pointer"
                          >
                            <Plus size={10} />
                            I Portfolio
                          </button>
                        ) : (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-1.5 py-1.5 border border-bone/10 hover:border-bone text-bone/60 hover:text-bone transition-colors rounded text-[9px] font-mono uppercase tracking-wider cursor-pointer"
                          >
                            <ExternalLink size={10} />
                            Öppna fil
                          </a>
                        )}
                      </div>

                      {/* SEO / Metadata Drawer */}
                      <div className="border-t border-bone/5 pt-2 mt-2">
                        {editingMetaPath === file.path ? (
                          <div className="space-y-2 bg-black/20 p-2 rounded-sm border border-bone/5">
                            <span className="block text-[8px] font-mono uppercase tracking-widest text-ember font-bold">Redigera Metadata</span>
                            <div>
                              <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">Alt-text (SEO)</label>
                              <input
                                type="text"
                                value={editMetaValues.alt}
                                onChange={(e) => setEditMetaValues({ ...editMetaValues, alt: e.target.value })}
                                className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                              />
                            </div>
                            <div>
                              <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">Titel (Title Tag)</label>
                              <input
                                type="text"
                                value={editMetaValues.title}
                                onChange={(e) => setEditMetaValues({ ...editMetaValues, title: e.target.value })}
                                className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                              />
                            </div>
                            <div>
                              <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">Bildtext (Caption)</label>
                              <input
                                type="text"
                                value={editMetaValues.caption}
                                onChange={(e) => setEditMetaValues({ ...editMetaValues, caption: e.target.value })}
                                className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                              />
                            </div>
                            <div>
                              <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">Beskrivning (Description)</label>
                              <textarea
                                value={editMetaValues.description}
                                onChange={(e) => setEditMetaValues({ ...editMetaValues, description: e.target.value })}
                                rows={2}
                                className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember resize-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">Sökoptimerat Filnamn</label>
                              <input
                                type="text"
                                value={editMetaValues.filename}
                                onChange={(e) => setEditMetaValues({ ...editMetaValues, filename: e.target.value })}
                                className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                              />
                            </div>
                            <div className="flex gap-2 justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => setEditingMetaPath(null)}
                                className="px-2 py-0.5 border border-bone/10 hover:border-bone text-bone/60 hover:text-bone text-[8px] font-mono uppercase tracking-widest rounded-sm cursor-pointer"
                              >
                                Avbryt
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveMetadata(file.path)}
                                className="px-2 py-0.5 bg-ember text-ink text-[8px] font-mono font-bold uppercase tracking-widest rounded-sm hover:bg-ember/90 cursor-pointer"
                              >
                                Spara
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-bone/40 font-mono max-w-[150px] truncate" title={file.alt}>
                              {file.alt ? `SEO: ${file.alt}` : "Saknar SEO metadata"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMetaPath(file.path);
                                setEditMetaValues({
                                  alt: file.alt || "",
                                  title: file.title || "",
                                  caption: file.caption || "",
                                  description: file.description || "",
                                  filename: file.filename || file.name
                                });
                              }}
                              className="text-[8px] font-mono uppercase tracking-widest text-ember hover:underline cursor-pointer"
                            >
                              Redigera SEO
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 justify-between border-t border-bone/5 pt-2 mt-2">
                        <span className="text-[8px] uppercase tracking-widest text-bone/40 font-mono">
                          Flytta till:
                        </span>
                        <select
                          value={file.folder || ""}
                          onChange={(e) => handleMoveFile(file, e.target.value)}
                          className="bg-stage/35 border border-bone/10 text-bone text-[9px] font-mono rounded px-1.5 py-0.5 focus:outline-none focus:border-ember cursor-pointer"
                        >
                          <option value="">Roten</option>
                          <option value="hero">Hero</option>
                          <option value="bio">Bio (Moods)</option>
                          <option value="portfolio">Portfolio</option>
                          <option value="showreel">Showreel</option>
                          <option value="seo">SEO</option>
                          <option value="meriter">Meriter</option>
                          <option value="röst">Röst</option>
                          <option value="ridåfall">Ridåfall</option>
                          <option value="allmänt">Allmänt</option>
                        </select>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.path)}
                          className="flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-red-400/60 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 size={10} />
                          Ta bort permanent
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <ImageUploadOptimizer
        isOpen={isOptimizerOpen}
        file={pendingUploadFile}
        defaultSection="allmänt"
        onCancel={() => {
          setIsOptimizerOpen(false);
          setPendingUploadFile(null);
        }}
        onUpload={(finalFile, category) => {
          proceedWithUpload(finalFile, category);
        }}
      />
    </div>
  );
}
