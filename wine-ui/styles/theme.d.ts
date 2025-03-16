export type Theme = "light" | "dark";

export interface ThemeVars {
  "--w-primary-color": string;
  "--w-primary-color-hover": string;
  "--w-primary-color-active": string;
  "--w-text-color": string;
  "--w-text-color-secondary": string;
  "--w-text-color-disabled": string;
  "--w-bg-color": string;
  "--w-bg-color-hover": string;
  "--w-border-color": string;
  "--w-shadow": string;
}

export interface ThemeContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
