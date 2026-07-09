import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { type Credit, type FilterKey } from "../../types";

export function ParallaxQuotes({ quotes }: { quotes: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  
  // Moderate vertical parallax to keep motion smooth and within separate zones
  const layers = [
    {
      y: useTransform(scrollYProgress, [0, 1], [80, -100]),
      x: useTransform(scrollYProgress, [0, 1], [-15, 15]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [30, -120]),
      x: useTransform(scrollYProgress, [0, 1], [10, -20]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [100, -80]),
      x: useTransform(scrollYProgress, [0, 1], [-10, 10]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [-10, -110]),
      x: useTransform(scrollYProgress, [0, 1], [20, -10]),
    },
    {
      y: useTransform(scrollYProgress, [0, 1], [120, -60]),
      x: useTransform(scrollYProgress, [0, 1], [-20, 20]),
    },
  ];

  // Specific layouts for each of the 5 quotes to prevent overlap and offscreen overflow
  const quoteLayouts = [
    {
      isLeft: false,
      top: 6,
      position: { right: "4%" },
      fontSize: "clamp(1.8rem, 4vw, 4.5rem)",
      maxWidth: "max-w-[70vw]"
    },
    {
      isLeft: true,
      top: 25,
      position: { left: "6%" },
      fontSize: "clamp(1.8rem, 3.8vw, 4.2rem)",
      maxWidth: "max-w-[70vw]"
    },
    {
      isLeft: false,
      top: 45,
      position: { right: "20%" }, // moved more to the left (pushed inward)
      fontSize: "clamp(2.1rem, 4.8vw, 5.2rem)",
      maxWidth: "max-w-[70vw]"
    },
    {
      isLeft: true,
      top: 65,
      position: { left: "8%" },
      fontSize: "clamp(1.7rem, 3.5vw, 4rem)",
      maxWidth: "max-w-[70vw]"
    },
    {
      isLeft: false,
      top: 82,
      position: { right: "24%" }, // moved more to the left (pushed inward)
      fontSize: "clamp(2.3rem, 5.4vw, 5.8rem)",
      maxWidth: "max-w-[70vw]"
    }
  ];

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {quotes.slice(0, 5).map((q, i) => {
        const layout = quoteLayouts[i] || quoteLayouts[0];
        
        return (
          <motion.div
            key={q}
            style={{
              y: layers[i].y,
              x: layers[i].x,
              top: `${layout.top}%`,
              ...layout.position,
            }}
            className={`absolute font-display italic ${layout.maxWidth} leading-[1.15] ${
              layout.isLeft ? "text-left" : "text-right"
            }`}
          >
            <svg className="w-full overflow-visible" style={{ height: "1.3em", fontSize: layout.fontSize }}>
              <text
                x={layout.isLeft ? "0" : "100%"}
                y="0.9em"
                textAnchor={layout.isLeft ? "start" : "end"}
                className="fill-bone/[0.05] font-display italic"
                style={{ fontSize: "1em" }}
              >
                "{q}"
              </text>
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}

export function Credits({
  credits = [],
  reviewQuotes,
  activeCommentaryUrl,
  onPlayCommentary,
}: {
  credits?: Credit[];
  reviewQuotes?: string[];
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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const defaultQuotes = useMemo(() => lang === "sv" ? [
      "en närvaro som river ner väggar",
      "en av fyra kvinnor vi får följa",
      "skånsk röst — varm, rå, omedelbar",
      "drama som hon känner extra starkt för",
      "närvarande, sårbar, exakt",
  ] : [
      "a presence that tears down walls",
      "one of four women we follow",
      "Scanian voice — warm, raw, immediate",
      "drama she feels especially strongly about",
      "present, vulnerable, precise",
  ], [lang]);
  const activeQuotes = reviewQuotes || defaultQuotes;

  const rows = useMemo(
    () => (filter === "Alla" ? credits : credits.filter((c) => c.type === filter)),
    [filter, credits],
  );

  const visibleRows = useMemo(() => {
    if (showAllCredits) return rows;
    const limit = isMobile ? 5 : 10;
    return rows.slice(0, limit);
  }, [rows, showAllCredits, isMobile]);
  const filters: FilterKey[] = ["Alla", "Film", "TV", "Theater", "Voice"];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.98], [1, 0]);

  const exitScale = useTransform(scrollYProgress, [0.75, 0.98], [1, 1.02]);
  return (
    <section id="credits" ref={ref} className="relative px-6 py-16 md:px-12 md:py-36">
      <motion.div style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <ParallaxQuotes quotes={activeQuotes} />


        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.5em] text-ember">
                {t.credits.act}
              </div>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-7xl text-bone leading-[0.95]">
                {t.credits.heading[0]}
                <span className="italic">{t.credits.heading[1]}</span>
              </h2>
            </div>
            <div className="flex overflow-x-auto no-scrollbar whitespace-nowrap gap-1 border-t border-bone/10 pt-4 max-w-full">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  data-hover
                  className={`flex-shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.3em] transition-colors ${
                    filter === f ? "text-ember" : "text-bone/50 hover:text-bone"
                  }`}
                >
                  {t.credits.filters[f]}
                  <span className="ml-2 font-mono text-[9px] text-bone/30">
                    {f === "Alla" ? credits.length : credits.filter((c) => c.type === f).length}
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
                  <div
                    onMouseEnter={() => setHoveredCredit(c)}
                    onMouseLeave={() => setHoveredCredit(null)}
                    onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                    className="grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-bone/[0.06] duration-300"
                  >
                    <div className="col-span-2 lg:col-span-1 font-mono text-xs text-ember/80 group-hover:text-ember transition-colors duration-300">
                      {c.year}
                    </div>
                    <div className="col-span-7 lg:col-span-5">
                      <div className="font-display text-xl sm:text-2xl lg:text-3xl text-bone transition-all flex flex-wrap items-center gap-3">
                        {c.url ? (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            data-hover
                            className="hover:text-ember transition-colors duration-300"
                          >
                            {c.title}
                          </a>
                        ) : (
                          <span>{c.title}</span>
                        )}
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
                            className={`relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 font-mono text-[9px] uppercase tracking-wider after:absolute after:content-[''] after:inset-[-8px] after:cursor-pointer ${
                              activeCommentaryUrl === c.commentary.url
                                ? "bg-ember border-ember text-ink font-semibold"
                                : "border-bone/35 text-bone/75 hover:text-ember hover:border-ember/40 bg-bone/[0.03]"
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
                      <div className="mt-1 text-xs text-bone/65 group-hover:text-bone/85 transition-colors duration-300">
                        {c.role[lang]}
                      </div>
                    </div>
                    <div className="hidden lg:block lg:col-span-2 text-[11px] uppercase tracking-[0.25em] text-bone/65 group-hover:text-bone/90 transition-colors duration-300">
                      {c.category[lang]}
                    </div>
                    <div className="hidden lg:block lg:col-span-3 text-[11px] uppercase tracking-[0.25em] text-bone/65 group-hover:text-bone/90 transition-colors duration-300">
                      {c.network}
                    </div>
                    <div className="col-span-3 lg:col-span-1 flex justify-end">
                      {c.url ? (
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noreferrer"
                          data-hover
                          aria-label={lang === "sv" ? `Visa ${c.title}` : `View ${c.title}`}
                          className="text-bone/50 hover:text-ember transition-all hover:rotate-45"
                        >
                          <ArrowUpRight size={18} />
                        </a>
                      ) : (
                        <ArrowUpRight
                          size={18}
                          className="text-bone/20"
                        />
                      )}
                    </div>
                    <div className="col-span-12 text-xs text-bone/55 lg:hidden group-hover:text-bone/80 transition-colors duration-300">
                      {c.network} · {c.category[lang]}
                    </div>
                  </div>
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
