<template>
  <div
    class="w-topbar"
    :class="{ 'w-topbar-fixed': fixed }"
    :style="{
      '--w-topbar-shadow': shadow ? 'var(--w-shadow)' : 'none',
    }"
  >
    <div class="w-topbar-content">
      <div class="w-topbar-left">
        <div class="w-logo">
          <img v-if="logo" :src="logo" :alt="title" />
          <span v-if="title" class="w-title">{{ title }}</span>
        </div>
        <NavMenu
          v-if="currentPosition === 'left' && items"
          :items="items"
          position="left"
          :active="modelValue"
          @select="handleItemClick"
        />
        <slot name="left"></slot>
      </div>

      <div class="w-topbar-center">
        <slot name="center"></slot>
        <NavMenu
          v-if="currentPosition === 'center' && items"
          :items="items"
          position="center"
          :active="modelValue"
          @select="handleItemClick"
        />
      </div>

      <div class="w-topbar-right">
        <slot name="right"></slot>
        <NavMenu
          v-if="currentPosition === 'right' && items"
          :items="items"
          position="right"
          :active="modelValue"
          @select="handleItemClick"
        />
        <div
          class="w-menu-toggle"
          :class="{ 'is-active': modelValue }"
          @click="() => toggleMenu(modelValue)"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
  <div
    class="w-nav-overlay"
    :class="{ 'w-nav-overlay-active': modelValue }"
    @click="() => handleClose('overlay')"
  ></div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue";
import type { TopbarProps, TopbarEmits } from "./types";
import { useMenu } from "./composables/useMenu";
import NavMenu from "./components/NavMenu.vue";

const props = defineProps<TopbarProps>();

const emit = defineEmits<TopbarEmits>();
const { handleClose, toggleMenu, handleItemClick } = useMenu(emit);

const currentPosition = computed(() => props.navPosition ?? "center");

// ESC 键关闭处理
onMounted(() => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape" && props.modelValue) {
      handleClose("escape");
    }
  };

  document.addEventListener("keydown", handleEsc);
  onUnmounted(() => {
    document.removeEventListener("keydown", handleEsc);
  });
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
