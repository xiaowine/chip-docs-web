import type { App } from "vue";
import { createTheme } from "./theme";
import type { ThemeOptions } from "./types";

export * from "./types";

export default {
  install: (app: App, options: ThemeOptions = {}) => {
    const theme = createTheme(options);

    app.config.globalProperties.$theme = theme;
    app.provide("theme", theme);

    const AUTO_MODE_KEY = `${options.storageKey || "wine-ui-theme"}-auto`;
    const isAutoMode = localStorage.getItem(AUTO_MODE_KEY) === "true";

    if (
      options.auto !== false &&
      (isAutoMode ||
        !localStorage.getItem(options.storageKey || "wine-ui-theme"))
    ) {
      theme.enableAutoTheme();
    }

    app.config.globalProperties.$dispose = () => {
      theme.disableAutoTheme();
    };
  },
};
