interface FileManifest {
  timestamp: string;
  files: Record<string, string>;
}

interface FileNode {
  md5: string;
  path: string;
}

const BASE_URL = "https://xiaowine.github.io/chip-docs";

export async function fetchFileManifest(): Promise<FileNode[]> {
  try {
    const response = await fetch(`${BASE_URL}/.data/file-manifest.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch file manifest");
    }
    const data: FileManifest = await response.json();

    return Object.entries(data.files).map(([md5, path]) => ({
      md5,
      path,
    }));
  } catch (error) {
    console.error("Error fetching file manifest:", error);
    return [];
  }
}

export function buildTreeData(files: FileNode[]) {
  const root: Record<string, any> = {};

  files.forEach((file) => {
    let current = root;
    const parts = file.path.split("/");
    const fileName = parts.pop()!;
    const fullPath = file.path;

    parts.forEach((part, index) => {
      const pathSoFar = parts.slice(0, index + 1).join("/");
      if (!current[part]) {
        current[part] = {
          key: pathSoFar,
          name: part,
          type: "directory",
          children: {},
        };
      }
      current = current[part].children;
    });

    current[fileName] = {
      key: fullPath,
      name: fileName,
      type: "file",
      path: `${BASE_URL}/${file.path}`,
      md5: file.md5,
    };
  });

  function convertToArray(node: Record<string, any>): any[] {
    return Object.values(node)
      .map((item) => ({
        ...item,
        children: item.children ? convertToArray(item.children) : undefined,
      }))
      .sort((a, b) => {
        // 如果类型不同，文件夹排在前面
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        // 同类型按名称排序（忽略大小写）
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
  }

  return convertToArray(root);
}
