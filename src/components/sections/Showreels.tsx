import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from "lucide-react";
import { useT } from "../../hooks/use-t";

interface VideoItem {
  id: string;
  title: { sv: string; en: string };
  sub: { sv: string; en: string };
  url: string;
  poster: string;
  genre: string;
  specs: string;
  glow: string; // Tailwind glow gradient or color
}

const VIDEOS: VideoItem[] = [
  {
    id: "drama",
    title: { sv: "Drama Showreel", en: "Drama Showreel" },
    sub: { sv: "Beck, SVT 'En våldsam kärlek' m.m.", en: "Beck, SVT 'En våldsam kärlek' etc." },
    url: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-female-portrait-in-dark-room-41655-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
    genre: "DRAMA",
    specs: "2.39:1 // ANAMORPHIC // 24 FPS",
    glow: "rgba(14, 116, 144, 0.15)", // Cyan/Teal glow
  },
  {
    id: "comedy",
    title: { sv: "Komedi & Humor", en: "Comedy & Humor" },
    sub: { sv: "Karatefylla, Anna Blomberg show", en: "Karatefylla, Anna Blomberg show" },
    url: "https://assets.mixkit.co/videos/preview/mixkit-laughing-woman-in-close-up-portrait-40283-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000",
    genre: "COMEDY",
    specs: "16:9 // FLAT // 25 FPS",
    glow: "rgba(235, 94, 40, 0.15)", // Ember glow
  },
  {
    id: "commercial",
    title: { sv: "Reklam & Dubbning", en: "Commercial & Voiceover" },
    sub: { sv: "Varumärken och röstproduktioner", en: "Brands and voiceover projects" },
    url: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-elegant-makeup-40432-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1000",
    genre: "COMMERCIAL",
    specs: "1.85:1 // SPHERICAL // 24 FPS",
    glow: "rgba(220, 38, 38, 0.15)", // Red glow
  },
];

export function Showreels() {
  const { t, lang } = useT();
  const [activeVideo, setActiveVideo] = useState<VideoItem>(VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Quick fullscreen request
  const requestFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
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

        {/* Cinematic Main Theater Player Container */}
        <div className="relative mx-auto max-w-[960px] aspect-[21/9] bg-stage/20 border border-bone/10 shadow-2xl rounded-sm group overflow-hidden">
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

          {/* Film Grain overlay */}
          <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.02]" />

          {/* Letterbox widescreen shadow lines */}
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-ink/90 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-ink/90 to-transparent pointer-events-none" />

          {/* TECHNICAL MONITOR OVERLAY */}
          <div className="absolute top-4 left-6 pointer-events-none flex flex-col font-mono text-[9px] tracking-wider text-bone/60 space-y-0.5">
            <div>REEL // {activeVideo.genre}</div>
            <div className="text-[8px] text-bone/40">{activeVideo.specs}</div>
          </div>
          <div className="absolute top-4 right-6 pointer-events-none font-mono text-[9px] tracking-widest text-bone/60 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            LIVE REC
          </div>

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
                  onClick={requestFullscreen}
                  className="hover:text-ember transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnails Selector Row */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          {VIDEOS.map((item) => {
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
                  {isHovered ? (
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
        </div>
      </motion.div>
    </section>
  );
}
