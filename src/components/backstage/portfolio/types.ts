export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  title?: string;
  filename?: string;
  description?: string;
  allow_download: boolean;
  download_url?: string;
  sort_order: number;
}
