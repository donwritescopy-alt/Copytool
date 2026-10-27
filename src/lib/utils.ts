import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge our custom token names so e.g. `text-label` isn't treated as a colour.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["caption", "label", "body-sm", "body", "title-sm", "title", "display"],
      radius: ["tight", "inner", "field", "panel", "card", "pill"],
      shadow: ["card", "raised", "glow-accent"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
