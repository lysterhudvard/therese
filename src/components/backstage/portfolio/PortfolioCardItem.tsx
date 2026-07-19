import React, { useRef, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { GalleryImage } from "./types";

const ArrowUpIcon = ArrowUp as any;
const ArrowDownIcon = ArrowDown as any;
const Trash2Icon = Trash2 as any;
const UploadIcon = Upload as any;

// Helper to parse crop prefix and original description text
const parseCropAndDesc = (descriptionStr: string | undefined | null) => {
  if (!descriptionStr) return { crop: "50% 50%", desc: "" };
  if (descriptionStr.startsWith("crop:")) {
    const parts = descriptionStr.split(";desc:");
    const crop = parts[0].replace("crop:", "");
    const desc = parts[1] || "";
    return { crop, desc };
  }
  return { crop: "50% 50%", desc: descriptionStr };
};

// Helper to serialize crop and original description text back to the database field
const serializeCropAndDesc = (crop: string, desc: string) => {
  return `crop:${crop};desc:${desc}`;
};

// Helper to translate various crop configurations (center, top, bottom, X% Y%) to numerical percentages
const parseXY = (cropStr: string) => {
  if (cropStr === "center") return [50, 50];
  if (cropStr === "top") return [50, 0];
  if (cropStr === "bottom") return [50, 100];
  if (cropStr === "left") return [0, 50];
  if (cropStr === "right") return [100, 50];
  
  const parts = cropStr.split(" ");
  if (parts.length === 2) {
    const x = parseInt(parts[0]);
    const y = parseInt(parts[1]);
    return [isNaN(x) ? 50 : x, isNaN(y) ? 50 : y];
  }
  return [50, 50];
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, cropX: 50, cropY: 50 });

  const { crop, desc } = parseCropAndDesc(img.description);
  const [cropX, cropY] = parseXY(crop);

  const updateCrop = (newX: number, newY: number) => {
    const serialized = serializeCropAndDesc(`${newX}% ${newY}%`, desc);
    setImages(
      images.map((x) => (x.id === img.id ? { ...x, description: serialized } : x))
    );
  };

  const handleDescChange = (newDesc: string) => {
    const serialized = serializeCropAndDesc(`${cropX}% ${cropY}%`, newDesc);
    setImages(
      images.map((x) => (x.id === img.id ? { ...x, description: serialized } : x))
    );
  };

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      cropX,
      cropY,
    };
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging || !containerRef.current) return;
    const container = containerRef.current;
    
    const deltaX = e.clientX - dragStart.current.mouseX;
    const deltaY = e.clientY - dragStart.current.mouseY;
    
    // We adjust the crop offset based on drag direction
    const pctDeltaX = (deltaX / container.clientWidth) * 100;
    const pctDeltaY = (deltaY / container.clientHeight) * 100;
    
    const nextX = Math.max(0, Math.min(100, Math.round(dragStart.current.cropX - pctDeltaX)));
    const nextY = Math.max(0, Math.min(100, Math.round(dragStart.current.cropY - pctDeltaY)));
    
    updateCrop(nextX, nextY);
  };

  const handleTouchStart = (e: any) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    dragStart.current = {
      mouseX: e.touches[0].clientX,
      mouseY: e.touches[0].clientY,
      cropX,
      cropY,
    };
  };

  const handleTouchMove = (e: any) => {
    if (!isDragging || !containerRef.current || e.touches.length !== 1) return;
    const container = containerRef.current;
    
    const deltaX = e.touches[0].clientX - dragStart.current.mouseX;
    const deltaY = e.touches[0].clientY - dragStart.current.mouseY;
    
    const pctDeltaX = (deltaX / container.clientWidth) * 100;
    const pctDeltaY = (deltaY / container.clientHeight) * 100;
    
    const nextX = Math.max(0, Math.min(100, Math.round(dragStart.current.cropX - pctDeltaX)));
    const nextY = Math.max(0, Math.min(100, Math.round(dragStart.current.cropY - pctDeltaY)));
    
    updateCrop(nextX, nextY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetCrop = () => {
    updateCrop(50, 50);
  };

  return (
    <div className="flex flex-col border border-bone/10 bg-stage/10 p-4 rounded-sm gap-4">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Interactive drag-to-crop preview */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <span className="text-[8px] font-mono text-ember uppercase tracking-wider md:hidden">PORTFÖLJBILD #{index + 1}</span>
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative w-32 aspect-[3/4] rounded bg-stage border border-bone/10 overflow-hidden shrink-0 group mx-auto md:mx-0 cursor-grab active:cursor-grabbing select-none"
            title="Dra bilden för att beskära utsnittet"
          >
            <img
              src={img.url}
              alt={img.alt}
              draggable={false}
              className="w-full h-full object-cover pointer-events-none select-none"
              style={{ objectPosition: `${cropX}% ${cropY}%` }}
            />
            {/* Grid overlay for cropping guidelines */}
            <div className="absolute inset-0 border border-ember/10 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <div className="border-r border-b border-bone/10"></div>
              <div className="border-r border-b border-bone/10"></div>
              <div className="border-b border-bone/10"></div>
              <div className="border-r border-b border-bone/10"></div>
              <div className="border-r border-b border-bone/10"></div>
              <div className="border-b border-bone/10"></div>
              <div className="border-r border-bone/10"></div>
              <div className="border-r border-bone/10"></div>
              <div></div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActivePickingImageId(img.id);
                setIsMediaPickerOpen(true);
              }}
              className="absolute top-1.5 right-1.5 p-1.5 bg-ink/80 hover:bg-ember border border-bone/10 hover:border-ember text-bone hover:text-ink rounded transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer z-10 opacity-70 hover:opacity-100"
              title="Byt bild från mediebibliotek"
            >
              <UploadIcon size={12} />
            </button>
            
            <div className="absolute bottom-1 right-1 bg-ink/80 px-1 py-0.5 rounded font-mono text-[7px] text-bone/60 pointer-events-none">
              {cropX}% {cropY}%
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetCrop}
            className="text-[8px] font-mono text-bone/45 hover:text-ember uppercase tracking-wider transition-colors cursor-pointer"
          >
            Centrera bild
          </button>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 pt-1">
          <div className="sm:col-span-2 hidden md:block mb-1">
            <span className="text-[8px] font-mono text-ember uppercase tracking-wider">PORTFÖLJBILD #{index + 1}</span>
          </div>
          <div>
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Bild-URL (Komprimerad visningsbild)
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
              Nedladdnings-URL (Högupplöst original)
            </label>
            <input
              type="text"
              value={img.download_url || img.url}
              onChange={(e) =>
                setImages(images.map((x) => (x.id === img.id ? { ...x, download_url: e.target.value } : x)))
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
              Film / Projekt (t.ex. Från: Karatefylla)
            </label>
            <input
              type="text"
              value={img.caption || ""}
              onChange={(e) =>
                setImages(images.map((x) => (x.id === img.id ? { ...x, caption: e.target.value } : x)))
              }
              placeholder="t.ex. Från: Karatefylla..."
              className="w-full bg-stage/35 border border-bone/10 text-bone px-3 py-1 rounded-sm text-xs focus:outline-none focus:border-ember"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[8px] uppercase tracking-widest text-bone/45 font-mono mb-1">
              Beskrivning (Description - Längre bakgrund/anteckningar)
            </label>
            <textarea
              value={desc}
              onChange={(e) => handleDescChange(e.target.value)}
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
            <ArrowUpIcon size={12} />
          </button>
          <button
            type="button"
            disabled={index === images.length - 1}
            onClick={() => moveImage(index, "down")}
            className="p-1.5 border border-bone/10 hover:border-ember text-bone/60 hover:text-ember disabled:opacity-20 transition-all rounded cursor-pointer"
          >
            <ArrowDownIcon size={12} />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteImage(img.id)}
            className="p-1.5 border border-bone/10 hover:border-red-400 text-bone/40 hover:text-red-400 transition-all rounded cursor-pointer"
          >
            <Trash2Icon size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
