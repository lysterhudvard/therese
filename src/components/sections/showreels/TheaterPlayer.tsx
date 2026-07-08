import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, X } from "lucide-react";
import { type VideoItem } from "./../ShowreelsData";

interface TheaterPlayerProps {
  isEnlarged: boolean;
  setIsEnlarged: (enlarged: boolean) => void;
  activeVideo: VideoItem;
  lang: "sv" | "en";
}

function getDurationAndType(item: VideoItem) {
  let type = "VIDEO";
  if (item.vimeoId) type = "VIMEO";
  else if (item.youtubeId) type = "YOUTUBE";

  const durationMatch = item.specs.match(/\b\d{1,2}:\d{2}\b/);
  let durationStr = durationMatch ? durationMatch[0] : "";

  if (!durationStr) {
    if (item.id === "main-reel") durationStr = "02:14";
    else if (item.id === "drama") durationStr = "02:45";
    else if (item.id === "comedy") durationStr = "01:30";
    else if (item.id === "commercials") durationStr = "00:45";
    else if (item.id === "stage") durationStr = "03:15";
    else durationStr = "02:00";
  }
  return { durationStr, type };
}

export function TheaterPlayer({
  isEnlarged,
  setIsEnlarged,
  activeVideo,
  lang,
}: TheaterPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  return (
    <div className="relative mx-auto max-w-[1400px] aspect-[16/9] md:aspect-[21/9]">
      {isEnlarged && <div className="w-full h-full bg-transparent" />}
      <motion.div
        layout
        data-no-spotlight
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }} // slower, high-end cinema expansion curve
        className={
          isEnlarged
            ? "fixed inset-0 z-[100] bg-black/98 backdrop-blur-md flex flex-col items-center justify-center p-6 md:p-12 cursor-zoom-out"
            : "absolute inset-0 bg-stage/20 shadow-2xl group overflow-hidden"
        }
        onClick={() => {
          if (isEnlarged) setIsEnlarged(false);
        }}
      >
        {isEnlarged ? (
          <>
            {/* Close Button relative to viewport */}
            <button
              type="button"
              onClick={() => setIsEnlarged(false)}
              aria-label="Close video"
              className="absolute right-4 top-4 md:right-6 md:top-6 lg:right-8 lg:top-8 z-[110] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-bone backdrop-blur transition hover:border-white/50 hover:bg-black/60 cursor-pointer"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div
              className="relative w-[90vw] md:w-[86vw] max-w-[1400px] flex flex-col cursor-default animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Bar */}
              <div className="flex justify-between items-baseline mb-3 font-sans text-xs uppercase tracking-[0.3em] text-white/40 select-none px-1">
                <span>SPELAS NU</span>
                <span className="font-display text-base italic tracking-normal text-bone uppercase">
                  SHOWREEL — THERESE JÄRVHEDEN
                </span>
              </div>

              {/* Widescreen Screen Canvas */}
              <div className="relative w-full aspect-video shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                {!isTransitionComplete ? (
                  // Static poster image displayed during layout scale-up, gradually fading to black
                  <div className="w-full h-full relative">
                    {activeVideo.poster ? (
                      <img
                        src={activeVideo.poster}
                        alt="Preparing screen..."
                        className="w-full h-full object-cover select-none"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/95" />
                    )}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-black pointer-events-none"
                    />
                  </div>
                ) : (
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
                )}

                {/* Film Grain overlay */}
                <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.02] z-20" />

                {/* Letterbox widescreen shadow lines */}
                <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/15 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-20" />
              </div>
            </div>
          </>
        ) : (
          // Normal inline screen canvas
          <div className="w-full h-full relative overflow-hidden">
            <div className="w-full h-full relative cursor-pointer group" onClick={() => setIsEnlarged(true)}>
              {activeVideo.poster ? (
                <img
                  src={activeVideo.poster}
                  alt={activeVideo.title[lang]}
                  className="w-full h-full object-cover select-none transition duration-[1500ms] group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-stage/10 transition duration-[1500ms] group-hover:scale-105" />
              )}
              {/* Glowing play symbol */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors duration-[1500ms]">
                <span className="flex items-center gap-5 text-xs uppercase tracking-[0.4em] text-bone font-sans select-none">
                  <span className="grid h-20 w-20 place-items-center rounded-full border border-bone/70 transition duration-[500ms] group-hover:scale-110 group-hover:border-bone group-hover:bg-bone group-hover:text-ink">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px]" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="hidden sm:inline">Play showreel</span>
                </span>
              </div>

              {/* Bottom info overlays */}
              <div className="absolute bottom-4 left-5 right-5 flex items-baseline justify-between font-sans text-[10px] uppercase tracking-[0.32em] text-white/50 select-none">
                <span>Therese Järvheden</span>
                <span>
                  {(() => {
                    const { durationStr, type } = getDurationAndType(activeVideo);
                    return `${durationStr} · ${type}`;
                  })()}
                </span>
              </div>
            </div>

            {/* Film Grain overlay */}
            <div className="absolute inset-0 pointer-events-none bg-grain opacity-[0.02] z-20" />

            {/* Letterbox widescreen shadow lines */}
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/15 to-transparent pointer-events-none z-20" />
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-20" />

            {/* TECHNICAL MONITOR OVERLAY */}
            <div className="absolute top-4 left-6 pointer-events-none flex flex-col font-mono text-[9px] tracking-wider text-bone/60 space-y-0.5 z-20">
              <div>REEL // {activeVideo.genre}</div>
              <div className="text-[8px] text-bone/40">{activeVideo.specs}</div>
            </div>

            {!activeVideo.youtubeId && !activeVideo.vimeoId && (
              <>
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
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col gap-3">
                  {/* Timeline Progress Bar */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-bone/60 tracking-wider">
                      {formatTime(currentTime)}
                    </span>
                    <div
                      className="flex-1 h-1 bg-white/20 hover:h-1.5 rounded-full cursor-pointer transition-all relative overflow-hidden"
                      onClick={handleSeek}
                    >
                      <div className="h-full bg-ember" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="font-mono text-[9px] text-bone/60 tracking-wider">
                      {formatTime(duration)}
                    </span>
                  </div>

                  {/* Operational controls row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="text-bone hover:text-ember transition-colors">
                        {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                      </button>
                      <button onClick={toggleMute} className="text-bone hover:text-ember transition-colors">
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      </button>
                    </div>

                    <button
                      onClick={() => setIsEnlarged(true)}
                      className="text-bone hover:text-ember transition-colors"
                      title="Cinema Mode"
                    >
                      <Maximize2 size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
