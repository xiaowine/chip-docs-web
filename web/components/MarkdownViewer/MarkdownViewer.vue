<template>
  <div class="markdown-viewer custom-scrollbar" :class="{ loading: isLoading }">
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="error" class="error-container">
      <div class="error-icon">!</div>
      <span>{{ error }}</span>
      <button class="retry-button" @click="fetchMarkdown">重试</button>
    </div>
    <div v-else>
      <div class="markdown-header">
        <h1 class="document-title">{{ documentTitle }}</h1>
        <div class="document-meta" v-if="lastUpdated">
          更新于 {{ lastUpdated }}
        </div>
      </div>
      <div class="markdown-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { marked } from "marked";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  refresh: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref(true);
const content = ref("");
const renderedContent = ref("");
const error = ref<string | null>(null);
const lastUpdated = ref<string | null>(null);

// 从Markdown内容中提取文档标题
const documentTitle = computed(() => {
  const match = content.value.match(/^#\s+(.*?)$/m);
  if (match && match[1]) {
    return match[1];
  }

  // 如果没有找到h1标签，尝试从URL中提取文件名
  const urlParts = props.url.split("/");
  const fileName = urlParts[urlParts.length - 1].replace(".md", "");
  return fileName === "README" ? "项目介绍" : fileName;
});

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true,
});

const fetchMarkdown = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await fetch(props.url);
    if (!response.ok) {
      throw new Error(`获取Markdown内容失败: ${response.statusText}`);
    }

    const text = await response.text();
    content.value = text;
    renderedContent.value = await marked(text);

    // 设置最后更新时间
    const lastModified = response.headers.get("last-modified");
    if (lastModified) {
      const date = new Date(lastModified);
      lastUpdated.value = date.toLocaleString("zh-CN");
    }
  } catch (err) {
    console.error("获取Markdown失败:", err);
    error.value = err instanceof Error ? err.message : "获取文档失败";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => props.url,
  () => {
    fetchMarkdown();
  }
);

watch(
  () => props.refresh,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchMarkdown();
    }
  }
);

onMounted(() => {
  fetchMarkdown();
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
