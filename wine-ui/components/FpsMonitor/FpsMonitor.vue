<template>
  <Teleport defer to="body">
    <div class="fps-monitor" v-show="props.show" :style="monitorStyle">
      FPS: {{ props.show ? currentFps : 0 }}
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { FpsProps } from "./types";

const props = withDefaults(defineProps<FpsProps>(), {
  position: "bottomRight",
  show: true,
  interval: 1000,
  marginTop: 0,
  marginBottom: 10,
  marginLeft: 0,
  marginRight: 20,
});
const monitorStyle = computed(() => {
  const style: Record<string, string> = {};

  switch (props.position) {
    case "topLeft":
      style.top =
        typeof props.marginTop === "number"
          ? `${props.marginTop}px`
          : props.marginTop;
      style.left =
        typeof props.marginLeft === "number"
          ? `${props.marginLeft}px`
          : props.marginLeft;
      break;
    case "topRight":
      style.top =
        typeof props.marginTop === "number"
          ? `${props.marginTop}px`
          : props.marginTop;
      style.right =
        typeof props.marginRight === "number"
          ? `${props.marginRight}px`
          : props.marginRight;
      break;
    case "bottomLeft":
      style.bottom =
        typeof props.marginBottom === "number"
          ? `${props.marginBottom}px`
          : props.marginBottom;
      style.left =
        typeof props.marginLeft === "number"
          ? `${props.marginLeft}px`
          : props.marginLeft;
      break;
    case "bottomRight":
      style.bottom =
        typeof props.marginBottom === "number"
          ? `${props.marginBottom}px`
          : props.marginBottom;
      style.right =
        typeof props.marginRight === "number"
          ? `${props.marginRight}px`
          : props.marginRight;
      break;
  }

  return style;
});

const currentFps = ref(0);
let frameCount = 0;
let previousTimestamp = Date.now();
let animationFrameHandle: number | null = null;

const requestNextFrame =
  window.requestAnimationFrame ||
  ((callback) => window.setTimeout(callback, 1000 / 60));

const updateFps = () => {
  if (!props.show) {
    return;
  }

  const currentTimestamp = Date.now();
  frameCount++;

  if (currentTimestamp > props.interval + previousTimestamp) {
    currentFps.value = Math.round(
      (frameCount * 1000) / (currentTimestamp - previousTimestamp)
    );
    frameCount = 0;
    previousTimestamp = currentTimestamp;
  }

  animationFrameHandle = requestNextFrame(updateFps);
};

const startMonitoring = () => {
  if (!animationFrameHandle) {
    frameCount = 0;
    previousTimestamp = Date.now();
    updateFps();
  }
};

const stopMonitoring = () => {
  if (animationFrameHandle) {
    cancelAnimationFrame(animationFrameHandle);
    animationFrameHandle = null;
    currentFps.value = 0;
  }
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.show) {
    startMonitoring();
  }
});

onUnmounted(() => {
  stopMonitoring();
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
