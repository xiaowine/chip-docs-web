<template>
  <div class="tree-node" :class="{ 'tree-node--expanded': node.expanded }">
    <div class="tree-node_content" @click="handleClick">
      <span class="tree-node_icon">
        <i v-if="isDirectory" class="tree-node_folder-icon" />
        <i v-else class="tree-node_file-icon" />
      </span>
      <span class="tree-node_label">{{ node.name }}</span>
    </div>
    <div v-if="isDirectory && node.expanded" class="tree-node_children">
      <TreeNode
        v-for="child in node.children"
        :key="child.key"
        :node="child"
        @select="handleSelect"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TreeNode } from "../types";

const props = defineProps<{
  node: TreeNode;
}>();

const emit = defineEmits<{
  (e: "select", node: TreeNode): void;
  (e: "toggle", node: TreeNode): void;
}>();

const isDirectory = computed(() => props.node.type === "directory");

const handleClick = () => {
  if (isDirectory.value) {
    emit("toggle", { ...props.node, expanded: !props.node.expanded });
  } else {
    emit("select", props.node);
  }
};

const handleSelect = (node: TreeNode) => emit("select", node);
const handleToggle = (node: TreeNode) => emit("toggle", node);
</script>

<style lang="scss" scoped>
@use "@theme/theme.scss" as *;
@use "../index.scss";
</style>
