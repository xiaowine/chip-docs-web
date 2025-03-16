<template>
  <div class="file-tree">
    <div v-if="props.searchable" class="file-tree_search">
      <div class="file-tree_search-wrapper">
        <i class="file-tree_search-icon"></i>
        <input
          type="text"
          v-model="searchText"
          placeholder="搜索文件..."
          class="file-tree_search-input"
        />
        <i
          v-show="searchText"
          class="file-tree_search-clear"
          @click="clearSearch"
        ></i>
      </div>
      <div class="file-tree_actions">
        <button
          class="file-tree_refresh-btn"
          @click="handleRefresh"
          :disabled="props.loading"
          :class="{ 'file-tree_refresh-btn--loading': props.loading }"
        >
          <i class="file-tree_refresh-icon"></i>
        </button>
      </div>
    </div>
    <div class="file-tree_content custom-scrollbar">
      <!-- 骨架屏占位 -->
      <div v-if="props.loading" class="file-tree_skeleton">
        <div
          v-for="i in 5"
          :key="i"
          class="file-tree_skeleton-item"
          :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
        >
          <div class="file-tree_skeleton-icon"></div>
          <div class="file-tree_skeleton-line"></div>
        </div>
        <div
          v-for="i in 3"
          :key="i + 5"
          class="file-tree_skeleton-item file-tree_skeleton-item--indented"
          :style="{ animationDelay: `${(i + 4) * 0.1}s` }"
        >
          <div class="file-tree_skeleton-icon"></div>
          <div class="file-tree_skeleton-line"></div>
        </div>
      </div>
      <!-- 实际内容 -->
      <TreeNode
        v-else
        v-for="node in filteredNodes"
        :key="node.key"
        :node="node"
        @select="handleSelect"
        @toggle="handleToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TreeNode from "./components/TreeNode.vue";
import type {
  TreeNode as ITreeNode,
  FileTreeProps,
  FileTreeEmits,
} from "./types";

const props = withDefaults(defineProps<FileTreeProps>(), {
  searchable: true,
  defaultExpanded: false,
  loading: false,
});

const emit = defineEmits<FileTreeEmits>();
const searchText = ref("");

const filteredNodes = computed(() => {
  if (!searchText.value) return props.data;
  return filterNodes(props.data, searchText.value.toLowerCase());
});

function filterNodes(nodes: ITreeNode[], search: string): ITreeNode[] {
  return nodes
    .filter((node) => {
      const matches = node.name.toLowerCase().includes(search);
      if (node.children) {
        const filteredChildren = filterNodes(node.children, search);
        if (filteredChildren.length) {
          return true;
        }
      }
      return matches;
    })
    .map((node) => ({
      ...node,
      children: node.children ? filterNodes(node.children, search) : undefined,
      expanded: search ? true : node.expanded,
    }));
}

const handleSelect = (node: ITreeNode) => {
  emit("select", node);
};

const handleToggle = (node: ITreeNode) => {
  emit("toggle", node);
};

const clearSearch = () => {
  searchText.value = "";
};

const handleRefresh = () => {
  emit("refresh");
};
</script>

<style lang="scss">
@use "@theme/theme.scss" as *;
@use "./index.scss";
</style>
