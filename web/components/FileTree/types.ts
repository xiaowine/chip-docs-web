export interface TreeNode {
  key: string;
  name: string;
  type: "file" | "directory";
  children?: TreeNode[];
  path?: string;
  expanded?: boolean;
  md5?: string;
}

export interface FileTreeProps {
  data: TreeNode[];
  searchable?: boolean;
  defaultExpanded?: boolean;
  loading?: boolean; // 添加loading属性
}

export interface FileTreeEmits {
  (e: "select", node: TreeNode): void;
  (e: "toggle", node: TreeNode): void;
  (e: "refresh"): void; // 添加刷新事件
}
