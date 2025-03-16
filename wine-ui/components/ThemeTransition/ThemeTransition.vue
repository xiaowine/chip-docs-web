<template>
  <Teleport defer to="body">
    <div
      class="theme-transition"
      :class="{ 'theme-transition--active': active }"
      :style="{
        '--next-theme-color': nextThemeColor,
      }"
      @transitionend="onTransitionEnd"
    ></div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

const active = ref(false);
const nextThemeColor = ref("");
const isAnimating = ref(false);

const emit = defineEmits<{
  (e: "transitionComplete"): void;
}>();

const onTransitionEnd = (e: TransitionEvent) => {
  if (e.propertyName === "transform") {
    active.value = false;
    nextThemeColor.value = "";
    isAnimating.value = false;
    emit("transitionComplete");
  }
};

const trigger = (nextColor: string) => {
  if (isAnimating.value) return false;

  isAnimating.value = true;
  nextThemeColor.value = nextColor;

  return new Promise<boolean>((resolve) => {
    requestAnimationFrame(() => {
      active.value = true;
      resolve(true);
    });
  });
};

defineExpose({
  trigger,
  isAnimating,
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
