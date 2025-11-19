import { clsx, type ClassValue } from "clsx";
// https://www.tailwindresources.com/theme/dcastil-tailwind-merge/
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
