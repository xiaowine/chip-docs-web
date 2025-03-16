import { createApp } from "vue";
import App from "./App.vue";
import ThemePlugin from "wine-ui/plugins/theme";

const app = createApp(App);
app.use(ThemePlugin, {
  defaultTheme: "light",
  auto: true,
  onThemeChange: (theme) => {
    console.log("主题切换为:", theme);
  },
});

app.mount("#app");
