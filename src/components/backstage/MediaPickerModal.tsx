import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, Video, Music, FileText } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface StorageFile {
  name: string;
  url: string;
  type: "image" | "video" | "audio" | "other";
  folder?: string;
  filePath: string;
  metadata?: {
    alt?: string;
    title?: string;
    caption?: string;
    description?: string;
    filename?: string;
  };
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (
    url: string,
    metadata?: {
      alt?: string;
      title?: string;
      caption?: string;
      description?: string;
      filename?: string;
    }
  ) => void;
  typeFilter?: "image" | "video" | "audio" | "all";
}

const folderLabels: Record<string, string> = {
  hero: "Hero",
  bio: "Bio",
  portfolio: "Portfolio",
  showreel: "Showreel",
  posters: "Showreel",
  seo: "SEO",
  credits: "Meriter",
  voice: "Röst",
  curtain: "Ridåfall",
  general: "Allmänt"
};

export function MediaPickerModal({ isOpen, onClose, onSelect, typeFilter = "all" }: MediaPickerModalProps) {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen]);

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
            let type: StorageFile["type"] = "other";
            if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext)) type = "image";
            else if (["mp4", "webm", "ogg", "mov", "m4v"].includes(ext)) type = "video";
            else if (["mp3", "wav", "aac", "m4a", "flac"].includes(ext)) type = "audio";

            const finalFolder = file.folder === "posters" ? "showreel" : (file.folder || "");
            const fileMeta = metaMap.get(filePath) || {};

            return {
              name: file.name,
              url: urlData.publicUrl,
              type,
              folder: finalFolder,
              filePath,
              metadata: {
                alt: fileMeta.alt || "",
                title: fileMeta.title || "",
                caption: fileMeta.caption || "",
                description: fileMeta.description || "",
                filename: fileMeta.filename || ""
              }
            };
          });
        setFiles(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredFiles = files.filter(
    (f) =>
      (typeFilter === "all" || f.type === typeFilter) &&
      (selectedFilter === "all" || f.folder === selectedFilter)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
      <div className="bg-stage border border-bone/10 w-full max-w-4xl max-h-[85vh] flex flex-col rounded-md shadow-2xl relative">
        <div className="flex justify-between items-center p-4 border-b border-bone/5">
          <h2 className="text-sm font-mono uppercase tracking-widest text-bone">Välj från Mediebibliotek</h2>
          <button onClick={onClose} className="p-1 text-bone/50 hover:text-bone hover:bg-bone/5 rounded-sm transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1 px-6 py-2 bg-ink/20 border-b border-bone/5">
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
              className={`px-2 py-0.5 rounded-sm font-mono text-[9px] uppercase tracking-wider transition-colors cursor-pointer border ${
                selectedFilter === tab.id
                  ? "border-ember text-ember bg-ember/5"
                  : "border-bone/5 text-bone/40 hover:text-bone hover:border-bone/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className="w-5 h-5 border-2 border-ember border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-bone/40 font-mono text-xs uppercase tracking-wider">
              Inga {typeFilter !== "all" ? typeFilter : "media"}filer hittades i den här kategorin.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <button
                  key={file.name}
                  onClick={() => {
                    onSelect(file.url, file.metadata);
                    onClose();
                  }}
                  className="group relative flex flex-col text-left border border-bone/5 bg-ink/30 rounded-sm overflow-hidden hover:border-ember transition-all"
                >
                  <div className="aspect-square bg-bone/5 flex items-center justify-center relative overflow-hidden">
                    {file.folder && (
                      <div className="absolute top-1.5 left-1.5 bg-ember text-ink font-mono text-[6px] font-bold uppercase tracking-wider px-1 py-0.5 rounded-sm z-10 shadow-sm">
                        {(folderLabels[file.folder] || file.folder).toUpperCase()}
                      </div>
                    )}
                    {file.type === "image" ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : file.type === "video" ? (
                      <div className="w-full h-full bg-ink/50 flex flex-col items-center justify-center text-bone/40 group-hover:text-ember transition-colors">
                        <Video size={24} className="mb-2" />
                        <span className="text-[9px] uppercase tracking-wider">Video</span>
                      </div>
                    ) : file.type === "audio" ? (
                      <div className="w-full h-full bg-ink/50 flex flex-col items-center justify-center text-bone/40 group-hover:text-ember transition-colors">
                        <Music size={24} className="mb-2" />
                        <span className="text-[9px] uppercase tracking-wider">Ljud</span>
                      </div>
                    ) : (
                      <FileText size={24} className="text-bone/40" />
                    )}
                  </div>
                  <div className="p-2 border-t border-bone/5">
                    <p className="text-[9px] font-mono text-bone/60 truncate" title={file.name}>
                      {file.name}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-ember/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
