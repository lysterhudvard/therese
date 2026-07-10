import { useState, useEffect } from "react";
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
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [heroDone, setHeroDone] = useState(false);
  const [logoSwapped, setLogoSwapped] = useState(false);
  const { t } = useT();

  const isBypassed =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("skip-intro");

  useEffect(() => {
    if (isBypassed) {
      setHeroDone(true);
      return;
    }
    const timer = setTimeout(() => {
      setHeroDone(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, [isBypassed]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrolled || isBypassed) {
      setLogoSwapped(true);
      document.documentElement.classList.add("logo-swapped");
    }
  }, [scrolled, isBypassed]);

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
        <button
          onClick={() => go("top")}
          className="font-display text-[14px] lg:text-[15px] tracking-[0.32em] uppercase text-bone flex items-center gap-1.5 nav-header-logo"
        >
          <span className="italic font-light">Therese</span>
          <span>Järvheden</span>
        </button>
        <div
          style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s' }}
          className={`flex items-center ${!heroDone ? "pointer-events-none" : ""} nav-header-menu-container`}
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
            <div
              style={{
                opacity: !scrolled ? 1 : 0,
                transform: !scrolled ? "scale(1)" : "scale(0.8)",
                width: !scrolled ? "auto" : 0,
                marginLeft: !scrolled ? 16 : 0,
                transition: "all 0.3s ease-in-out",
              }}
              className="overflow-hidden inline-flex shrink-0"
            >
              <LangSwitch />
            </div>
          </nav>
          <div className="flex items-center lg:hidden">
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
        </div>
      </div>
      
      <div
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open ? "translateY(0)" : "translateY(-10px)",
          transition: "all 0.3s ease-in-out",
        }}
        className="lg:hidden absolute left-0 right-0 top-full border-t border-bone/15 bg-stage/95 backdrop-blur-md"
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
          <div className="border-t border-bone/10 pt-5 mt-2 flex justify-start">
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
