import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useT } from "../../hooks/use-t";
import {
  CREDITS,
  REVIEW_QUOTES_EN,
  REVIEW_QUOTES_SV,
  type Credit,
  type FilterKey,
} from "../../routes/index";

export function ParallaxQuotes() {
  const { lang } = useT();
  const quotes = lang === "sv" ? REVIEW_QUOTES_SV : REVIEW_QUOTES_EN;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const layers = [
    {
      y: useTransform(scrollYProgress, [0, 1], [120, -260]),
      x: useTransform(scrollYProgress, [0, 1], [-40, 40]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [40, -440]),
      x: useTransform(scrollYProgress, [0, 1], [20, -60]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [180, -180]),
      x: useTransform(scrollYProgress, [0, 1], [-10, 30]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [-40, -340]),
      x: useTransform(scrollYProgress, [0, 1], [60, -20]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [220, -120]),
      x: useTransform(scrollYProgress, [0, 1], [-30, 50]),
    },
  ];
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {quotes.map((q, i) => (
        <motion.div
          key={q}
          style={{
            y: layers[i].y,
            x: layers[i].x,
            top: `${10 + i * 18}%`,
            left: `${(i * 17) % 80}%`,
          }}
          className="absolute font-display italic text-bone/[0.06] whitespace-nowrap"
        >
          <span style={{ fontSize: `clamp(3rem, ${5 + i}vw, ${7 + i}rem)` }}>"{q}"</span>
        </motion.div>
      ))}
    </div>
  );
}

