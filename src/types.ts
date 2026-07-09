export type Credit = {
  year: string;
  title: string;
  role: { sv: string; en: string };
  type: "TV" | "Film" | "Voice" | "Theater";
  category: { sv: string; en: string };
  network: string;
  url?: string;
  img: string;
  is_current_production?: boolean;
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

export type FilterKey = "Alla" | "Film" | "TV" | "Theater" | "Voice";
