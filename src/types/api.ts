// Tipos de respuestas de la API

import { Project, RecordDetails } from "./domain";

export interface ProjectsResponse {
  projects: Project[];
}

export interface ZonesResponse {
  zones: string[];
}

export interface CategoriesResponse {
  categories: string[];
}

export interface RecordsResponse {
  items: Project[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface DetailsResponse {
  record: RecordDetails;
}