export function Credits({
  activeCommentaryUrl,
  onPlayCommentary,
}: {
  activeCommentaryUrl?: string;
  onPlayCommentary?: (c: { title: string; role: string; url: string; text: string } | null) => void;
}) {
  const { lang, t } = useT();
  const [filter, setFilter] = useState<FilterKey>("Alla");
  const [hoveredCredit, setHoveredCredit] = useState<Credit | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAllCredits, setShowAllCredits] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rows = useMemo(
    () => (filter === "Alla" ? CREDITS : CREDITS.filter((c) => c.type === filter)),
    [filter],
  );

  const visibleRows = useMemo(() => {
    if (showAllCredits) return rows;
    const limit = isMobile ? 5 : 10;
    return rows.slice(0, limit);
  }, [rows, showAllCredits, isMobile]);
  const filters: FilterKey[] = ["Alla", "Film", "TV", "Theater", "Voice"];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.95], [1, 1.05]);

  return (
    <section id="credits" ref={ref} className="relative px-6 py-28 md:px-12 md:py-40">
      <motion.div style={{ opacity, scale }} className="w-full h-full">
        <ParallaxQuotes />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.5em] text-ember">
                {t.credits.act}
              </div>
              <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.95]">
                {t.credits.heading[0]}
                <span className="italic">{t.credits.heading[1]}</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-1 border-t border-bone/10 pt-4">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  data-hover
                  className={`px-4 py-2 text-[11px] uppercase tracking-[0.3em] transition-colors ${
                    filter === f ? "text-ember" : "text-bone/50 hover:text-bone"
                  }`}
                >
                  {t.credits.filters[f]}
                  <span className="ml-2 font-mono text-[9px] text-bone/30">
                    {f === "Alla" ? CREDITS.length : CREDITS.filter((c) => c.type === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-14 border-t border-bone/20">
            <AnimatePresence initial={false}>
              {visibleRows.map((c, i) => (
                <motion.li
                  key={c.title}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className="group relative border-b border-bone/20 transition-colors duration-300 hover:border-bone/45"
                >
                  <a
                    href={c.url ?? "#credits"}
                    target={c.url ? "_blank" : undefined}
                    rel={c.url ? "noreferrer" : undefined}
                    onClick={(e) => {
                      if (!c.url) e.preventDefault();
                    }}
                    onMouseEnter={() => setHoveredCredit(c)}
                    onMouseLeave={() => setHoveredCredit(null)}
                    onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                    data-hover
                    className="grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-bone/[0.06] duration-300"
                  >
                    <div className="col-span-2 md:col-span-1 font-mono text-xs text-ember/70 group-hover:text-ember transition-colors duration-300">
                      {c.year}
                    </div>
                    <div className="col-span-7 md:col-span-5">
                      <div className="font-display text-2xl md:text-3xl text-bone transition-all flex flex-wrap items-center gap-3">
                        <span>{c.title}</span>
                        {c.commentary && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const comm = c.commentary;
                              if (!comm) return;
                              if (onPlayCommentary) {
                                if (activeCommentaryUrl === comm.url) {
                                  onPlayCommentary(null);
                                } else {
                                  onPlayCommentary({
                                    title: c.title,
                                    role: c.role[lang],
                                    url: comm.url,
                                    text: lang === "sv" ? comm.svText : comm.enText,
                                  });
                                }
                              }
                            }}
                            data-hover
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all duration-300 font-mono text-[9px] uppercase tracking-wider ${
                              activeCommentaryUrl === c.commentary.url
                                ? "bg-ember border-ember text-ink font-semibold"
                                : "border-bone/20 text-bone/60 hover:text-ember hover:border-ember/40 bg-bone/[0.03]"
                            }`}
                          >
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              {activeCommentaryUrl === c.commentary.url ? (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                              ) : null}
                              <span
                                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                  activeCommentaryUrl === c.commentary.url ? "bg-ink" : "bg-ember"
                                }`}
                              ></span>
                            </span>
                            <span>
                              {activeCommentaryUrl === c.commentary.url
                                ? lang === "sv"
                                  ? "Spelar"
                                  : "Playing"
                                : lang === "sv"
                                  ? "Kommentar"
                                  : "Commentary"}
                            </span>
                          </button>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-bone/50 group-hover:text-bone/80 transition-colors duration-300">
                        {c.role[lang]}
                      </div>
                    </div>
                    <div className="hidden md:block md:col-span-2 text-[11px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-bone/85 transition-colors duration-300">
                      {c.category[lang]}
                    </div>
                    <div className="hidden md:block md:col-span-3 text-[11px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-bone/85 transition-colors duration-300">
                      {c.network}
                    </div>
                    <div className="col-span-3 md:col-span-1 flex justify-end">
                      <ArrowUpRight
                        size={18}
                        className="text-bone/30 transition-all group-hover:text-ember group-hover:rotate-45"
                      />
                    </div>
                    <div className="col-span-12 text-xs text-bone/40 md:hidden group-hover:text-bone/70 transition-colors duration-300">
                      {c.network} · {c.category[lang]}
                    </div>
                  </a>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {rows.length > (isMobile ? 5 : 10) && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAllCredits(!showAllCredits)}
                data-hover
                className="px-6 py-3 border border-bone/10 hover:border-ember text-bone hover:text-ember font-mono text-[10px] uppercase tracking-widest transition-all duration-300 rounded-sm bg-stage/10 cursor-pointer pointer-events-auto"
              >
                {showAllCredits
                  ? (lang === "sv" ? "Visa färre meriter" : "Show Less Credits")
                  : (lang === "sv" ? "Visa fler meriter" : "Show More Credits")}
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {hoveredCredit && hoveredCredit.img && hoveredCredit.script && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="pointer-events-none fixed z-[100] w-64 overflow-hidden rounded-lg border border-bone/20 bg-ink shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden md:block"
              style={{
                left: mousePos.x + 20,
                top: mousePos.y + 20,
              }}
            >
              <div className="relative aspect-[3/4] w-full bg-stage">
                <img
                  src={hoveredCredit.img}
                  alt={hoveredCredit.title}
                  className="h-full w-full object-cover opacity-35 filter grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none" />

                <div className="absolute inset-0 p-4 flex flex-col justify-between font-mono text-[10px] text-bone/90 select-none">
                  <div>
                    <div className="border-b border-bone/10 pb-1 mb-2 text-ember text-[8px] uppercase tracking-wider">
                      {lang === "sv" ? "Manussida" : "Script Excerpt"}
                    </div>
                    <div className="text-[9px] font-bold text-bone/50 mb-3 truncate">
                      {hoveredCredit.script.scene}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-ember font-bold mb-1.5">
                      {hoveredCredit.script.dialogue.char}
                    </div>
                    <p className="leading-relaxed bg-ember/15 border-l-2 border-ember pl-2 py-1 text-[10px] text-bone italic">
                      "{hoveredCredit.script.dialogue.line[lang]}"
                    </p>
                  </div>
                  <div className="text-[8.5px] text-bone/35 text-right uppercase tracking-widest">
                    Process · {hoveredCredit.title}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
