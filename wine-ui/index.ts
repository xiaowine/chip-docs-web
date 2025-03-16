import type { App } from "vue";
import Topbar from "./components/Topbar";
import ThemeTransition from "./components/ThemeTransition";
import ThemeSwitch from "./components/ThemeSwitch";
import FpsMonitor from "./components/FpsMonitor";
import RoundCard from "./components/RoundCard";
import Dialog from "./components/Dialog";
import type { MenuItem } from "./components/Topbar/types";
import type { DialogProps } from "./components/Dialog/types";

export { Topbar, ThemeTransition, ThemeSwitch, FpsMonitor, RoundCard, Dialog };
export type { MenuItem, DialogProps };
export * from "./utils";

export default {
  install(app: App) {
    app.component("xTopbar", Topbar);
    app.component("xThemeTransition", ThemeTransition);
    app.component("xThemeSwitch", ThemeSwitch);
    app.component("xFpsMonitor", FpsMonitor);
    app.component("xRoundCard", RoundCard);
    app.component("xDialog", Dialog);
  },
};
