import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "@/entities/project/ui/ProjectCard";
import { useProjects } from "@/entities/project/model/ProjectsContext";

export default function ProjectsPage() {
  const { projects, createProject, deleteProject } = useProjects();
  const [newProjectName, setNewProjectName] = useState("");
  const navigate = useNavigate();

  const title = useMemo(() => {
    if (!projects.length) {
      return "No projects yet";
    }

    return `${projects.length} React project${projects.length > 1 ? "s" : ""}`;
  }, [projects.length]);

  const handleCreateProject = (event) => {
    event.preventDefault();

    const createdProject = createProject(newProjectName);
    setNewProjectName("");
    navigate(`/editor/${createdProject.id}`);
  };

  const handleDeleteProject = (projectId) => {
    const shouldDelete = window.confirm("Delete this project permanently?");

    if (!shouldDelete) {
      return;
    }

    deleteProject(projectId);
  };

  return (
    <main className="projects-page">
      <section className="hero">
        <p className="hero-badge">React Online Editor</p>
        <h1>Create and manage React projects in your browser</h1>
        <p>
          Create a new project from boilerplate, open any saved project, and continue editing with live preview.
        </p>
      </section>

      <section className="create-card">
        <h2>Create New React App</h2>
        <form className="create-form" onSubmit={handleCreateProject}>
          <input
            type="text"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
            placeholder="Project name (optional)"
            maxLength={50}
          />
          <button className="button primary" type="submit">
            + New Project
          </button>
        </form>
      </section>

      <section className="projects-grid-wrap">
        <div className="projects-grid-header">
          <h2>{title}</h2>
        </div>

        {projects.length ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={handleDeleteProject} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Start by creating your first React application.</p>
          </div>
        )}
      </section>
    </main>
  );
}
