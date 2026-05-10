import { Link } from "react-router-dom";

export default function EditorTopbar({ projectId, nameDraft, setNameDraft, onCommitName }) {
  return (
    <header className="editor-topbar">
      <div className="editor-topbar-left">
        <Link className="button ghost" to="/">
          Back to Projects
        </Link>
        <span className="project-id">{projectId}</span>
      </div>

      <input
        className="project-name-input"
        value={nameDraft}
        onChange={(event) => setNameDraft(event.target.value)}
        onBlur={onCommitName}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommitName();
          }
        }}
      />
    </header>
  );
}
