<template>
  <button class="theme-switch" @click="handleThemeChange">
    <div class="theme-switch-container">
      <TransitionGroup name="theme-transition">
        <span class="theme-switch-icon" :key="'icon-' + theme">
          {{ theme === "light" ? "🌞" : "🌙" }}
        </span>
        <span class="theme-switch-text" :key="'text-' + theme">
          {{ theme === "light" ? "暗色" : "亮色" }}
        </span>
      </TransitionGroup>
    </div>
  </button>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{ theme: string }>(), {
  theme: "light",
});
const emit = defineEmits<{
  (e: "toggleThemeEvent"): void;
}>();

const handleThemeChange = () => {
  emit("toggleThemeEvent");
};
</script>

<style scoped lang="scss">
@use "./index.scss";
</style>
