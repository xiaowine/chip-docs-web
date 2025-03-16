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
  // 尝试从内容的第一个h1标签提取标题
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
.markdown-viewer {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 20px;
  color: var(--w-text-color);

  &.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }

  .markdown-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--w-border-color);

    .document-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: var(--w-text-color);
    }

    .document-meta {
      margin-top: 8px;
      font-size: 14px;
      color: var(--w-text-color-secondary);
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--w-text-color-secondary);

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: var(--w-primary-color);
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--w-error-color);

    .error-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--w-error-color);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .retry-button {
      margin-top: 16px;
      padding: 8px 16px;
      background-color: var(--w-primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;

      &:hover {
        opacity: 0.9;
      }
    }
  }

  .markdown-content {
    line-height: 1.6;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: var(--w-text-color);
    }

    p {
      margin: 1em 0;
    }

    code {
      background-color: var(--w-code-bg-color, rgba(0, 0, 0, 0.05));
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }

    pre code {
      display: block;
      padding: 1em;
      overflow: auto;
    }

    blockquote {
      border-left: 4px solid var(--w-primary-color);
      padding-left: 1em;
      margin-left: 0;
      color: var(--w-text-color-secondary);
    }

    img {
      max-width: 100%;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;

      th,
      td {
        border: 1px solid var(--w-border-color);
        padding: 8px;
      }

      th {
        background-color: var(--w-bg-color-secondary);
      }
    }

    a {
      color: var(--w-primary-color);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    ul,
    ol {
      padding-left: 2em;
      margin: 1em 0;
    }
  }
}

// 适配暗色模式
:deep(.dark) {
  .markdown-content {
    code {
      background-color: var(--w-code-bg-color-dark, rgba(255, 255, 255, 0.1));
    }
  }
}
</style>
