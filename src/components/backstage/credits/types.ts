export interface CreditRow {
  id: string;
  year: string;
  title: string;
  role_sv: string;
  role_en: string;
  category_sv: string;
  category_en: string;
  network: string;
  type: string;
  url?: string;
  img: string;
  img_alt?: string;
  img_caption?: string;
  img_title?: string;
  img_filename?: string;
  img_description?: string;
  is_current_production: boolean;
  sort_order: number;
  // Audio commentary / röst
  commentary_url?: string;
  commentary_duration?: string;
  commentary_sv?: string;
  commentary_en?: string;
  // Script dialogue
  script_scene?: string;
  script_char?: string;
  script_line_sv?: string;
  script_line_en?: string;
}
