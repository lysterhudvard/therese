import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { Mail, ArrowUpRight, Play, Send, Check, Pause, Volume2, VolumeX, X } from "lucide-react";

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
    nav: { bio: "Biografi", portfolio: "Portfolio", credits: "Meriter", voice: "Röst", contact: "Kontakt" },
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
    portfolio: { act: "Akt III", title: ["Portfolio", "Bilder"], hint: "Scrolla för att se bilder." },
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
    nav: { bio: "Biography", portfolio: "Portfolio", credits: "Credits", voice: "Voice", contact: "Contact" },
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
    portfolio: { act: "Act III", title: ["Portfolio", "Images"], hint: "Scroll to view images." },
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
  commentary?: {
    url: string;
    duration: string;
    svText: string;
    enText: string;
  };
  script?: {
    scene: string;
    dialogue: {
      char: string;
      line: { sv: string; en: string };
    };
  };
};

const CREDITS: Credit[] = [
  {
    year: "2024",
    title: "En våldsam kärlek",
    role: { sv: "Ensemble — en av fyra kvinnor", en: "Ensemble — one of four women" },
    type: "TV",
    category: { sv: "Drama", en: "Drama" },
    network: "SVT",
    url: "https://www.svtplay.se/en-valdsam-karlek",
    img: IMG.hero,
    commentary: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "0:15",
      svText: "Det var en emotionellt utmanande roll, men oerhört viktig att berätta för att uppmärksamma kvinnofrid och våld i nära relationer.",
      enText: "It was an emotionally challenging role, but incredibly important to tell to draw attention to domestic abuse and relationship violence."
    },
    script: {
      scene: "SCENE 4 - INT. APARTMENT - NIGHT",
      dialogue: {
        char: "THERESE",
        line: {
          sv: "Vi måste prata om det här. Vi kan inte låtsas som ingenting längre.",
          en: "We need to talk about this. We can't pretend it's nothing anymore."
        }
      }
    }
  },
  {
    year: "2023",
    title: "Beck — Utan uppsåt",
    role: { sv: "Nora (lärare)", en: "Nora (teacher)" },
    type: "Film",
    category: { sv: "Drama", en: "Drama" },
    network: "Filmlance / C More",
    img: IMG.bioA,
    commentary: {
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "0:12",
      svText: "Att spela Nora i Beck var fantastiskt. Hon bär på en tyst intensitet som gör varje blick laddad.",
      enText: "Playing Nora in Beck was fantastic. She carries a quiet intensity that makes every look charged."
    },
    script: {
      scene: "SCENE 17 - INT. CLASSROOM - DAY",
      dialogue: {
        char: "NORA",
        line: {
          sv: "Alla slår upp sidan fyrtiotvå. Vi har inte mycket tid kvar.",
          en: "Everyone open to page forty-two. We don't have much time left."
        }
      }
    }
  },
  {
    year: "2021",
    title: "Karatefylla",
    role: { sv: "Återkommande roll", en: "Recurring role" },
    type: "TV",
    category: { sv: "Komedi", en: "Comedy" },
    network: "SVT",
    img: IMG.feature,
    script: {
      scene: "SCENE 8 - INT. BAR - NIGHT",
      dialogue: {
        char: "TJEJEN",
        line: {
          sv: "Ska du ha en stor stark eller ska du bara stå där och titta?",
          en: "Are you having a big beer or are you just going to stand there and watch?"
        }
      }
    }
  },
  {
    year: "2020",
    title: "Jävla klåpare",
    role: { sv: "Återkommande roll", en: "Recurring role" },
    type: "TV",
    category: { sv: "Komedi", en: "Comedy" },
    network: "SVT",
    img: IMG.portfolio[3],
    script: {
      scene: "SCENE 12 - INT. OFFICE - DAY",
      dialogue: {
        char: "KUNDEN",
        line: {
          sv: "Det här är helt oacceptabelt. Vem är ansvarig här?",
          en: "This is completely unacceptable. Who is in charge here?"
        }
      }
    }
  },
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
  Comedic: { image: "https://a6c2528650.clvaw-cdnwnd.com/a1d4e2b76c0723db65512f7305fc0d9c/200000044-20e3320e36/Thess0564_highres.jpg?ph=a6c2528650", weight: 500 },
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
    { id: "portfolio", label: t.nav.portfolio },
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
            </div>
            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.3em] text-bone/50 font-mono">
              <span>Foto: Robert Eldrim</span>
              <span>Smink: Sara Zetterström - Mua</span>
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

