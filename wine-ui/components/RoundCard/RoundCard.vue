<template>
  <div
    class="w-round-card"
    :style="{
      ...(radius !== undefined && {
        'border-radius': typeof radius === 'number' ? `${radius}px` : radius,
      }),
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { type RoundCardProps } from "./types";
defineProps<RoundCardProps>();
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
