import React, { useState, useEffect } from "react";
import { X, Sparkles, Check, AlertTriangle, Info, ArrowRight, FileImage } from "lucide-react";

interface ImageUploadOptimizerProps {
  isOpen: boolean;
  file: File | null;
  defaultSection?: "hero" | "bio" | "portfolio" | "showreel" | "seo" | "credits" | "voice" | "curtain" | "general";
  onCancel: () => void;
  onUpload: (finalFile: File, category: string) => void;
}

interface ImageProfile {
  name: string;
  maxWidth: number;
  maxHeight: number;
  targetKb: number;
  description: string;
  seoGuideline: string;
}

const SECTION_PROFILES: Record<string, ImageProfile> = {
  hero: {
    name: "Akt I: Hero (Stor Bakgrundsbild)",
    maxWidth: 2000,
    maxHeight: 1125,
    targetKb: 250,
    description: "Visas i sajtens allra översta del. Kräver liggande format (16:9 eller 21:9).",
    seoGuideline: "Kritisk för LCP (Largest Contentful Paint). Bilder över 250 KB sänker sajtens initiala laddningshastighet hos Google.",
  },
  bio: {
    name: "Akt II: Biografi (Moods)",
    maxWidth: 800,
    maxHeight: 1000,
    targetKb: 100,
    description: "Porträttbilder för de olika stämningslägena (Dramatisk, Komisk, Klassisk). Kräver stående format (3:4 eller 4:5).",
    seoGuideline: "Skärmläsare och AI sökmotorer läser av dessa bilder. Säkerställ att du lägger till en tydlig Alt-text som beskriver Thereses uttryck.",
  },
  portfolio: {
    name: "Akt III: Galleri / Portfolio",
    maxWidth: 1000,
    maxHeight: 1000,
    targetKb: 120,
    description: "Visas i det horisontella rullningsgalleriet på startsidan.",
    seoGuideline: "Ett tungt galleri sänker hela sidans prestanda. Genom att komprimera till WebP laddar besökarens webbläsare in galleribilderna direkt vid scroll.",
  },
  showreel: {
    name: "Akt IV: Showreels (Poster)",
    maxWidth: 1600,
    maxHeight: 900,
    targetKb: 150,
    description: "Visas som en fast omslagsbild vidoespelaren innan besökaren klickar på play.",
    seoGuideline: "Fungerar som det visuella ankaret för dina showreels. Skall ge ett snabbt, skarpt och komprimerat intryck.",
  },
  seo: {
    name: "SEO: Social Delningsbild (OG Image)",
    maxWidth: 1200,
    maxHeight: 630, // 1.91:1 ratio
    targetKb: 200,
    description: "Bilden som visas i förhandsvisningen när länken delas på Facebook, LinkedIn, i SMS eller Slack.",
    seoGuideline: "Måste ha exakt 1.91:1 i bildförhållande (t.ex. 1200x630px) för att inte beskäras fult av sociala medier. Använd PNG eller högkvalitativ JPG.",
  },
  credits: {
    name: "Akt V: Meriter (Meritbilder)",
    maxWidth: 1000,
    maxHeight: 1000,
    targetKb: 100,
    description: "Bilder som visas för dina olika meriter/roller.",
    seoGuideline: "Håll filstorlekar under kontroll för att spara bandbredd vid rullning av meritlistan.",
  },
  voice: {
    name: "Akt VI: Röst (Bakgrundsbild)",
    maxWidth: 1200,
    maxHeight: 900,
    targetKb: 150,
    description: "Bakgrundsbild för röstsektionen.",
    seoGuideline: "Komprimering säkerställer snabb inläsning när besökaren scrollar ner till röstaktören.",
  },
  curtain: {
    name: "Akt VII: Ridåfall (Stängningsbild)",
    maxWidth: 1200,
    maxHeight: 900,
    targetKb: 150,
    description: "Slutbild som visas i slutet av webbplatsen.",
    seoGuideline: "Skapar ett mjukt avslut på sidan utan onödig laddningstid.",
  },
  general: {
    name: "Generell / Annan Bild",
    maxWidth: 1600,
    maxHeight: 1600,
    targetKb: 150,
    description: "Standardprofil för övriga bilder.",
    seoGuideline: "Håller bildstorlekar under kontroll för att bibehålla en stabil och responsiv sajtupplevelse.",
  },
};

