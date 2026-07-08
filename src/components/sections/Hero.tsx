import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { IMG } from "../../routes/index";

export function Hero({ onDone, heroDone, heroImage }: { onDone: () => void; heroDone: boolean; heroImage?: string }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  useEffect(() => {
    const tm = setTimeout(onDone, 1700);
    return () => clearTimeout(tm);
  }, [onDone]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div style={{ scale, opacity }} className="absolute inset-0">
        <motion.img
          src={heroImage || ""}
          alt="Therese Järvheden"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover object-[50%_25%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stage/40 via-stage/30 to-stage" />
        <div className="absolute inset-0 bg-gradient-to-r from-stage/60 via-transparent to-stage/60" />
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="absolute inset-x-0 top-0 z-30 h-1/2 bg-ink"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="absolute inset-x-0 bottom-0 z-30 h-1/2 bg-ink"
      />

      {!heroDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute inset-0 z-40 flex items-center justify-center px-6"
        >
          <motion.h1
            layoutId="header-logo"
            className="font-display text-bone text-center tracking-[0.32em] uppercase flex items-center justify-center gap-3 whitespace-nowrap"
            style={{ fontSize: "clamp(1.1rem, 4vw, 3.2rem)" }}
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 1.6 }}
          >
            <span className="italic font-light">Therese</span>
            <span>Järvheden</span>
          </motion.h1>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.3, duration: 0.9 }}
        className="absolute inset-x-0 bottom-0 z-20 px-6 pb-10 md:px-12 md:pb-14"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-md">
            <div className="text-[10px] uppercase tracking-[0.4em] text-ember">{t.hero.act}</div>
            <p className="mt-3 font-display text-xl md:text-2xl text-bone/90 italic leading-snug">
              {t.hero.line}
            </p>
          </div>
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.4em] text-bone/60">
            <span>{t.hero.role}</span>
            <span className="h-px w-10 bg-bone/40" />
            <span>{t.hero.base}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.8 }}
        className="absolute left-1/2 bottom-3 z-20 -translate-x-1/2 text-[9px] uppercase tracking-[0.5em] text-bone/70"
      >
        {t.hero.scroll}
      </motion.div>
    </section>
  );
}
