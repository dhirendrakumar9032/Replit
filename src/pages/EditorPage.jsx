import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { aquaBlue } from "@codesandbox/sandpack-themes";
import { useProjects } from "@/entities/project/model/ProjectsContext";
import EditorWorkspace from "@/features/editor/components/EditorWorkspace";
import { resolveActiveFile, resolveEntryFile } from "@/features/editor/lib/editorFiles";

export default function EditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, saveEditorSnapshot, addProjectDependency } = useProjects();

  const project = projects.find((item) => item.id === projectId);
  const [loadKey, setLoadKey] = useState(0);

  useEffect(() => {
    setLoadKey((value) => value + 1);
  }, [projectId]);

  const onRenameProject = useCallback(
    (name) => {
      updateProject(projectId, { name });
    },
    [projectId, updateProject]
  );

  const onSnapshotChange = useCallback(
    (snapshot) => {
      saveEditorSnapshot(projectId, snapshot);
    },
    [projectId, saveEditorSnapshot]
  );

  const onAddDependency = useCallback(
    (packageName, packageVersion) => {
      addProjectDependency(projectId, packageName, packageVersion);
      setLoadKey((value) => value + 1);
    },
    [projectId, addProjectDependency]
  );

  if (!project) {
    return (
      <main className="not-found">
        <h1>Project not found</h1>
        <p>Go back and create a new React application.</p>
        <button className="button primary" type="button" onClick={() => navigate("/")}>
          Go to Projects
        </button>
      </main>
    );
  }

  const activeFile = resolveActiveFile(project.files, project.activeFile);
  const entryFile = resolveEntryFile(project.files);

  return (
    <SandpackProvider
      key={`${project.id}-${loadKey}`}
      template="react"
      files={project.files}
      theme={aquaBlue}
      options={{
        activeFile,
        recompileMode: "immediate",
        recompileDelay: 250,
      }}
      customSetup={{
        entry: entryFile,
        dependencies: project.dependencies || {},
      }}
    >
      <EditorWorkspace
        projectId={project.id}
        projectName={project.name}
        projectDependencies={project.dependencies || {}}
        onRenameProject={onRenameProject}
        onSnapshotChange={onSnapshotChange}
        onAddDependency={onAddDependency}
      />
    </SandpackProvider>
  );
}
