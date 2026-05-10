import FileTreeNode from "./FileTreeNode";

export default function FileExplorerPanel({
  filePathInputRef,
  newFilePath,
  setNewFilePath,
  onAddFile,
  treeNodes,
  activeFile,
  expandedFolders,
  onToggleFolder,
  onOpenFile,
}) {
  return (
    <>
      <div className="sidebar-section-header">
        <h3>FILES</h3>
        <button
          type="button"
          className="mini-button"
          onClick={() => {
            filePathInputRef.current?.focus();
          }}
          title="Add file"
        >
          +
        </button>
      </div>

      <form className="add-file-form" onSubmit={onAddFile}>
        <input
          ref={filePathInputRef}
          type="text"
          value={newFilePath}
          onChange={(event) => setNewFilePath(event.target.value)}
          placeholder="src/components/Button.jsx"
        />
      </form>

      <div className="file-tree">
        {treeNodes.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            depth={0}
            activeFile={activeFile}
            expandedFolders={expandedFolders}
            onToggleFolder={onToggleFolder}
            onOpenFile={onOpenFile}
          />
        ))}
      </div>
    </>
  );
}
