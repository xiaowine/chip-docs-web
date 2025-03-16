import { ref, watch } from "vue";
import type { Theme } from "../styles/theme";

const THEME_KEY = "wine-ui-theme";

// 创建主题状态
export const currentTheme = ref<Theme>(
  (localStorage.getItem(THEME_KEY) as Theme) || "light"
);

// 系统主题匹配器
const systemThemeMatcher = window.matchMedia("(prefers-color-scheme: dark)");

// 更新主题
const updateTheme = (theme: Theme) => {
  currentTheme.value = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
};

// 监听系统主题变化
const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
  const theme: Theme = e.matches ? "dark" : "light";
  updateTheme(theme);
};

// 切换主题
export const toggleTheme = () => {
  const theme: Theme = currentTheme.value === "light" ? "dark" : "light";
  updateTheme(theme);
};

// 设置主题
export const setTheme = (theme: Theme) => {
  updateTheme(theme);
};

// 启用自动主题
export const enableAutoTheme = () => {
  handleSystemThemeChange(systemThemeMatcher);
  systemThemeMatcher.addEventListener("change", handleSystemThemeChange);
};

// 禁用自动主题
export const disableAutoTheme = () => {
  systemThemeMatcher.removeEventListener("change", handleSystemThemeChange);
};

// 组合式函数
export const useTheme = () => {
  // 初始化时设置主题
  watch(
    currentTheme,
    (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
    },
    { immediate: true }
  );

  return {
    theme: currentTheme,
    toggleTheme,
    setTheme,
    enableAutoTheme,
    disableAutoTheme,
  };
};
