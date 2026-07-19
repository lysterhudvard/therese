import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { Download as DownloadOrig, ArrowRight as ArrowRightOrig } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const Download = DownloadOrig as any;
const ArrowRight = ArrowRightOrig as any;
const MotionDiv = motion.div as any;

export interface PortfolioImage {
  url: string;
  alt?: string;
  title?: string;
  caption?: string;
  filename?: string;
  allow_download?: boolean;
  download_url?: string;
}

export function Portfolio({ images = [], teaser = false }: { images?: (string | PortfolioImage)[], teaser?: boolean }) {
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
  let normalizedImages = images.map((img, idx) => {
    if (typeof img === "string") {
      return {
        url: img,
        download_url: img,
        alt: `Therese Järvheden portfolio ${idx + 1}`,
        title: "",
        caption: "",
        filename: "",
        allow_download: true,
      };
    }
    return {
      url: img.url,
      download_url: img.download_url || img.url,
      alt: img.alt || `Therese Järvheden portfolio ${idx + 1}`,
      title: img.title || "",
      caption: img.caption || "",
      filename: img.filename || "",
      allow_download: img.allow_download !== false,
    };
  });

  if (teaser) {
    normalizedImages = normalizedImages.slice(0, 4);
  }

  const [liveImages, setLiveImages] = useState<PortfolioImage[]>(normalizedImages);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    let active = true;
    const fetchPortfolioImages = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_images")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (data && Array.isArray(data) && active) {
          let fetched = data.map((img: any, idx: number) => ({
            url: img.url,
            download_url: img.download_url || img.url,
            alt: img.alt || `Therese Järvheden portfolio ${idx + 1}`,
            title: img.title || "",
            caption: img.caption || "",
            filename: img.filename || "",
            allow_download: img.allow_download !== false,
          }));

          if (teaser) {
            fetched = fetched.slice(0, 4);
          }
          setLiveImages(fetched);
        }
      } catch (e) {
        console.error("Failed to fetch portfolio images client-side:", e);
      }
    };

    fetchPortfolioImages();
    return () => { active = false; };
  }, [teaser]);

  useEffect(() => {
    const calc = () => {
      // Use setTimeout to ensure DOM is fully repainted before measuring width
      setTimeout(() => {
        if (!trackRef.current) return;
        const vw = window.innerWidth;
        // Track starts at 42vw from left. We want to scroll so the right edge 
        // is fully visible with a 10vw padding on the right.
        // Total scrollable width = scrollWidth - (window.innerWidth - 42vw) + 10vw padding
        const visibleWidth = vw * 0.58; 
        const paddingRight = vw * 0.10;
        const maxScroll = trackRef.current.scrollWidth - visibleWidth + paddingRight;
        setMaxX(Math.max(0, maxScroll));
      }, 100);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [liveImages.length]);

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
    <section 
      id="portfolio" 
      ref={ref} 
      className={`relative ${liveImages.length > 0 ? "h-auto lg:h-[320vh]" : "h-auto lg:h-[100svh]"}`}
    >
      <MotionDiv
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="relative lg:sticky top-0 h-auto lg:h-[100svh] w-full overflow-hidden bg-ink"
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
        {liveImages.length > 0 && (
          <div className="absolute left-0 top-0 bottom-0 z-20 w-[42vw] bg-gradient-to-r from-ink via-ink/90 to-transparent pointer-events-none hidden lg:block" />
        )}

        <div className="absolute left-6 top-1/2 z-30 -translate-y-1/2 lg:left-12 hidden lg:block">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-1.5">
            {t.portfolio.act}
          </div>
          <div className="font-display text-5xl md:text-6xl text-bone leading-none">
            {t.portfolio.title[0]}
            <br />
            {t.portfolio.title[1]}
          </div>
          {liveImages.length > 0 && (
            <div className="mt-4 text-xs text-bone/70 max-w-[180px]">{t.portfolio.hint}</div>
          )}
        </div>

        {/* Desktop Image Track / Placeholder */}
        {liveImages.length === 0 ? (
          <div className="hidden lg:flex items-center justify-center w-full h-full font-mono text-[10px] uppercase tracking-[0.3em] text-bone/45 animate-pulse-slow">
            <span className="mr-3">//</span> {lang === "sv" ? "Bilder kommer snart" : "Images coming soon"}
          </div>
        ) : (
          <MotionDiv
            ref={trackRef}
            style={{ x }}
            className="hidden lg:flex absolute left-[42vw] top-1/2 h-[55vh] min-h-[400px] -translate-y-1/2 items-center gap-6"
          >
            {liveImages.map((img, i) => (
              <div
                key={img.url + i}
                className="relative shrink-0 group overflow-hidden border border-bone/5 hover:border-ember/30 transition-colors duration-500"
                style={{ width: "min(34vw, 460px, 54svh)", aspectRatio: "3/4" }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  title={img.title || undefined}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute left-3 top-3 font-mono text-[10px] text-bone/60 bg-ink/40 backdrop-blur-xs px-2 py-0.5 rounded-sm">
                  {String(i + 1).padStart(2, "0")} / {String(liveImages.length).padStart(2, "0")}
                </div>
                <div className="absolute bottom-3 left-3 font-mono text-[9px] text-bone/70 tracking-wider">
                  THESS · {String(2020 + (i % 4))}
                </div>

                {img.allow_download && (
                  <button
                    type="button"
                    onClick={() => triggerDownload(img.download_url || img.url, img.filename || `therese-jarvheden-press-${i + 1}.jpg`)}
                    className="absolute bottom-3 right-3 p-2 bg-ink/75 hover:bg-ember border border-bone/10 hover:border-ember text-bone hover:text-ink rounded-full transition-all duration-300 shadow-md flex items-center justify-center cursor-pointer scale-90 group-hover:scale-100 opacity-0 group-hover:opacity-100"
                    title={lang === "sv" ? "Ladda ner pressbild" : "Download press photo"}
                  >
                    <Download size={14} />
                  </button>
                )}
              </div>
            ))}

            {teaser && (
              <div className="flex items-center justify-center shrink-0 ml-12">
                <a href="/press" className="inline-flex items-center gap-3 border border-bone/20 bg-stage hover:border-ember px-8 py-5 font-mono text-[11px] tracking-[0.25em] uppercase text-bone hover:text-ember transition-all rounded-sm cursor-pointer shadow-sm">
                  {lang === "sv" ? "Fler pressbilder" : "More press photos"}
                  <ArrowRight size={16} />
                </a>
              </div>
            )}
          </MotionDiv>
        )}
        {/* Mobile / Tablet layout - natural height, does not lock page scrolling */}
        <div className="lg:hidden relative z-10 flex flex-col py-20 md:py-24">
          <div className="px-6 pb-6">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">

              {t.portfolio.act}
            </div>
            <h3 className="mt-2 font-display text-4xl text-bone leading-none">
              {t.portfolio.title[0]} {t.portfolio.title[1]}
            </h3>
          </div>
          
          {liveImages.length === 0 ? (
            <div className="px-6 py-6 font-mono text-[9px] uppercase tracking-[0.3em] text-bone/45 animate-pulse-slow flex items-center gap-2">
              <span>//</span>
              <span>{lang === "sv" ? "Bilder kommer snart" : "Images coming soon"}</span>
            </div>
          ) : (
            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-4 px-6">
                {liveImages.map((img, i) => (
                  <div key={img.url + i} className="relative shrink-0 w-[240px] aspect-[3/4] rounded overflow-hidden border border-bone/10">
                    <img
                      src={img.url}
                      alt={img.alt}
                      title={img.title || undefined}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-2 top-2 font-mono text-[10px] text-bone/70 bg-black/50 px-1.5 py-0.5 rounded-sm">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {img.allow_download && (
                      <button
                        type="button"
                        onClick={() => triggerDownload(img.download_url || img.url, img.filename || `therese-jarvheden-press-${i + 1}.jpg`)}
                        className="absolute bottom-2 right-2 p-2 bg-black/60 text-bone hover:text-ember rounded-full transition-colors flex items-center justify-center cursor-pointer"
                        title={lang === "sv" ? "Ladda ner pressbild" : "Download press photo"}
                      >
                        <Download size={12} />
                      </button>
                    )}
                  </div>
                ))}
                
                {teaser && (
                  <div className="shrink-0 w-[240px] h-[320px] flex items-center justify-center border border-bone/10 bg-stage/50 rounded">
                    <a href="/press" className="flex flex-col items-center gap-4 text-bone/70 hover:text-ember transition-colors font-mono uppercase tracking-[0.2em] text-[10px] p-6 text-center">
                      <div className="w-12 h-12 rounded-full border border-bone/20 flex items-center justify-center">
                        <ArrowRight size={18} />
                      </div>
                      {lang === "sv" ? "Se hela arkivet" : "View full archive"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </MotionDiv>
    </section>
  );
}
