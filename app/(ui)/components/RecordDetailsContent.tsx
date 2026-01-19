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
        <p className="text-zinc-600 dark:text-zinc-400">Cargando detalles...</p>
      </div>
    );
  }

  // Estado de error
  if (errorDetails && !loadingDetails) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">{errorDetails}</p>
      </div>
    );
  }

  // Sin detalles
  if (!details) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">No se encontraron detalles</p>
      </div>
    );
  }

  // Contenido de detalles
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Información Básica */}
      <div className="col-span-full">
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
          Información Básica
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Proyecto:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.proyecto)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Fase:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.fase)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Torre:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.torre)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Período:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.periodo)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Categoría:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.categoria)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Estado:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.estado)}</p>
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="col-span-full">
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Ubicación</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">País:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.pais)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Departamento:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.departamento)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Municipio:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.municipio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Zona:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.zona)}</p>
          </div>
        </div>
      </div>

      {/* Desarrollador */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Desarrollador</h3>
        <div>
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Desarrollador:</span>
          <p className="text-black dark:text-zinc-50">{formatValue(details.desarrollador)}</p>
        </div>
      </div>

      {/* Fechas */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Fechas</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Fecha Inicio:</span>
            <p className="text-black dark:text-zinc-50">{formatDate(details.fecha_inicio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Fecha Entrega:</span>
            <p className="text-black dark:text-zinc-50">{formatDate(details.fecha_entrega)}</p>
          </div>
        </div>
      </div>

      {/* Unidades */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Unidades</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Unidades:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.total_unidades ?? 0)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Unidades Disponibles:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.unidades_disponibles ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Precios */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Precios</h3>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Precio Promedio:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.precio_promedio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Cuota Promedio:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.cuota_promedio)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Ingresos Promedio:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.ingresos_promedio)}</p>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="col-span-full">
        <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Información Adicional</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tipo de Seguridad:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.tipo_de_seguridad)}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Cantidad Accesos:</span>
            <p className="text-black dark:text-zinc-50">{formatValue(details.cantidad_accesos)}</p>
          </div>
          <div className="col-span-full">
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">URL Imagen:</span>
            <p className="break-all text-black dark:text-zinc-50">
              {details.url_imagen ? (
                <a
                  href={details.url_imagen}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
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
