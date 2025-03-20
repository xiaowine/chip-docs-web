<template>
  <div class="file-preview-container">
    <div v-if="false" class="file-preview-loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="file-preview-error">
      <p>{{ error }}</p>
    </div>

    <!-- 图片预览 -->
    <div v-else-if="fileType === 'image'" class="file-preview-image">
      <img :src="fileUrl" :alt="filename" />
    </div>

    <!-- PDF预览 -->
    <div v-else-if="fileType === 'pdf'" class="file-preview-pdf">
      <PdfViewer :url="fileUrl" />
    </div>

    <!-- Markdown预览 -->
    <div v-else-if="fileType === 'markdown'" class="file-preview-markdown">
      <MarkdownViewer :url="fileUrl" />
    </div>

    <!-- 不支持的文件类型 -->
    <div v-else class="file-preview-unsupported">
      <p>不支持预览此类型的文件</p>
      <p>文件类型: {{ fileExtension || "未知" }}</p>
      <button class="action-button download-btn" @click="handleDownload">
        下载文件
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import MarkdownViewer from "../MarkdownViewer/MarkdownViewer.vue";
import PdfViewer from "../PdfViewer/PdfViewer.vue";

interface Props {
  filePath?: string;
  filename?: string;
}

const props = withDefaults(defineProps<Props>(), {
  filePath: "",
  filename: "文件预览",
});

const emit = defineEmits<{
  (e: "download", path: string): void;
  (e: "loaded"): void;
  (e: "error", message: string): void;
}>();

const error = ref<string | null>(null);

// 提取文件扩展名
const fileExtension = computed(() => {
  if (!props.filePath) return null;
  const match = props.filePath.toLowerCase().match(/\.([^.]+)$/);
  return match ? match[1] : null;
});

// 判断文件类型
const fileType = computed(() => {
  const ext = fileExtension.value;
  if (!ext) return null;

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return "image";
  if (["mp4", "webm", "ogg", "mov"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (ext === "md") return "markdown";

  return null;
});

// 构建文件URL
const fileUrl = computed(() => {
  if (!props.filePath) return "";

  // 如果是完整URL，直接返回
  if (props.filePath.startsWith("http")) {
    return props.filePath;
  }

  // 否则构建相对URL
  return `https://xiaowine.github.io/chip-docs/${props.filePath}`;
});

// // 构建PDF查看器URL
// const pdfViewerUrl = computed(() => {
//   if (fileType.value === "pdf") {
//     // 使用PDF.js或浏览器内置PDF查看器
//     return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
//       fileUrl.value
//     )}`;
//   }
//   return "";
// });

// 下载当前文件
const handleDownload = () => {
  if (props.filePath) {
    emit("download", props.filePath);
  }
};
</script>

<style lang="scss" scoped>
.file-preview {
  &-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
  }

  &-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .loading-spinner {
      border: 5px solid rgba(var(--w-primary-color-rgb), 0.2);
      border-radius: 50%;
      border-top: 5px solid var(--w-primary-color);
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
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

  &-error {
    color: var(--w-error-color);
    text-align: center;
  }

  &-image {
    max-width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }
  }

  &-video {
    max-width: 100%;
    max-height: 100%;

    video {
      max-width: 100%;
      max-height: 70vh;
    }
  }

  &-pdf {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &-markdown {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0;
    box-sizing: border-box;
  }

  &-unsupported {
    text-align: center;
    padding: 40px;

    p {
      margin-bottom: 20px;
    }
  }
}
</style>
