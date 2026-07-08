import React from "react";
import { ArrowUp, ArrowDown, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { ShowreelItem } from "./types";

interface ShowreelCardItemProps {
  reel: ShowreelItem;
  index: number;
  showreelsLength: number;
  handleReelChange: (id: string, field: keyof ShowreelItem, value: any) => void;
  moveReel: (index: number, direction: "up" | "down") => void;
  handleDeleteReel: (id: string) => void;
  handlePosterUpload: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingPoster: boolean;
  setActivePickerId: (id: string | null) => void;
}

export function ShowreelCardItem({
  reel,
  index,
  showreelsLength,
  handleReelChange,
  moveReel,
  handleDeleteReel,
  handlePosterUpload,
  isUploadingPoster,
  setActivePickerId,
}: ShowreelCardItemProps) {
  return (
    <div className="border border-bone/10 bg-stage/5 p-6 rounded-sm space-y-4 relative">
      <div className="flex items-center justify-between border-b border-bone/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-ember uppercase">Video #{index + 1}</span>
          <span className="text-[9px] font-mono text-bone/40">{reel.specs || "16:9 // HD"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => moveReel(index, "up")}
            className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
          >
            <ArrowUp size={11} />
          </button>
          <button
            type="button"
            disabled={index === showreelsLength - 1}
            onClick={() => moveReel(index, "down")}
            className="p-1 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
          >
            <ArrowDown size={11} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteReel(reel.id)}
            className="p-1 border border-bone/10 hover:border-red-400 text-bone/40 hover:text-red-400 transition-all rounded cursor-pointer"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Titel (Svenska)</label>
          <input
            type="text"
            id={index === 0 ? "klick-showreels-title-sv" : undefined}
            value={reel.title_sv}
            onChange={(e) => handleReelChange(reel.id, "title_sv", e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Title (English)</label>
          <input
            type="text"
            value={reel.title_en}
            onChange={(e) => handleReelChange(reel.id, "title_en", e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Undertext (Svenska)</label>
          <input
            type="text"
            value={reel.sub_sv}
            onChange={(e) => handleReelChange(reel.id, "sub_sv", e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Subtitle (English)</label>
          <input
            type="text"
            value={reel.sub_en}
            onChange={(e) => handleReelChange(reel.id, "sub_en", e.target.value)}
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>

        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Vimeo Video ID (Rekommenderat)</label>
          <input
            type="text"
            id={index === 0 ? "klick-showreels-vimeo" : undefined}
            value={reel.vimeo_id || ""}
            onChange={(e) => handleReelChange(reel.id, "vimeo_id", e.target.value)}
            placeholder="T.ex: 1042732987"
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Direkt Video-URL (Moln/Backup)</label>
          <input
            type="text"
            value={reel.url || ""}
            onChange={(e) => handleReelChange(reel.id, "url", e.target.value)}
            placeholder="https://uhdzswnawlqpsaajsjpo.supabase.co/storage/v1/..."
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>

        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Genre / Kategori</label>
          <input
            type="text"
            value={reel.genre}
            onChange={(e) => handleReelChange(reel.id, "genre", e.target.value)}
            placeholder="T.ex: FILM / TV-DRAMA"
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Teknisk Spec</label>
          <input
            type="text"
            value={reel.specs}
            onChange={(e) => handleReelChange(reel.id, "specs", e.target.value)}
            placeholder="T.ex: 16:9 // HD"
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>

        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Glöd färg (CSS glow)</label>
          <input
            type="text"
            value={reel.glow}
            onChange={(e) => handleReelChange(reel.id, "glow", e.target.value)}
            placeholder="T.ex: rgba(235, 94, 40, 0.15)"
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>
        <div>
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">YouTube Video ID (Alternativt)</label>
          <input
            type="text"
            value={reel.youtube_id || ""}
            onChange={(e) => handleReelChange(reel.id, "youtube_id", e.target.value)}
            placeholder="T.ex: dQw4w9WgXcQ"
            className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
          />
        </div>

        <div className="md:col-span-2 space-y-4">
          <label className="block text-[8px] uppercase tracking-widest text-bone/45 mb-1 font-mono">Posterbild (URL)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={reel.poster}
              onChange={(e) => handleReelChange(reel.id, "poster", e.target.value)}
              className="flex-1 bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
            <button
              type="button"
              onClick={() => setActivePickerId(reel.id)}
              className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors cursor-pointer"
              title="Välj från mediebibliotek"
            >
              <ImageIcon size={12} />
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePosterUpload(reel.id, e)}
              disabled={isUploadingPoster}
              className="hidden"
              id={`poster-upload-${reel.id}`}
            />
            <label
              htmlFor={`poster-upload-${reel.id}`}
              id={index === 0 ? "klick-showreels-upload-poster" : undefined}
              className="px-3 bg-bone/10 hover:bg-bone/20 text-bone rounded-sm text-xs transition-colors flex items-center justify-center cursor-pointer shrink-0"
            >
              <Upload size={12} />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Alt-Text (SEO)</label>
              <input
                type="text"
                value={reel.poster_alt || ""}
                onChange={(e) => handleReelChange(reel.id, "poster_alt", e.target.value)}
                placeholder="Alt-text för Google..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Titel (Title Tag)</label>
              <input
                type="text"
                value={reel.poster_title || ""}
                onChange={(e) => handleReelChange(reel.id, "poster_title", e.target.value)}
                placeholder="Titel..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Bildtext (Caption)</label>
              <input
                type="text"
                value={reel.poster_caption || ""}
                onChange={(e) => handleReelChange(reel.id, "poster_caption", e.target.value)}
                placeholder="Bildtext..."
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Sökoptimerat Filnamn</label>
              <input
                type="text"
                value={reel.poster_filename || ""}
                onChange={(e) => handleReelChange(reel.id, "poster_filename", e.target.value)}
                placeholder="ex. therese-showreel.webp"
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">Beskrivning (Description - WordPress-stil)</label>
              <textarea
                value={reel.poster_description || ""}
                onChange={(e) => handleReelChange(reel.id, "poster_description", e.target.value)}
                placeholder="Längre beskrivning för mediabiblioteket/SEO..."
                rows={2}
                className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
              />
            </div>
          </div>

          {reel.poster && (
            <img src={reel.poster} alt="Poster preview" className="w-48 aspect-video object-cover rounded mt-2 border border-bone/10" />
          )}
        </div>
      </div>
    </div>
  );
}
