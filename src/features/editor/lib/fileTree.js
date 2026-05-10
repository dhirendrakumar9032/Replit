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

export function buildFileTree(filePaths) {
  const root = {
    children: new Map(),
  };

  for (const filePath of filePaths) {
    const trimmed = filePath.replace(/^\/+/, "");

    if (!trimmed) {
      continue;
    }

    const segments = trimmed.split("/");
    let current = root;

    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index];
      const isFile = index === segments.length - 1;
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

  const toArray = (childrenMap) =>
    Array.from(childrenMap.values())
      .map((node) => ({
        ...node,
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
