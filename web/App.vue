<template>
  <div class="app-container custom-scrollbar">
    <Topbar
      v-model="isTopbarMenuOpen"
      :logo="toplogo"
      title="Wine UI"
      nav-position="right"
      :items="menuItems"
      :shadow="true"
      :fixed="true"
      @before-open="handleBeforeOpen"
      @before-close="handleBeforeClose"
      @opened="handleOpened"
      @closed="handleClosed"
      @before-select="handleBeforeSelect"
      @select="handleSelect"
      @selected="handleSelected"
    >
      <template #right>
        <ThemeSwitch
          :theme="themeContext?.theme.value ?? 'light'"
          @toggleThemeEvent="toggleTheme"
        />
      </template>
    </Topbar>
    <div class="main-content">
      <div class="container">
        <h1>Wine UI 组件库示例</h1>
      </div>
    </div>
    <RoundCard class="card-example shadow-box">
      <div class="demo-section">
        <h2>内容居中</h2>
        <button class="demo-button" @click="showCenteredDialog = true">
          打开居中内容对话框
        </button>
        <Dialog
          v-model="showCenteredDialog"
          title="内容居中对话框"
          :center="true"
          @confirm="() => console.log('点击确定')"
          @cancel="() => console.log('点击取消')"
          @close="() => console.log('点击关闭')"
        >
          <p>这个对话框的内容是居中的</p>
          <p>标题和内容都会水平居中对齐</p>
        </Dialog>
      </div>
      <div class="demo-section">
        <h2>内容不居中</h2>
        <button class="demo-button" @click="showDialog = true">
          打开居中内容对话框
        </button>
        <Dialog
          v-model="showDialog"
          title="内容不居中对话框"
          @confirm="() => console.log('点击确定')"
          @cancel="() => console.log('点击取消')"
          @close="() => console.log('点击关闭')"
        >
          <p>这个对话框的内容是不居中的</p>
          <p>标题和内容都不会水平居中对齐</p>
        </Dialog>
      </div>
      <div class="demo-section">
        <h2>插槽替换</h2>
        <button class="demo-button" @click="showSlotDialog = true">
          打开居中内容对话框
        </button>
        <Dialog
          v-model="showSlotDialog"
          title="插槽替换"
          @confirm="() => console.log('点击确定')"
          @cancel="() => console.log('点击取消')"
          @close="() => console.log('点击关闭')"
        >
          <template #footer>footer插槽</template>
          <p>这是一段占位内容</p>
          <p>这是插槽替换的副本内容</p>
        </Dialog>
      </div>
    </RoundCard>

    <RoundCard class="card-example shadow-box">
      <h3>卡片组件RoundCard示例</h3>
      <div class="card-example-container custom-scrollbar">
        <RoundCard class="image-card shadow-box" :radius="0">
          <img src="https://api.xsot.cn/bing?jump=true" alt="示例图片" />
        </RoundCard>
        <RoundCard
          v-for="i in 30"
          :key="i"
          class="image-card shadow-box"
          :radius="i * 3"
        >
          {{ i * 3 }}
          <img src="https://api.xsot.cn/bing?jump=true" alt="示例图片" />
        </RoundCard>
        <RoundCard class="image-card shadow-box">
          <img src="https://api.xsot.cn/bing?jump=true" alt="示例图片" />
        </RoundCard>
      </div>
    </RoundCard>
  </div>
  <ThemeTransition
    ref="themeTransitionRef"
    @transition-complete="onTransitionComplete"
  />
  <FpsMonitor position="bottomRight" marginRight="20px" marginBottom="10px" />
</template>

<script setup lang="ts">
import toplogo from "/vue.svg";
import { ref, inject } from "vue";
import {
  Topbar,
  ThemeTransition,
  ThemeSwitch,
  FpsMonitor,
  RoundCard,
  Dialog,
  type MenuItem,
} from "wine-ui";
import { debounce } from "wine-ui/utils";
import type { MenuEventType } from "wine-ui/components/Topbar/types";
import type { ThemeContext } from "wine-ui/plugins/theme/types";

const isTopbarMenuOpen = ref(false);

const themeContext = inject<ThemeContext>("theme");

const themeTransitionRef = ref();

const showCenteredDialog = ref(false);
const showDialog = ref(false);
const showSlotDialog = ref(false);

let pendingThemeChange = false;

const menuItems: MenuItem[] = [
  {
    key: "home",
    label: "首页",
    link: "#",
    onClick: () => console.log("点击首页"),
  },
  {
    key: "products",
    label: "产品",
    link: "#products",
  },
  {
    key: "about",
    label: "关于",
    link: "#about",
  },
];

const handleSelect = (item: MenuItem) => {
  console.log("选中菜单项:", item.label);
};

const handleBeforeOpen = () => {
  console.log("即将打开菜单");
  return true;
};

const handleBeforeClose = (type: MenuEventType) => {
  console.log("即将关闭菜单", type);
  return true;
};

const handleOpened = () => {
  console.log("菜单已打开");
};

const handleClosed = (type: MenuEventType) => {
  console.log("菜单已关闭", type);
  isTopbarMenuOpen.value = false;
};

const handleBeforeSelect = (item: MenuItem) => {
  console.log("即将选择菜单项:", item.label);
  return true;
};

const handleSelected = (item: MenuItem) => {
  console.log("菜单项已选择:", item.label);
};

const onTransitionComplete = () => {
  if (pendingThemeChange) {
    console.log("主题切换动画完成");
    themeContext?.toggleTheme();
    pendingThemeChange = false;
  }
};

// 使用防抖包装主题切换函数
const toggleTheme = debounce(async () => {
  if (pendingThemeChange || themeTransitionRef.value?.isAnimating) return;

  const nextTheme = themeContext?.theme.value === "light" ? "dark" : "light";
  const nextColor = getComputedStyle(document.documentElement)
    .getPropertyValue(
      nextTheme === "light" ? "--w-bg-color-light" : "--w-bg-color-dark"
    )
    .trim();

  pendingThemeChange = await themeTransitionRef.value?.trigger(nextColor);
  console.log("开始主题切换动画", pendingThemeChange);
}, 300);
</script>

<style lang="scss">
@use "@theme/theme.scss" as *;

.app-container {
  min-height: 100vh;
  background-color: var(--w-bg-color);
  color: var(--w-text-color);
  display: flex;
  flex-direction: column;
}

.main-content {
  padding-top: var(--w-topbar-height, 60px);
  flex: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @include mobile {
    padding: 15px;
  }
}

.card-example {
  padding: 20px;
  text-align: center;
  margin: 30px;

  &-container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 0;
  }
}

.image-card {
  width: 200px;
  height: 166px;
}
</style>
