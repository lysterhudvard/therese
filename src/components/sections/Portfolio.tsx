import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { IMG } from "../../routes/index";

export function Portfolio({ images = IMG.portfolio }: { images?: string[] }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ["end end", "end start"],
  });
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!trackRef.current) return;
      setMaxX(trackRef.current.scrollWidth - window.innerWidth);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const exitOpacity = useTransform(exitProgress, [0, 0.8], [1, 0]);
  const exitScale = useTransform(exitProgress, [0, 0.8], [1, 1.05]);

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
          <div className="mt-4 text-xs text-bone/40 max-w-[180px]">{t.portfolio.hint}</div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center gap-8 px-[40vw] will-change-transform z-10"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative shrink-0"
              style={{ width: "min(34vw, 460px)", aspectRatio: "3/4" }}
            >
              <img
                src={src}
                alt={`Portfolio ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-2 top-2 font-mono text-[10px] text-bone/70">
                {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-bone/70">
                THESS · {String(2020 + (i % 4))}
              </div>
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
              {images.map((src, i) => (
                <div key={src} className="relative shrink-0 w-[240px] aspect-[3/4]">
                  <img
                    src={src}
                    alt={`Portfolio ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover rounded shadow-lg"
                  />
                  <div className="absolute left-2 top-2 font-mono text-[10px] text-bone/70 bg-black/40 px-1.5 py-0.5 rounded">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
