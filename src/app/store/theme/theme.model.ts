export type ThemeName = 'purple' | 'green' | 'blue' | 'orange' | 'rose';

export interface Theme {
  name: ThemeName;
  label: string;
  accent: string;
}

export const THEMES: Theme[] = [
  { name: 'purple', label: 'Purple', accent: '#7c6aff' },
  { name: 'green', label: 'Green', accent: '#22c55e' },
  { name: 'blue', label: 'Blue', accent: '#3b82f6' },
  { name: 'orange', label: 'Orange', accent: '#f97316' },
  { name: 'rose', label: 'Rose', accent: '#f43f5e' },
];

export const THEME_NAMES: ThemeName[] = THEMES.map((t) => t.name);
