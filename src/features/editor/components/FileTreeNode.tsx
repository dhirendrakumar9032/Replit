import {
  Braces,
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { getFileType } from "@/features/editor/lib/fileTree";
import type { FileTreeItem } from "@/features/editor/lib/fileTree";
import type { NodeApi } from "react-arborist";

function FileIcon({ filePath }) {
  const fileType = getFileType(filePath);
  const className = `explorer-icon file-${fileType}`;

  if (fileType === "css") {
    return <Braces className={className} size={16} />;
  }

  if (fileType === "html") {
    return <FileCode className={className} size={16} />;
  }

  if (fileType === "json") {
    return <FileJson className={className} size={16} />;
  }

  if (fileType === "js" || fileType === "react") {
    return <FileCode className={className} size={16} />;
  }

  if (fileType === "file") {
    return <FileText className={className} size={16} />;
  }

  return <File className={className} size={16} />;
}

export default function FileTreeNode({
  node,
  style,
  dragHandle,
  onAddNode,
  onDeleteNode,
}: {
  node: NodeApi<FileTreeItem>;
  style: React.CSSProperties;
  dragHandle?: (el: HTMLDivElement | null) => void;
  onAddNode: (node: FileTreeItem) => void;
  onDeleteNode: (node: FileTreeItem) => void;
}) {
  const item = node.data;
  const isFolder = item.type === "folder";
  const isActive = node.isSelected || node.id === node.tree.props.selection;

  return (
    <div
      ref={dragHandle}
      className={[
        "explorer-row",
        isActive ? "active" : "",
        node.isDragging ? "dragging" : "",
        node.willReceiveDrop ? "drop-target" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onDoubleClick={() => {
        if (isFolder) {
          node.toggle();
        }
      }}
    >
      <button
        type="button"
        className="explorer-node-button"
        onClick={() => {
          if (isFolder) {
            node.toggle();
          } else {
            node.activate();
          }
        }}
      >
        {isFolder ? (
          <ChevronRight
            className={`explorer-chevron ${node.isOpen ? "open" : ""}`}
            size={14}
          />
        ) : (
          <span className="explorer-chevron-spacer" />
        )}

        {isFolder ? (
          node.isOpen ? (
            <FolderOpen className="explorer-icon folder open" size={17} />
          ) : (
            <Folder className="explorer-icon folder" size={17} />
          )
        ) : (
          <FileIcon filePath={item.path} />
        )}

        <span className="explorer-node-name">{item.name}</span>
      </button>

      <div className="explorer-actions">
        {isFolder ? (
          <button
            type="button"
            className="tree-action-button"
            onClick={(event) => {
              event.stopPropagation();
              onAddNode(item);
            }}
            title={`Add inside ${item.name}`}
          >
            <Plus size={13} />
          </button>
        ) : null}

        <button
          type="button"
          className="tree-action-button danger"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteNode(item);
          }}
          title={`Delete ${item.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
