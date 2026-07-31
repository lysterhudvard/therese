import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play as PlayOrig, ArrowRight as ArrowRightOrig, Pause as PauseOrig } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const Play = PlayOrig as any;
const ArrowRight = ArrowRightOrig as any;
const Pause = PauseOrig as any;
const MotionDiv = motion.div as any;
import { useT, useCommentaryStore } from "../../hooks/use-t";
import { SpotlightImage } from "../ui/SpotlightImage";

interface VoiceProps {
  imageUrl?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  sampleUrl?: string;
  bookingEmail?: string;
  teaser?: boolean;
}

export function Voice({ imageUrl, imageAlt, imageTitle, imageCaption, sampleUrl, bookingEmail, teaser = false }: VoiceProps) {
  const { t } = useT();
  const { stopCommentary } = useCommentaryStore();
  const ref = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [liveVoice, setLiveVoice] = useState({ 
    url: imageUrl, 
    alt: imageAlt, 
    title: imageTitle, 
    caption: imageCaption,
    sampleUrl: sampleUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    bookingEmail: bookingEmail || ""
  });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    let active = true;
    const fetchVoice = async () => {
      try {
        const { data, error } = await supabase
          .from("biography")
          .select("voice_settings")
          .eq("id", "main")
          .maybeSingle();

        if (error) throw error;
        if (data?.voice_settings && active) {
          const vs = typeof data.voice_settings === "string"
            ? JSON.parse(data.voice_settings)
            : data.voice_settings;
          setLiveVoice({
            url: vs?.image_url || imageUrl,
            alt: vs?.image_alt || imageAlt,
            title: vs?.image_title || imageTitle,
            caption: vs?.image_caption || imageCaption,
            sampleUrl: vs?.sample_url || sampleUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            bookingEmail: vs?.booking_email || bookingEmail || ""
          });
        }
      } catch (e) {
        console.error("Failed to fetch voice client-side:", e);
      }
    };
    
    fetchVoice();
    return () => { active = false; };
  }, [imageUrl, imageAlt, imageTitle, imageCaption, sampleUrl]);

  // Stop audio if component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Load audio source when sampleUrl changes (e.g. when database updates state client-side)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [liveVoice.sampleUrl]);

  // Sync state if audio ends or is paused elsewhere
  const handleEnded = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      stopCommentary();
      
      // Ensure the audio source is loaded if it's currently uninitialized
      if (audioRef.current.readyState === 0) {
        audioRef.current.load();
      }

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Audio playback failed:", err);
          setIsPlaying(false);
        });
    }
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);
  const exitScale = useTransform(scrollYProgress, [0.3, 0.95], [1, 1.03]);

  return (
    <section id="voice" ref={ref} className="relative overflow-hidden bg-ink">
      {liveVoice.sampleUrl && (
        <audio
          ref={audioRef}
          src={liveVoice.sampleUrl}
          onEnded={handleEnded}
        />
      )}
      <MotionDiv style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <div className={liveVoice.url ? "grid grid-cols-1 lg:grid-cols-2" : "max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-6 py-20 md:py-48"}>
          <div className={`flex flex-col justify-center ${liveVoice.url ? "px-6 py-20 md:py-48 lg:px-16" : "items-center max-w-2xl"}`}>
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.voice.act}</div>

            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-bone leading-[0.95]">
              {t.voice.heading[0]}
              <span className="italic">{t.voice.heading[1]}</span>
              {t.voice.heading[2]}
            </h2>
            <p className="mt-7 text-bone/70 leading-relaxed">
              {t.voice.body[0]}
              <em className="text-bone">{t.voice.body[1]}</em>
              {t.voice.body[2]}
            </p>
            <div className={`mt-10 flex flex-wrap items-center gap-4 ${liveVoice.url ? "" : "justify-center"}`}>
              {liveVoice.sampleUrl && (
                <button
                  onClick={togglePlay}
                  data-hover
                  className="group inline-flex items-center gap-3 border border-ember bg-ember text-ink px-7 py-4 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-bone hover:border-bone transition-colors cursor-pointer shadow-lg hover:shadow-ember/15"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={14} />
                      {t.lang.label === "Language" ? "Pause Sample" : "Pausa röstprov"}
                    </>
                  ) : (
                    <>
                      <Play size={14} className="translate-x-[0.5px]" />
                      {t.lang.label === "Language" ? "Play Sample" : "Lyssna på röstprov"}
                    </>
                  )}
                </button>
              )}

              {teaser ? (
                <a
                  href="/rost"
                  data-hover
                  className="group inline-flex items-center gap-3 border border-ember/40 bg-ember/5 px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-ember hover:bg-ember hover:text-ink transition-colors"
                >
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  {t.lang.label === "Language" ? "Go to Voice & Dubbing" : "Gå till röst & dubbning"}
                </a>
              ) : (
                <>
                  {liveVoice.bookingEmail ? (
                    <a
                      href={`mailto:${liveVoice.bookingEmail}`}
                      data-hover
                      className="group inline-flex items-center gap-3 border border-ember/40 bg-ember/5 px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-ember hover:bg-ember hover:text-ink transition-colors"
                    >
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      {t.voice.cta}
                    </a>
                  ) : (
                    <button
                      onClick={() =>
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                      }
                      data-hover
                      className="group inline-flex items-center gap-3 border border-ember/40 bg-ember/5 px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-ember hover:bg-ember hover:text-ink transition-colors"
                    >
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      {t.voice.cta}
                    </button>
                  )}
                  <div className="text-[10px] uppercase tracking-[0.3em] text-bone/70">
                    {t.voice.demo}
                  </div>
                </>
              )}
            </div>
          </div>
          {liveVoice.url && (
            <div className="relative h-[60svh] lg:h-[90svh] overflow-hidden lg:order-first">
              <SpotlightImage 
                src={liveVoice.url} 
                alt={liveVoice.alt || "Therese — röst"} 
                title={liveVoice.title}
                className="h-full w-full" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent lg:bg-gradient-to-r pointer-events-none" />
              {liveVoice.caption && (
                <div className="absolute bottom-4 left-6 z-10 text-[9px] uppercase tracking-[0.3em] text-bone/40 font-mono">
                  {liveVoice.caption}
                </div>
              )}
            </div>
          )}
        </div>
      </MotionDiv>
    </section>
  );
}