export function ImageUploadOptimizer({
  isOpen,
  file,
  defaultSection = "general",
  onCancel,
  onUpload,
}: ImageUploadOptimizerProps) {
  const [selectedSection, setSelectedSection] = useState<string>(defaultSection);
  const [originalDetails, setOriginalDetails] = useState<{ width: number; height: number; size: number } | null>(null);
  const [optimizedBlob, setOptimizedBlob] = useState<Blob | null>(null);
  const [optimizedDetails, setOptimizedDetails] = useState<{ width: number; height: number; size: number } | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (file) {
      // Load original image details
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          setOriginalDetails({
            width: img.width,
            height: img.height,
            size: file.size,
          });
        };
        img.onerror = () => {
          setErrorMsg("Kunde inte läsa bilden. Kontrollera filen.");
        };
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  useEffect(() => {
    if (file && originalDetails) {
      generateOptimizedImage();
    }
  }, [file, selectedSection, originalDetails]);

  const generateOptimizedImage = async () => {
    if (!file || !originalDetails) return;
    setIsCompiling(true);
    setErrorMsg("");

    const profile = SECTION_PROFILES[selectedSection] || SECTION_PROFILES.general;

    try {
      const result = await new Promise<{ blob: Blob; width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          img.src = e.target?.result as string;
          img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Constrain sizes
            if (width > profile.maxWidth || height > profile.maxHeight) {
              const ratio = Math.min(profile.maxWidth / width, profile.maxHeight / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Kunde inte skapa rityta för komprimering"));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Export to WebP (use standard jpeg as fallback for rare cases)
            const outputFormat = selectedSection === "seo" ? "image/jpeg" : "image/webp";
            
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve({ blob, width, height });
                } else {
                  reject(new Error("Kunde inte komprimera bild-blob"));
                }
              },
              outputFormat,
              0.82 // 82% quality yields optimal size/quality ratio
            );
          };
          img.onerror = () => reject(new Error("Bilden är trasig eller kan inte ritas"));
        };
        reader.onerror = () => reject(new Error("Kunde inte läsa filen"));
      });

      setOptimizedBlob(result.blob);
      setOptimizedDetails({
        width: result.width,
        height: result.height,
        size: result.blob.size,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Ett fel uppstod vid komprimeringen.");
    } finally {
      setIsCompiling(false);
    }
  };

  if (!isOpen || !file) return null;

  const currentProfile = SECTION_PROFILES[selectedSection] || SECTION_PROFILES.general;

  const handleUploadOptimized = () => {
    if (!optimizedBlob) return;
    
    // Create new optimized file name
    const originalName = file.name;
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
    const extension = selectedSection === "seo" ? "jpg" : "webp";
    const mimeType = selectedSection === "seo" ? "image/jpeg" : "image/webp";
    const optimizedFileName = `${nameWithoutExt}-optimized.${extension}`;

    const optimizedFile = new File([optimizedBlob], optimizedFileName, { type: mimeType });
    onUpload(optimizedFile, selectedSection);
  };

  const handleUploadOriginal = () => {
    onUpload(file, selectedSection);
  };

  const formatKb = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + " KB";
  };

  const calculateReduction = () => {
    if (!originalDetails || !optimizedDetails) return 0;
    const diff = originalDetails.size - optimizedDetails.size;
    return Math.max(0, Math.round((diff / originalDetails.size) * 100));
  };

  const isOversized = (size: number, limit: number) => {
    return size > limit * 1024;
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-ink/90 backdrop-blur-sm">
      <div className="bg-stage border border-bone/10 w-full max-w-2xl flex flex-col rounded-md shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-bone/5 bg-stage/50">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-ember animate-pulse" />
            <h2 className="text-sm font-mono uppercase tracking-widest text-bone">
              Medieoptimering & SEO-koll
            </h2>
          </div>
          <button onClick={onCancel} className="p-1 text-bone/50 hover:text-bone hover:bg-bone/5 rounded-sm transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* File summary */}
          <div className="flex items-center gap-3 bg-ink/30 border border-bone/5 p-3 rounded-sm">
            <FileImage size={24} className="text-bone/45" />
            <div className="truncate text-left">
              <span className="block text-[11px] font-mono text-bone truncate">{file.name}</span>
              <span className="block text-[9px] text-bone/40 uppercase tracking-widest mt-0.5">
                Vald fil • {formatKb(file.size)}
              </span>
            </div>
          </div>

          {/* Section Profile Selector */}
          <div className="space-y-2 text-left">
            <label className="block text-[9px] uppercase tracking-widest text-bone/45 font-mono">
              Var ska bilden användas?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(SECTION_PROFILES).map(([key, profile]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSection(key)}
                  className={`px-3 py-2 text-left border rounded-sm transition-all cursor-pointer ${
                    selectedSection === key
                      ? "border-ember bg-ember/5 text-ember"
                      : "border-bone/5 bg-ink/20 text-bone/60 hover:border-bone/20 hover:text-bone"
                  }`}
                >
                  <span className="block text-[10px] font-bold font-mono tracking-wider truncate">
                    {key.toUpperCase()}
                  </span>
                  <span className="block text-[8px] text-bone/40 truncate mt-0.5">
                    Max {profile.maxWidth}px
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target rules information */}
          {currentProfile && (
            <div className="bg-stage/40 border border-bone/5 p-4 rounded-sm space-y-2 text-left text-xs text-bone/70">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-ember mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-bone">{currentProfile.name}</p>
                  <p className="text-[10px] text-bone/50 mt-0.5 leading-relaxed">{currentProfile.description}</p>
                </div>
              </div>
              <div className="border-t border-bone/5 pt-2 mt-2">
                <p className="text-[9px] font-mono uppercase tracking-widest text-ember/80">Sökmotoroptimering (SEO):</p>
                <p className="text-[10px] text-bone/60 mt-1 leading-relaxed">{currentProfile.seoGuideline}</p>
              </div>
            </div>
          )}

          {/* Compare columns */}
          {originalDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original image details */}
              <div className="border border-bone/5 bg-ink/10 p-4 rounded-sm space-y-3 text-left">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-bone/40">
                  Original
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-bone/50">Upplösning:</span>
                    <span className="font-mono text-bone">{originalDetails.width} × {originalDetails.height} px</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-bone/50">Filstorlek:</span>
                    <span className={`font-mono font-bold ${isOversized(originalDetails.size, currentProfile.targetKb) ? "text-red-400" : "text-bone"}`}>
                      {formatKb(originalDetails.size)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-bone/50">Filtyp:</span>
                    <span className="font-mono uppercase text-bone">{file.type.split("/")[1] || "bild"}</span>
                  </div>
                </div>

                {isOversized(originalDetails.size, currentProfile.targetKb) && (
                  <div className="flex items-start gap-1.5 text-[9px] text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded-sm mt-2">
                    <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                    <span>Filen är större än rekommenderade {currentProfile.targetKb} KB och kommer att slöa ner webbplatsen.</span>
                  </div>
                )}
              </div>

              {/* Optimized image details */}
              <div className="border border-ember/20 bg-ember/5 p-4 rounded-sm space-y-3 text-left relative">
                {isCompiling && (
                  <div className="absolute inset-0 bg-stage/80 flex items-center justify-center backdrop-blur-xs">
                    <span className="w-5 h-5 border-2 border-ember border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                <span className="block text-[9px] font-mono uppercase tracking-widest text-ember">
                  Optimerad preview
                </span>

                {errorMsg ? (
                  <div className="text-xs text-red-400 py-4">{errorMsg}</div>
                ) : optimizedDetails ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-bone/50">Ny upplösning:</span>
                      <span className="font-mono text-bone">{optimizedDetails.width} × {optimizedDetails.height} px</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-bone/50">Ny filstorlek:</span>
                      <span className="font-mono text-ember font-bold">{formatKb(optimizedDetails.size)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-bone/50">Ny filtyp:</span>
                      <span className="font-mono text-bone uppercase">
                        {selectedSection === "seo" ? "JPEG" : "WebP"}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs pt-1 border-t border-bone/5 mt-2">
                      <span className="text-ember font-semibold flex items-center gap-1">
                        Storleksminskning:
                      </span>
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <ArrowRight size={10} /> {calculateReduction()}% mindre!
                      </span>
                    </div>

                    {calculateReduction() > 0 && (
                      <div className="flex items-start gap-1.5 text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-sm mt-2">
                        <Check size={12} className="flex-shrink-0 mt-0.5" />
                        <span>Komprimerad till det moderna {selectedSection === "seo" ? "JPEG" : "WebP"} formatet, laddar snabbt på Google!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-bone/40 py-4">Kalkylerar...</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-bone/5 bg-stage/80 flex justify-between items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-bone/10 hover:border-bone/20 text-bone/60 hover:text-bone text-xs font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
          >
            Avbryt
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUploadOriginal}
              className="px-3 py-2 border border-bone/10 hover:border-red-400/40 text-bone/40 hover:text-red-400 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              title="Ladda upp den tunga originalbilden utan optimering"
            >
              Ladda upp Original
            </button>
            <button
              type="button"
              disabled={isCompiling || !!errorMsg || !optimizedBlob}
              onClick={handleUploadOptimized}
              className="px-5 py-2 bg-ember text-ink font-bold font-mono text-[10px] uppercase tracking-widest rounded-sm hover:bg-ember/90 transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-ember/15"
            >
              Ladda upp Optimerad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
