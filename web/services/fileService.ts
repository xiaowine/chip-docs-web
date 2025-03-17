/**
 * 文件详情服务
 * 用于获取文件的详细信息
 */
import { addTimestampToUrl } from "../utils/url";

export interface FileDetail {
  path: string;
  size: number;
  modifiedTime: string;
  isDirectory: boolean;
  md5: string;
}

const BASE_URL = "https://xiaowine.github.io/chip-docs";

/**
 * 根据文件MD5获取文件详情
 *
 * @param md5 文件的MD5值
 * @returns 文件详情对象
 */
export async function getFileDetailByMd5(md5: string): Promise<FileDetail> {
  try {
    const url = addTimestampToUrl(`${BASE_URL}/.data/md5s/${md5}.json`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取文件详情失败，状态码: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("获取文件详情时出错:", error);
    throw error;
  }
}

/**
 * 下载文件
 *
 * @param path 文件路径
 * @param onProgress 下载进度回调函数，参数为 0-100 的数值
 * @param signal 可选的AbortSignal对象，用于取消下载
 * @param callbacks 可选的回调函数对象，用于处理不同状态
 */
export async function downloadFile(
  path: string,
  onProgress?: (progress: number) => void,
  signal?: AbortSignal,
  callbacks?: {
    onSuccess?: () => void;
    onCancel?: () => void;
    onError?: (error: Error) => void;
  }
): Promise<void> {
  const downloadUrl = addTimestampToUrl(`${BASE_URL}/${path}`);
  try {
    // 添加取消检查
    if (signal?.aborted) {
      onProgress?.(0);
      callbacks?.onCancel?.();
      return;
    }

    // 初始进度报告
    onProgress?.(0);

    const response = await fetch(downloadUrl, { signal });
    if (!response.ok) {
      const error = new Error(`下载失败，状态码: ${response.status}`);
      callbacks?.onError?.(error);
      return;
    }

    const contentLength = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    if (reader) {
      while (true) {
        // 检查是否已经取消
        if (signal?.aborted) {
          reader.cancel(); // 重要：取消读取流
          onProgress?.(0); // 重置进度
          callbacks?.onCancel?.();
          return;
        }

        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (onProgress && contentLength) {
          const progress = (receivedLength / contentLength) * 100;
          onProgress(Math.min(Math.round(progress), 99)); // 保持在99%以下直到完全完成
        }
      }
    }

    // 检查是否在创建Blob之前已取消
    if (signal?.aborted) {
      onProgress?.(0);
      callbacks?.onCancel?.();
      return;
    }

    // 确保进度为100%
    onProgress?.(100);

    const blob = new Blob(chunks);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop() || "下载文件";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    callbacks?.onSuccess?.();
  } catch (error: unknown) {
    // 确保终止下载时的错误处理更完善
    if (error instanceof DOMException && error.name === "AbortError") {
      console.log("下载已取消");
      onProgress?.(0); // 重置进度
      callbacks?.onCancel?.();
    } else {
      console.error("下载文件时出错:", error);
      callbacks?.onError?.(
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}

/**
 * 获取Markdown文件内容并预览
 * @param url Markdown文件的URL
 * @returns Promise<string> Markdown内容
 */
export async function fetchMarkdownContent(url: string): Promise<string> {
  try {
    const timestampedUrl = addTimestampToUrl(url);
    const response = await fetch(timestampedUrl);
    if (!response.ok) {
      throw new Error(`获取Markdown内容失败: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("获取Markdown失败:", error);
    throw error;
  }
}

/**
 * 格式化文件大小为易读格式
 *
 * @param size 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

/**
 * 格式化日期时间为本地时间字符串
 *
 * @param dateString ISO日期字符串
 * @returns 格式化后的日期时间字符串
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN");
}
