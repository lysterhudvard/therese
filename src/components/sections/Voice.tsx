import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play as PlayOrig, ArrowRight as ArrowRightOrig } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const Play = PlayOrig as any;
const ArrowRight = ArrowRightOrig as any;
const MotionDiv = motion.div as any;
import { useT } from "../../hooks/use-t";
import { SpotlightImage } from "../ui/SpotlightImage";

interface VoiceProps {
  imageUrl?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  teaser?: boolean;
}

export function Voice({ imageUrl, imageAlt, imageTitle, imageCaption, teaser = false }: VoiceProps) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  
  const [liveVoice, setLiveVoice] = useState({ url: imageUrl, alt: imageAlt, title: imageTitle, caption: imageCaption });

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    let active = true;
    const fetchVoice = async () => {
      try {
        const { data, error } = await supabase
          .from("biography")
          .select("voice_section")
          .eq("id", "main")
          .maybeSingle();

        if (error) throw error;
        if (data?.voice_section && active) {
          const vs = data.voice_section;
          setLiveVoice({
            url: vs.image_url || imageUrl,
            alt: vs.image_alt || imageAlt,
            title: vs.image_title || imageTitle,
            caption: vs.image_caption || imageCaption
          });
        }
      } catch (e) {
        console.error("Failed to fetch voice client-side:", e);
      }
    };
    
    fetchVoice();
    return () => { active = false; };
  }, [imageUrl, imageAlt, imageTitle, imageCaption]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);

  const exitScale = useTransform(scrollYProgress, [0.3, 0.95], [1, 1.03]);

  return (
    <section id="voice" ref={ref} className="relative overflow-hidden bg-ink">
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
                  <button
                    onClick={() =>
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                    }
                    data-hover
                    className="group inline-flex items-center gap-3 border border-ember/40 bg-ember/5 px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-ember hover:bg-ember hover:text-ink transition-colors"
                  >
                    <Play size={14} className="transition-transform group-hover:translate-x-0.5" />
                    {t.voice.cta}
                  </button>
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
