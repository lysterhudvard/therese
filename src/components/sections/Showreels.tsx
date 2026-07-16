import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft as ArrowLeftOrig, ArrowRight as ArrowRightOrig, Video as VideoOrig } from "lucide-react";

const ArrowLeft = ArrowLeftOrig as any;
const ArrowRight = ArrowRightOrig as any;
const Video = VideoOrig as any;
import { useT } from "../../hooks/use-t";
import { VIDEOS, type VideoItem } from "./ShowreelsData";
import { TheaterPlayer } from "./showreels/TheaterPlayer";

export function Showreels({ videos = VIDEOS, teaser = false }: { videos?: VideoItem[], teaser?: boolean }) {
  const { lang } = useT();
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videos[0] || VIDEOS[0]);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  useEffect(() => {
    if (videos && videos.length > 0) {
      setActiveVideo(videos[0]);
    }
  }, [videos]);

  const remainingVideos = videos.filter((v) => v.id !== activeVideo.id);
  const hasMoreVideos = remainingVideos.length > 3;
  const displayedVideos = showAllVideos ? remainingVideos : remainingVideos.slice(0, 3);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax / Scroll Exit Effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const exitOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.3, 0.95], [1, 1.03]);

  return (
    <section
      id="showreels"
      ref={sectionRef}
      className={`relative px-6 py-20 md:px-12 md:py-48 bg-ink overflow-hidden ${
        isEnlarged ? "z-[9999]" : ""
      }`}
    >
      {/* Immersive Atmospheric Ambient Backdrop Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[1000ms] ease-in-out opacity-[0.15] z-0"
        style={{
          background: `radial-gradient(circle 800px at 50% 45%, ${activeVideo.glow} 0%, transparent 80%)`,
        }}
      />

      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale, zIndex: isEnlarged ? 9999 : 10 }}
        className="relative mx-auto max-w-7xl"
      >
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember">

            {lang === "sv" ? "Akt IV — Showreels" : "Act IV — Showreels"}
          </div>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-7xl text-bone leading-none">
            {lang === "sv" ? "Rörligt " : "Moving "}
            <span className="italic">{lang === "sv" ? "material" : "Pictures"}</span>
          </h2>
          <p className="mt-4 text-xs text-bone/40 max-w-md mx-auto">
            {lang === "sv"
              ? "Urval av scener från film, TV och kommersiella produktioner."
              : "A selection of performance clips from film, television, and commercials."}
          </p>
        </div>

        {/* Cinematic Main Theater Player Wrapper */}
        <TheaterPlayer
          isEnlarged={isEnlarged}
          setIsEnlarged={setIsEnlarged}
          activeVideo={activeVideo}
          lang={lang}
        />

        {/* Thumbnails Selector Row */}
        {!teaser && displayedVideos.length > 0 && (
          <div
            className={`mt-12 grid gap-6 max-w-[1400px] mx-auto ${
              showAllVideos
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : hasMoreVideos
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {displayedVideos.map((item) => {
              const isHovered = hoveredCardId === item.id;
              const isSelected = activeVideo.id === item.id;

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCardId(item.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  onClick={() => setActiveVideo(item)}
                  className={`relative border cursor-pointer rounded-sm overflow-hidden transition-all duration-500 bg-stage/20 ${
                    isSelected ? "border-ember" : "border-bone/10 hover:border-bone/30"
                  }`}
                >
                  {/* Visual Thumbnail Frame */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    {/* Real video looping silent preview on hover */}
                    {isHovered && item.url ? (
                      <video
                        src={item.url}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                      />
                    ) : item.poster ? (
                      <img
                        src={item.poster}
                        alt={item.title[lang]}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-stage/40 flex items-center justify-center">
                        <Video className="w-6 h-6 text-bone/20" />
                      </div>
                    )}
                    {/* Ambient dim overlay */}
                    <div className="absolute inset-0 bg-ink/30" />

                    {/* Genre Badge */}
                    <div className="absolute bottom-2 left-2 bg-ink/75 border border-bone/15 px-2 py-0.5 font-mono text-[8px] tracking-widest text-bone">
                      {item.genre}
                    </div>
                  </div>

                  {/* Text Metadata */}
                  <div className="p-4">
                    <h3 className="font-display text-lg text-bone leading-tight">
                      {item.title[lang]}
                    </h3>
                    <p className="mt-1 text-[10px] text-bone/50 tracking-wide">{item.sub[lang]}</p>
                  </div>
                </div>
              );
            })}

            {/* Toggle card for show more/less */}
            {hasMoreVideos && (
              <div
                onClick={() => setShowAllVideos(!showAllVideos)}
                className="relative border border-bone/10 hover:border-ember bg-stage/10 cursor-pointer rounded-sm overflow-hidden flex flex-col items-center justify-center p-6 text-center group transition-all duration-500 min-h-[150px] md:h-auto"
              >
                <motion.div
                  animate={{ x: showAllVideos ? 0 : [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="w-10 h-10 rounded-full border border-bone/20 flex items-center justify-center text-bone/60 group-hover:text-ember group-hover:border-ember transition-colors mb-2"
                >
                  {showAllVideos ? (
                    <ArrowLeft size={16} className="rotate-90 md:rotate-0" />
                  ) : (
                    <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                  )}
                </motion.div>
                <span className="font-mono text-[9px] tracking-widest text-bone/60 group-hover:text-bone transition-colors uppercase">
                  {showAllVideos
                    ? (lang === "sv" ? "Visa färre" : "Show Less")
                    : (lang === "sv" ? "Visa fler" : "Show More")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Teaser CTA */}
        {teaser && (
          <div className="mt-16 text-center">
            <a 
              href="/press"
              className="inline-flex items-center gap-3 border border-bone/20 bg-stage/10 hover:border-ember hover:bg-ember/5 px-8 py-4 font-mono text-[11px] tracking-[0.25em] uppercase text-bone hover:text-ember transition-all rounded-sm shadow-sm"
            >
              {lang === "sv" ? "Se fler produktioner" : "View more productions"}
              <ArrowRight size={16} />
            </a>
          </div>
        )}
      </motion.div>

    </section>
  );
}
