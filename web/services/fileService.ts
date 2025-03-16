/**
 * 文件详情服务
 * 用于获取文件的详细信息
 */

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
    const response = await fetch(`${BASE_URL}/.data/md5s/${md5}.json`);
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
 */
export async function downloadFile(
  path: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  const downloadUrl = `${BASE_URL}/${path}`;
  try {
    // 初始进度报告
    onProgress?.(0);

    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`下载失败，状态码: ${response.status}`);
    }

    const contentLength = Number(response.headers.get("content-length")) || 0;
    const reader = response.body?.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        if (onProgress && contentLength) {
          const progress = (receivedLength / contentLength) * 100;
          onProgress(Math.min(Math.round(progress), 100));
        }
      }
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
  } catch (error) {
    console.error("下载文件时出错:", error);
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
