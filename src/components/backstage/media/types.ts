export interface StorageFile {
  name: string;
  path: string;
  id: string;
  url: string;
  isImage: boolean;
  isVideo: boolean;
  size?: number;
  created_at?: string;
  folder?: string;
  alt?: string;
  title?: string;
  caption?: string;
  description?: string;
  filename?: string;
}

export const folderLabels: Record<string, string> = {
  hero: "Hero",
  bio: "Bio",
  portfolio: "Portfolio",
  showreel: "Showreel",
  posters: "Showreel",
  seo: "SEO",
  credits: "Meriter",
  voice: "Röst",
  curtain: "Ridåfall",
  general: "Allmänt"
};
