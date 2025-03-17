import { addTimestampToUrl } from "../utils/url";

// 变更记录的数据结构
export interface FileChange {
  filename: string;
  md5: string;
}

export interface ChangeRecord {
  added: FileChange[];
  removed: FileChange[];
  modified: FileChange[];
}

export interface ChangelogEntry {
  timestamp: string;
  changes: ChangeRecord;
}

const BASE_URL = "https://xiaowine.github.io/chip-docs";

/**
 * 获取变更日志数据
 *
 * @returns 变更日志条目数组
 */
export async function fetchChangelog(): Promise<ChangelogEntry[]> {
  try {
    const url = addTimestampToUrl(`${BASE_URL}/.data/changes.json`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch changelog");
    }

    const data: ChangelogEntry[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching changelog:", error);
    return [];
  }
}

/**
 * 格式化日期时间显示
 *
 * @param timestamp ISO格式的时间戳
 * @returns 格式化后的日期字符串
 */
export function formatChangeDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (e) {
    return timestamp;
  }
}
