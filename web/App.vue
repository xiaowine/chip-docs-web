<template>
  <div class="app-container custom-scrollbar">
    <Topbar
      v-model="isTopbarMenuOpen"
      :logo="toplogo"
      title="Wine UI"
      nav-position="right"
      :items="menuItems"
      :shadow="true"
      :fixed="true"
    >
      <template #right>
        <ThemeSwitch
          :theme="themeContext?.theme.value ?? 'light'"
          @toggleThemeEvent="toggleTheme"
        />
      </template>
    </Topbar>
    <div class="main-content">
      <div class="container">
        <div class="content-layout">
          <div class="file-tree-container">
            <RoundCard
              style="
                height: 100%;
                border: 2px solid var(--w-border-color) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              "
            >
              <FileTree
                :data="fileTreeData"
                :loading="isFileTreeLoading"
                :error-message="fileTreeErrorMessage"
                @select="handleFileSelect"
                @toggle="handleFileToggle"
                @refresh="handleFileRefresh"
              />
            </RoundCard>
          </div>
          <div class="markdown-container">
            <RoundCard
              style="
                height: 100%;
                border: 2px solid var(--w-border-color) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              "
            >
              <MarkdownViewer :url="markdownUrl" />
            </RoundCard>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ThemeTransition
    ref="themeTransitionRef"
    @transition-complete="onTransitionComplete"
  />
  <FpsMonitor position="bottomRight" marginRight="20px" marginBottom="10px" />

  <Dialog
    v-model="showFileDialog"
    title="文件详情"
    width="500px"
    :show-cancel="false"
    confirm-text="关闭"
  >
    <div v-if="fileDetail">
      <div class="file-detail-item">
        <strong>文件路径:</strong> {{ fileDetail.path }}
      </div>
      <div class="file-detail-item">
        <strong>文件大小:</strong> {{ formatFileSize(fileDetail.size) }}
      </div>
      <div class="file-detail-item">
        <strong>更新时间:</strong> {{ formatDate(fileDetail.modifiedTime) }}
      </div>
      <div class="file-detail-item">
        <strong>文件MD5:</strong> {{ fileDetail.md5 }}
      </div>
      <div class="file-actions">
        <button
          class="action-button download-btn"
          @click="handleDownload(fileDetail.path)"
        >
          下载
        </button>
        <button class="action-button preview-btn" @click="">预览</button>
      </div>
    </div>
    <div v-else class="file-detail-loading">加载中...</div>
  </Dialog>

  <!-- 下载进度对话框 -->
  <Dialog
    v-model="showDownloadDialog"
    title="文件下载"
    width="400px"
    :closable="false"
    :close-on-click-mask="false"
    :show-footer="false"
  >
    <div class="download-progress">
      <div class="download-info">
        <p class="download-filename">{{ downloadingFile }}</p>
        <p class="download-percent">{{ downloadProgress }}%</p>
      </div>
      <div class="progress-bar-container">
        <div
          class="progress-bar"
          :style="{ width: `${downloadProgress}%` }"
        ></div>
      </div>
      <p class="download-status">{{ downloadStatus }}</p>
      <div class="download-actions">
        <button
          v-if="!downloadComplete"
          class="action-button cancel-btn"
          @click="cancelDownload"
        >
          取消下载
        </button>
        <button
          v-if="downloadComplete"
          class="action-button done-btn"
          @click="closeDownloadDialog"
        >
          完成
        </button>
      </div>
    </div>
  </Dialog>

  <!-- 变更记录对话框 -->
  <Dialog
    v-model="showChangelogDialog"
    title="变更记录"
    width="700px"
    :show-cancel="false"
    confirm-text="关闭"
  >
    <ChangeLog />
  </Dialog>

  <!-- 关于网站对话框 -->
  <Dialog
    v-model="showAboutDialog"
    title="关于网站"
    width="600px"
    :show-cancel="false"
    confirm-text="关闭"
  >
    <About />
  </Dialog>
</template>

<script setup lang="ts">
import toplogo from "/vue.svg";
import { ref, inject } from "vue";
import {
  Topbar,
  ThemeTransition,
  ThemeSwitch,
  FpsMonitor,
  RoundCard,
  Dialog,
  type MenuItem,
} from "wine-ui";
import { debounce } from "wine-ui/utils";
import type { ThemeContext } from "wine-ui/plugins/theme/types";
import FileTree from "./components/FileTree/FileTree.vue";
import type { TreeNode } from "./components/FileTree/types";
import { fetchFileManifest, buildTreeData } from "./services/fileManifest";
import { onMounted } from "vue";
import {
  getFileDetailByMd5,
  formatFileSize,
  formatDate,
  downloadFile,
  type FileDetail,
} from "./services/fileService";
import MarkdownViewer from "./components/MarkdownViewer/MarkdownViewer.vue";
import ChangeLog from "./components/ChangeLog/ChangeLog.vue";
import About from "./components/About.vue";

const isTopbarMenuOpen = ref(false);

const themeContext = inject<ThemeContext>("theme");

const themeTransitionRef = ref();

let pendingThemeChange = false;

// 变更记录对话框控制变量
const showChangelogDialog = ref(false);
// 关于网站对话框控制变量
const showAboutDialog = ref(false);

