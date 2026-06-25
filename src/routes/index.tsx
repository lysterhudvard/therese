import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Mail, ArrowUpRight, Play, Send, Check } from "lucide-react";

const Instagram = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);
const Facebook = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

/* ---------- Spotlight Image Component for Point 2 ---------- */
function SpotlightImage({
  src,
  alt,
  className = "",
  style = {},
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mask = maskRef.current;
    if (!container || !mask) return;

    // Set initial mask state out of view
    mask.style.webkitMaskImage = "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
    mask.style.maskImage = "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mask.style.webkitMaskImage = `radial-gradient(circle 300px at ${x}px ${y}px, black 10%, transparent 80%)`;
      mask.style.maskImage = `radial-gradient(circle 300px at ${x}px ${y}px, black 10%, transparent 80%)`;
    };

    const onMouseLeave = () => {
      mask.style.webkitMaskImage = "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
      mask.style.maskImage = "radial-gradient(circle 300px at -500px -500px, black 10%, transparent 80%)";
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`} style={style}>
      {/* Background: Desaturated & Darkened */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover filter grayscale brightness-[0.22] transition-all duration-500"
      />
      {/* Foreground: Fully colored under spotlight mask */}
      <img
        ref={maskRef}
        src={src}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-all duration-300"
      />
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Therese Järvheden — Skådespelerska" },
      { name: "description", content: "Swedish actress Therese Järvheden. Drama, comedy, voice. SVT 'En våldsam kärlek', 'Karatefylla', Beck — 'Utan uppsåt'." },
      { property: "og:title", content: "Therese Järvheden — Skådespelerska" },
      { property: "og:description", content: "Swedish actress Therese Järvheden. Drama, comedy, voice." },
      { property: "og:image", content: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650" },
    ],
  }),
  component: Page,
});

/* ---------- Asset constants (scraped from theresejarvheden.se) ---------- */
const IMG = {
  hero: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000000-339e8339ea/Thess1114_lowres.jpg?ph=a6c2528650",
  bioA: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000012-8d9138d916/Thess0822_lowres.jpg?ph=a6c2528650",
  voice: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000001-a2d05a2d07/unnamed-5.jpg?ph=a6c2528650",
  feature: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000031-558e7558ea/image-crop-200000013-8.jpeg?ph=a6c2528650",
  portfolio: [
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000028-5883458837/image-crop-200000014-6.jpeg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000032-c5f44c5f47/Thess0972_bw_highres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000015-689df689e2/Thess0903_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000036-5c2c05c2c2/Thess1110_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000017-971e0971e2/Thess1079_highres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000013-289ef289f3/Thess0862_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000010-3743037433/Thess0609_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000037-4aeb44aeb6/Thess1093_lowres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000043-e152ee1530/Thess0477_highres-5.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000044-20e3320e36/Thess0564_highres.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000045-8549a8549d/Thess0972_highres-5.jpg?ph=a6c2528650",
    "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000046-2484224845/Thess1078_lowres.jpg?ph=a6c2528650",
  ],
};

/* ---------- i18n ---------- */
type Lang = "sv" | "en";

const I18N = {
  sv: {
    nav: { bio: "Biografi", reel: "Showreel", credits: "Meriter", voice: "Röst", contact: "Kontakt" },
    hero: { act: "Akt I — Nu aktuell", line: '"En våldsam kärlek" — SVT dramadokumentär.', role: "Skådespelerska", base: "Malmö · Stockholm", scroll: "scrolla" },
    bio: {
      act: "Akt II — Biografi",
      heading: ["En skådespelerska med ", "bredd", " — från SVT-drama till komedi och röst."],
      director: "Regissörens manus · Stämning",
      moods: { Dramatic: "Dramatisk", Comedic: "Komisk", Classical: "Klassisk" },
      lines: {
        Dramatic: "Drama är något jag känner extra starkt för.",
        Comedic: "Komedi kräver samma precision som tragedi — bara snabbare.",
        Classical: "Scenen lärde mig allt jag vet om timing och tystnad.",
      },
      p1Pre: "Therese var senast aktuell i SVT:s dramadokumentär ",
      p1Link: "En våldsam kärlek",
      p1Post: " där hon spelade en av de fyra kvinnor vi fick följa. Serien handlar om våld i nära relationer — en samhällsfråga vi måste prata mer om, belysa dess problematik och börja agera.",
      p2: ["Hon har spelat teater och musikal sedan hon var barn. I TV har hon mestadels medverkat i humorproduktioner som Kristallennominerade ", "Karatefylla", ", humorserien ", "Jävla klåpare", " samt andra humorprojekt — bl.a. ", "Anna Blomberg show", " och ", "Jobbtjuven", "."],
      p3: ["Drama är något som Therese känner extra starkt för. Vi har sett henne bland annat i Beck-filmen ", "Utan uppsåt", ", där hon gästspelade rollen som läraren ", "Nora", "."],
      facts: [["Bas", "Malmö / Stockholm"], ["Dialekt", "Skånsk · Rikssvenska"], ["Språk", "Svenska · Engelska"]] as [string, string][],
    },
    reel: { act: "Akt III", title: ["Film", "Showreel"], hint: "Scrolla för att rulla bandet." },
    credits: {
      act: "Akt IV — Meriter",
      heading: ["Roller & ", "Meriter"],
      filters: { Alla: "Alla", Film: "Film", TV: "TV", Theater: "Teater", Voice: "Röst" } as Record<FilterKey, string>,
    },
    voice: {
      act: "Akt V — Röst",
      heading: ["En ", "skånsk", " röst — varm, rå, omedelbar."],
      body: ["Therese har använts flitigt för sin skånska röst i många radio- och TV-reklamer. Hon har även dubbat rösten till mamman i barnserien ", "Familjen Valentin", "."],
      cta: "Boka röst",
      demo: "Demo via e-post",
    },
    contact: {
      act: "Akt VI — Kontakt",
      heading: ["Ta ett ", "möte", "."],
      agentLabel: "Skådespelerska — agentur",
      agentSub: "Schultzberg Agency",
      voiceLabel: "Röst — direkt",
      fields: { name: "Namn", email: "E-post", msg: "Meddelande" },
      submit: "Skicka",
      okTitle: "Ridån går upp.",
      okBody: (name: string) => `Tack, ${name || "vän"}. Ditt meddelande är lämnat i regissörens händer. Återkoppling inom kort.`,
      again: "Skicka ytterligare ett meddelande",
    },
    footer: {
      role: "Skådespelerska · Röst",
      agent: "Agent", social: "Sociala medier", photo: "Foto",
      end: "Ridå · Föreställningens slut",
    },
    lang: { label: "Språk", sv: "Svenska", en: "English" },
  },
  en: {
    nav: { bio: "Biography", reel: "Reel", credits: "Credits", voice: "Voice", contact: "Contact" },
    hero: { act: "Act I — Now Playing", line: '"En våldsam kärlek" — SVT documentary drama.', role: "Actress", base: "Malmö · Stockholm", scroll: "scroll" },
    bio: {
      act: "Act II — Biography",
      heading: ["An actress with ", "range", " — from SVT drama to comedy and voice."],
      director: "Director's Script · Mood",
      moods: { Dramatic: "Dramatic", Comedic: "Comedic", Classical: "Classical" },
      lines: {
        Dramatic: "Drama is something I feel especially strongly about.",
        Comedic: "Comedy demands the same precision as tragedy — just faster.",
        Classical: "The stage taught me everything I know about timing and silence.",
      },
      p1Pre: "Therese was most recently seen in SVT's documentary drama ",
      p1Link: "En våldsam kärlek",
      p1Post: " where she played one of the four women we follow. The series is about intimate-partner violence — a societal issue we must talk about more, expose, and act on.",
      p2: ["She has performed theatre and musicals since childhood. On television she has appeared mostly in comedy productions such as the Kristallen-nominated ", "Karatefylla", ", the comedy series ", "Jävla klåpare", " and other comedy projects — including ", "Anna Blomberg show", " and ", "Jobbtjuven", "."],
      p3: ["Drama is something Therese feels especially strongly about. We have seen her in the Beck film ", "Utan uppsåt", ", where she guest-starred as the teacher ", "Nora", "."],
      facts: [["Base", "Malmö / Stockholm"], ["Dialect", "Scanian · Standard Swedish"], ["Languages", "Swedish · English"]] as [string, string][],
    },
    reel: { act: "Act III", title: ["Film", "Reel"], hint: "Scroll to roll the reel." },
    credits: {
      act: "Act IV — Credits",
      heading: ["Performance ", "Credits"],
      filters: { Alla: "All", Film: "Film", TV: "TV", Theater: "Theatre", Voice: "Voice" } as Record<FilterKey, string>,
    },
    voice: {
      act: "Act V — Voice",
      heading: ["A ", "Scanian", " voice — warm, raw, immediate."],
      body: ["Therese is frequently booked for her Scanian voice in radio and TV commercials. She has also dubbed the mother in the children's series ", "Familjen Valentin", "."],
      cta: "Book voice",
      demo: "Demo via email",
    },
    contact: {
      act: "Act VI — Contact",
      heading: ["Take a ", "meeting", "."],
      agentLabel: "Actress — agency",
      agentSub: "Schultzberg Agency",
      voiceLabel: "Voice — direct",
      fields: { name: "Name", email: "Email", msg: "Message" },
      submit: "Send",
      okTitle: "Curtain rises.",
      okBody: (name: string) => `Thank you, ${name || "friend"}. Your message is in the director's hands. You'll hear back shortly.`,
      again: "Send another message",
    },
    footer: {
      role: "Actress · Voice",
      agent: "Agent", social: "Social", photo: "Photo",
      end: "Curtain · End of Performance",
    },
    lang: { label: "Language", sv: "Svenska", en: "English" },
  },
};

type Dict = typeof I18N.sv;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "sv",
  setLang: () => {},
  t: I18N.sv as Dict,
});
const useT = () => useContext(LangContext);

/* ---------- Credits data (titles in original Swedish; notes translated) ---------- */
type Credit = {
  year: string;
  title: string;
  role: { sv: string; en: string };
  type: "TV" | "Film" | "Voice" | "Theater";
  category: { sv: string; en: string };
  network: string;
  url?: string;
  img: string;
};

const CREDITS: Credit[] = [
  { year: "2024", title: "En våldsam kärlek", role: { sv: "Ensemble — en av fyra kvinnor", en: "Ensemble — one of four women" }, type: "TV", category: { sv: "Drama", en: "Drama" }, network: "SVT", url: "https://www.svtplay.se/en-valdsam-karlek", img: IMG.hero },
  { year: "2023", title: "Beck — Utan uppsåt", role: { sv: "Nora (lärare)", en: "Nora (teacher)" }, type: "Film", category: { sv: "Drama", en: "Drama" }, network: "Filmlance / C More", img: IMG.bioA },
  { year: "2021", title: "Karatefylla", role: { sv: "Återkommande roll", en: "Recurring role" }, type: "TV", category: { sv: "Komedi", en: "Comedy" }, network: "SVT", img: IMG.feature },
  { year: "2020", title: "Jävla klåpare", role: { sv: "Återkommande roll", en: "Recurring role" }, type: "TV", category: { sv: "Komedi", en: "Comedy" }, network: "SVT", img: IMG.portfolio[3] },
  { year: "2019", title: "Anna Blomberg show", role: { sv: "Sketch ensemble", en: "Sketch ensemble" }, type: "TV", category: { sv: "Komedi", en: "Comedy" }, network: "SVT", img: IMG.portfolio[5] },
  { year: "2018", title: "Jobbtjuven", role: { sv: "Återkommande roll", en: "Recurring role" }, type: "TV", category: { sv: "Komedi", en: "Comedy" }, network: "SVT", img: IMG.portfolio[7] },
  { year: "—", title: "Familjen Valentin", role: { sv: "Mamman (röst, dubb)", en: "The mother (voice, dub)" }, type: "Voice", category: { sv: "Animation", en: "Animation" }, network: "Barnkanalen", img: IMG.voice },
  { year: "—", title: "Radio- & TV-reklam", role: { sv: "Röst (skånsk dialekt)", en: "Voice (Scanian dialect)" }, type: "Voice", category: { sv: "Reklam", en: "Commercials" }, network: "Diverse", img: IMG.portfolio[1] },
  { year: "—", title: "Teater & Musikal", role: { sv: "Diverse roller", en: "Various roles" }, type: "Theater", category: { sv: "Scen", en: "Stage" }, network: "Diverse uppsättningar", img: IMG.portfolio[10] },
];

const REVIEW_QUOTES_SV = [
  "en närvaro som river ner väggar",
  "en av fyra kvinnor vi får följa",
  "skånsk röst — varm, rå, omedelbar",
  "drama som hon känner extra starkt för",
  "närvarande, sårbar, exakt",
];
const REVIEW_QUOTES_EN = [
  "a presence that tears down walls",
  "one of four women we follow",
  "Scanian voice — warm, raw, immediate",
  "drama she feels especially strongly about",
  "present, vulnerable, precise",
];

const MOOD_DATA = {
  Dramatic: { image: IMG.hero, weight: 300 },
  Comedic: { image: IMG.bioA, weight: 500 },
  Classical: { image: IMG.feature, weight: 400 },
} as const;

type Mood = keyof typeof MOOD_DATA;
type FilterKey = "Alla" | "Film" | "TV" | "Theater" | "Voice";

/* ---------- Cursor spotlight ---------- */
function Spotlight() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 320, damping: 32, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 32, mass: 0.4 });
  const [enlarged, setEnlarged] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      setEnlarged(!!t?.closest("a, button, [data-hover]"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (coarse) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] will-change-transform"
        style={{ x: sx, y: sy }}
      >
        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: 14, height: 14, background: "var(--color-bone)", mixBlendMode: "difference" }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] will-change-transform"
        style={{ x: sx, y: sy }}
        animate={{ opacity: enlarged ? 0 : 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 520, height: 520,
            background: "radial-gradient(circle, color-mix(in oklch, var(--color-ember) 22%, transparent) 0%, color-mix(in oklch, var(--color-ember) 6%, transparent) 35%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />
      </motion.div>
    </>
  );
}

/* ---------- Language switch ---------- */
function LangSwitch({ className = "" }: { className?: string }) {
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
function Nav({ heroDone }: { heroDone: boolean }) {
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
    { id: "reel", label: t.nav.reel },
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
        scrolled
          ? "bg-ink border-b border-bone/10"
          : "bg-transparent"
      }`}
    >
      <div className={`flex items-center justify-between px-6 md:px-10 transition-all duration-700 ease-in-out ${scrolled ? "py-3.5" : "py-5"}`}>
        {heroDone ? (
          <motion.button
            layoutId="header-logo"
            onClick={() => go("top")}
            className="font-display text-[14px] md:text-[15px] tracking-[0.32em] uppercase text-bone flex items-center gap-1.5"
            transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 1.6 }}
          >
            <span className="italic font-light">Therese</span>
            <span>Järvheden</span>
          </motion.button>
        ) : (
          <div className="w-[150px]" />
        )}
        <nav className="hidden md:flex items-center gap-9 text-[11px] uppercase tracking-[0.32em] text-bone/80">
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="hover:text-bone transition-colors px-3 py-1.5 rounded-sm">
              {l.label}
            </button>
          ))}
          <LangSwitch className="ml-2" />
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <LangSwitch />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-1.5 text-bone"
            aria-label="Menu"
          >
            <span className={`block h-px w-7 bg-bone transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-px w-7 bg-bone transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-7 bg-bone transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-bone/15 bg-stage/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-6 py-6 gap-4">
              {links.map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="text-left font-display text-2xl text-bone">
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

/* ---------- Hero ---------- */
function Hero({ onDone, heroDone }: { onDone: () => void; heroDone: boolean }) {
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
          src={IMG.hero}
          alt="Therese Järvheden"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover object-[50%_25%]"
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
        className="absolute left-1/2 bottom-3 z-20 -translate-x-1/2 text-[9px] uppercase tracking-[0.5em] text-bone/40"
      >
        {t.hero.scroll}
      </motion.div>
    </section>
  );
}

/* ---------- Biography ---------- */
function Biography() {
  const { t } = useT();
  const [mood, setMood] = useState<Mood>("Dramatic");
  const data = MOOD_DATA[mood];
  return (
    <section id="bio" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
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
              <div className="absolute left-4 bottom-4 text-[10px] uppercase tracking-[0.4em] text-bone/80">
                Foto · Robert Eldrim
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.bio.act}</div>
          <h2
            className="mt-5 font-display leading-[0.95] text-bone transition-all duration-700"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.6rem)", fontWeight: data.weight }}
          >
            {t.bio.heading[0]}<span className="italic text-ember">{t.bio.heading[1]}</span>{t.bio.heading[2]}
          </h2>

          <div className="mt-10">
            <div className="text-[10px] uppercase tracking-[0.4em] text-bone/50 mb-3 font-mono">
              {t.bio.director}
            </div>
            <div className="inline-flex hairline border-t-0 border border-bone/15">
              {(Object.keys(MOOD_DATA) as Mood[]).map((m) => (
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
              <a href="https://www.svtplay.se/en-valdsam-karlek" target="_blank" rel="noreferrer" className="text-ember underline-offset-4 hover:underline">
                {t.bio.p1Link}
              </a>
              {t.bio.p1Post}
            </p>
            <p>
              {t.bio.p2[0]}<em className="text-bone">{t.bio.p2[1]}</em>{t.bio.p2[2]}<em className="text-bone">{t.bio.p2[3]}</em>{t.bio.p2[4]}<em className="text-bone">{t.bio.p2[5]}</em>{t.bio.p2[6]}<em className="text-bone">{t.bio.p2[7]}</em>{t.bio.p2[8]}
            </p>
            <p>
              {t.bio.p3[0]}<em className="text-bone">{t.bio.p3[1]}</em>{t.bio.p3[2]}<span className="text-ember">{t.bio.p3[3]}</span>{t.bio.p3[4]}
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
      </div>
    </section>
  );
}

/* ---------- Film reel ---------- */
function FilmReel() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!trackRef.current) return;
      setMaxX(trackRef.current.scrollWidth - window.innerWidth);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  return (
    <section id="reel" ref={ref} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink">
        <div className="absolute inset-x-0 top-0 z-20 flex h-6 items-center gap-3 overflow-hidden px-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="h-3 w-7 shrink-0 rounded-sm bg-stage" />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-6 items-center gap-3 overflow-hidden px-2">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="h-3 w-7 shrink-0 rounded-sm bg-stage" />
          ))}
        </div>

        <div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 md:left-12 hidden md:block">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-3">{t.reel.act}</div>
          <div className="font-display text-5xl md:text-6xl text-bone leading-none">{t.reel.title[0]}<br/>{t.reel.title[1]}</div>
          <div className="mt-4 text-xs text-bone/40 max-w-[180px]">{t.reel.hint}</div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center gap-8 px-[40vw] will-change-transform"
        >
          {IMG.portfolio.map((src, i) => (
            <div key={src} className="relative shrink-0" style={{ width: "min(34vw, 460px)", aspectRatio: "3/4" }}>
              <img src={src} alt={`Portfolio ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute left-2 top-2 font-mono text-[10px] text-bone/70">
                {String(i + 1).padStart(2, "0")} / {String(IMG.portfolio.length).padStart(2, "0")}
              </div>
              <div className="absolute bottom-2 right-2 font-mono text-[10px] text-bone/70">
                THESS · {String(2020 + (i % 4))}
              </div>
            </div>
          ))}
        </motion.div>

        <div className="md:hidden absolute inset-0 flex flex-col">
          <div className="px-6 pt-16 pb-4">
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.reel.act}</div>
            <h3 className="mt-2 font-display text-4xl text-bone leading-none">{t.reel.title[0]} {t.reel.title[1]}</h3>
          </div>
          <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar">
            <div className="flex items-center gap-4 px-6 h-full">
              {IMG.portfolio.map((src, i) => (
                <div key={src} className="relative shrink-0 h-[70%]" style={{ aspectRatio: "3/4" }}>
                  <img src={src} alt={`Portfolio ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute left-2 top-2 font-mono text-[10px] text-bone/70">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Parallax quotes ---------- */
function ParallaxQuotes() {
  const { lang } = useT();
  const quotes = lang === "sv" ? REVIEW_QUOTES_SV : REVIEW_QUOTES_EN;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const layers = [
    { y: useTransform(scrollYProgress, [0, 1], [120, -260]), x: useTransform(scrollYProgress, [0, 1], [-40, 40]) },
    { y: useTransform(scrollYProgress, [0, 1], [40, -440]), x: useTransform(scrollYProgress, [0, 1], [20, -60]) },
    { y: useTransform(scrollYProgress, [0, 1], [180, -180]), x: useTransform(scrollYProgress, [0, 1], [-10, 30]) },
    { y: useTransform(scrollYProgress, [0, 1], [-40, -340]), x: useTransform(scrollYProgress, [0, 1], [60, -20]) },
    { y: useTransform(scrollYProgress, [0, 1], [220, -120]), x: useTransform(scrollYProgress, [0, 1], [-30, 50]) },
  ];
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {quotes.map((q, i) => (
        <motion.div
          key={q}
          style={{ y: layers[i].y, x: layers[i].x, top: `${10 + i * 18}%`, left: `${(i * 17) % 80}%` }}
          className="absolute font-display italic text-bone/[0.06] whitespace-nowrap"
        >
          <span style={{ fontSize: `clamp(3rem, ${5 + i}vw, ${7 + i}rem)` }}>"{q}"</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Credits ---------- */
function Credits() {
  const { lang, t } = useT();
  const [filter, setFilter] = useState<FilterKey>("Alla");
  const rows = useMemo(
    () => (filter === "Alla" ? CREDITS : CREDITS.filter((c) => c.type === filter)),
    [filter],
  );
  const filters: FilterKey[] = ["Alla", "Film", "TV", "Theater", "Voice"];

  return (
    <section id="credits" className="relative px-6 py-28 md:px-12 md:py-40">
      <ParallaxQuotes />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.credits.act}</div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.95]">
              {t.credits.heading[0]}<span className="italic">{t.credits.heading[1]}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-1 border-t border-bone/10 pt-4">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                data-hover
                className={`px-4 py-2 text-[11px] uppercase tracking-[0.3em] transition-colors ${
                  filter === f ? "text-ember" : "text-bone/50 hover:text-bone"
                }`}
              >
                {t.credits.filters[f]}
                <span className="ml-2 font-mono text-[9px] text-bone/30">
                  {f === "Alla" ? CREDITS.length : CREDITS.filter((c) => c.type === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-14 border-t border-bone/10">
          <AnimatePresence initial={false}>
            {rows.map((c, i) => (
              <motion.li
                key={c.title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="group relative border-b border-bone/10"
              >
                <a
                  href={c.url ?? "#credits"}
                  target={c.url ? "_blank" : undefined}
                  rel={c.url ? "noreferrer" : undefined}
                  onClick={(e) => { if (!c.url) e.preventDefault(); }}
                  data-hover
                  className="grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-bone/[0.02]"
                >
                  <div className="col-span-2 md:col-span-1 font-mono text-xs text-ember/70">{c.year}</div>
                  <div className="col-span-7 md:col-span-5">
                    <div className="font-display text-2xl md:text-3xl text-bone group-hover:italic transition-all">
                      {c.title}
                    </div>
                    <div className="mt-1 text-xs text-bone/50">{c.role[lang]}</div>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-[11px] uppercase tracking-[0.25em] text-bone/50">
                    {c.category[lang]}
                  </div>
                  <div className="hidden md:block md:col-span-3 text-[11px] uppercase tracking-[0.25em] text-bone/50">
                    {c.network}
                  </div>
                  <div className="col-span-3 md:col-span-1 flex justify-end">
                    <ArrowUpRight size={18} className="text-bone/30 transition-all group-hover:text-ember group-hover:rotate-45" />
                  </div>
                  <div className="col-span-12 text-xs text-bone/40 md:hidden">{c.network} · {c.category[lang]}</div>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}

/* ---------- Voice ---------- */
function Voice() {
  const { t } = useT();
  return (
    <section id="voice" className="relative overflow-hidden bg-ink">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-[60svh] md:h-[90svh] overflow-hidden">
          <SpotlightImage src={IMG.voice} alt="Therese — röst" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent md:bg-gradient-to-r pointer-events-none" />
        </div>
        <div className="flex flex-col justify-center px-6 py-20 md:px-16 md:py-32">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.voice.act}</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-bone leading-[0.95]">
            {t.voice.heading[0]}<span className="italic">{t.voice.heading[1]}</span>{t.voice.heading[2]}
          </h2>
          <p className="mt-7 max-w-md text-bone/70 leading-relaxed">
            {t.voice.body[0]}<em className="text-bone">{t.voice.body[1]}</em>{t.voice.body[2]}
          </p>
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              data-hover
              className="group inline-flex items-center gap-3 border border-ember/40 bg-ember/5 px-7 py-4 text-[11px] uppercase tracking-[0.3em] text-ember hover:bg-ember hover:text-ink transition-colors"
            >
              <Play size={14} className="transition-transform group-hover:translate-x-0.5" />
              {t.voice.cta}
            </button>
            <div className="text-[10px] uppercase tracking-[0.3em] text-bone/40">{t.voice.demo}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <section id="contact" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-14">
        <div className="md:col-span-5">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.contact.act}</div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl text-bone leading-[0.92]">
            {t.contact.heading[0]}<span className="italic">{t.contact.heading[1]}</span>{t.contact.heading[2]}
          </h2>

          <div className="mt-12 space-y-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-bone/40">{t.contact.agentLabel}</div>
              <a
                href="mailto:jonas@schultzbergagency.com"
                data-hover
                className="mt-2 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3"
              >
                <Mail size={20} /> jonas@schultzbergagency.com
              </a>
              <div className="mt-1 text-xs text-bone/40">{t.contact.agentSub}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-bone/40">{t.contact.voiceLabel}</div>
              <a
                href="mailto:theresejarvheden@gmail.com"
                data-hover
                className="mt-2 inline-flex items-center gap-3 font-display text-2xl md:text-3xl text-bone hover:text-ember transition-colors px-3 py-2 rounded-sm -ml-3"
              >
                <Mail size={20} /> theresejarvheden@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-5 pt-4">
              <a href="https://www.instagram.com/theresejarvheden/" target="_blank" rel="noreferrer" data-hover className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5">
                <Instagram size={16} /> Instagram
              </a>
              <a href="https://www.facebook.com/therese.jarvhedenfdpersson" target="_blank" rel="noreferrer" data-hover className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-bone/60 hover:text-ember transition-colors px-2.5 py-1.5 rounded-sm -ml-2.5">
                <Facebook size={16} /> Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="relative border border-bone/10 bg-stage/40 backdrop-blur-sm p-8 md:p-12">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
                    className="grid h-16 w-16 place-items-center rounded-full border border-ember bg-ember/10"
                  >
                    <Check size={26} className="text-ember" />
                  </motion.div>
                  <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.4 } }} className="mt-6 font-display text-3xl text-bone">
                    {t.contact.okTitle}
                  </motion.h3>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.55 } }} className="mt-3 max-w-sm text-sm text-bone/60">
                    {t.contact.okBody(form.name)}
                  </motion.p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", msg: "" }); }}
                    className="mt-8 text-[10px] uppercase tracking-[0.35em] text-bone/40 hover:text-ember transition-colors"
                  >
                    {t.contact.again}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <Field label={t.contact.fields.name} id="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field label={t.contact.fields.email} id="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label={t.contact.fields.msg} id="msg" textarea value={form.msg} onChange={(v) => setForm({ ...form, msg: v })} />
                  <button
                    type="submit"
                    data-hover
                    disabled={!form.name || !form.email || !form.msg}
                    className="group inline-flex items-center gap-3 border border-ember bg-ember px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-ink transition-all hover:bg-bone hover:border-bone disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t.contact.submit} <Send size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, id, value, onChange, type = "text", textarea,
}: { label: string; id: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  const [focus, setFocus] = useState(false);
  const active = focus || value.length > 0;
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`absolute left-0 pointer-events-none transition-all duration-300 font-mono uppercase tracking-[0.3em] ${
          active ? "top-0 text-[10px] text-ember" : "top-7 text-xs text-bone/40"
        }`}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          value={value}
          rows={4}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-6 w-full resize-none border-b border-bone/20 bg-transparent pb-2 pt-1 text-bone outline-none focus:border-ember transition-colors"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-6 w-full border-b border-bone/20 bg-transparent pb-2 pt-1 text-bone outline-none focus:border-ember transition-colors"
        />
      )}
    </div>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const { t } = useT();
  return (
    <footer className="relative border-t border-bone/10 px-6 py-14 md:px-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="font-display text-3xl md:text-4xl text-bone leading-none">Therese Järvheden</div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.4em] text-bone/40">{t.footer.role}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-xs text-bone/50">
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-bone/30 mb-2">{t.footer.agent}</div>
            <a href="mailto:jonas@schultzbergagency.com" className="hover:text-ember transition-colors">Schultzberg Agency</a>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-bone/30 mb-2">{t.footer.social}</div>
            <div className="flex flex-col gap-1">
              <a href="https://www.instagram.com/theresejarvheden/" target="_blank" rel="noreferrer" className="hover:text-ember transition-colors">Instagram</a>
              <a href="https://www.facebook.com/therese.jarvhedenfdpersson" target="_blank" rel="noreferrer" className="hover:text-ember transition-colors">Facebook</a>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-bone/30 mb-2">{t.footer.photo}</div>
            <a href="http://medljus.se/" target="_blank" rel="noreferrer" className="hover:text-ember transition-colors">Robert Eldrim — Medljus</a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl mt-12 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-[0.35em] text-bone/30">
        <div>© {new Date().getFullYear()} Therese Järvheden</div>
        <div>{t.footer.end}</div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
function Page() {
  const [heroDone, setHeroDone] = useState(false);
  const [lang, setLangState] = useState<Lang>("sv");
  const [isInReel, setIsInReel] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("reel");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInReel(entry.isIntersecting);
      },
      {
        rootMargin: "-10% 0px -10% 0px",
        threshold: 0.05,
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("tj-lang") as Lang | null;
    if (saved === "sv" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("tj-lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const ctx = useMemo(() => ({ lang, setLang, t: I18N[lang] as Dict }), [lang]);

  return (
    <LangContext.Provider value={ctx}>
      <main className="relative bg-stage text-bone selection:bg-ember selection:text-ink">
        <Spotlight />
        <Nav heroDone={heroDone} />
        
        {/* Cinematic Anamorphic Scope Bars (Point 1) */}
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[65] bg-ink transition-transform duration-[750ms] ease-in-out h-[8vh] md:h-[12vh]"
          style={{
            transform: isInReel ? "translateY(0)" : "translateY(-100%)",
          }}
        />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[65] bg-ink transition-transform duration-[750ms] ease-in-out h-[8vh] md:h-[12vh]"
          style={{
            transform: isInReel ? "translateY(0)" : "translateY(100%)",
          }}
        />

        <Hero onDone={() => setHeroDone(true)} heroDone={heroDone} />
        <Biography />
        <FilmReel />
        <Credits />
        <Voice />
        <Contact />
        <Footer />
      </main>
    </LangContext.Provider>
  );
}
