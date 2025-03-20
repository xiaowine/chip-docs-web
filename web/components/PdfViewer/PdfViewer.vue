<template>
  <div class="pdf-viewer">
    <div class="pdf-viewer_loading" :class="{ active: loading }">
      <div class="loading-spinner"></div>
      <p>PDF加载中...</p>
    </div>

    <div class="pdf-viewer_error" :class="{ active: error }">
      <p>{{ error }}</p>
    </div>

    <div class="pdf-viewer_content" :class="{ hidden: loading || error }">
      <div class="pdf-viewer_controls">
        <div class="pdf-viewer_controls-group">
          <button
            class="pdf-control-button"
            @click="prevPage"
            :disabled="currentPage <= 1"
            aria-label="上一页"
          >
            <span class="control-icon">◀</span>
            <span class="control-text">上一页</span>
          </button>

          <span class="pdf-page-info">
            {{ currentPage }} / {{ pageCount || "?" }}
          </span>

          <button
            class="pdf-control-button"
            @click="nextPage"
            :disabled="currentPage >= pageCount"
            aria-label="下一页"
          >
            <span class="control-text">下一页</span>
            <span class="control-icon">▶</span>
          </button>
        </div>

        <div class="pdf-viewer_controls-group">
          <button
            class="pdf-control-button"
            @click="zoomOut"
            :disabled="scale <= 0.5"
            aria-label="缩小"
          >
            <span class="control-icon">－</span>
          </button>

          <span class="pdf-zoom-info">{{ Math.round(scale * 100) }}%</span>

          <button
            class="pdf-control-button"
            @click="zoomIn"
            :disabled="scale >= 3.0"
            aria-label="放大"
          >
            <span class="control-icon">＋</span>
          </button>
        </div>
      </div>

      <div class="pdf-viewer_container" ref="canvasContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

// 设置 PDF.js workerSrc (在生产环境中应指向实际的worker路径)
// 根据环境决定worker路径
const pdfjsWorker = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
);
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker.toString();

interface Props {
  url: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "loaded"): void;
  (e: "error", message: string): void;
}>();

// 状态变量
const loading = ref(true);
const error = ref<string | null>(null);
// 使用普通变量而不是响应式引用存储 PDF 文档对象
let pdfDocument: PDFDocumentProxy | null = null;
const currentPage = ref(1);
const pageCount = ref(0);
const scale = ref(1.0);
const canvasContainer = ref<HTMLElement | null>(null);
const currentPageRendering = ref(false);
const pageNumPending = ref<number | null>(null);

// 加载PDF文档
const loadPdf = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 使用fetch获取PDF文件
    const response = await fetch(props.url);
    if (!response.ok) {
      throw new Error(`获取PDF失败: ${response.statusText}`);
    }

    const pdfData = await response.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: pdfData }).promise;

    // 存储到普通变量中
    pdfDocument = pdf;
    pageCount.value = pdf.numPages;
    currentPage.value = 1;

    // 加载第一页
    renderPage(currentPage.value);
  } catch (err) {
    error.value = `PDF文件加载失败: ${
      err instanceof Error ? err.message : String(err)
    }`;
    emit("error", error.value);
    loading.value = false; // 确保加载状态被重置
  }
};

// 渲染页面
const renderPage = async (pageNum: number) => {
  currentPageRendering.value = true;

  try {
    if (!pdfDocument) {
      throw new Error("PDF文档未加载");
    }

    // 直接使用普通变量，而不是响应式引用
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: scale.value });

    // 清除旧的画布
    if (canvasContainer.value) {
      canvasContainer.value.innerHTML = "";
    }

    // 创建新的画布
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("无法创建Canvas上下文");
    }

    // 设置画布尺寸
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 添加样式使其在容器中正确显示和滚动
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    // 将画布添加到容器中
    canvasContainer.value?.appendChild(canvas);

    // 渲染PDF页面
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    currentPageRendering.value = false;

    // 检查是否有待渲染的页面
    if (pageNumPending.value !== null) {
      renderPage(pageNumPending.value);
      pageNumPending.value = null;
    } else {
      loading.value = false;
      emit("loaded");
    }
  } catch (err) {
    currentPageRendering.value = false;
    error.value = `渲染页面失败: ${
      err instanceof Error ? err.message : String(err)
    }`;
    loading.value = false;
    emit("error", error.value);
  }
};

// 队列化渲染，防止快速翻页时渲染冲突
const queueRenderPage = (pageNum: number) => {
  if (currentPageRendering.value) {
    pageNumPending.value = pageNum;
  } else {
    renderPage(pageNum);
  }
};

// 翻页控制
const prevPage = () => {
  if (currentPage.value <= 1) return;
  currentPage.value--;
  queueRenderPage(currentPage.value);
};

const nextPage = () => {
  if (currentPage.value >= pageCount.value) return;
  currentPage.value++;
  queueRenderPage(currentPage.value);
};

// 缩放控制
const zoomIn = () => {
  if (scale.value >= 3.0) return; // 添加最大缩放限制
  scale.value += 0.25;
  queueRenderPage(currentPage.value);
};

const zoomOut = () => {
  if (scale.value <= 0.5) return; // 最小缩放限制
  scale.value -= 0.25;
  queueRenderPage(currentPage.value);
};

// 组件挂载时加载PDF
onMounted(() => {
  if (props.url) {
    loadPdf();
  }
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (pdfDocument) {
    pdfDocument.destroy();
    pdfDocument = null;
  }
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
