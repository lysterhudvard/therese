export interface ShowreelItem {
  id: string;
  title_sv: string;
  title_en: string;
  sub_sv: string;
  sub_en: string;
  vimeo_id?: string;
  youtube_id?: string;
  url?: string;
  poster: string;
  poster_alt?: string;
  poster_caption?: string;
  poster_title?: string;
  poster_filename?: string;
  poster_description?: string;
  genre: string;
  specs: string;
  glow: string;
  sort_order: number;
}