const menuItems: MenuItem[] = [
  {
    key: "changes",
    label: "变更记录",
    link: "#changes",
    onClick: () => {
      showChangelogDialog.value = true;
    },
  },
  {
    key: "about",
    label: "关于网站",
    link: "#about",
    onClick: () => {
      showAboutDialog.value = true;
    },
  },
];

const onTransitionComplete = () => {
  if (pendingThemeChange) {
    console.log("主题切换动画完成");
    themeContext?.toggleTheme();
    pendingThemeChange = false;
  }
};

const fileTreeData = ref<TreeNode[]>([]);
const isFileTreeLoading = ref(true);
const fileTreeErrorMessage = ref("");

const loadFileManifest = async () => {
  isFileTreeLoading.value = true;
  fileTreeErrorMessage.value = "";

  try {
    const files = await fetchFileManifest();
    fileTreeData.value = buildTreeData(files);

    if (fileTreeData.value.length === 0) {
      fileTreeErrorMessage.value = "未找到任何文件数据";
    }
  } catch (error) {
    console.error("加载文件清单出错:", error);
    fileTreeErrorMessage.value =
      error instanceof Error ? error.message : "无法加载文件清单，请稍后重试";
  } finally {
    isFileTreeLoading.value = false;
  }
};

// 添加文件刷新处理函数
const handleFileRefresh = () => {
  loadFileManifest();
};

const showFileDialog = ref(false);
const fileDetail = ref<FileDetail | null>(null);
const handleFileSelect = async (node: TreeNode) => {
  if (node.type === "file" && node.path && node.md5) {
    fileDetail.value = null;
    showFileDialog.value = true;

    try {
      fileDetail.value = await getFileDetailByMd5(node.md5);
    } catch (error) {
      console.error("获取文件详情出错:", error);
      fileDetail.value = {
        path: node.name || "",
        size: 0,
        modifiedTime: new Date().toISOString(),
        isDirectory: false,
        md5: node.md5 || "",
      };
    }
  }
};

const handleFileToggle = (node: TreeNode) => {
  const updateNode = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((n) => {
      if (n.key === node.key) {
        return { ...n, expanded: node.expanded };
      }
      if (n.children) {
        return { ...n, children: updateNode(n.children) };
      }
      return n;
    });
  };
  fileTreeData.value = updateNode(fileTreeData.value);
};

// 添加下载控制器引用
const currentDownloadController = ref<AbortController | null>(null);

// 处理文件下载
const handleDownload = (path: string) => {
  downloadingFile.value = path.split("/").pop() || "文件";
  showDownloadDialog.value = true;
  downloadComplete.value = false;
  downloadProgress.value = 0;
  downloadStatus.value = "准备下载...";

  // 创建新的 AbortController
  currentDownloadController.value = new AbortController();

  const updateProgress = (progress: number) => {
    downloadProgress.value = progress;
    if (progress < 100) {
      downloadStatus.value = `下载中 ${progress}%...`;
    } else {
      downloadStatus.value = "下载完成";
      downloadComplete.value = true;
    }
  };

  // 使用回调函数处理下载状态
  downloadFile(path, updateProgress, currentDownloadController.value.signal, {
    onSuccess: () => {
      downloadStatus.value = "下载完成";
      downloadComplete.value = true;
    },
    onCancel: () => {
      downloadStatus.value = "下载已取消";
      downloadComplete.value = true;
      downloadProgress.value = 0;
    },
    onError: (error) => {
      downloadStatus.value = `下载失败: ${error.message}`;
      downloadComplete.value = true;
    },
  });
};

// 取消下载
const cancelDownload = () => {
  if (currentDownloadController.value) {
    // 先更新UI状态
    downloadStatus.value = "正在取消下载...";

    // 延迟一帧再执行取消操作，让UI有时间更新
    setTimeout(() => {
      currentDownloadController.value?.abort();
      currentDownloadController.value = null;
    }, 0);
  }
};

// 添加下载进度相关状态
const showDownloadDialog = ref(false);
const downloadProgress = ref(0);
const downloadingFile = ref("");
const downloadStatus = ref("准备下载...");
const downloadComplete = ref(false);

// 关闭下载对话框
const closeDownloadDialog = () => {
  showDownloadDialog.value = false;
  // 重置下载状态
  downloadProgress.value = 0;
  downloadingFile.value = "";
  downloadStatus.value = "准备下载...";
  downloadComplete.value = false;
  currentDownloadController.value = null;
};

// 使用防抖包装主题切换函数
const toggleTheme = debounce(async () => {
  if (pendingThemeChange || themeTransitionRef.value?.isAnimating) return;

  const nextTheme = themeContext?.theme.value === "light" ? "dark" : "light";
  const nextColor = getComputedStyle(document.documentElement)
    .getPropertyValue(
      nextTheme === "light" ? "--w-bg-color-light" : "--w-bg-color-dark"
    )
    .trim();

  pendingThemeChange = await themeTransitionRef.value?.trigger(nextColor);
  console.log("开始主题切换动画", pendingThemeChange);
}, 300);

onMounted(() => {
  loadFileManifest();
});

// Markdown预览相关状态 - 默认加载README文件
const markdownUrl = ref("https://xiaowine.github.io/chip-docs/README.md");
</script>

<style lang="scss">
@use "./index.scss";
</style>
