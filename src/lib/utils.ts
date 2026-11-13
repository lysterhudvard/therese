import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function moveArrayItem<T>(arr: T[], index: number, direction: "up" | "down"): T[] {
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= arr.length) return arr;

  const result = [...arr];
  const temp = result[index];
  result[index] = result[nextIndex];
  result[nextIndex] = temp;
  return result;
}

export function extractFilePathFromUrl(url?: string | null): string | null {
  if (!url) return null;
  const marker = "/storage/v1/object/public/portfolio/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(url.substring(idx + marker.length));
  }
  return null;
}

export const parseCropAndDesc = (descriptionStr: string | undefined | null) => {
  if (!descriptionStr) return { crop: "50% 50%", desc: "" };
  if (descriptionStr.startsWith("crop:")) {
    const parts = descriptionStr.split(";desc:");
    const crop = parts[0].replace("crop:", "");
    const desc = parts[1] || "";
    return { crop, desc };
  }
  return { crop: "50% 50%", desc: descriptionStr };
};

export const serializeCropAndDesc = (crop: string, desc: string) => {
  return `crop:${crop};desc:${desc}`;
};

export interface CreditVideoItem {
  title?: string;
  url: string;
}

export function parseCreditVideos(rawUrl?: string | null): CreditVideoItem[] {
  if (!rawUrl || typeof rawUrl !== "string") return [];
  const trimmed = rawUrl.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item && typeof item.url === "string" && item.url.trim())
          .map((item) => ({
            title: typeof item.title === "string" ? item.title : "",
            url: item.url.trim(),
          }));
      }
    } catch {
      // Fallback to single plain URL if malformed JSON
    }
  }
  return [{ url: trimmed }];
}

export function serializeCreditVideos(videos: CreditVideoItem[]): string {
  const clean = videos
    .map((v) => ({ title: v.title?.trim() || "", url: v.url.trim() }))
    .filter((v) => v.url);

  if (clean.length === 0) return "";
  if (clean.length === 1 && !clean[0].title) return clean[0].url;
  return JSON.stringify(clean.map((v) => (v.title ? { title: v.title, url: v.url } : { url: v.url })));
}

export function parseVideoSource(item: { url?: string; youtubeId?: string; vimeoId?: string }) {
  let vimeoId = item.vimeoId || "";
  let youtubeId = item.youtubeId || "";
  const url = (item.url || "").trim();
  let type: "YOUTUBE" | "VIMEO" | "VIDEO" | "EXTERNAL" = "VIDEO";

  const ytMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);

  if (ytMatch) {
    youtubeId = ytMatch[1];
    vimeoId = "";
    type = "YOUTUBE";
  } else if (vimeoMatch) {
    vimeoId = vimeoMatch[1];
    youtubeId = "";
    type = "VIMEO";
  } else if (vimeoId) {
    type = "VIMEO";
  } else if (youtubeId) {
    type = "YOUTUBE";
  } else if (url) {
    const isDirectVideo =
      /\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(url) ||
      (url.includes("/storage/v1/object/public/") &&
        !/\.(mp3|wav|ogg|m4a|webp|jpg|jpeg|png|gif|pdf)(\?.*)?$/i.test(url));
    type = isDirectVideo ? "VIDEO" : "EXTERNAL";
  }

  return { type, vimeoId, youtubeId, url, isPlayableInModal: type !== "EXTERNAL" && !!(youtubeId || vimeoId || url) };
}

export interface VoiceSample {
  id: string;
  title_sv: string;
  title_en: string;
  url: string;
}

export function parseVoiceSamples(voiceSettings?: any, fallbackUrl?: string): VoiceSample[] {
  if (voiceSettings && Array.isArray(voiceSettings.samples) && voiceSettings.samples.length > 0) {
    const valid = voiceSettings.samples
      .filter((s: any) => s && typeof s.url === "string" && s.url.trim())
      .map((s: any, idx: number) => ({
        id: s.id || `sample-${idx + 1}`,
        title_sv: s.title_sv || s.title_en || `Röstprov ${idx + 1}`,
        title_en: s.title_en || s.title_sv || `Voice Sample ${idx + 1}`,
        url: s.url.trim(),
      }));
    if (valid.length > 0) return valid;
  }

  const singleUrl = voiceSettings?.sample_url || fallbackUrl;
  if (singleUrl && typeof singleUrl === "string" && singleUrl.trim()) {
    return [
      {
        id: "default-1",
        title_sv: "Röstprov",
        title_en: "Voice Sample",
        url: singleUrl.trim(),
      },
    ];
  }

  return [];
}

export function mapCreditRow(c: any) {
  const credit: any = {
    year: c.year || "—",
    title: c.title || "",
    role: { sv: c.role_sv || "", en: c.role_en || "" },
    type: c.type,
    category: { sv: c.category_sv || "", en: c.category_en || "" },
    network: c.network || "",
    url: c.url || undefined,
    img: c.img || "",
    is_current_production: c.is_current_production,
  };
  if (c.commentary_url) {
    credit.commentary = {
      url: c.commentary_url,
      duration: c.commentary_duration || "0:10",
      svText: c.commentary_sv || "",
      enText: c.commentary_en || "",
    };
  }
  if (c.script_scene) {
    credit.script = {
      scene: c.script_scene,
      dialogue: {
        char: c.script_char || "CHARACTER",
        line: { sv: c.script_line_sv || "", en: c.script_line_en || "" },
      },
    };
  }
  return credit;
}
