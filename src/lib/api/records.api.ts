import { RecordsResponse, DetailsResponse } from "@/src/types/api";

export interface SearchRecordsParams {
  project: string;
  zone?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export async function searchRecords(params: SearchRecordsParams): Promise<RecordsResponse> {
  const searchParams = new URLSearchParams({
    project: params.project,
    page: (params.page || 1).toString(),
    pageSize: (params.pageSize || 20).toString(),
  });

  if (params.zone) {
    searchParams.append("zone", params.zone);
  }

  if (params.category) {
    searchParams.append("category", params.category);
  }

  const response = await fetch(`/api/records?${searchParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(errorData.error || "Error al obtener registros");
  }

  return response.json();
}

export async function getRecordDetails(id: number): Promise<DetailsResponse> {
  const response = await fetch(`/api/records/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(errorData.error || "Error al obtener detalles");
  }

  return response.json();
}
