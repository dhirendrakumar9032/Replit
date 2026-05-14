import { Navigate, Route, Routes } from "react-router-dom";
import EditorPage from "@/pages/EditorPage";
import ProjectsPage from "@/pages/ProjectsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsPage />} />
      <Route path="/editor/:projectSlug" element={<EditorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