/* ---------- Portfolio ---------- */
function Portfolio() {
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
    <section id="portfolio" ref={ref} className="relative" style={{ height: "320vh" }}>
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

        {/* Dark barrier on the left to fade out images as they approach the text */}
        <div className="absolute left-0 top-0 bottom-0 z-20 w-[42vw] bg-gradient-to-r from-ink via-ink/90 to-transparent pointer-events-none hidden md:block" />

        <div className="absolute left-6 top-1/2 z-30 -translate-y-1/2 md:left-12 hidden md:block">
          <div className="text-[10px] uppercase tracking-[0.5em] text-ember mb-1.5">{t.portfolio.act}</div>
          <div className="font-display text-5xl md:text-6xl text-bone leading-none">{t.portfolio.title[0]}<br/>{t.portfolio.title[1]}</div>
          <div className="mt-4 text-xs text-bone/40 max-w-[180px]">{t.portfolio.hint}</div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 items-center gap-8 px-[40vw] will-change-transform z-10"
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
            <div className="text-[10px] uppercase tracking-[0.5em] text-ember">{t.portfolio.act}</div>
            <h3 className="mt-2 font-display text-4xl text-bone leading-none">{t.portfolio.title[0]} {t.portfolio.title[1]}</h3>
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
function Credits({
  activeCommentaryUrl,
  onPlayCommentary,
}: {
  activeCommentaryUrl?: string;
  onPlayCommentary?: (c: { title: string; role: string; url: string; text: string } | null) => void;
}) {
  const { lang, t } = useT();
  const [filter, setFilter] = useState<FilterKey>("Alla");
  const [hoveredCredit, setHoveredCredit] = useState<Credit | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

        <ul className="mt-14 border-t border-bone/20">
          <AnimatePresence initial={false}>
            {rows.map((c, i) => (
              <motion.li
                key={c.title}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                className="group relative border-b border-bone/20 transition-colors duration-300 hover:border-bone/45"
              >
                <a
                  href={c.url ?? "#credits"}
                  target={c.url ? "_blank" : undefined}
                  rel={c.url ? "noreferrer" : undefined}
                  onClick={(e) => { if (!c.url) e.preventDefault(); }}
                  onMouseEnter={() => setHoveredCredit(c)}
                  onMouseLeave={() => setHoveredCredit(null)}
                  onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                  data-hover
                  className="grid grid-cols-12 items-baseline gap-4 py-7 transition-colors hover:bg-bone/[0.06] duration-300"
                >
                  <div className="col-span-2 md:col-span-1 font-mono text-xs text-ember/70 group-hover:text-ember transition-colors duration-300">{c.year}</div>
                  <div className="col-span-7 md:col-span-5">
                    <div className="font-display text-2xl md:text-3xl text-bone transition-all flex flex-wrap items-center gap-3">
                      <span>{c.title}</span>
                      {c.commentary && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const comm = c.commentary;
                            if (!comm) return;
                            if (onPlayCommentary) {
                              if (activeCommentaryUrl === comm.url) {
                                onPlayCommentary(null);
                              } else {
                                onPlayCommentary({
                                  title: c.title,
                                  role: c.role[lang],
                                  url: comm.url,
                                  text: lang === "sv" ? comm.svText : comm.enText,
                                });
                              }
                            }
                          }}
                          data-hover
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all duration-300 font-mono text-[9px] uppercase tracking-wider ${
                            activeCommentaryUrl === c.commentary.url
                              ? "bg-ember border-ember text-ink font-semibold"
                              : "border-bone/20 text-bone/60 hover:text-ember hover:border-ember/40 bg-bone/[0.03]"
                          }`}
                        >
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            {activeCommentaryUrl === c.commentary.url ? (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-75"></span>
                            ) : null}
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${activeCommentaryUrl === c.commentary.url ? "bg-ink" : "bg-ember"}`}></span>
                          </span>
                          <span>
                            {activeCommentaryUrl === c.commentary.url
                              ? (lang === "sv" ? "Spelar" : "Playing")
                              : (lang === "sv" ? "Kommentar" : "Commentary")}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-bone/50 group-hover:text-bone/80 transition-colors duration-300">{c.role[lang]}</div>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-[11px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-bone/85 transition-colors duration-300">
                    {c.category[lang]}
                  </div>
                  <div className="hidden md:block md:col-span-3 text-[11px] uppercase tracking-[0.25em] text-bone/50 group-hover:text-bone/85 transition-colors duration-300">
                    {c.network}
                  </div>
                  <div className="col-span-3 md:col-span-1 flex justify-end">
                    <ArrowUpRight size={18} className="text-bone/30 transition-all group-hover:text-ember group-hover:rotate-45" />
                  </div>
                  <div className="col-span-12 text-xs text-bone/40 md:hidden group-hover:text-bone/70 transition-colors duration-300">{c.network} · {c.category[lang]}</div>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <AnimatePresence>
        {hoveredCredit && hoveredCredit.img && hoveredCredit.script && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none fixed z-[100] w-64 overflow-hidden rounded-lg border border-bone/20 bg-ink shadow-[0_20px_50px_rgba(0,0,0,0.8)] hidden md:block"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y + 20,
            }}
          >
            <div className="relative aspect-[3/4] w-full bg-stage">
              <img
                src={hoveredCredit.img}
                alt={hoveredCredit.title}
                className="h-full w-full object-cover opacity-35 filter grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-transparent pointer-events-none" />
              
              <div className="absolute inset-0 p-4 flex flex-col justify-between font-mono text-[10px] text-bone/90 select-none">
                <div>
                  <div className="border-b border-bone/10 pb-1 mb-2 text-ember text-[8px] uppercase tracking-wider">
                    {lang === "sv" ? "Manussida" : "Script Excerpt"}
                  </div>
                  <div className="text-[9px] font-bold text-bone/50 mb-3 truncate">
                    {hoveredCredit.script.scene}
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-ember font-bold mb-1.5">
                    {hoveredCredit.script.dialogue.char}
                  </div>
                  <p className="leading-relaxed bg-ember/15 border-l-2 border-ember pl-2 py-1 text-[10px] text-bone italic">
                    "{hoveredCredit.script.dialogue.line[lang]}"
                  </p>
                </div>
                <div className="text-[8.5px] text-bone/35 text-right uppercase tracking-widest">
                  Process · {hoveredCredit.title}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

/* ---------- Commentary Player ---------- */
function CommentaryPlayer({
  title,
  role,
  url,
  text,
  onClose,
}: {
  title: string;
  role: string;
  url: string;
  text: string;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        setPlaying(false);
      });
    }
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !muted;
    setMuted(!muted);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 15);
    }
  };

  const onEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] w-[92vw] max-w-lg bg-ink/95 border border-bone/15 backdrop-blur-xl px-5 py-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-3 font-mono"
    >
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span className={`relative inline-flex rounded-full h-2 w-2 bg-ember ${playing ? "animate-pulse" : ""}`} />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-ember">Director's Commentary</span>
        </div>
        <button
          onClick={onClose}
          className="text-bone/45 hover:text-bone transition-colors p-1"
        >
          <X size={15} />
        </button>
      </div>

      <div className="bg-bone/[0.04] border border-bone/5 p-3 rounded-lg flex flex-col gap-1.5">
        <div className="text-[11px] text-bone font-semibold truncate">
          {title} <span className="text-bone/40 font-normal">— {role}</span>
        </div>
        <p className="text-[11px] text-bone/70 leading-relaxed italic border-t border-bone/5 pt-1.5 select-none">
          "{text}"
        </p>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <button
          onClick={togglePlay}
          className="h-8 w-8 rounded-full bg-ember hover:bg-bone text-ink hover:text-ink transition-colors flex items-center justify-center shrink-0 shadow-lg"
        >
          {playing ? <Pause size={13} fill="currentColor" /> : <Play size={13} fill="currentColor" className="translate-x-[0.5px]" />}
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-[9px] text-bone/50 w-8">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSliderChange}
            className="flex-1 h-1 bg-bone/15 rounded-lg appearance-none cursor-pointer accent-ember focus:outline-none"
            style={{
              background: `linear-gradient(to right, #D88C5A 0%, #D88C5A ${((currentTime / (duration || 1)) * 100).toFixed(1)}%, rgba(220, 218, 209, 0.15) ${((currentTime / (duration || 1)) * 100).toFixed(1)}%, rgba(220, 218, 209, 0.15) 100%)`
            }}
          />
          <span className="text-[9px] text-bone/50 w-8 text-right">{formatTime(duration)}</span>
        </div>

        <button
          onClick={toggleMute}
          className="text-bone/55 hover:text-ember transition-colors p-1"
        >
          {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>
    </motion.div>
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
  const { lang, t } = useT();
  const [isHovered, setIsHovered] = useState(false);
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

  const creditsList = [
    { label: t.footer.agent, value: "Schultzberg Agency", href: "mailto:jonas@schultzbergagency.com" },
    { label: lang === "sv" ? "KONTAKT" : "CONTACT", value: "theresejarvheden@gmail.com", href: "mailto:theresejarvheden@gmail.com" },
    { label: "INSTAGRAM", value: "@theresejarvheden", href: "https://www.instagram.com/theresejarvheden/" },
    { label: "FACEBOOK", value: "Therese Järvheden", href: "https://www.facebook.com/therese.jarvhedenfdpersson" },
    { label: t.footer.photo, value: "Robert Eldrim", href: "https://www.instagram.com/roberteldrim/" },
    { label: lang === "sv" ? "SMINK" : "MAKEUP", value: "Sara Zetterström - Mua" },
    { label: lang === "sv" ? "SCENBILDER" : "STILLS", value: "SVT · Filmlance · C More" }
  ];

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
        <div className="font-display text-3xl md:text-4xl tracking-[0.32em] uppercase text-bone">
          <span className="italic font-light">Therese</span> Järvheden
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-[0.40em] text-ember">{t.footer.role}</div>
      </div>

      <div className="w-full max-w-lg z-10 flex flex-col items-center relative min-h-[380px]">
        {/* Intro/Morphing Screen & Layout Transition */}
        {!animatedIn ? (
          <div className="w-full flex justify-center py-8 z-30">
            <motion.div 
              layoutId="post-credits-reel"
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative w-64 h-40 md:w-80 md:h-52 bg-stage/95 border border-bone/20 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <img 
                src={IMG.portfolio[0]} 
                alt="Post-Credits Scene" 
                className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
              <div 
                className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                style={{
                  backgroundImage: "linear-gradient(rgba(220, 218, 209, 0.08) 50%, transparent 50%)",
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
                src={IMG.portfolio[0]} 
                alt="Post-Credits Scene" 
                className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
              <div 
                className="absolute inset-0 opacity-[0.08] pointer-events-none" 
                style={{
                  backgroundImage: "linear-gradient(rgba(220, 218, 209, 0.08) 50%, transparent 50%)",
                  backgroundSize: "100% 4px",
                }}
              />
            </motion.div>
          </div>
        )}

        {/* Scrolling Credits container */}
        <div className="w-full h-[240px] relative overflow-hidden z-10 border-y border-bone/5">
          <AnimatePresence>
            {startScroll && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 py-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div
                  animate={{
                    y: isHovered ? "0%" : ["40%", "-100%"]
                  }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 26,
                      ease: "linear"
                    }
                  }}
                  className="flex flex-col items-center gap-8 text-center font-mono select-none"
                >
                  {creditsList.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-bone/45 mb-1">{item.label}</span>
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
                  
                  <div className="text-[10px] uppercase tracking-[0.3em] text-bone/35 mt-6">
                    {t.footer.end}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom metadata row */}
      <div className="relative w-full max-w-7xl mx-auto mt-16 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-bone/30 z-10">
        <div>© {new Date().getFullYear()} Therese Järvheden</div>
        <div>ALL CREDITS DIRECTED BY THERESE JÄRVHEDEN</div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
function Page() {
  const [heroDone, setHeroDone] = useState(false);
  const [lang, setLangState] = useState<Lang>("sv");
  const [isInPortfolio, setIsInPortfolio] = useState(false);
  const [activeCommentary, setActiveCommentary] = useState<{ title: string; role: string; url: string; text: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById("portfolio");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInPortfolio(entry.isIntersecting);
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
            transform: isInPortfolio ? "translateY(0)" : "translateY(-100%)",
          }}
        />
        <div
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[65] bg-ink transition-transform duration-[750ms] ease-in-out h-[8vh] md:h-[12vh]"
          style={{
            transform: isInPortfolio ? "translateY(0)" : "translateY(100%)",
          }}
        />

        <Hero onDone={() => setHeroDone(true)} heroDone={heroDone} />
        <Biography />
        <Portfolio />
        <Credits
          activeCommentaryUrl={activeCommentary?.url}
          onPlayCommentary={setActiveCommentary}
        />
        <Voice />
        <Contact />
        <Footer />

        <AnimatePresence>
          {activeCommentary && (
            <CommentaryPlayer
              title={activeCommentary.title}
              role={activeCommentary.role}
              url={activeCommentary.url}
              text={activeCommentary.text}
              onClose={() => setActiveCommentary(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </LangContext.Provider>
  );
}
