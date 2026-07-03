import { createContext, useContext } from "react";

export type Lang = "sv" | "en";

export const I18N = {
  sv: {
    nav: {
      bio: "Biografi",
      portfolio: "Portfolio",
      showreels: "Showreels",
      credits: "Meriter",
      voice: "Röst",
      contact: "Kontakt",
    },
    hero: {
      act: "Akt I — Nu aktuell",
      line: '"En våldsam kärlek" — SVT dramadokumentär.',
      role: "Skådespelerska",
      base: "Malmö · Stockholm",
      scroll: "scrolla",
    },
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
      p1Post:
        " där hon spelade en av de fyra kvinnor vi fick följa. Serien handlar om våld i nära relationer — en samhällsfråga vi måste prata mer om, belysa dess problematik och börja agera.",
      p2: [
        "Hon har spelat teater och musikal sedan hon var barn. I TV har hon mestadels medverkat i humorproduktioner som Kristallennominerade ",
        "Karatefylla",
        ", humorserien ",
        "Jävla klåpare",
        " samt andra humorprojekt — bl.a. ",
        "Anna Blomberg show",
        " och ",
        "Jobbtjuven",
        ".",
      ],
      p3: [
        "Drama är något som Therese känner extra starkt för. Vi har sett henne bland annat i Beck-filmen ",
        "Utan uppsåt",
        ", där hon gästspelade rollen som läraren ",
        "Nora",
        ".",
      ],
      facts: [
        ["Bas", "Malmö / Stockholm"],
        ["Dialekt", "Skånsk · Rikssvenska"],
        ["Språk", "Svenska · Engelska"],
      ] as [string, string][],
    },
    portfolio: {
      act: "Akt III",
      title: ["Portfolio", "Bilder"],
      hint: "Scrolla för att se bilder.",
    },
    credits: {
      act: "Akt IV — Meriter",
      heading: ["Roller & ", "Meriter"],
      filters: { Alla: "Alla", Film: "Film", TV: "TV", Theater: "Teater", Voice: "Röst" } as Record<
        string,
        string
      >,
    },
    voice: {
      act: "Akt V — Röst",
      heading: ["En ", "skånsk", " röst — varm, rå, omedelbar."],
      body: [
        "Therese har använts flitigt för sin skånska röst i många radio- och TV-reklamer. Hon har även dubbat rösten till mamman i barnserien ",
        "Familjen Valentin",
        ".",
      ],
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
      okBody: (name: string) =>
        `Tack, ${name || "vän"}. Ditt meddelande är lämnat i regissörens händer. Återkoppling inom kort.`,
      again: "Skicka ytterligare ett meddelande",
    },
    footer: {
      act: "Akt XII — Ridåfall",
      title: "Slut på showen",
      role: "Skådespelerska · Röst",
      agent: "Agent",
      social: "Sociala medier",
      photo: "Foto",
      end: "SLUT",
    },
    lang: { label: "Språk", sv: "Svenska", en: "English" },
  },
  en: {
    nav: {
      bio: "Biography",
      portfolio: "Portfolio",
      showreels: "Showreels",
      credits: "Credits",
      voice: "Voice",
      contact: "Contact",
    },
    hero: {
      act: "Act I — Now Playing",
      line: '"En våldsam kärlek" — SVT documentary drama.',
      role: "Actress",
      base: "Malmö · Stockholm",
      scroll: "scroll",
    },
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
      p1Post:
        " where she played one of the four women we follow. The series is about intimate-partner violence — a societal issue we must talk about more, expose, and act on.",
      p2: [
        "She has performed theatre and musicals since childhood. On television she has appeared mostly in comedy productions such as the Kristallen-nominated ",
        "Karatefylla",
        ", the comedy series ",
        "Jävla klåpare",
        " and other comedy projects — including ",
        "Anna Blomberg show",
        " and ",
        "Jobbtjuven",
        ".",
      ],
      p3: [
        "Drama is something Therese feels especially strongly about. We have seen her in the Beck film ",
        "Utan uppsåt",
        ", where she guest-starred as the teacher ",
        "Nora",
        ".",
      ],
      facts: [
        ["Base", "Malmö / Stockholm"],
        ["Dialect", "Scanian · Standard Swedish"],
        ["Languages", "Swedish · English"],
      ] as [string, string][],
    },
    portfolio: { act: "Act III", title: ["Portfolio", "Images"], hint: "Scroll to view images." },
    credits: {
      act: "Act IV — Credits",
      heading: ["Performance ", "Credits"],
      filters: {
        Alla: "All",
        Film: "Film",
        TV: "TV",
        Theater: "Theatre",
        Voice: "Voice",
      } as Record<string, string>,
    },
    voice: {
      act: "Act V — Voice",
      heading: ["A ", "Scanian", " voice — warm, raw, immediate."],
      body: [
        "Therese is frequently booked for her Scanian voice in radio and TV commercials. She has also dubbed the mother in the children's series ",
        "Familjen Valentin",
        ".",
      ],
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
      okBody: (name: string) =>
        `Thank you, ${name || "friend"}. Your message is in the director's hands. You'll hear back shortly.`,
      again: "Send another message",
    },
    footer: {
      act: "Act XII — Curtain Fall",
      title: "End of Show",
      role: "Actress · Voice",
      agent: "Agent",
      social: "Social",
      photo: "Photo",
      end: "THE END",
    },
    lang: { label: "Language", sv: "Svenska", en: "English" },
  },
};

export type Dict = typeof I18N.sv;

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "sv",
  setLang: () => {},
  t: I18N.sv as Dict,
});

export const useT = () => useContext(LangContext);
