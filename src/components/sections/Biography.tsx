import { useRef, useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { SpotlightImage } from "../ui/SpotlightImage";

export interface BioSection {
  id: string;
  title_sv: string;
  title_en: string;
  quote_sv: string;
  quote_en: string;
  image: string;
  image_alt?: string;
  image_caption?: string;
  image_title?: string;
  image_filename?: string;
  weight?: number;
}

const DEFAULT_SECTIONS: BioSection[] = [
  {
    id: "Dramatic",
    title_sv: "Dramatisk",
    title_en: "Dramatic",
    quote_sv: "Drama är något jag känner extra starkt för.",
    quote_en: "Drama is something I feel especially strongly about.",
    image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
    weight: 300
  },
  {
    id: "Comedic",
    title_sv: "Komisk",
    title_en: "Comedic",
    quote_sv: "Komedi kräver samma precision som tragedi — bara snabbare.",
    quote_en: "Comedy demands the same precision as tragedy — just faster.",
    image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
    weight: 500
  },
  {
    id: "Classical",
    title_sv: "Klassisk",
    title_en: "Classical",
    quote_sv: "Scenen lärde mig allt jag vet om timing och tystnad.",
    quote_en: "The stage taught me everything I know about timing and silence.",
    image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
    weight: 400
  }
];

export function Biography({ 
  sections, 
  imageCredits
}: { 
  sections?: BioSection[]; 
  imageCredits?: { sv: string; en: string }; 
}) {
  const { t, lang } = useT();

  const activeSections = useMemo(() => {
    if (sections && sections.length > 0) return sections;
    return DEFAULT_SECTIONS;
  }, [sections]);

  const [activeId, setActiveId] = useState<string>(activeSections[0]?.id || "Dramatic");

  // Find current active section data
  const data = useMemo(() => {
    return activeSections.find(s => s.id === activeId) || activeSections[0] || DEFAULT_SECTIONS[0];
  }, [activeSections, activeId]);

  // Adjust activeId if it's no longer in activeSections
  useEffect(() => {
    if (!activeSections.some(s => s.id === activeId) && activeSections.length > 0) {
      setActiveId(activeSections[0].id);
    }
  }, [activeSections, activeId]);


  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(scrollYProgress, [0.3, 0.95], [1, 0]);

  const exitScale = useTransform(scrollYProgress, [0.3, 0.95], [1, 1.03]);
  return (
    <section id="bio" ref={ref} className="relative px-6 py-20 md:px-12 md:py-48">
      <motion.div style={{ opacity: exitOpacity, scale: exitScale }} className="w-full h-full">
        <div className={data.image ? "mx-auto grid max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12" : "mx-auto max-w-4xl flex flex-col items-center justify-center text-center"}>

          <div className={data.image ? "lg:col-span-7" : "w-full flex flex-col items-center max-w-3xl"}>
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.bio.act}</div>
            <h2
              className="mt-5 font-display leading-[0.95] text-bone transition-all duration-700"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)", fontWeight: data.weight || 300 }}
            >
              {t.bio.heading[0]}
              <span className="italic text-ember">{t.bio.heading[1]}</span>
              {t.bio.heading[2]}
            </h2>

            {/* Mobile Image, right below the title */}
            {data.image && (
              <div className="block lg:hidden mt-8 w-full">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeId}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full"
                    >
                      <SpotlightImage
                        src={data.image}
                        alt={data.image_alt || `Therese Järvheden — ${lang === "sv" ? data.title_sv : data.title_en}`}
                        title={data.image_title}
                        className="h-full w-full"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-stage/70 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-2 text-[9px] uppercase tracking-[0.3em] text-bone/50 font-mono whitespace-pre-line">
                  {data.image_caption ? (
                    <span>{data.image_caption}</span>
                  ) : imageCredits ? (
                    lang === "sv" ? imageCredits.sv : imageCredits.en
                  ) : (
                    <>
                      <span>Foto: Robert Eldrim · Smink: Sara Zetterström</span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="mt-10">
              <div className="text-[10px] uppercase tracking-[0.4em] text-bone/50 mb-3 font-mono">
                {t.bio.director}
              </div>
              <div className="flex w-full hairline border-t-0 border border-bone/15 overflow-hidden">
                {activeSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveId(s.id)}
                    data-hover
                    className={`relative flex-1 min-w-0 px-2 min-[375px]:px-3 sm:px-5 py-3 text-[9px] min-[375px]:text-[10px] sm:text-[11px] uppercase tracking-[0.15em] min-[375px]:tracking-[0.25em] sm:tracking-[0.32em] transition-colors truncate ${
                      activeId === s.id ? "text-ink" : "text-bone/70 hover:text-bone"
                    }`}
                  >
                    {activeId === s.id && (
                      <motion.span
                        layoutId="moodPill"
                        className="absolute inset-0 bg-ember"
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}
                    <span className="relative">{lang === "sv" ? s.title_sv : s.title_en}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className={`mt-5 font-display italic text-bone/80 text-xl lg:text-2xl max-w-lg ${data.image ? "" : "mx-auto"}`}
                >
                  "{lang === "sv" ? data.quote_sv : data.quote_en}"
                </motion.p>
              </AnimatePresence>
            </div>

            <div className={`mt-14 space-y-7 text-bone/75 leading-relaxed ${data.image ? "max-w-xl text-left" : "max-w-2xl text-center mx-auto"}`}>
              <p>
                {t.bio.p1Pre}
                {t.bio.p1Link && (
                  <a
                    href="https://www.svtplay.se/en-valdsam-karlek"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ember underline-offset-4 hover:underline"
                  >
                    {t.bio.p1Link}
                  </a>
                )}
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
 
            <dl className={`mt-14 grid grid-cols-3 gap-6 border-t border-bone/10 pt-8 w-full ${data.image ? "max-w-xl" : "max-w-2xl mx-auto"}`}>
              {t.bio.facts.map(([k, v]) => (
                <div key={k} className={data.image ? "" : "flex flex-col items-center"}>
                  <dt className="text-[9px] uppercase tracking-[0.35em] text-bone/70">{k}</dt>
                  <dd className="mt-2 font-display text-lg text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {data.image && (
            <div className="hidden lg:block lg:col-span-5 lg:order-first">
              <div className="sticky top-28">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeId}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 h-full w-full"
                    >
                      <SpotlightImage
                        src={data.image}
                        alt={data.image_alt || `Therese Järvheden — ${lang === "sv" ? data.title_sv : data.title_en}`}
                        title={data.image_title}
                        className="h-full w-full"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-stage/70 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="mt-3 flex flex-col gap-1 text-[10px] uppercase tracking-[0.3em] text-bone/50 font-mono whitespace-pre-line">
                  {data.image_caption ? (
                    <span>{data.image_caption}</span>
                  ) : imageCredits ? (
                    lang === "sv" ? imageCredits.sv : imageCredits.en
                  ) : (
                    <>
                      <span>Foto: Robert Eldrim</span>
                      <span>Smink: Sara Zetterström</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </motion.div>
    </section>
  );
}
