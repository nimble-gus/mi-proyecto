"use client";

import { RecordDetails } from "@/src/features/projects/types/domain";
import { formatValue, formatDate } from "@/src/shared/utils/formatters";

interface RecordDetailsContentProps {
  details: RecordDetails | null;
  loadingDetails: boolean;
  errorDetails: string | null;
  isEditing?: boolean;
  onFieldChange?: (field: keyof RecordDetails, value: any) => void;
}

export function RecordDetailsContent({
  details,
  loadingDetails,
  errorDetails,
  isEditing = false,
  onFieldChange,
}: RecordDetailsContentProps) {
  // Estado de carga
  if (loadingDetails) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#6B7280]">Cargando detalles...</p>
      </div>
    );
  }

  // Estado de error
  if (errorDetails && !loadingDetails) {
    return (
      <div className="rounded-lg border border-[#EF4444]/30 bg-[#FEE2E2] p-4 text-center">
        <p className="text-[#DC2626]">{errorDetails}</p>
      </div>
    );
  }

  // Sin detalles
  if (!details) {
    return (
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 text-center">
        <p className="text-[#6B7280]">No se encontraron detalles</p>
      </div>
    );
  }

  // Contenido de detalles
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Información Básica */}
      <div className="col-span-full rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#4DA3FF]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#4DA3FF]/20 pb-2">
          <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Información Básica
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-semibold text-[#1F3A5F]">Proyecto:</span>
            <p className="mt-1 text-[#111827] font-medium">{formatValue(details.proyecto)}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1F3A5F]">Fase:</span>
            {isEditing ? (
              <input
                type="text"
                value={details.fase || ""}
                onChange={(e) => onFieldChange?.("fase", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="mt-1 text-[#111827] font-medium">{formatValue(details.fase)}</p>
            )}
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1F3A5F]">Torre:</span>
            <p className="mt-1 text-[#111827] font-medium">{formatValue(details.torre)}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1F3A5F]">Período:</span>
            <p className="mt-1 text-[#111827] font-medium">{formatValue(details.periodo)}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1F3A5F]">Categoría:</span>
            <p className="mt-1 text-[#4DA3FF] font-semibold">{formatValue(details.categoria)}</p>
          </div>
          <div>
            <span className="text-sm font-semibold text-[#1F3A5F]">Estado:</span>
            {isEditing ? (
              <input
                type="text"
                value={details.estado || ""}
                onChange={(e) => onFieldChange?.("estado", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="mt-1 text-[#10B981] font-semibold">{formatValue(details.estado)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="col-span-full rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#1F3A5F]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#1F3A5F]/20 pb-2">
          <svg className="h-5 w-5 text-[#1F3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Ubicación
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">País:</span>
            <p className="text-[#111827]">{formatValue(details.pais)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Departamento:</span>
            <p className="text-[#111827]">{formatValue(details.departamento)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Municipio:</span>
            <p className="text-[#111827]">{formatValue(details.municipio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Zona:</span>
            <p className="text-[#111827]">{formatValue(details.zona)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Latitud:</span>
            <p className="text-[#111827]">{details.latitud !== null && details.latitud !== undefined ? details.latitud : "N/A"}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Longitud:</span>
            <p className="text-[#111827]">{details.longitud !== null && details.longitud !== undefined ? details.longitud : "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Desarrollador */}
      <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#F59E0B]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#F59E0B]/20 pb-2">
          <svg className="h-5 w-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Desarrollador
        </h3>
        <div>
          <span className="text-sm font-medium text-[#6B7280]">Desarrollador:</span>
          <p className="text-[#111827]">{formatValue(details.desarrollador)}</p>
        </div>
      </div>

      {/* Fechas */}
      <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#10B981]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#10B981]/20 pb-2">
          <svg className="h-5 w-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Fechas
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Fecha Inicio:</span>
            {isEditing ? (
              <input
                type="date"
                value={details.fecha_inicio ? details.fecha_inicio.slice(0, 10) : ""}
                onChange={(e) => onFieldChange?.("fecha_inicio", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="text-[#111827]">{formatDate(details.fecha_inicio)}</p>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Fecha Entrega:</span>
            {isEditing ? (
              <input
                type="date"
                value={details.fecha_entrega ? details.fecha_entrega.slice(0, 10) : ""}
                onChange={(e) => onFieldChange?.("fecha_entrega", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="text-[#111827]">{formatDate(details.fecha_entrega)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Unidades */}
      <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#10B981]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#10B981]/20 pb-2">
          <svg className="h-5 w-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Unidades
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Total Unidades:</span>
            <p className="text-[#111827]">{formatValue(details.total_unidades ?? 0)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Unidades Disponibles:</span>
            {isEditing ? (
              <input
                type="number"
                value={details.unidades_disponibles ?? ""}
                onChange={(e) => onFieldChange?.("unidades_disponibles", e.target.value ? parseInt(e.target.value, 10) : null)}
                min="0"
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="text-[#111827]">{formatValue(details.unidades_disponibles ?? 0)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Precios */}
      <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#F59E0B]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#F59E0B]/20 pb-2">
          <svg className="h-5 w-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Precios
        </h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Precio Promedio:</span>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={details.precio_promedio || ""}
                onChange={(e) => onFieldChange?.("precio_promedio", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="text-[#111827]">{formatValue(details.precio_promedio)}</p>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Cuota Promedio:</span>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={details.cuota_promedio || ""}
                onChange={(e) => onFieldChange?.("cuota_promedio", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="text-[#111827]">{formatValue(details.cuota_promedio)}</p>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Ingresos Promedio:</span>
            {isEditing ? (
              <input
                type="number"
                step="0.01"
                value={details.ingresos_promedio || ""}
                onChange={(e) => onFieldChange?.("ingresos_promedio", e.target.value || null)}
                className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-3 py-2 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30"
              />
            ) : (
              <p className="text-[#111827]">{formatValue(details.ingresos_promedio)}</p>
            )}
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="col-span-full rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#4DA3FF]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F3A5F] border-b-2 border-[#4DA3FF]/20 pb-2">
          <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Información Adicional
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Tipo de Seguridad:</span>
            <p className="text-[#111827]">{formatValue(details.tipo_de_seguridad)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Cantidad Accesos:</span>
            <p className="text-[#111827]">{formatValue(details.cantidad_accesos)}</p>
          </div>
          <div className="col-span-full">
            <span className="text-sm font-medium text-[#6B7280]">URL Imagen:</span>
            <p className="break-all text-[#111827]">
              {details.url_imagen ? (
                <a
                  href={details.url_imagen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4DA3FF] hover:underline"
                >
                  {details.url_imagen}
                </a>
              ) : (
                "N/A"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
