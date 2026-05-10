import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SandpackCodeEditor, SandpackLayout, SandpackPreview, useSandpack } from "@codesandbox/sandpack-react";
import { BASE_PACKAGES } from "@/features/editor/constants/basePackages";
import { createStarterByPath, normalizePath } from "@/features/editor/lib/editorFiles";
import { buildFileTree, getAncestorFolders } from "@/features/editor/lib/fileTree";
import { resolvePackage } from "@/features/packages/api/packageRegistryClient";
import { usePackageSearch } from "@/features/packages/hooks/usePackageSearch";
import EditorTopbar from "@/features/editor/components/EditorTopbar";
import FileExplorerPanel from "@/features/editor/components/FileExplorerPanel";
import PackageManagerPanel from "@/features/editor/components/PackageManagerPanel";

export default function EditorWorkspace({
  projectId,
  projectName,
  projectDependencies,
  onRenameProject,
  onSnapshotChange,
  onAddDependency,
}) {
  const { sandpack, dispatch } = useSandpack();

  const [newFilePath, setNewFilePath] = useState("");
  const [nameDraft, setNameDraft] = useState(projectName);
  const [addingPackage, setAddingPackage] = useState("");
  const [expandedFolders, setExpandedFolders] = useState(() => new Set(["/src"]));

  const filePathInputRef = useRef(null);
  const packageSearchRef = useRef(null);

  const {
    query: packageQuery,
    setQuery: setPackageQuery,
    results: packageResults,
    isSearching: isSearchingPackages,
    error: packageError,
    setError: setPackageError,
  } = usePackageSearch();

  const filePaths = useMemo(
    () => Object.keys(sandpack.files || {}).sort((a, b) => a.localeCompare(b)),
    [sandpack.files]
  );

  const treeNodes = useMemo(() => buildFileTree(filePaths), [filePaths]);

  const installedPackages = useMemo(() => {
    const userPackages = Object.entries(projectDependencies || {}).sort(([a], [b]) => a.localeCompare(b));

    return [
      ...Object.entries(BASE_PACKAGES),
      ...userPackages.filter(([packageName]) => !BASE_PACKAGES[packageName]),
    ];
  }, [projectDependencies]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSnapshotChange({
        files: sandpack.files,
        activeFile: sandpack.activeFile,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [sandpack.files, sandpack.activeFile, onSnapshotChange]);

  useEffect(() => {
    setNameDraft(projectName);
  }, [projectName]);

  useEffect(() => {
    setExpandedFolders((previous) => {
      const next = new Set(previous);
      let changed = false;

      if (filePaths.some((filePath) => filePath.startsWith("/src/")) && !next.has("/src")) {
        next.add("/src");
        changed = true;
      }

      for (const folderPath of getAncestorFolders(sandpack.activeFile || "")) {
        if (!next.has(folderPath)) {
          next.add(folderPath);
          changed = true;
        }
      }

      return changed ? next : previous;
    });
  }, [filePaths, sandpack.activeFile]);

  const expandAncestors = useCallback((path) => {
    const ancestors = getAncestorFolders(path);

    if (!ancestors.length) {
      return;
    }

    setExpandedFolders((previous) => {
      const next = new Set(previous);
      let changed = false;

      for (const folderPath of ancestors) {
        if (!next.has(folderPath)) {
          next.add(folderPath);
          changed = true;
        }
      }

      return changed ? next : previous;
    });
  }, []);

  const toggleFolder = useCallback((path) => {
    setExpandedFolders((previous) => {
      const next = new Set(previous);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }, []);

  const openFile = useCallback(
    (path) => {
      expandAncestors(path);

      if (typeof sandpack.openFile === "function") {
        sandpack.openFile(path);
        return;
      }

      dispatch({
        type: "set-active-file",
        path,
      });
    },
    [sandpack, dispatch, expandAncestors]
  );

  const addFile = (event) => {
    event.preventDefault();

    const normalized = normalizePath(newFilePath);

    if (!normalized) {
      return;
    }

    if (sandpack.files[normalized]) {
      openFile(normalized);
      setNewFilePath("");
      return;
    }

    const starterCode = createStarterByPath(normalized);

    if (typeof sandpack.addFile === "function") {
      sandpack.addFile(normalized, starterCode, true);
      openFile(normalized);
    } else {
      onSnapshotChange({
        files: {
          ...sandpack.files,
          [normalized]: {
            code: starterCode,
          },
        },
        activeFile: normalized,
      });
    }

    expandAncestors(normalized);
    setNewFilePath("");
  };

  const commitName = () => {
    const trimmed = nameDraft.trim();

    if (trimmed && trimmed !== projectName) {
      onRenameProject(trimmed);
    } else if (!trimmed) {
      setNameDraft(projectName);
    }
  };

  const isPackageInstalled = useCallback(
    (packageName) => Boolean(BASE_PACKAGES[packageName] || projectDependencies?.[packageName]),
    [projectDependencies]
  );

  const addPackage = useCallback(
    async (packageName) => {
      if (!packageName || isPackageInstalled(packageName)) {
        return;
      }

      setAddingPackage(packageName);
      setPackageError("");

      try {
        const resolved = await resolvePackage(packageName);
        onAddDependency(resolved.name, resolved.version);
      } catch {
        setPackageError("Package could not be added.");
      } finally {
        setAddingPackage("");
      }
    },
    [isPackageInstalled, onAddDependency, setPackageError]
  );

  return (
    <div className="editor-page">
      <EditorTopbar
        projectId={projectId}
        nameDraft={nameDraft}
        setNameDraft={setNameDraft}
        onCommitName={commitName}
      />

      <SandpackLayout className="custom-layout">
        <aside className="files-panel">
          <FileExplorerPanel
            filePathInputRef={filePathInputRef}
            newFilePath={newFilePath}
            setNewFilePath={setNewFilePath}
            onAddFile={addFile}
            treeNodes={treeNodes}
            activeFile={sandpack.activeFile}
            expandedFolders={expandedFolders}
            onToggleFolder={toggleFolder}
            onOpenFile={openFile}
          />

          <PackageManagerPanel
            packageSearchRef={packageSearchRef}
            installedPackages={installedPackages}
            packageQuery={packageQuery}
            setPackageQuery={setPackageQuery}
            isSearchingPackages={isSearchingPackages}
            packageError={packageError}
            packageResults={packageResults}
            addingPackage={addingPackage}
            isPackageInstalled={isPackageInstalled}
            onAddPackage={addPackage}
          />
        </aside>

        <section className="code-panel">
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            wrapContent
            showInlineErrors
            style={{ height: "calc(100vh - 180px)" }}
          />
        </section>

        <section className="preview-panel">
          <div className="preview-title">Preview</div>
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton
            style={{ height: "calc(100vh - 230px)" }}
          />
        </section>
      </SandpackLayout>
    </div>
  );
}
