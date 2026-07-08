import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { useT } from "../../hooks/use-t";
import { SpotlightImage } from "../ui/SpotlightImage";

interface VoiceProps {
  imageUrl?: string;
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
}

export function Voice({ imageUrl, imageAlt, imageTitle, imageCaption }: VoiceProps) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.75, 0.98], [1, 0]);

  const exitScale = useTransform(scrollYProgress, [0.75, 0.98], [1, 1.02]);

  return (
    <section id="voice" ref={ref} className="relative overflow-hidden bg-ink">
      <motion.div style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <div className={imageUrl ? "grid grid-cols-1 lg:grid-cols-2" : "max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-6 py-16 lg:py-36"}>
          <div className={`flex flex-col justify-center ${imageUrl ? "px-6 py-16 lg:px-16 lg:py-36" : "items-center max-w-2xl"}`}>
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
            <div className={`mt-10 flex flex-wrap items-center gap-4 ${imageUrl ? "" : "justify-center"}`}>
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
            </div>
          </div>
          {imageUrl && (
            <div className="relative h-[60svh] lg:h-[90svh] overflow-hidden lg:order-first">
              <SpotlightImage 
                src={imageUrl} 
                alt={imageAlt || "Therese — röst"} 
                title={imageTitle}
                className="h-full w-full" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent lg:bg-gradient-to-r pointer-events-none" />
              {imageCaption && (
                <div className="absolute bottom-4 left-6 z-10 text-[9px] uppercase tracking-[0.3em] text-bone/40 font-mono">
                  {imageCaption}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
