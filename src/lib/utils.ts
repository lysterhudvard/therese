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
