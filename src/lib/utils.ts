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
