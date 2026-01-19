import { ZonesResponse, CategoriesResponse } from "@/src/types/api";

export async function getZones(project: string): Promise<ZonesResponse> {
  if (!project || !project.trim()) {
    return { zones: [] };
  }

  const projectName = encodeURIComponent(project.trim());
  const response = await fetch(`/api/zones?project=${projectName}`);

  if (!response.ok) {
    throw new Error("Error al obtener zonas");
  }

  return response.json();
}

export async function getCategories(project: string): Promise<CategoriesResponse> {
  if (!project || !project.trim()) {
    return { categories: [] };
  }

  const projectName = encodeURIComponent(project.trim());
  const response = await fetch(`/api/categories?project=${projectName}`);

  if (!response.ok) {
    throw new Error("Error al obtener categorías");
  }

  return response.json();
}
