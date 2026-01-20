import { UnitsCatalogs, UnitDetails } from "../types/domain";

export interface UnitsCatalogsParams {
  recordId: number;
  period?: string;
}

export interface SearchUnitsParams {
  recordId: number;
  period?: string;
  use?: string;
  availability?: string;
  bedrooms?: number;
  page?: number;
  pageSize?: number;
  sort?: "new" | "old";
}

export interface UnitsResponse {
  items: Array<{
    id: number;
    num_unidad: string | null;
    modelo: string | null;
    torre_fase: string | null;
    unidad: string | null;
    uso: string | null;
    disponibilidad: string | null;
    cant_dormitorios: number | null;
    precio_total_usd: number | null;
    precio_total_qtz: number | null;
    tama_o_unidad: number | null;
  }>;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface UnitDetailsResponse {
  unit: UnitDetails;
}

export interface UnitsCatalogsResponse {
  uses: string[];
  availabilities: string[];
  bedrooms: number[];
}

export async function getUnitsCatalogs(
  params: UnitsCatalogsParams
): Promise<UnitsCatalogsResponse> {
  const searchParams = new URLSearchParams({
    recordId: params.recordId.toString(),
  });

  if (params.period) {
    searchParams.append("period", params.period);
  }

  const response = await fetch(`/api/units/catalogs?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || "Error al obtener catálogos de unidades");
  }

  return response.json();
}

export async function searchUnits(params: SearchUnitsParams): Promise<UnitsResponse> {
  // Asegurar que page y pageSize sean números válidos
  let page = 1;
  if (params.page !== undefined && params.page !== null) {
    if (typeof params.page === "number" && !isNaN(params.page)) {
      page = Math.max(1, params.page);
    } else {
      const parsed = parseInt(String(params.page), 10);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }
  }

  let pageSize = 10; // Default
  if (params.pageSize !== undefined && params.pageSize !== null) {
    if (typeof params.pageSize === "number" && !isNaN(params.pageSize)) {
      pageSize = Math.max(1, Math.min(50, params.pageSize));
    } else {
      const parsed = parseInt(String(params.pageSize), 10);
      if (!isNaN(parsed) && parsed > 0) {
        pageSize = Math.min(50, parsed);
      }
    }
  }

  const searchParams = new URLSearchParams({
    recordId: params.recordId.toString(),
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (params.period) {
    searchParams.append("period", params.period);
  }
  if (params.use) {
    searchParams.append("use", params.use);
  }
  if (params.availability) {
    searchParams.append("availability", params.availability);
  }
  if (params.bedrooms !== undefined && params.bedrooms !== null) {
    searchParams.append("bedrooms", params.bedrooms.toString());
  }
  if (params.sort) {
    searchParams.append("sort", params.sort);
  }

  const response = await fetch(`/api/units?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || "Error al buscar unidades");
  }

  return response.json();
}

export async function getUnitDetails(unitId: number): Promise<UnitDetailsResponse> {
  const response = await fetch(`/api/units/${unitId}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || "Error al obtener detalle de la unidad");
  }

  return response.json();
}

export interface UpdateUnitParams {
  unitId: number;
  data: Partial<UnitDetails>;
}

export async function updateUnitDetails(
  params: UpdateUnitParams
): Promise<UnitDetailsResponse> {
  const response = await fetch(`/api/units/${params.unitId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(error.error || "Error al actualizar la unidad");
  }

  return response.json();
}
