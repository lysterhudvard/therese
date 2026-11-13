import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play as PlayOrig, Pause as PauseOrig } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { mapCreditRow, parseCreditVideos, parseVideoSource } from "../../lib/utils";
import { useT, useCommentaryStore, playCommentary, stopCommentary } from "../../hooks/use-t";
import { type Credit, type FilterKey } from "../../types";
import { type VideoItem } from "./ShowreelsData";
import { TheaterPlayer } from "./showreels/TheaterPlayer";

import { ParallaxQuotes } from "./ParallaxQuotes";
export { ParallaxQuotes } from "./ParallaxQuotes";

const Play = PlayOrig as any;
const Pause = PauseOrig as any;
const MotionDiv = motion.div as any;
const MotionTr = motion.tr as any;

export function Credits({
  credits = [],
  reviewQuotes,
  activeCommentaryUrl: propActiveCommentaryUrl,
  onPlayCommentary,
  isSubpage = false,
}: {
  credits?: Credit[];
  reviewQuotes?: any[];
  activeCommentaryUrl?: string;
  onPlayCommentary?: (c: { title: string; role: string; url: string; text: string } | null) => void;
  isSubpage?: boolean;
}) {
  const { lang, t } = useT();
  const { active } = useCommentaryStore();
  const activeCommentaryUrl = active?.url || propActiveCommentaryUrl;
  const [liveCredits, setLiveCredits] = useState<Credit[]>(credits);
  const [filter, setFilter] = useState<FilterKey>("Alla");
  
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    let activeSync = true;
    const fetchCredits = async () => {
      try {
        const { data, error } = await supabase
          .from("credits")
          .select("*")
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (data && Array.isArray(data) && activeSync) {
          setLiveCredits(data.map(mapCreditRow));
        }
      } catch (e) {
        console.error("Failed to fetch credits client-side:", e);
      }
    };

    fetchCredits();
    return () => { activeSync = false; };
  }, []);

  const [hoveredCredit, setHoveredCredit] = useState<Credit | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showAllCredits, setShowAllCredits] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeVideoState, setActiveVideoState] = useState<{ active: VideoItem; playlist: VideoItem[] } | null>(null);

  const openCreditVideos = (c: Credit, startIndex = 0) => {
    const videos = parseCreditVideos(c.url);
    if (videos.length === 0) return;
    const playlist: VideoItem[] = videos.map((v, idx) => {
      const label = v.title || (videos.length > 1 ? `${c.title} (${idx + 1})` : c.title);
      return {
        id: `${c.title}-${idx}-${v.url}`,
        title: { sv: label, en: label },
        sub: c.role,
        url: v.url,
        poster: c.img || "",
        genre: c.type.toUpperCase(),
        specs: c.year,
        glow: "rgba(235, 94, 40, 0.15)",
      };
    });
    const selected = playlist[startIndex] || playlist[0];
    const srcInfo = parseVideoSource(selected);
    if (srcInfo.isPlayableInModal) {
      setActiveVideoState({ active: selected, playlist });
    } else if (srcInfo.url) {
      window.open(srcInfo.url, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rows = useMemo(
    () => (filter === "Alla" ? liveCredits : liveCredits.filter((c) => c.type === filter)),
    [filter, liveCredits],
  );

  const visibleRows = useMemo(() => {
    if (showAllCredits) return rows;
    const limit = isMobile ? 5 : 10;
    return rows.slice(0, limit);
  }, [rows, showAllCredits, isMobile]);
  const filters: FilterKey[] = ["Alla", "Film", "TV", "Theater", "Voice"];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);

  const exitScale = useTransform(scrollYProgress, [0.3, 0.95], [1, 1.03]);
  return (
    <section id="credits" ref={ref} className={`relative px-6 pb-20 md:px-12 md:pb-48 ${isSubpage ? "pt-6 md:pt-12" : "pt-20 md:pt-48"}`}>
      <MotionDiv style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <ParallaxQuotes reviewQuotes={reviewQuotes} lang={lang} />


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
                    {f === "Alla" ? liveCredits.length : liveCredits.filter((c) => c.type === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <table className="w-full mt-14 border-t border-bone/20 block">
            <thead className="sr-only">
              <tr>
                <th>År</th>
                <th>Titel</th>
                <th>Kategori</th>
                <th>Produktion</th>
                <th>Länk</th>
              </tr>
            </thead>
            <tbody className="block w-full">
            <AnimatePresence initial={false}>
              {visibleRows.map((c, i) => {
                const videos = parseCreditVideos(c.url);
                const firstEmbedIdx = videos.findIndex((v) => parseVideoSource({ url: v.url }).isPlayableInModal);
                const hasModalVideo = firstEmbedIdx !== -1;
                const actionIdx = hasModalVideo ? firstEmbedIdx : 0;

                return (
                <MotionTr
                  key={`${c.title}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className="group relative border-b border-bone/20 transition-colors duration-300 hover:border-bone/45 w-full grid grid-cols-12 items-center gap-4 py-7 px-4 sm:px-6 md:px-8 hover:bg-bone/[0.06]"
                  onMouseEnter={() => setHoveredCredit(c)}
                  onMouseLeave={() => setHoveredCredit(null)}
                  onMouseMove={(e: any) => setMousePos({ x: e.clientX, y: e.clientY })}
                >
                    <td className="col-span-2 lg:col-span-1 font-mono text-xs text-ember/80 group-hover:text-ember transition-colors duration-300 block">
                      {c.year}
                    </td>
                    <td className="col-span-7 lg:col-span-5 block">
                      <div className="font-display text-xl sm:text-2xl lg:text-3xl text-bone transition-all flex flex-wrap items-center gap-3">
                        {videos.length > 0 ? (
                          hasModalVideo ? (
                            <button
                              type="button"
                              onClick={() => openCreditVideos(c, actionIdx)}
                              data-hover
                              className="text-left hover:text-ember transition-colors duration-300 cursor-pointer"
                            >
                              {c.title}
                            </button>
                          ) : (
                            <a href={videos[0].url} target="_blank" rel="noreferrer" data-hover className="hover:text-ember transition-colors duration-300">
                              {c.title}
                            </a>
                          )
                        ) : (
                          <span>{c.title}</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-bone/65 group-hover:text-bone/85 transition-colors duration-300">
                        {c.role[lang]}
                      </div>
                      {videos.length > 1 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {videos.map((v, vIdx) => {
                            const isModal = parseVideoSource({ url: v.url }).isPlayableInModal;
                            const label = v.title || `Video ${vIdx + 1}`;
                            const chipCls = "inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-bone/15 bg-stage/30 hover:border-ember hover:text-ember text-[10px] font-mono text-bone/75 transition-colors";
                            return isModal ? (
                              <button key={`${v.url}-${vIdx}`} type="button" onClick={(e) => { e.stopPropagation(); openCreditVideos(c, vIdx); }} data-hover className={`${chipCls} cursor-pointer`}>
                                <Play size={9} fill="currentColor" />
                                <span>{label}</span>
                              </button>
                            ) : (
                              <a key={`${v.url}-${vIdx}`} href={v.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} data-hover className={chipCls}>
                                <ArrowUpRight size={10} />
                                <span>{label}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="hidden lg:block lg:col-span-2 text-[11px] uppercase tracking-[0.25em] text-bone/65 group-hover:text-bone/90 transition-colors duration-300">
                      {c.category[lang]}
                    </td>
                    <td className="hidden lg:block lg:col-span-2 text-[11px] uppercase tracking-[0.25em] text-bone/65 group-hover:text-bone/90 transition-colors duration-300">
                      {c.network}
                    </td>
                    <td className="col-span-3 lg:col-span-2 flex flex-col items-end gap-2 justify-center block">
                      {videos.length > 0 && (hasModalVideo ? (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openCreditVideos(c, actionIdx); }}
                          data-hover
                          aria-label={lang === "sv" ? `Titta på ${c.title}` : `Watch ${c.title}`}
                          className="relative inline-flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto px-0 sm:px-4 py-0 sm:py-1.5 border border-ember/40 bg-ember/5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-ember hover:bg-ember hover:text-ink rounded-sm shadow-md shadow-ember/5 hover:shadow-ember/15 transition-all duration-300 after:absolute after:content-[''] after:inset-[-8px] after:cursor-pointer cursor-pointer"
                        >
                          <Play size={10} fill="currentColor" className="shrink-0" />
                          <span className="hidden sm:inline ml-1.5">{lang === "sv" ? "Titta" : "Watch"}{videos.length > 1 ? ` (${videos.length})` : ""}</span>
                        </button>
                      ) : (
                        <a
                          href={videos[0].url}
                          target="_blank"
                          rel="noreferrer"
                          data-hover
                          aria-label={lang === "sv" ? `Titta på ${c.title}` : `Watch ${c.title}`}
                          className="relative inline-flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto px-0 sm:px-4 py-0 sm:py-1.5 border border-ember/40 bg-ember/5 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-ember hover:bg-ember hover:text-ink rounded-sm shadow-md shadow-ember/5 hover:shadow-ember/15 transition-all duration-300 after:absolute after:content-[''] after:inset-[-8px] after:cursor-pointer"
                        >
                          <ArrowUpRight size={13} className="shrink-0" />
                          <span className="hidden sm:inline ml-1">{lang === "sv" ? "Titta" : "Watch"}</span>
                        </a>
                      ))}
                      {c.commentary && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const comm = c.commentary;
                            if (!comm) return;
                            if (activeCommentaryUrl === comm.url) stopCommentary();
                            else playCommentary({ title: c.title, role: c.role[lang], url: comm.url, text: lang === "sv" ? comm.svText : comm.enText });
                          }}
                          data-hover
                          className={`relative inline-flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto px-0 sm:px-4 py-0 sm:py-1.5 rounded-sm border transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] shadow-md after:absolute after:content-[''] after:inset-[-8px] after:cursor-pointer ${
                            activeCommentaryUrl === c.commentary.url
                              ? "bg-ember border-ember text-ink shadow-ember/15"
                              : "border-ember/40 bg-ember/5 text-ember hover:bg-ember hover:text-ink shadow-ember/5 hover:shadow-ember/15"
                          }`}
                        >
                          <span className="relative flex items-center justify-center shrink-0">
                            {activeCommentaryUrl === c.commentary.url ? <Pause size={11} fill="currentColor" /> : <Play size={11} fill="currentColor" className="translate-x-[0.5px]" />}
                          </span>
                          <span className="hidden sm:inline ml-1.5">
                            {activeCommentaryUrl === c.commentary.url ? (lang === "sv" ? "Spelar" : "Playing") : (lang === "sv" ? "Kommentar" : "Commentary")}
                          </span>
                        </button>
                      )}
                    </td>
                    <td className="col-span-12 text-xs text-bone/55 lg:hidden group-hover:text-bone/80 transition-colors duration-300 block">
                      {c.network} · {c.category[lang]}
                    </td>
                </MotionTr>
                );
              })}
            </AnimatePresence>
            </tbody>
          </table>

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
            <MotionDiv
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
            </MotionDiv>
          )}
        </AnimatePresence>
      </MotionDiv>
      {activeVideoState && (
        <TheaterPlayer
          modalOnly
          isEnlarged={true}
          setIsEnlarged={(open) => {
            if (!open) setActiveVideoState(null);
          }}
          activeVideo={activeVideoState.active}
          playlist={activeVideoState.playlist}
          onSelectVideo={(vid) =>
            setActiveVideoState((prev) => (prev ? { ...prev, active: vid } : null))
          }
          lang={lang}
        />
      )}
    </section>
  );
}
