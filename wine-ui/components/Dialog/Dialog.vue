<template>
  <Teleport to="body">
    <Transition name="w-dialog-fade">
      <div v-if="modelValue" class="w-dialog-mask" @click="handleMaskClick">
        <div class="w-dialog" :style="dialogStyle" @click.stop>
          <div class="w-dialog-header" v-if="title || $slots.header">
            <slot name="header">
              <h3
                class="w-dialog-title"
                :class="{ 'w-dialog-title--center': center }"
              >
                {{ title }}
              </h3>
            </slot>
            <button v-if="closable" class="w-dialog-close" @click="handleClose">
              <span class="w-dialog-close-icon">×</span>
            </button>
          </div>

          <div
            class="w-dialog-body"
            :class="{ 'w-dialog-body--center': center }"
          >
            <slot></slot>
          </div>

          <div class="w-dialog-footer" v-if="$slots.footer || showFooter">
            <slot name="footer">
              <button
                v-if="showCancel"
                class="w-dialog-button w-dialog-cancel"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                class="w-dialog-button w-dialog-confirm"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { DialogEmits, DialogProps } from "./types";
const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: false,
  title: "",
  width: 500,
  closable: true,
  closeOnClickMask: true,
  center: false,
  showFooter: true,
  showCancel: true,
  confirmText: "确定",
  cancelText: "取消",
});

const emit = defineEmits<DialogEmits>();

const dialogStyle = computed(() => {
  const style: Record<string, string> = {};
  if (typeof props.width === "number") {
    style.width = `${props.width}px`;
  } else {
    style.width = props.width;
  }
  return style;
});

const handleClose = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleMaskClick = () => {
  if (props.closeOnClickMask) {
    handleClose();
  }
};

const handleConfirm = () => {
  emit("confirm");
  handleClose();
};

const handleCancel = () => {
  emit("cancel");
  handleClose();
};
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
