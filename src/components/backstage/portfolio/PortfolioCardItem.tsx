import React from "react";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { GalleryImage } from "./types";

interface PortfolioCardItemProps {
  img: GalleryImage;
  index: number;
  images: GalleryImage[];
  setImages: (images: GalleryImage[]) => void;
  handleAltChange: (id: string, newAlt: string) => void;
  handleDownloadToggle: (id: string) => void;
  handleDeleteImage: (id: string) => void;
  moveImage: (index: number, direction: "up" | "down") => void;
  setActivePickingImageId: (id: string | null) => void;
  setIsMediaPickerOpen: (open: boolean) => void;
}

export function PortfolioCardItem({
  img,
  index,
  images,
  setImages,
  handleAltChange,
  handleDownloadToggle,
  handleDeleteImage,
  moveImage,
  setActivePickingImageId,
  setIsMediaPickerOpen,
}: PortfolioCardItemProps) {
  return (
    <div className="flex flex-col border border-bone/10 bg-stage/10 p-4 rounded-sm gap-4">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Small thumbnail preview with edit trigger */}
        <div className="relative w-20 aspect-[3/4] rounded bg-stage border border-bone/10 overflow-hidden shrink-0 group mx-auto md:mx-0">
          <img
            src={img.url}
            alt={img.alt}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          />
          <button
            type="button"
            onClick={() => {
              setActivePickingImageId(img.id);
              setIsMediaPickerOpen(true);
            }}
            className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-ember transition-opacity duration-300 cursor-pointer"
            title="Byt bild från mediebibliotek"
          >
            <Upload size={12} />
          </button>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Bild-URL
            </label>
            <input
              type="text"
              value={img.url}
              onChange={(e) =>
                setImages(images.map((x) => (x.id === img.id ? { ...x, url: e.target.value } : x)))
              }
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
            />
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Alt-Text (SEO - Sökoptimering)
            </label>
            <input
              type="text"
              value={img.alt}
              onChange={(e) => handleAltChange(img.id, e.target.value)}
              placeholder="Beskriv bilden för Google..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Titel (Title tag)
            </label>
            <input
              type="text"
              value={img.title || ""}
              onChange={(e) =>
                setImages(images.map((x) => (x.id === img.id ? { ...x, title: e.target.value } : x)))
              }
              placeholder="Titel..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Bildtext (Caption)
            </label>
            <input
              type="text"
              value={img.caption || ""}
              onChange={(e) =>
                setImages(images.map((x) => (x.id === img.id ? { ...x, caption: e.target.value } : x)))
              }
              placeholder="Kort bildtext..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Beskrivning (Description - Längre bakgrund/anteckningar)
            </label>
            <textarea
              value={img.description || ""}
              onChange={(e) =>
                setImages(
                  images.map((x) => (x.id === img.id ? { ...x, description: e.target.value } : x))
                )
              }
              placeholder="Längre beskrivning, anteckningar, licens eller historia om bilden..."
              rows={2}
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1.5 rounded-sm text-xs focus:outline-none focus:border-ember resize-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Filnamn (SEO filnamn, t.ex. therese-jarvheden-drama.webp)
            </label>
            <input
              type="text"
              value={img.filename || ""}
              onChange={(e) =>
                setImages(images.map((x) => (x.id === img.id ? { ...x, filename: e.target.value } : x)))
              }
              placeholder="Sökordsoptimerat filnamn..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember font-mono"
            />
          </div>
        </div>
      </div>

      {/* Sorting and controls */}
      <div className="flex items-center justify-between border-t border-bone/5 pt-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={img.allow_download}
            onChange={() => handleDownloadToggle(img.id)}
            className="rounded border-bone/20 text-ember focus:ring-0 focus:ring-offset-0 bg-transparent w-3.5 h-3.5"
          />
          <span className="text-[10px] uppercase tracking-widest text-bone/60 font-mono">
            Nedladdning tillåten
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
  );
}
