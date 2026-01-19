"use client";

import { useEffect, useRef, useCallback } from "react";
import { RecordDetails } from "@/src/types/domain";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: RecordDetails | null;
  loadingDetails: boolean;
  errorDetails: string | null;
}

// Funciones helper para formatear valores
const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }
  if (typeof value === "string" && value.trim() === "") {
    return "N/A";
  }
  return String(value);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

export function DetailsModal({
  isOpen,
  onClose,
  details,
  loadingDetails,
  errorDetails,
}: DetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal al hacer click afuera y prevenir scroll del body
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        const target = event.target as HTMLElement;
        if (target.classList.contains("modal-overlay")) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      >
        {/* Header del Modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            Detalles del Proyecto
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label="Cerrar modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6">
          {loadingDetails && (
            <div className="flex items-center justify-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">Cargando detalles...</p>
            </div>
          )}

          {errorDetails && !loadingDetails && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
              <p className="text-red-600 dark:text-red-400">{errorDetails}</p>
            </div>
          )}

          {!loadingDetails && !errorDetails && details && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Información Básica */}
              <div className="col-span-full">
                <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">ID:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.id)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Código Proyecto:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.cod_proyecto)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Proyecto:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.proyecto)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Categoría:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.categoria)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Estado:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.estado)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Uso:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.uso)}</p>
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
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Mercado:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.mercado)}</p>
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
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Subzona:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.subzona)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Latitud:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.latitud)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Longitud:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.longitud)}</p>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="col-span-full">
                <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Fechas</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Fecha Recolección:</span>
                    <p className="text-black dark:text-zinc-50">{formatDate(details.fecha_recoleccion)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Fecha Inicio:</span>
                    <p className="text-black dark:text-zinc-50">{formatDate(details.fecha_inicio)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Fecha Entrega:</span>
                    <p className="text-black dark:text-zinc-50">{formatDate(details.fecha_entrega)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Meses de Comercialización:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.meses_de_comercializacion)}</p>
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

              {/* Unidades y Área */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Unidades y Área</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Unidades:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.total_unidades)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Unidades Disponibles:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.unidades_disponibles)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total m²:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.total_m2)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">m² Disponibles:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.m2_disponibles)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Tamaño Promedio:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.tamano_promedio)} m²</p>
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
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Precio Promedio m²:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.precio_prom_m2)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Cuota Promedio:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.cuota_promedio)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Ingresos Promedio:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.ingresos_promedio)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Precio Parqueo Adicional:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.precio_parqueo_adicional)}</p>
                  </div>
                </div>
              </div>

              {/* Parqueos */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">Parqueos</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Parqueos Proyecto:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.total_parqueos_proyecto)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Parqueos Asignados:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.parqueos_asignados)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Parqueos Visita:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.parqueos_visita)}</p>
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
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">MUVI:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.muvi)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">FHA:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.fha)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">NSE Proyecto:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.nse_proyecto)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Showroom:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.showroom)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Casa Modelo:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.casa_modelo)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Cantidad Accesos:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.cantidad_accesos)}</p>
                  </div>
                  <div>
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
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Mig Number:</span>
                    <p className="text-black dark:text-zinc-50">{formatValue(details.mig_number)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Creado en:</span>
                    <p className="text-black dark:text-zinc-50">{formatDate(details.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
