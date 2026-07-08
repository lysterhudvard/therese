import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useT } from "../../hooks/use-t";
import { IMG } from "../../routes/index";

export function Footer({ bioData }: { bioData?: any }) {
  const { lang, t } = useT();
  const [animatedIn, setAnimatedIn] = useState(false);
  const [startScroll, setStartScroll] = useState(false);

  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.15 });

  useEffect(() => {
    if (isInView) {
      // Step 1: Wait 1.2s showing the big intro screen
      const morphTimer = setTimeout(() => {
        setAnimatedIn(true);
      }, 1200);

      // Step 2: Once it morphs, wait for transition to finish, then start scroll
      const scrollTimer = setTimeout(() => {
        setStartScroll(true);
      }, 2000);

      return () => {
        clearTimeout(morphTimer);
        clearTimeout(scrollTimer);
      };
    } else {
      setAnimatedIn(false);
      setStartScroll(false);
    }
  }, [isInView]);

  const footerImage = bioData?.footer_image || "";
  const footerImageAlt = bioData?.footer_image_alt || "Post-Credits Scene";
  const footerImageTitle = bioData?.footer_image_title || "";
  const footerEnd = (lang === "sv" ? bioData?.footer_end_sv : bioData?.footer_end_en) || t.footer.end;

  const creditsList = useMemo(() => {
    if (bioData?.footer_credits && Array.isArray(bioData?.footer_credits) && bioData.footer_credits.length > 0) {
      return bioData.footer_credits.map((item: any) => ({
        label: lang === "sv" ? item.label_sv : item.label_en,
        value: lang === "sv" ? item.value_sv : item.value_en,
        href: item.href || undefined,
      }));
    }

    return [
      {
        label: t.footer.agent,
        value: "Schultzberg Agency",
        href: "mailto:jonas@schultzbergagency.com",
      },
      {
        label: lang === "sv" ? "KONTAKT" : "CONTACT",
        value: "theresejarvheden@gmail.com",
        href: "mailto:theresejarvheden@gmail.com",
      },
      {
        label: "INSTAGRAM",
        value: "@theresejarvheden",
        href: "https://www.instagram.com/theresejarvheden/",
      },
      {
        label: "FACEBOOK",
        value: "Therese Järvheden",
        href: "https://www.facebook.com/therese.jarvhedenfdpersson",
      },
      {
        label: t.footer.photo,
        value: "Robert Eldrim",
        href: "https://www.instagram.com/roberteldrim/",
      },
      { label: lang === "sv" ? "SMINK" : "MAKEUP", value: "Sara Zetterström" },
      { label: lang === "sv" ? "SCENBILDER" : "STILLS", value: "SVT · Filmlance · C More" },
      {
        label: lang === "sv" ? "PRODUCENT HEMSIDA" : "WEBSITE PRODUCER",
        value: "Sirin Öngörür",
      },
    ];
  }, [bioData, lang, t]);

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-bone/10 bg-black/40 px-6 py-20 md:px-12 overflow-hidden flex flex-col items-center justify-center min-h-[580px]"
    >
      {/* Film noise / scanlines effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(220, 218, 209, 0.08) 50%, transparent 50%)",
          backgroundSize: "100% 4px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink pointer-events-none" />

      {/* Title / Curtain Call */}
      <div className="text-center mb-10 z-10">
        <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-2">{t.footer.act}</div>
        <div className="font-display text-3xl md:text-5xl tracking-[0.25em] uppercase text-bone leading-[1.1]">
          {t.footer.title}
        </div>
        <div className="mt-4 text-[10px] uppercase tracking-[0.35em] text-bone/70">
          <span className="italic font-light">Therese</span> Järvheden —{" "}
          {lang === "sv" ? (
            <>
              Skådespelerska<span className="hidden md:inline"> · Röst</span>
            </>
          ) : (
            <>
              Actress<span className="hidden md:inline"> · Voice</span>
            </>
          )
          }
        </div>
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center relative min-h-[380px]">
        {/* Intro/Morphing Screen & Layout Transition */}
        {footerImage && (
          !animatedIn ? (
            <div className="w-full flex justify-center py-8 z-30">
              <motion.div
                layoutId="post-credits-reel"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-64 h-40 md:w-80 md:h-52 bg-stage/95 border border-bone/20 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <img
                  src={footerImage}
                  alt={footerImageAlt}
                  title={footerImageTitle}
                  className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(220, 218, 209, 0.08) 50%, transparent 50%)",
                    backgroundSize: "100% 4px",
                  }}
                />
              </motion.div>
            </div>
          ) : (
            /* Mini screen mode - positioned directly above the scrolling box on the right */
            <div className="w-full flex justify-end mb-3 z-30 pr-1">
              <motion.div
                layoutId="post-credits-reel"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-28 h-20 bg-stage/90 border border-bone/15 rounded overflow-hidden shadow-2xl"
              >
                <img
                  src={footerImage}
                  alt={footerImageAlt}
                  title={footerImageTitle}
                  className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(220, 218, 209, 0.08) 50%, transparent 50%)",
                    backgroundSize: "100% 4px",
                  }}
                />
              </motion.div>
            </div>
          )
        )}

        {/* Scrolling Credits container */}
        <div className="w-full h-[240px] relative overflow-hidden z-10 border-y border-bone/5">
          <style>{`
            @keyframes creditScroll {
              0% { transform: translateY(220px); }
              100% { transform: translateY(-100%); }
            }
            .credit-scroll-container {
              animation: creditScroll 30s linear infinite;
            }
            .credit-scroll-container:hover {
              animation-play-state: paused;
            }
          `}</style>
          <AnimatePresence>
            {startScroll && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 py-4 pointer-events-auto"
              >
                <div className="credit-scroll-container flex flex-col items-center gap-8 text-center font-mono select-none">
                  {creditsList.map((item: { label: string; value: string; href?: string }, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-bone/70 mb-1">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          data-hover
                          className="text-sm md:text-base uppercase tracking-widest text-bone hover:text-ember transition-colors cursor-pointer pointer-events-auto"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm md:text-base uppercase tracking-widest text-bone/70">
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}

                  <div className="text-sm md:text-base font-display uppercase tracking-[0.4em] text-bone mt-8 font-semibold">
                    {footerEnd}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom metadata row */}
      <div className="relative w-full max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-bone/60 z-10">
        <div>© {new Date().getFullYear()} Therese Järvheden</div>
        <div>ALL CREDITS DIRECTED BY THERESE JÄRVHEDEN</div>
      </div>
    </footer>
  );
}
