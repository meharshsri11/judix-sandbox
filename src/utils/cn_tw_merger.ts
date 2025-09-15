import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMergeConfig = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        'text-h1',
        'text-h2',
        'text-h3',
        'text-h4',
        'text-h5',
        'text-h6',
        "text-body-lg",
        "text-body-md",
        "text-body-sm",
        "text-label-lg",
        "text-label-md",
        "text-label-sm",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMergeConfig(clsx(inputs));
}
