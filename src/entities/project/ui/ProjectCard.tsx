import { Link } from "react-router-dom";
import { formatDateTime } from "@/shared/lib/date";
import { getProjectEditorPath } from "@/entities/project/model/projectRoutes";

export default function ProjectCard({ project, onDelete }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
      </div>
      <p>Last updated: {formatDateTime(project.updatedAt)}</p>
      <div className="project-actions">
        <Link className="button primary" to={getProjectEditorPath(project)}>
          Open Editor
        </Link>
        <button className="button ghost" type="button" onClick={() => onDelete(project.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
