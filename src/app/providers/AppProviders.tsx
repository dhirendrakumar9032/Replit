import { BrowserRouter } from "react-router-dom";
import { ProjectsProvider } from "@/entities/project/model/ProjectsContext";

export default function AppProviders({ children }) {
  return (
    <ProjectsProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ProjectsProvider>
  );
}
