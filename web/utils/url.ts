/**
 * URL 相关工具函数
 */

/**
 * 给 URL 添加时间戳参数防止缓存
 *
 * @param url 原始URL
 * @returns 添加时间戳后的URL
 */
export function addTimestampToUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Date.now()}`;
}
