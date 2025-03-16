import type { ComputedRef } from "vue";

export type Theme = "light" | "dark";

export interface ThemeOptions {
  defaultTheme?: Theme;
  storageKey?: string;
  auto?: boolean;
  onThemeChange?: (theme: Theme) => void;
}

export interface ThemeContext {
  theme: ComputedRef<Theme>;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  enableAutoTheme: () => void;
  disableAutoTheme: () => void;
  isAutoTheme: ComputedRef<boolean>;
}

// declare module "@vue/runtime-core" {
//   interface ComponentCustomProperties {
//     $theme: ThemeContext;
//   }
// }
