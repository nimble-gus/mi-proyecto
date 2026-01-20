import { ProjectsResponse } from "@/src/shared/types/api";

export async function searchProjects(query: string): Promise<ProjectsResponse> {
  if (!query.trim()) {
    return { projects: [] };
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const response = await fetch(`/api/projects?q=${encodedQuery}`);

  if (!response.ok) {
    throw new Error("Error al buscar proyectos");
  }

  return response.json();
}
