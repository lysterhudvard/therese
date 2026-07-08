import React from "react";
import { Upload, Link as LinkIcon, Plus, RefreshCw } from "lucide-react";

interface MediaUploadColumnProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  handleAddExternal: (e: React.FormEvent) => void;
  externalType: "image" | "video";
  setExternalType: (type: "image" | "video") => void;
  externalUrl: string;
  setExternalUrl: (url: string) => void;
  externalAlt: string;
  setExternalAlt: (alt: string) => void;
}

export function MediaUploadColumn({
  handleFileUpload,
  isUploading,
  handleAddExternal,
  externalType,
  setExternalType,
  externalUrl,
  setExternalUrl,
  externalAlt,
  setExternalAlt,
}: MediaUploadColumnProps) {
  return (
    <div className="space-y-6">
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
  );
}
