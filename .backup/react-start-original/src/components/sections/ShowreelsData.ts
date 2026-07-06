export interface VideoItem {
  id: string;
  title: { sv: string; en: string };
  sub: { sv: string; en: string };
  url?: string;
  youtubeId?: string;
  vimeoId?: string;
  poster: string;
  genre: string;
  specs: string;
  glow: string; // Tailwind glow gradient or color
}

export const VIDEOS: VideoItem[] = [
  {
    id: "main-reel",
    title: { sv: "Huvudshowreel", en: "Main Showreel" },
    sub: { sv: "Therese Järvheden — Skådespelerska", en: "Therese Järvheden — Actress" },
    vimeoId: "1206764752",
    url: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-female-portrait-in-dark-room-41655-large.mp4",
    poster: "https://img.youtube.com/vi/J9_4XQiQtNk/maxresdefault.jpg",
    genre: "SHOWREEL",
    specs: "16:9 // HD // 25 FPS",
    glow: "rgba(235, 94, 40, 0.18)", // Ember/orange glow
  },
  {
    id: "drama",
    title: { sv: "Drama & Scen", en: "Drama & Stage" },
    sub: { sv: "Beck, SVT 'En våldsam kärlek' m.m.", en: "Beck, SVT 'En våldsam kärlek' etc." },
    url: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-female-portrait-in-dark-room-41655-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
    genre: "DRAMA",
    specs: "2.39:1 // ANAMORPHIC // 24 FPS",
    glow: "rgba(14, 116, 144, 0.15)", // Cyan/Teal glow
  },
  {
    id: "comedy",
    title: { sv: "Komedi & Humor", en: "Comedy & Humor" },
    sub: { sv: "Karatefylla, Anna Blomberg show", en: "Karatefylla, Anna Blomberg show" },
    url: "https://assets.mixkit.co/videos/preview/mixkit-laughing-woman-in-close-up-portrait-40283-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=1000",
    genre: "COMEDY",
    specs: "16:9 // FLAT // 25 FPS",
    glow: "rgba(235, 94, 40, 0.15)", // Ember glow
  },
  {
    id: "commercials",
    title: { sv: "Reklam & Röst", en: "Commercials & Voice" },
    sub: { sv: "Röstjobb och reklamfilmer", en: "Voiceovers and commercial films" },
    url: "https://assets.mixkit.co/videos/preview/mixkit-woman-recording-voiceover-in-studio-41659-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1000",
    genre: "COMMERCIAL",
    specs: "16:9 // FLAT // 25 FPS",
    glow: "rgba(235, 94, 40, 0.12)",
  },
  {
    id: "stage",
    title: { sv: "Scenframträdanden", en: "Stage Performances" },
    sub: { sv: "Utdrag från scen och musikal", en: "Excerpts from stage and musical" },
    url: "https://assets.mixkit.co/videos/preview/mixkit-actor-practicing-a-monologue-in-front-of-a-mirror-41656-large.mp4",
    poster:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
    genre: "THEATER",
    specs: "16:9 // FLAT // 24 FPS",
    glow: "rgba(14, 116, 144, 0.12)",
  },
];
