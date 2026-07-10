import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


import { useCommentaryStore } from "../../hooks/use-t";

export function CommentaryPlayer() {
  const { active, stopCommentary } = useCommentaryStore();

  if (!active) return null;

  const { title, role, url, text } = active;
  const onClose = stopCommentary;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => {
          setPlaying(true);
        })
        .catch(() => {
          setPlaying(false);
        });
    }
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 15);
    }
  };

  const onEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[92vw] max-w-lg bg-ink/95 border border-bone/15 backdrop-blur-xl px-5 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-3 font-mono"
    >
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span
              className={`relative inline-flex rounded-full h-2 w-2 bg-ember ${playing ? "animate-pulse" : ""}`}
            />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-ember">
            Director's Commentary
          </span>
        </div>
        <button onClick={onClose} className="text-bone/45 hover:text-bone transition-colors p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="bg-bone/[0.04] border border-bone/5 p-3 rounded-lg flex flex-col gap-1.5">
        <div className="text-[11px] text-bone font-semibold truncate">
          {title} <span className="text-bone/70 font-normal">— {role}</span>
        </div>
        <p className="text-[11px] text-bone/70 leading-relaxed italic border-t border-bone/5 pt-1.5 select-none">
          "{text}"
        </p>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          onClick={togglePlay}
          className="h-8 w-8 rounded-full bg-ember hover:bg-bone text-ink hover:text-ink transition-colors flex items-center justify-center shrink-0 shadow-lg"
        >
          {playing ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="14" y="4" width="4" height="16" rx="1" />
              <rect x="6" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="translate-x-[0.5px]"
            >
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          )}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-[9px] text-bone/50 w-8">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSliderChange}
            className="flex-1 h-1 bg-bone/15 rounded-lg appearance-none cursor-pointer accent-ember focus:outline-none"
            style={{
              background: `linear-gradient(to right, #D88C5A 0%, #D88C5A ${(
                (currentTime / (duration || 1)) *
                100
              ).toFixed(1)}%, rgba(220, 218, 209, 0.15) ${(
                (currentTime / (duration || 1)) *
                100
              ).toFixed(1)}%, rgba(220, 218, 209, 0.15) 100%)`,
            }}
          />
          <span className="text-[9px] text-bone/50 w-8 text-right">{formatTime(duration)}</span>
        </div>

        <button
          onClick={toggleMute}
          className="text-bone/55 hover:text-ember transition-colors p-1"
        >
          {muted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4.7 6 9H2v6h4l5 4.3V4.7z" />
              <line x1="22" x2="16" y1="9" y2="15" />
              <line x1="16" x2="22" y1="9" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4.7 6 9H2v6h4l5 4.3V4.7z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
}
