export interface SmileyFeatures {
  mouth: string;
  eyes: string;
  color: string;
}

export interface SmileyFaceProps extends SmileyFeatures {
  size?: number;
  className?: string;
}

// Predefined options for smiley features
export const MOUTH_OPTIONS = {
  happy: 'M 30 45 Q 50 65 70 45',
  sad: 'M 30 55 Q 50 35 70 55',
  neutral: 'M 35 50 L 65 50',
  big_smile: 'M 25 45 Q 50 70 75 45',
  wink: 'M 30 45 Q 50 60 70 45',
} as const;

export const EYE_OPTIONS = {
  normal: { left: { cx: 35, cy: 35, r: 3 }, right: { cx: 65, cy: 35, r: 3 } },
  closed: { left: 'M 32 35 L 38 35', right: 'M 62 35 L 68 35' },
  wink: { left: 'M 32 35 L 38 35', right: { cx: 65, cy: 35, r: 3 } },
  big: { left: { cx: 35, cy: 35, r: 4 }, right: { cx: 65, cy: 35, r: 4 } },
  dots: { left: { cx: 35, cy: 35, r: 2 }, right: { cx: 65, cy: 35, r: 2 } },
} as const;

export const COLOR_OPTIONS = [
  '#FFD700', // Gold
  '#FF69B4', // Hot Pink
  '#87CEEB', // Sky Blue
  '#98FB98', // Pale Green
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#FFB6C1', // Light Pink
  '#AFEEEE', // Pale Turquoise
] as const;

export type MouthType = keyof typeof MOUTH_OPTIONS;
export type EyeType = keyof typeof EYE_OPTIONS;
export type ColorType = (typeof COLOR_OPTIONS)[number];
