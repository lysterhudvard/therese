export interface BioSection {
  id: string;
  title_sv: string;
  title_en: string;
  quote_sv: string;
  quote_en: string;
  image: string;
  image_alt?: string;
  image_caption?: string;
  image_title?: string;
  image_filename?: string;
  description?: string;
  weight?: number;
}

export interface FAQItem {
  id: string;
  q: { sv: string; en: string };
  a: { sv: string; en: string };
}

export interface ReviewQuoteItem {
  id: string;
  sv: string;
  en: string;
}
