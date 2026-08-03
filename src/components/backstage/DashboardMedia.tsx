import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImageIcon, RefreshCw } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { extractFilePathFromUrl, parseCropAndDesc, serializeCropAndDesc } from "../../lib/utils";
import { ImageUploadOptimizer } from "./ImageUploadOptimizer";
import { StorageFile } from "./media/types";
import { MediaUploadColumn } from "./media/MediaUploadColumn";
import { MediaCardItem } from "./media/MediaCardItem";

export function DashboardMedia() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalType, setExternalType] = useState<"image" | "video">("image");
  const [externalAlt, setExternalAlt] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(20);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  useEffect(() => {
    setDisplayCount(20);
  }, [selectedFilter]);

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

      const folders = ["", "hero", "bio", "portfolio", "showreel", "posters", "seo", "credits", "voice", "curtain", "general"];
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
        const mapped: StorageFile[] = allFiles
          .filter((file) => file.name !== ".emptyFolderPlaceholder" && file.id !== null && file.metadata)
          .map((file) => {
            const filePath = file.folder ? `${file.folder}/${file.name}` : file.name;
            const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filePath);
            const ext = file.name.split(".").pop()?.toLowerCase() || "";
            const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext);
            const isVideo = ["mp4", "webm", "ogg", "mov", "m4v"].includes(ext);

            const finalFolder = file.folder === "posters" ? "showreel" : (file.folder || "");
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
              folder: finalFolder,
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

  const uploadSingleFileDirectly = async (fileToUpload: File, category: string, isOriginalFallback: boolean = false) => {
    const toastId = toast.loading(`Laddar upp ${fileToUpload.name}...`);
    try {
      const fileExt = fileToUpload.name.split(".").pop();
      const baseName = fileToUpload.name.substring(0, fileToUpload.name.lastIndexOf(".")).replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      const suffix = isOriginalFallback ? "-original" : "";
      const fileName = `${baseName}-${Math.random().toString(36).substring(2, 6)}${suffix}.${fileExt}`;
      const fileFullPath = `${category}/${fileName}`;
      
      const { error } = await supabase.storage.from("portfolio").upload(fileFullPath, fileToUpload, { cacheControl: "public, max-age=31536000", upsert: true });

      if (error) throw error;
      toast.success(`${fileToUpload.name} uppladdad!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(`Uppladdning misslyckades för ${fileToUpload.name}: ${err.message}`, { id: toastId });
      throw err;
    }
  };

  const handleFileUpload = async (e: any) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) as File[] : [];
    if (selectedFiles.length === 0) return;

    (e.target as any).value = "";

    if (selectedFiles.length === 1 && selectedFiles[0].type.startsWith("image/")) {
      setPendingUploadFile(selectedFiles[0]);
      setIsOptimizerOpen(true);
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    try {
      for (const file of selectedFiles) {
        const isAudio = file.type.startsWith("audio/") || 
          ["mp3", "wav", "ogg", "aac", "m4a", "flac"].includes(file.name.split(".").pop()?.toLowerCase() || "");
        
        const category = isAudio ? "voice" : "general";
        
        await uploadSingleFileDirectly(file, category);
        successCount++;
      }
      if (selectedFiles.length > 1) {
        toast.success(`${successCount} av ${selectedFiles.length} filer har laddats upp!`);
      }
      fetchFiles();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const proceedWithUpload = async (fileToUpload: File, category: string = "general", uploadOriginal: boolean = false) => {
    const originalFile = pendingUploadFile;
    setIsOptimizerOpen(false);
    setPendingUploadFile(null);
    setIsUploading(true);
    try {
      // 1. Upload optimized image
      await uploadSingleFileDirectly(fileToUpload, category);
      
      // 2. Upload original if requested
      if (uploadOriginal && originalFile) {
        await uploadSingleFileDirectly(originalFile, category, true);
      }

      fetchFiles();
    } catch (err: any) {
      console.error(err);
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
      setSelectedFiles(prev => prev.filter(p => p !== filePath));
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte ta bort fil: ${err.message}`, { id: toastId });
    }
  };

  const toggleFileSelection = (filePath: string) => {
    setSelectedFiles(prev => 
      prev.includes(filePath) 
        ? prev.filter(p => p !== filePath)
        : [...prev, filePath]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    const isConfirmed = window.confirm(`Är du säker på att du vill ta bort ${selectedFiles.length} filer permanent?`);
    if (!isConfirmed) return;

    const toastId = toast.loading(`Tar bort ${selectedFiles.length} filer...`);
    try {
      const { error } = await supabase.storage.from("portfolio").remove(selectedFiles);
      if (error) throw error;

      toast.success(`${selectedFiles.length} filer har tagits bort.`, { id: toastId });
      setSelectedFiles([]);
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte ta bort filer: ${err.message}`, { id: toastId });
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

      // Sync metadata to matching portfolio_images table entries
      const { data: pImages } = await supabase.from("portfolio_images").select("*");
      if (pImages && pImages.length > 0) {
        const matching = pImages.filter((p) => {
          const path1 = extractFilePathFromUrl(p.url);
          const path2 = extractFilePathFromUrl(p.download_url);
          return path1 === filePath || path2 === filePath;
        });

        if (matching.length > 0) {
          const toUpdate = matching.map((p) => {
            const { crop } = parseCropAndDesc(p.description);
            return {
              ...p,
              alt: editMetaValues.alt,
              title: editMetaValues.title,
              caption: editMetaValues.caption,
              description: serializeCropAndDesc(crop, editMetaValues.description),
              filename: editMetaValues.filename,
            };
          });
          await supabase.from("portfolio_images").upsert(toUpdate);
        }
      }

      // Sync metadata to matching showreels table entries
      const { data: pReels } = await supabase.from("showreels").select("*");
      if (pReels && pReels.length > 0) {
        const matchingReels = pReels.filter((r) => {
          const path1 = extractFilePathFromUrl(r.poster);
          return path1 === filePath;
        });

        if (matchingReels.length > 0) {
          const reelsToUpdate = matchingReels.map((r) => ({
            ...r,
            poster_alt: editMetaValues.alt,
            poster_title: editMetaValues.title,
            poster_caption: editMetaValues.caption,
            poster_description: editMetaValues.description,
            poster_filename: editMetaValues.filename,
          }));
          await supabase.from("showreels").upsert(reelsToUpdate);
        }
      }

      toast.success("Metadata sparad för filen!");
      alert("Filinformationen har sparats framgångsrikt!");
      setEditingMetaPath(null);
      fetchFiles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Kunde inte spara metadata: ${err.message}`);
      alert(`Misslyckades med att spara filinformation: ${err.message}`);
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

  const handleAddExternal = async (e: any) => {
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
        <MediaUploadColumn
          handleFileUpload={handleFileUpload}
          isUploading={isUploading}
          handleAddExternal={handleAddExternal}
          externalType={externalType}
          setExternalType={setExternalType}
          externalUrl={externalUrl}
          setExternalUrl={setExternalUrl}
          externalAlt={externalAlt}
          setExternalAlt={setExternalAlt}
        />

        {/* Media Grid Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-bone/5 pb-3 space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-xs uppercase tracking-widest text-bone font-mono flex items-center gap-1.5">
                Filförteckning ({files.filter(f => selectedFilter === "all" || f.folder === selectedFilter).length} / {files.length})
              </h3>
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-ember">{selectedFiles.length} markerade</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles([])}
                    className="px-2 py-1 text-[9px] border border-bone/10 hover:border-bone/30 text-bone/60 hover:text-bone rounded uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Avmarkera
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="px-2 py-1 text-[9px] bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-ink border border-red-500/30 rounded uppercase tracking-wider transition-colors cursor-pointer font-bold"
                  >
                    Ta bort valda
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "Alla" },
                { id: "hero", label: "Hero" },
                { id: "bio", label: "Bio" },
                { id: "portfolio", label: "Portfolio" },
                { id: "showreel", label: "Showreel" },
                { id: "seo", label: "SEO" },
                { id: "credits", label: "Meriter" },
                { id: "voice", label: "Röst" },
                { id: "curtain", label: "Ridåfall" },
                { id: "general", label: "Allmänt" },
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files
                  .filter(f => selectedFilter === "all" || f.folder === selectedFilter)
                  .slice(0, displayCount)
                  .map((file, index) => (
                    <MediaCardItem
                      key={file.id}
                      file={file}
                      index={index}
                      formatSize={formatSize}
                      handleCopyUrl={handleCopyUrl}
                      handleAddToPortfolio={handleAddToPortfolio}
                      editingMetaPath={editingMetaPath}
                      setEditingMetaPath={setEditingMetaPath}
                      editMetaValues={editMetaValues}
                      setEditMetaValues={setEditMetaValues}
                      handleSaveMetadata={handleSaveMetadata}
                      handleMoveFile={handleMoveFile}
                      handleDeleteFile={handleDeleteFile}
                      isSelected={selectedFiles.includes(file.path)}
                      onToggleSelect={toggleFileSelection}
                    />
                  ))}
              </div>

              {files.filter(f => selectedFilter === "all" || f.folder === selectedFilter).length > displayCount && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setDisplayCount(prev => prev + 20)}
                    className="px-4 py-2 border border-bone/10 hover:border-ember text-bone hover:text-ember transition-colors rounded font-mono text-[10px] uppercase tracking-widest cursor-pointer"
                  >
                    Visa fler (+20)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ImageUploadOptimizer
        isOpen={isOptimizerOpen}
        file={pendingUploadFile}
        defaultSection="general"
        onCancel={() => {
          setIsOptimizerOpen(false);
          setPendingUploadFile(null);
        }}
        onUpload={(finalFile, category, uploadOriginal) => {
          proceedWithUpload(finalFile, category, uploadOriginal);
        }}
      />
    </div>
  );
}
