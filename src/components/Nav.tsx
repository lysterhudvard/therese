import { useState, useEffect } from "react";
import { useT, type Lang } from "../hooks/use-t";

/* ---------- Language switch ---------- */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useT();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      role="group"
      aria-label={mounted ? t.lang.label : "Språk"}
      className={`inline-flex items-center border border-bone/20 text-[10px] uppercase tracking-[0.3em] ${className}`}
    >
      {(["sv", "en"] as Lang[]).map((l) => {
        const isActive = mounted ? lang === l : l === "sv";
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            data-hover
            aria-pressed={isActive}
            className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
              isActive ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Navigation ---------- */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [heroDone, setHeroDone] = useState(false);
  const [logoSwapped, setLogoSwapped] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const { t, lang } = useT();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Sync SEO Title and Meta Description tags dynamically on the client side on language change
  useEffect(() => {
    if (typeof window === "undefined" || !currentPath) return;

    const norm = (p: string) => p.replace(/\/$/, "") || "/";
    const pathKey = norm(currentPath);

    // Skip admin panel
    if (pathKey.startsWith("/backstage")) return;

    const dbData = window.__INITIAL_DB_DATA__;

    const titles = {
      "/": {
        sv: dbData?.seo?.title_sv || "Therese Järvheden — Skådespelerska",
        en: dbData?.seo?.title_en || "Therese Järvheden — Actress"
      },
      "/cv": {
        sv: "CV & Filmografi – Therese Järvheden | Roller i urval",
        en: "CV & Filmography – Therese Järvheden | Selected Roles"
      },
      "/rost": {
        sv: "Röstskådespelare & Voice Over (Skånska/Svenska) | Therese Järvheden",
        en: "Voice Actor & Voice Over (Scanian/Swedish) | Therese Järvheden"
      },
      "/press": {
        sv: "Pressbilder, Foton & Showreels | Therese Järvheden",
        en: "Press Photos, Gallery & Showreels | Therese Järvheden"
      },
      "/faq": {
        sv: "Vanliga Frågor (FAQ) | Therese Järvheden",
        en: "Frequently Asked Questions (FAQ) | Therese Järvheden"
      },
      "/kontakt": {
        sv: "Kontakt & Agentur | Therese Järvheden",
        en: "Contact & Agency Representation | Therese Järvheden"
      }
    };

    const descs = {
      "/": {
        sv: dbData?.seo?.description_sv || "Swedish actress Therese Järvheden. Drama, comedy, voice. Featured in SVT's 'En våldsam kärlek', 'Karatefylla', Beck — 'Utan uppsåt'.",
        en: dbData?.seo?.description_en || "Swedish actress Therese Järvheden. Drama, comedy, voice. Featured in SVT's 'En våldsam kärlek', 'Karatefylla', Beck — 'Utan uppsåt'."
      },
      "/cv": {
        sv: "CV, meriter och filmografi för skådespelerskan Therese Järvheden. Se roller inom TV, film, teater och röst med röstkommentarer.",
        en: "CV and performance credits for Swedish actor Therese Järvheden. Browse roles across TV, film, theatre, and voice acting."
      },
      "/rost": {
        sv: "Boka röstskådespelaren Therese Järvheden för voice over, dubbning och reklam. Lyssna på röstprov med skånsk dialekt.",
        en: "Book Swedish voice actress Therese Järvheden for voice overs, dubbing, and commercials. Listen to Scanian voice samples."
      },
      "/press": {
        sv: "Ladda ner högupplösta pressbilder och foton för Therese Järvheden. Se showreels och rörligt material.",
        en: "Download high-resolution press photos. Watch showreels and video reels for Swedish actress Therese Järvheden."
      },
      "/faq": {
        sv: "Vanliga frågor och svar om skådespelerskan Therese Järvheden. Läs om dialekt, roller, och kontakt.",
        en: "Frequently asked questions and answers about the Swedish actress Therese Järvheden."
      },
      "/kontakt": {
        sv: "Kontakta skådespelerskan Therese Järvheden direkt för röst och dubbning, eller via Schultzberg Agency för skådespeleri.",
        en: "Get in touch with Swedish actress Therese Järvheden directly, or contact Schultzberg Agency for acting representation."
      }
    };

    const tMap = titles[pathKey as keyof typeof titles] || titles["/"];
    const dMap = descs[pathKey as keyof typeof descs] || descs["/"];

    const title = lang === "sv" ? tMap.sv : tMap.en;
    const desc = lang === "sv" ? dMap.sv : dMap.en;

    document.title = title;

    const updateMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        if (selector.startsWith("meta[property=")) {
          const propName = selector.slice(15, -2);
          el.setAttribute("property", propName);
        } else {
          const nameName = selector.slice(11, -2);
          el.setAttribute("name", nameName);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    updateMeta("meta[name=\"description\"]", "content", desc);
    updateMeta("meta[property=\"og:title\"]", "content", title);
    updateMeta("meta[property=\"og:description\"]", "content", desc);
    updateMeta("meta[name=\"twitter:title\"]", "content", title);
    updateMeta("meta[name=\"twitter:description\"]", "content", desc);

    let shareImage = dbData?.seo?.og_image;
    
    if (!shareImage) {
      if (pathKey === "/press" && dbData?.portfolioImages?.[0]?.url) {
        shareImage = dbData.portfolioImages[0].url;
      } else if (pathKey === "/rost") {
        try {
          const vs = typeof dbData?.biography?.voice_settings === "string"
            ? JSON.parse(dbData.biography.voice_settings)
            : dbData?.biography?.voice_settings;
          if (vs?.image_url) {
            shareImage = vs.image_url;
          }
        } catch (e) {}
      } else if (pathKey === "/cv" || pathKey === "/") {
        shareImage = dbData?.biography?.hero_image;
      }
    }

    if (!shareImage) {
      shareImage = "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650";
    }

    updateMeta("meta[property=\"og:image\"]", "content", shareImage);
    updateMeta("meta[name=\"twitter:image\"]", "content", shareImage);
  }, [lang, currentPath]);

  useEffect(() => {
    const isBypassed = document.documentElement.classList.contains("skip-intro");
    // If not on the homepage, immediately skip intro delay
    const isHomePage = window.location.pathname === "/";
    if (isBypassed || !isHomePage) {
      setHeroDone(true);
      if (!isHomePage) {
        setLogoSwapped(true);
        document.documentElement.classList.add("logo-swapped");
      }
      return;
    }
    const timer = setTimeout(() => {
      setHeroDone(true);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isBypassed = document.documentElement.classList.contains("skip-intro");
    if (scrolled || isBypassed) {
      setLogoSwapped(true);
      document.documentElement.classList.add("logo-swapped");
    }
  }, [scrolled]);

  const links = [
    { id: "bio", label: t.nav.bio, href: "/" },
    { id: "credits", label: t.nav.credits, href: "/cv" },
    { id: "voice", label: t.nav.voice, href: "/rost" },
    { id: "portfolio", label: t.nav.portfolio, href: "/press" },
    { id: "faq", label: t.nav.faq, href: "/faq" },
    { id: "contact", label: t.nav.contact, href: "/kontakt" },
  ];

  const isLinkActive = (href: string) => {
    const norm = (p: string) => p.replace(/\/$/, "") || "/";
    return norm(currentPath) === norm(href);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-all duration-700 ease-in-out ${
        scrolled || open ? "bg-ink border-b border-bone/10" : "bg-transparent"
      }`}
    >
      <div
        className={`flex items-center justify-between pl-4 pr-6 lg:px-10 transition-all duration-700 ease-in-out ${scrolled ? "py-5 lg:py-3.5" : "py-7 lg:py-5"}`}
      >
        <a
          href="/"
          style={open ? { opacity: 1, pointerEvents: "auto" } : undefined}
          className="font-display text-[14px] lg:text-[15px] tracking-[0.32em] uppercase text-bone flex items-center gap-1.5 nav-header-logo"
        >
          <span className="italic font-light">Therese</span>
          <span>Järvheden</span>
        </a>
        <div
          style={{ opacity: heroDone ? 1 : 0, transition: 'opacity 0.5s' }}
          className={`flex items-center ${!heroDone ? "pointer-events-none" : ""} nav-header-menu-container`}
        >
          <nav className="hidden lg:flex items-center gap-9 text-[11px] uppercase tracking-[0.32em] text-bone/80">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                className={`hover:text-bone transition-colors px-3 py-1.5 rounded-sm ${isLinkActive(l.href) ? 'nav-active' : ''}`}
              >
                {l.label}
              </a>
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
              className="flex flex-col gap-1.5 text-bone p-3 -mr-3 cursor-pointer pointer-events-auto"
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
            <a
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-left font-display text-2xl text-bone px-3 py-1.5 rounded-sm ${isLinkActive(l.href) ? 'nav-active' : ''}`}
            >
              {l.label}
            </a>
          ))}
          <div className="border-t border-bone/10 pt-5 mt-2 flex justify-start">
            <LangSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
