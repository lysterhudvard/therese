import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT, type Lang } from "../hooks/use-t";

/* ---------- Language switch ---------- */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useT();
  return (
    <div
      role="group"
      aria-label={t.lang.label}
      className={`inline-flex items-center border border-bone/20 text-[10px] uppercase tracking-[0.3em] ${className}`}
    >
      {(["sv", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          data-hover
          aria-pressed={lang === l}
          className={`px-2.5 py-1.5 transition-colors ${
            lang === l ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------- Navigation ---------- */
export function Nav({ heroDone }: { heroDone: boolean }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { id: "bio", label: t.nav.bio },
    { id: "portfolio", label: t.nav.portfolio },
    { id: "showreels", label: t.nav.showreels },
    { id: "credits", label: t.nav.credits },
    { id: "voice", label: t.nav.voice },
    { id: "contact", label: t.nav.contact },
  ];

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-700 ease-in-out ${
        scrolled ? "bg-ink border-b border-bone/10" : "bg-transparent"
      }`}
    >
      <div
        className={`flex items-center justify-between pl-4 pr-6 lg:px-10 transition-all duration-700 ease-in-out ${scrolled ? "py-5 lg:py-3.5" : "py-7 lg:py-5"}`}
      >
        {heroDone ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={() => go("top")}
            className="font-display text-[14px] lg:text-[15px] tracking-[0.32em] uppercase text-bone flex items-center gap-1.5"
          >
            <span className="italic font-light">Therese</span>
            <span>Järvheden</span>
          </motion.button>
        ) : (
          <div className="w-[150px]" />
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: heroDone ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={`flex items-center ${!heroDone ? "pointer-events-none" : ""}`}
        >
          <nav className="hidden lg:flex items-center gap-9 text-[11px] uppercase tracking-[0.32em] text-bone/80">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="hover:text-bone transition-colors px-3 py-1.5 rounded-sm"
              >
                {l.label}
              </button>
            ))}
            <AnimatePresence>
              {!scrolled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto", marginLeft: 16 }}
                  exit={{ opacity: 0, scale: 0.8, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden inline-flex shrink-0"
                >
                  <LangSwitch />
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
          <div className="flex items-center lg:hidden">
            <AnimatePresence>
              {!scrolled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto", marginRight: 12 }}
                  exit={{ opacity: 0, scale: 0.8, width: 0, marginRight: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden inline-flex shrink-0"
                >
                  <LangSwitch />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex flex-col gap-1.5 text-bone"
              aria-label="Menu"
            >
              <span
                className={`block h-px w-7 bg-bone transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-7 bg-bone transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-7 bg-bone transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden border-t border-bone/15 bg-stage/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {links.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="text-left font-display text-2xl text-bone"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
