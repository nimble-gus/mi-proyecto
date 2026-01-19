"use client";

import { RecordDetails } from "@/src/types/domain";
import { formatValue, formatDate } from "@/src/lib/utils/formatters";

interface RecordDetailsContentProps {
  details: RecordDetails | null;
  loadingDetails: boolean;
  errorDetails: string | null;
}

export function RecordDetailsContent({
  details,
  loadingDetails,
  errorDetails,
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
      <div className="col-span-full">
        <h3 className="mb-3 text-base font-semibold text-[#111827]">
          Información Básica
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Proyecto:</span>
            <p className="text-[#111827]">{formatValue(details.proyecto)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Fase:</span>
            <p className="text-[#111827]">{formatValue(details.fase)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Torre:</span>
            <p className="text-[#111827]">{formatValue(details.torre)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Período:</span>
            <p className="text-[#111827]">{formatValue(details.periodo)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Categoría:</span>
            <p className="text-[#111827]">{formatValue(details.categoria)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Estado:</span>
            <p className="text-[#111827]">{formatValue(details.estado)}</p>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="col-span-full">
        <h3 className="mb-3 text-base font-semibold text-[#111827]">Ubicación</h3>
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
        </div>
      </div>

      {/* Desarrollador */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-[#111827]">Desarrollador</h3>
        <div>
          <span className="text-sm font-medium text-[#6B7280]">Desarrollador:</span>
          <p className="text-[#111827]">{formatValue(details.desarrollador)}</p>
        </div>
      </div>

      {/* Fechas */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-[#111827]">Fechas</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Fecha Inicio:</span>
            <p className="text-[#111827]">{formatDate(details.fecha_inicio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Fecha Entrega:</span>
            <p className="text-[#111827]">{formatDate(details.fecha_entrega)}</p>
          </div>
        </div>
      </div>

      {/* Unidades */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-[#111827]">Unidades</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Total Unidades:</span>
            <p className="text-[#111827]">{formatValue(details.total_unidades ?? 0)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Unidades Disponibles:</span>
            <p className="text-[#111827]">{formatValue(details.unidades_disponibles ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Precios */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-[#111827]">Precios</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Precio Promedio:</span>
            <p className="text-[#111827]">{formatValue(details.precio_promedio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Cuota Promedio:</span>
            <p className="text-[#111827]">{formatValue(details.cuota_promedio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-[#6B7280]">Ingresos Promedio:</span>
            <p className="text-[#111827]">{formatValue(details.ingresos_promedio)}</p>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="col-span-full">
        <h3 className="mb-3 text-base font-semibold text-[#111827]">Información Adicional</h3>
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
