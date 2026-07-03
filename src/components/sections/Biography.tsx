import { useRef, useState, useMemo } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { SpotlightImage } from "../ui/SpotlightImage";
import { MOOD_DATA, type Mood } from "../../routes/index";

interface FAQItem {
  id: string;
  q: { sv: string; en: string };
  a: { sv: string; en: string };
}

export function Biography({ moodData = MOOD_DATA, faqs }: { moodData?: typeof MOOD_DATA; faqs?: FAQItem[] }) {
  const { t, lang } = useT();
  const [mood, setMood] = useState<Mood>("Dramatic");
  const data = moodData[mood];

  const activeFaqs = useMemo(() => {
    if (!faqs || !Array.isArray(faqs)) return [];
    return faqs.filter(faq => {
      const q = lang === "sv" ? faq.q?.sv : faq.q?.en;
      const a = lang === "sv" ? faq.a?.sv : faq.a?.en;
      return q?.trim() && a?.trim();
    });
  }, [faqs, lang]);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.5, 0.95], [1, 1.05]);

  return (
    <section id="bio" ref={ref} className="relative px-6 py-28 md:px-12 md:py-40">
      <motion.div style={{ opacity, scale }} className="w-full h-full">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.bio.act}</div>
            <h2
              className="mt-5 font-display leading-[0.95] text-bone transition-all duration-700"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)", fontWeight: data.weight }}
            >
              {t.bio.heading[0]}
              <span className="italic text-ember">{t.bio.heading[1]}</span>
              {t.bio.heading[2]}
            </h2>

            <div className="mt-10">
              <div className="text-[10px] uppercase tracking-[0.4em] text-bone/50 mb-3 font-mono">
                {t.bio.director}
              </div>
              <div className="inline-flex hairline border-t-0 border border-bone/15">
                {(Object.keys(moodData) as Mood[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    data-hover
                    className={`relative px-5 py-3 text-[11px] uppercase tracking-[0.32em] transition-colors ${
                      mood === m ? "text-ink" : "text-bone/70 hover:text-bone"
                    }`}
                  >
                    {mood === m && (
                      <motion.span
                        layoutId="moodPill"
                        className="absolute inset-0 bg-ember"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className="relative">{t.bio.moods[m]}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={mood}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="mt-5 font-display italic text-bone/80 text-xl md:text-2xl max-w-lg"
                >
                  "{t.bio.lines[mood]}"
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-14 space-y-7 text-bone/75 leading-relaxed max-w-xl">
              <p>
                {t.bio.p1Pre}
                <a
                  href="https://www.svtplay.se/en-valdsam-karlek"
                  target="_blank"
                  rel="noreferrer"
                  className="text-ember underline-offset-4 hover:underline"
                >
                  {t.bio.p1Link}
                </a>
                {t.bio.p1Post}
              </p>
              <p>
                {t.bio.p2[0]}
                <em className="text-bone">{t.bio.p2[1]}</em>
                {t.bio.p2[2]}
                <em className="text-bone">{t.bio.p2[3]}</em>
                {t.bio.p2[4]}
                <em className="text-bone">{t.bio.p2[5]}</em>
                {t.bio.p2[6]}
                <em className="text-bone">{t.bio.p2[7]}</em>
                {t.bio.p2[8]}
              </p>
              <p>
                {t.bio.p3[0]}
                <em className="text-bone">{t.bio.p3[1]}</em>
                {t.bio.p3[2]}
                <span className="text-ember">{t.bio.p3[3]}</span>
                {t.bio.p3[4]}
              </p>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-bone/10 pt-8 max-w-xl">
              {t.bio.facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[9px] uppercase tracking-[0.35em] text-bone/40">{k}</dt>
                  <dd className="mt-2 font-display text-lg text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="md:col-span-5 md:order-first">
            <div className="sticky top-28">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mood}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full"
                  >
                    <SpotlightImage
                      src={data.image}
                      alt={`Therese Järvheden — ${mood}`}
                      className="h-full w-full"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-stage/70 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="mt-3 flex flex-col gap-1 text-[10px] uppercase tracking-[0.3em] text-bone/50 font-mono">
                <span>Foto: Robert Eldrim</span>
                <span>Smink: Sara Zetterström</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion FAQ Section */}
        {activeFaqs.length > 0 && (
          <div className="mx-auto max-w-3xl mt-24 border-t border-bone/10 pt-16">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-6 font-mono text-center">
              {lang === "sv" ? "Vanliga Frågor" : "Frequently Asked Questions"}
            </div>
            <h3 className="font-display text-2xl md:text-3xl text-bone text-center mb-10 uppercase tracking-widest">
              FAQ
            </h3>
            
            <div className="space-y-2">
              {activeFaqs.map((faq) => {
                const question = lang === "sv" ? faq.q.sv : faq.q.en;
                const answer = lang === "sv" ? faq.a.sv : faq.a.en;
                
                return (
                  <FAQAccordionItem key={faq.id} question={question} answer={answer} />
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

function FAQAccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-bone/5 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-display text-lg text-bone hover:text-ember transition-colors focus:outline-none cursor-pointer"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-ember font-mono text-xs"
        >
          ▼
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="py-2 text-sm text-bone/65 leading-relaxed font-sans">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}
