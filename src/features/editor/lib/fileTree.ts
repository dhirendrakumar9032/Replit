import { isFolderMarkerPath } from "@/features/editor/lib/editorFiles";

export type FileTreeItem = {
  name: string;
  path: string;
  type: "file" | "folder";
  children: FileTreeItem[];
};

export function getFileType(filePath) {
  if (filePath.endsWith(".jsx")) {
    return "react";
  }

  if (filePath.endsWith(".css")) {
    return "css";
  }

  if (filePath.endsWith(".js") || filePath.endsWith(".ts")) {
    return "js";
  }

  if (filePath.endsWith(".html")) {
    return "html";
  }

  if (filePath.endsWith(".json")) {
    return "json";
  }

  return "file";
}

export function getFileIconLabel(fileType) {
  if (fileType === "react") {
    return "R";
  }

  if (fileType === "css") {
    return "{}";
  }

  if (fileType === "js") {
    return "JS";
  }

  if (fileType === "html") {
    return "</>";
  }

  if (fileType === "json") {
    return "[]";
  }

  return "*";
}

export function getNodeNameFromPath(path) {
  return path.replace(/^\/+/, "").split("/").filter(Boolean).pop() || "";
}

export function getAncestorFolders(path) {
  if (!path) {
    return [];
  }

  const segments = path.replace(/^\/+/, "").split("/").filter(Boolean);
  const ancestors = [];

  for (let index = 0; index < segments.length - 1; index += 1) {
    ancestors.push(`/${segments.slice(0, index + 1).join("/")}`);
  }

  return ancestors;
}

type MutableFileTreeItem = {
  name: string;
  path: string;
  type: "file" | "folder";
  children: Map<string, MutableFileTreeItem>;
};

export function buildFileTree(filePaths): FileTreeItem[] {
  const root = {
    children: new Map<string, MutableFileTreeItem>(),
  };

  for (const filePath of filePaths) {
    const trimmed = filePath.replace(/^\/+/, "");

    if (!trimmed) {
      continue;
    }

    const segments = trimmed.split("/");
    let current = root;
    const isFolderMarker = isFolderMarkerPath(filePath);
    const maxIndex = isFolderMarker ? segments.length - 2 : segments.length - 1;

    for (let index = 0; index <= maxIndex; index += 1) {
      const segment = segments[index];
      const isFile = !isFolderMarker && index === maxIndex;
      const nodePath = `/${segments.slice(0, index + 1).join("/")}`;

      if (!current.children.has(segment)) {
        current.children.set(segment, {
          name: segment,
          path: nodePath,
          type: isFile ? "file" : "folder",
          children: new Map(),
        });
      }

      const node = current.children.get(segment);

      if (!isFile) {
        node.type = "folder";
      }

      current = node;
    }
  }

  const toArray = (childrenMap: Map<string, MutableFileTreeItem>): FileTreeItem[] =>
    Array.from(childrenMap.values())
      .map((node) => ({
        name: node.name,
        path: node.path,
        type: node.type,
        children: node.type === "folder" ? toArray(node.children) : [],
      }))
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }

        return a.name.localeCompare(b.name);
      });

  return toArray(root.children);
}
