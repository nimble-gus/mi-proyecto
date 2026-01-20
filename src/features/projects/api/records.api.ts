import { RecordsResponse, DetailsResponse } from "@/src/shared/types/api";

export interface SearchRecordsParams {
  project: string;
  zone?: string;
  category?: string;
  period?: string;
  page?: number;
  pageSize?: number;
}

export async function searchRecords(params: SearchRecordsParams): Promise<RecordsResponse> {
  // Asegurar que page y pageSize sean números válidos
  let page = 1;
  if (params.page !== undefined && params.page !== null) {
    if (typeof params.page === 'number' && !isNaN(params.page)) {
      page = Math.max(1, params.page);
    } else {
      const parsed = parseInt(String(params.page), 10);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }
  }

  let pageSize = 5; // Valor por defecto: 5 proyectos por página
  if (params.pageSize !== undefined && params.pageSize !== null) {
    if (typeof params.pageSize === 'number' && !isNaN(params.pageSize)) {
      pageSize = Math.max(1, Math.min(50, params.pageSize));
    } else {
      const parsed = parseInt(String(params.pageSize), 10);
      if (!isNaN(parsed) && parsed > 0) {
        pageSize = Math.min(50, parsed);
      }
    }
  }
  
  const searchParams = new URLSearchParams({
    project: params.project,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (params.zone) {
    searchParams.append("zone", params.zone);
  }

  if (params.category) {
    searchParams.append("category", params.category);
  }

  if (params.period) {
    searchParams.append("period", params.period);
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

export interface UpdateRecordParams {
  fase?: string | null;
  estado?: string | null;
  fecha_inicio?: string | null;
  fecha_entrega?: string | null;
  precio_promedio?: string | null;
  cuota_promedio?: string | null;
  ingresos_promedio?: string | null;
  unidades_disponibles?: number | null;
}

export async function updateRecordDetails(
  id: number,
  data: UpdateRecordParams
): Promise<DetailsResponse> {
  const response = await fetch(`/api/records/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(errorData.error || "Error al actualizar el registro");
  }

  return response.json();
}
