import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, ArrowLeft, ArrowRight } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { VIDEOS, type VideoItem } from "./ShowreelsData";

export function Showreels() {
  const { lang } = useT();
  const [activeVideo, setActiveVideo] = useState<VideoItem>(VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  const hasMoreVideos = VIDEOS.length > 3;
  const displayedVideos = showAllVideos ? VIDEOS : VIDEOS.slice(0, 3);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lock scroll bar when enlarged
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isEnlarged) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isEnlarged]);

  // Handle transition completion delay
  useEffect(() => {
    if (isEnlarged) {
      setIsTransitionComplete(false);
      const timer = setTimeout(() => {
        setIsTransitionComplete(true);
      }, 2200); // Matches the Framer Motion transition duration (2.2s)
      return () => clearTimeout(timer);
    } else {
      setIsTransitionComplete(false);
    }
  }, [isEnlarged]);

  // Parallax / Scroll Exit Effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.95], [1, 1.05]);

  // Sync state when active video changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeVideo]);

  // Autoplay local HTML5 video only after transition is fully complete
  useEffect(() => {
    if (isTransitionComplete) {
      if (!activeVideo.youtubeId && !activeVideo.vimeoId && videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.log("Autoplay was prevented:", err);
          });
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isTransitionComplete, activeVideo]);

  // Video play/pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Update Progress Bar
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(current);
    setProgress(dur > 0 ? (current / dur) * 100 : 0);
  };

  // Loaded metadata
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Handle Seek click
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetTime = percentage * duration;
    videoRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
    setProgress(percentage * 100);
  };

  // Format Timecodes
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Video end handler
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  return (
    <section
      id="showreels"
      ref={sectionRef}
      className="relative px-6 py-28 md:px-12 md:py-40 bg-ink overflow-hidden"
    >
      {/* Immersive Atmospheric Ambient Backdrop Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-[1000ms] ease-in-out opacity-60 z-0"
        style={{
          background: `radial-gradient(circle 800px at 50% 45%, ${activeVideo.glow} 0%, transparent 80%)`,
        }}
      />

      <motion.div style={{ opacity, scale }} className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember">
            {lang === "sv" ? "Akt III.V — Showreels" : "Act III.V — Showreels"}
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-none">
            {lang === "sv" ? "Rörligt " : "Moving "}
            <span className="italic">{lang === "sv" ? "material" : "Pictures"}</span>
          </h2>
          <p className="mt-4 text-xs text-bone/40 max-w-md mx-auto">
            {lang === "sv"
              ? "Urval av scener från film, TV och kommersiella produktioner."
              : "A selection of performance clips from film, television, and commercials."}
          </p>
        </div>

        {/* Cinematic Theater Mode Toggle link */}
        <div className="flex justify-end max-w-[960px] mx-auto mb-3">
          <button
            onClick={() => setIsEnlarged(!isEnlarged)}
            className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-bone/50 hover:text-ember transition-colors uppercase"
          >
            <Maximize2 size={10} />
            {isEnlarged
              ? lang === "sv"
                ? "Stäng teaterläge"
                : "Exit Theater Mode"
              : lang === "sv"
                ? "Aktivera teaterläge"
                : "Enter Theater Mode"}
          </button>
        </div>

        {/* Cinematic Main Theater Player Wrapper */}
        <div className="relative mx-auto max-w-[960px] aspect-[16/9]">
          {/* Reservation space layout placeholder when enlarged */}
          {isEnlarged && <div className="w-full h-full bg-transparent" />}

          <motion.div
            layout
            data-no-spotlight
            transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }} // slower, high-end cinema expansion curve
            className={
              isEnlarged
                ? "fixed inset-0 z-[100] bg-black/98 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-12 cursor-zoom-out"
                : "absolute inset-0 bg-stage/20 border border-bone/10 shadow-2xl rounded-sm group overflow-hidden"
            }
            onClick={() => {
              if (isEnlarged) setIsEnlarged(false);
            }}
          >
            {/* Enlarged Mode Title Info */}
            {isEnlarged && (
              <div className="absolute top-6 left-6 md:left-12 font-mono text-[9px] tracking-[0.4em] text-bone/40 select-none uppercase">
                {lang === "sv"
                  ? "Teaterläge // Klicka utanför för att stänga"
                  : "Theater Mode // Click outside to exit"}
              </div>
            )}

            {/* Custom Close Button for mobile ease of use */}
            {isEnlarged && (
              <button
                onClick={() => setIsEnlarged(false)}
                className="absolute top-4 right-4 z-[110] text-bone/40 hover:text-bone p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}

            {/* Widescreen Screen Canvas (wider cinema sizing: max-w-[1400px]) */}
            <div
              className={
                isEnlarged
                  ? "relative w-[94vw] max-w-[1400px] aspect-[16/9] border border-bone/15 shadow-[0_0_80px_rgba(0,0,0,0.85)] rounded-sm overflow-hidden cursor-default"
                  : "w-full h-full relative overflow-hidden"
              }
              onClick={(e) => {
                if (isEnlarged) e.stopPropagation(); // Stop close when clicking internal video space
              }}
            >
              {/* Media rendering selector (Wait until transition complete before mounting player) */}
              {isEnlarged && !isTransitionComplete ? (
                // Static poster image displayed during layout scale-up, gradually fading to black
                <div className="w-full h-full relative">
                  <img
                    src={activeVideo.poster}
                    alt="Preparing screen..."
                    className="w-full h-full object-cover select-none"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-black pointer-events-none"
                  />
                </div>
              ) : isEnlarged && isTransitionComplete ? (
                // Video starts playing only after layout scale-up is completed
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full h-full absolute inset-0 z-10"
                >
                  {activeVideo.vimeoId ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${activeVideo.vimeoId}?autoplay=1&muted=0&badge=0&autopause=0`}
                      className="w-full h-full border-0 absolute inset-0 z-10"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : activeVideo.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                      className="w-full h-full border-0 absolute inset-0 z-10"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      src={activeVideo.url}
                      poster={activeVideo.poster}
                      onClick={togglePlay}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={handleEnded}
                      playsInline
                      className="w-full h-full object-cover select-none cursor-pointer"
                    />
                  )}
                </motion.div>
              ) : (
                // Normal inline static poster view with custom play button
                <div
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => setIsEnlarged(true)}
                >
                  <img
                    src={activeVideo.poster}
                    alt={activeVideo.title[lang]}
                    className="w-full h-full object-cover select-none"
                  />
                  {/* Glowing play symbol */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-stage/80 backdrop-blur-sm border border-bone/20 flex items-center justify-center text-ember shadow-lg hover:scale-105 transition-transform">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>
              )}

              {/* Film Grain overlay */}
              <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.02] z-20" />

              {/* Letterbox widescreen shadow lines */}
              <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-ink/90 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-ink/90 to-transparent pointer-events-none z-20" />

              {/* TECHNICAL MONITOR OVERLAY */}
              <div className="absolute top-4 left-6 pointer-events-none flex flex-col font-mono text-[9px] tracking-wider text-bone/60 space-y-0.5 z-20">
                <div>REEL // {activeVideo.genre}</div>
                <div className="text-[8px] text-bone/40">{activeVideo.specs}</div>
              </div>
              <div className="absolute top-4 right-6 pointer-events-none font-mono text-[9px] tracking-widest text-bone/60 flex items-center gap-2 z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
                LIVE REC
              </div>

              {/* Render controls/overlays only if it's a local video and in active playing state */}
              {!activeVideo.youtubeId && !activeVideo.vimeoId && !activeVideo.youtubeId && (
                <>
                  {/* Big Center Play Button Overlay */}
                  <AnimatePresence>
                    {!isPlaying && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={togglePlay}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-stage/80 backdrop-blur-sm border border-bone/20 flex items-center justify-center text-ember shadow-lg hover:scale-105 hover:bg-stage transition-transform z-20 group-hover:scale-105"
                      >
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* CUSTOM CINEMA PLAYER CONTROLS */}
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col gap-3">
                    {/* Timeline Progress Bar */}
                    <div
                      onClick={handleSeek}
                      className="relative w-full h-1 bg-bone/20 rounded-full cursor-pointer group/timeline hover:h-1.5 transition-all"
                    >
                      <div
                        className="absolute top-0 left-0 h-full bg-ember rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-bone opacity-0 group-hover/timeline:opacity-100 transition-opacity"
                        style={{ left: `calc(${progress}% - 5px)` }}
                      />
                    </div>

                    {/* Panel Buttons */}
                    <div className="flex items-center justify-between text-bone/80 text-xs">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlay}
                          className="hover:text-ember transition-colors"
                          aria-label={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause size={15} /> : <Play size={15} fill="currentColor" />}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="hover:text-ember transition-colors"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                        </button>
                        <span className="font-mono text-[10px]">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setIsEnlarged(true)}
                          className="hover:text-ember transition-colors"
                          aria-label="Enlarge Screen"
                        >
                          <Maximize2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Thumbnails Selector Row */}
        <div
          className={`mt-12 grid gap-6 max-w-[960px] mx-auto ${
            showAllVideos
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              : hasMoreVideos
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
                : "grid-cols-1 md:grid-cols-3"
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
                  ) : (
                    <img
                      src={item.poster}
                      alt={item.title[lang]}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
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
      </motion.div>
    </section>
  );
}
