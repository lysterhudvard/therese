import React from "react";
import { Copy, Trash2, ExternalLink, Plus, FileText } from "lucide-react";
import { StorageFile, folderLabels } from "./types";

interface MediaCardItemProps {
  file: StorageFile;
  index: number;
  formatSize: (bytes?: number) => string;
  handleCopyUrl: (url: string) => void;
  handleAddToPortfolio: (file: StorageFile) => void;
  editingMetaPath: string | null;
  setEditingMetaPath: (path: string | null) => void;
  editMetaValues: {
    alt: string;
    title: string;
    caption: string;
    description: string;
    filename: string;
  };
  setEditMetaValues: React.Dispatch<
    React.SetStateAction<{
      alt: string;
      title: string;
      caption: string;
      description: string;
      filename: string;
    }>
  >;
  handleSaveMetadata: (filePath: string) => void;
  handleMoveFile: (file: StorageFile, newFolder: string) => void;
  handleDeleteFile: (filePath: string) => void;
}

export function MediaCardItem({
  file,
  index,
  formatSize,
  handleCopyUrl,
  handleAddToPortfolio,
  editingMetaPath,
  setEditingMetaPath,
  editMetaValues,
  setEditMetaValues,
  handleSaveMetadata,
  handleMoveFile,
  handleDeleteFile,
}: MediaCardItemProps) {
  return (
    <div className="border border-bone/10 bg-stage/10 rounded-sm overflow-hidden flex flex-col justify-between">
      {/* File preview box */}
      <div className="relative aspect-video bg-stage flex items-center justify-center overflow-hidden border-b border-bone/10 group">
        {file.folder && (
          <div className="absolute top-2 left-2 bg-ember text-ink font-mono text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm z-10 shadow-sm">
            {(folderLabels[file.folder] || file.folder).toUpperCase()}
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
              <span className="block text-[8px] font-mono uppercase tracking-widest text-ember font-bold">
                Redigera Metadata
              </span>
              <div>
                <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">
                  Alt-text (SEO)
                </label>
                <input
                  type="text"
                  value={editMetaValues.alt}
                  onChange={(e) => setEditMetaValues({ ...editMetaValues, alt: e.target.value })}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">
                  Titel (Title Tag)
                </label>
                <input
                  type="text"
                  value={editMetaValues.title}
                  onChange={(e) => setEditMetaValues({ ...editMetaValues, title: e.target.value })}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">
                  Bildtext (Caption)
                </label>
                <input
                  type="text"
                  value={editMetaValues.caption}
                  onChange={(e) => setEditMetaValues({ ...editMetaValues, caption: e.target.value })}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember"
                />
              </div>
              <div>
                <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">
                  Beskrivning (Description)
                </label>
                <textarea
                  value={editMetaValues.description}
                  onChange={(e) => setEditMetaValues({ ...editMetaValues, description: e.target.value })}
                  rows={2}
                  className="w-full bg-stage/35 border border-bone/10 text-bone px-1.5 py-0.5 rounded-sm text-[9px] focus:outline-none focus:border-ember resize-none"
                />
              </div>
              <div>
                <label className="block text-[7px] uppercase tracking-widest text-bone/45 font-mono mb-0.5">
                  Sökoptimerat Filnamn
                </label>
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
                    filename: file.filename || file.name,
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
          <span className="text-[8px] uppercase tracking-widest text-bone/40 font-mono font-bold">
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
            <option value="posters">Showreel (Posters)</option>
            <option value="seo">SEO</option>
            <option value="credits">Meriter</option>
            <option value="voice">Röst</option>
            <option value="curtain">Ridåfall</option>
            <option value="general">Allmänt</option>
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
  );
}
