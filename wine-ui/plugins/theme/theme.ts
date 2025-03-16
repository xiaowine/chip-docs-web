import { ref, computed } from "vue";
import type { Theme, ThemeContext, ThemeOptions } from "./types";

export function createTheme(options: ThemeOptions = {}): ThemeContext {
  const THEME_KEY = options.storageKey || "wine-ui-theme";
  const AUTO_MODE_KEY = `${THEME_KEY}-auto`;
  const defaultTheme = options.defaultTheme || "light";

  const isAuto = ref(localStorage.getItem(AUTO_MODE_KEY) === "true");
  const currentTheme = ref<Theme>(
    isAuto.value
      ? (options.defaultTheme as Theme)
      : (localStorage.getItem(THEME_KEY) as Theme) || defaultTheme
  );

  document.documentElement.setAttribute("data-theme", currentTheme.value);

  const systemThemeMatcher = window.matchMedia("(prefers-color-scheme: dark)");

  const updateTheme = (theme: Theme, saveToStorage = false) => {
    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (saveToStorage) {
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(AUTO_MODE_KEY, "false");
      isAuto.value = false;
    }
    options.onThemeChange?.(theme);
  };

  const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (isAuto.value) {
      const theme: Theme = e.matches ? "dark" : "light";
      updateTheme(theme, false);
    }
  };

  return {
    theme: computed(() => currentTheme.value),
    isAutoTheme: computed(() => isAuto.value),

    setTheme(theme: Theme) {
      updateTheme(theme, true);
    },

    toggleTheme() {
      const theme: Theme = currentTheme.value === "light" ? "dark" : "light";
      updateTheme(theme, true);
    },

    enableAutoTheme() {
      isAuto.value = true;
      localStorage.setItem(AUTO_MODE_KEY, "true");
      handleSystemThemeChange(systemThemeMatcher);
      systemThemeMatcher.addEventListener("change", handleSystemThemeChange);
    },

    disableAutoTheme() {
      isAuto.value = false;
      localStorage.setItem(AUTO_MODE_KEY, "false");
      systemThemeMatcher.removeEventListener("change", handleSystemThemeChange);
    },
  };
}
