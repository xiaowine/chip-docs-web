<template>
  <div class="changelog">
    <div v-if="loading" class="changelog-loading">
      <div class="changelog-spinner"></div>
      <p>加载变更记录中...</p>
    </div>
    <div v-else-if="error" class="changelog-error">
      <p>{{ error }}</p>
      <button class="changelog-retry-btn" @click="loadChangelog">重试</button>
    </div>
    <div v-else-if="!changelog.length" class="changelog-empty">
      <p>暂无变更记录</p>
    </div>
    <div v-else class="changelog-list">
      <div
        v-for="(entry, index) in changelog"
        :key="index"
        class="changelog-item"
        :class="{ expanded: expandedItems.includes(index) }"
      >
        <div class="changelog-header" @click="toggleExpand(index)">
          <div class="changelog-header-content">
            <span class="changelog-date">{{
              formatChangeDate(entry.timestamp)
            }}</span>
            <span class="changelog-changes-count">
              {{ getChangesCount(entry) }} 个变更
            </span>
          </div>
          <span
            class="changelog-indicator"
            :class="{ expanded: expandedItems.includes(index) }"
          >
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
              />
            </svg>
          </span>
        </div>
        <transition
          name="expand"
          @enter="startExpandAnimation"
          @leave="startCollapseAnimation"
        >
          <div v-show="expandedItems.includes(index)" class="changelog-details">
            <div
              v-if="entry.changes.added.length"
              class="changelog-section added"
            >
              <div class="changelog-section-header">
                <div class="changelog-section-icon">✚</div>
                <h4>新增文件 ({{ entry.changes.added.length }})</h4>
              </div>
              <ul>
                <li v-for="file in entry.changes.added" :key="file.md5">
                  <span class="file-name">{{ file.filename }}</span>
                  <span class="file-md5">[MD5: {{ file.md5 }}]</span>
                </li>
              </ul>
            </div>
            <div
              v-if="entry.changes.modified.length"
              class="changelog-section modified"
            >
              <div class="changelog-section-header">
                <div class="changelog-section-icon">✎</div>
                <h4>修改文件 ({{ entry.changes.modified.length }})</h4>
              </div>
              <ul>
                <li v-for="file in entry.changes.modified" :key="file.md5">
                  <span class="file-name">{{ file.filename }}</span>
                  <span class="file-md5">[MD5: {{ file.md5 }}]</span>
                </li>
              </ul>
            </div>
            <div
              v-if="entry.changes.removed.length"
              class="changelog-section removed"
            >
              <div class="changelog-section-header">
                <div class="changelog-section-icon">✖</div>
                <h4>删除文件 ({{ entry.changes.removed.length }})</h4>
              </div>
              <ul>
                <li v-for="file in entry.changes.removed" :key="file.md5">
                  <span class="file-name">{{ file.filename }}</span>
                  <span class="file-md5">[MD5: {{ file.md5 }}]</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  fetchChangelog,
  formatChangeDate,
  type ChangelogEntry,
} from "../../services/changelogService";
// 状态变量
const changelog = ref<ChangelogEntry[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const expandedItems = ref<number[]>([]);

// 加载变更日志数据
const loadChangelog = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await fetchChangelog();
    changelog.value = data;
  } catch (e) {
    error.value = e instanceof Error ? e.message : "加载变更记录失败";
  } finally {
    loading.value = false;
  }
};

// 计算单个变更记录的总变更数
const getChangesCount = (entry: ChangelogEntry): number => {
  return (
    entry.changes.added.length +
    entry.changes.modified.length +
    entry.changes.removed.length
  );
};

// 展开/收起变更记录详情
const toggleExpand = (index: number) => {
  const position = expandedItems.value.indexOf(index);
  if (position > -1) {
    expandedItems.value.splice(position, 1);
  } else {
    expandedItems.value.push(index);
  }
};

// 展开动画处理函数
const startExpandAnimation = (el: Element, done: () => void) => {
  const element = el as HTMLElement;

  // 设置初始和目标状态
  element.style.display = "block";
  const targetHeight = element.scrollHeight + "px";
  element.style.height = "0";
  element.style.opacity = "0";

  // 强制重排并添加过渡结束监听
  element.offsetHeight;
  element.addEventListener("transitionend", function handler() {
    element.style.height = "auto";
    element.removeEventListener("transitionend", handler);
    done();
  });

  // 开始动画
  requestAnimationFrame(() => {
    element.style.height = targetHeight;
    element.style.opacity = "1";
  });
};

const startCollapseAnimation = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  element.style.height = element.scrollHeight + "px";

  // Force reflow
  element.offsetHeight;

  const onTransitionEnd = () => {
    element.removeEventListener("transitionend", onTransitionEnd);
    done();
  };
  element.addEventListener("transitionend", onTransitionEnd);

  requestAnimationFrame(() => {
    element.style.height = "0";
    element.style.opacity = "0";
  });
};

onMounted(() => {
  loadChangelog();
});
</script>

<style lang="scss" scoped>
@use "./index.scss";
</style>
