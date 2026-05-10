import { getFileIconLabel, getFileType } from "@/features/editor/lib/fileTree";

export default function FileTreeNode({
  node,
  depth,
  activeFile,
  expandedFolders,
  onToggleFolder,
  onOpenFile,
}) {
  if (node.type === "folder") {
    const isExpanded = expandedFolders.has(node.path);

    return (
      <div className="tree-node-group">
        <button
          type="button"
          className="tree-row tree-folder-button"
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
          onClick={() => onToggleFolder(node.path)}
        >
          <span className="tree-chevron">{isExpanded ? "v" : ">"}</span>
          <span className="tree-folder-icon">DIR</span>
          <span className="tree-node-name">{node.name}</span>
        </button>

        {isExpanded
          ? node.children.map((childNode) => (
              <FileTreeNode
                key={childNode.path}
                node={childNode}
                depth={depth + 1}
                activeFile={activeFile}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onOpenFile={onOpenFile}
              />
            ))
          : null}
      </div>
    );
  }

  const fileType = getFileType(node.path);
  const iconLabel = getFileIconLabel(fileType);
  const isActive = activeFile === node.path;

  return (
    <button
      type="button"
      className={`tree-row tree-file-button ${isActive ? "active" : ""}`}
      style={{ paddingLeft: `${depth * 14 + 24}px` }}
      onClick={() => onOpenFile(node.path)}
    >
      <span className={`file-icon ${fileType}`}>{iconLabel}</span>
      <span className="tree-node-name">{node.name}</span>
    </button>
  );
}
