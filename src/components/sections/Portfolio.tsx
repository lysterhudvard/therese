import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { IMG } from "../../routes/index";

export interface PortfolioImage {
  url: string;
  alt?: string;
  allow_download?: boolean;
}

export function Portfolio({ images = [] }: { images?: (string | PortfolioImage)[] }) {
  const { t, lang } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });
  const [maxX, setMaxX] = useState(0);

  // Normalize image data to objects
  const normalizedImages = (images.length > 0 ? images : IMG.portfolio).map((img, idx) => {
    if (typeof img === "string") {
      return {
        url: img,
        alt: `Therese Järvheden portfolio ${idx + 1}`,
        allow_download: true,
      };
    }
    return {
      url: img.url,
      alt: img.alt || `Therese Järvheden portfolio ${idx + 1}`,
      allow_download: img.allow_download !== false,
    };
  });

  useEffect(() => {
    const calc = () => {
      if (!trackRef.current) return;
      setMaxX(trackRef.current.scrollWidth - window.innerWidth);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [normalizedImages.length]);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const exitOpacity = useTransform(exitProgress, [0, 0.8], [1, 0]);
  const exitScale = useTransform(exitProgress, [0, 0.8], [1, 1.05]);

  // Force trigger browser download by fetching as blob to avoid same-origin restrictions
  const triggerDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.warn("Direct download failed, falling back to open in tab:", error);
      window.open(url, "_blank");
    }
  };

  return (
    <section id="portfolio" ref={ref} className="relative h-auto md:h-[320vh]">
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="relative md:sticky top-0 h-auto md:h-[100svh] w-full overflow-hidden bg-ink"
      >
        <div className="absolute inset-x-0 top-0 z-20 flex h-6 items-center gap-3 overflow-hidden px-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="h-3 w-7 shrink-0 rounded-sm bg-stage" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-6 items-center gap-3 overflow-hidden px-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="h-3 w-7 shrink-0 rounded-sm bg-stage" />
          ))}
        </div>

        {/* Dark barrier on the left to fade out images as they approach the text */}
        <div className="absolute left-0 top-0 bottom-0 z-20 w-[42vw] bg-gradient-to-r from-ink via-ink/90 to-transparent pointer-events-none hidden md:block" />

        <div className="absolute left-6 top-1/2 z-30 -translate-y-1/2 md:left-12 hidden md:block">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-1.5">
            {t.portfolio.act}
          </div>
          <div className="font-display text-5xl md:text-6xl text-bone leading-none">
            {t.portfolio.title[0]}
            <br />
            {t.portfolio.title[1]}
          </div>
          <div className="mt-4 text-xs text-bone/70 max-w-[180px]">{t.portfolio.hint}</div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center gap-8 px-[40vw] will-change-transform z-10"
        >
          {normalizedImages.map((img, i) => (
            <div
              key={img.url + i}
              className="relative shrink-0 group overflow-hidden border border-bone/5 hover:border-ember/30 transition-colors duration-500"
              style={{ width: "min(34vw, 460px)", aspectRatio: "3/4" }}
            >
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute left-3 top-3 font-mono text-[10px] text-bone/60 bg-ink/40 backdrop-blur-xs px-2 py-0.5 rounded-sm">
                {String(i + 1).padStart(2, "0")} / {String(normalizedImages.length).padStart(2, "0")}
              </div>
              <div className="absolute bottom-3 left-3 font-mono text-[9px] text-bone/70 tracking-wider">
                THESS · {String(2020 + (i % 4))}
              </div>

              {img.allow_download && (
                <button
                  type="button"
                  onClick={() => triggerDownload(img.url, `therese-jarvheden-press-${i + 1}.jpg`)}
                  className="absolute bottom-3 right-3 p-2 bg-ink/75 hover:bg-ember border border-bone/10 hover:border-ember text-bone hover:text-ink rounded-full transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                  title={lang === "sv" ? "Ladda ner pressbild" : "Download press photo"}
                >
                  <Download size={14} />
                </button>
              )}
            </div>
          ))}
        </motion.div>

        {/* Mobile / Tablet layout - natural height, does not lock page scrolling */}
        <div className="md:hidden relative z-10 flex flex-col py-16">
          <div className="px-6 pb-6">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">
              {t.portfolio.act}
            </div>
            <h3 className="mt-2 font-display text-4xl text-bone leading-none">
              {t.portfolio.title[0]} {t.portfolio.title[1]}
            </h3>
          </div>
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 px-6">
              {normalizedImages.map((img, i) => (
                <div key={img.url + i} className="relative shrink-0 w-[240px] aspect-[3/4] rounded overflow-hidden border border-bone/10">
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute left-2 top-2 font-mono text-[10px] text-bone/70 bg-black/50 px-1.5 py-0.5 rounded-sm">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {img.allow_download && (
                    <button
                      type="button"
                      onClick={() => triggerDownload(img.url, `therese-jarvheden-press-${i + 1}.jpg`)}
                      className="absolute bottom-2 right-2 p-2 bg-black/60 text-bone hover:text-ember rounded-full transition-colors flex items-center justify-center cursor-pointer"
                      title={lang === "sv" ? "Ladda ner pressbild" : "Download press photo"}
                    >
                      <Download size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
