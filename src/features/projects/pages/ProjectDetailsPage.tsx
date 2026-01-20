"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRecordDetails } from "../hooks/useRecordDetails";
import { useUpdateRecord } from "../hooks/useUpdateRecord";
import { RecordDetailsContent } from "@/src/shared/components/details/RecordDetailsContent";
import { RecordDetails } from "../types/domain";

interface ProjectDetailsPageProps {
  id: string;
}

export function ProjectDetailsPage({ id }: ProjectDetailsPageProps) {
  const router = useRouter();

  const { details, loadingDetails, errorDetails, loadDetails } = useRecordDetails();
  const { updateRecord, loading: updating, error: updateError, success: updateSuccess, resetState } = useUpdateRecord();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<RecordDetails>>({});
  const [originalData, setOriginalData] = useState<RecordDetails | null>(null);
  const [savedChanges, setSavedChanges] = useState<Record<string, { old: any; new: any }> | null>(null);

  useEffect(() => {
    const recordId = parseInt(id, 10);
    if (!isNaN(recordId) && recordId > 0) {
      loadDetails(recordId);
    }
  }, [id, loadDetails]);

  // Inicializar datos editables cuando se entra en modo edición
  useEffect(() => {
    if (isEditing && details) {
      setOriginalData({ ...details });
      setEditedData({ ...details });
    }
  }, [isEditing, details]);

  // Función helper para comparar valores
  const compareValues = (oldValue: any, newValue: any): boolean => {
    // Manejar null/undefined
    if (oldValue === null || oldValue === undefined) {
      return newValue !== null && newValue !== undefined && newValue !== "";
    }
    if (newValue === null || newValue === undefined || newValue === "") {
      return oldValue !== null && oldValue !== undefined;
    }
    
    // Comparar fechas (como strings YYYY-MM-DD sin conversión a Date)
    if (typeof oldValue === 'string' && typeof newValue === 'string') {
      // Si son strings de fecha (tienen formato YYYY-MM-DD o ISO)
      const oldDateStr = oldValue.length >= 10 ? oldValue.slice(0, 10) : oldValue;
      const newDateStr = newValue.length >= 10 ? newValue.slice(0, 10) : newValue;
      if (oldDateStr.match(/^\d{4}-\d{2}-\d{2}$/) && newDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return oldDateStr !== newDateStr;
      }
    }
    
    // Comparar números
    if (typeof oldValue === 'number' || typeof newValue === 'number') {
      return Number(oldValue) !== Number(newValue);
    }
    
    // Comparar strings
    return String(oldValue).trim() !== String(newValue).trim();
  };

  // Función para detectar cambios
  const detectChanges = (original: RecordDetails | null, edited: Partial<RecordDetails>): Record<string, { old: any; new: any }> => {
    const changes: Record<string, { old: any; new: any }> = {};
    
    if (!original) return changes;

    const editableFields: (keyof RecordDetails)[] = [
      'fase',
      'estado',
      'fecha_inicio',
      'fecha_entrega',
      'precio_promedio',
      'cuota_promedio',
      'ingresos_promedio',
      'unidades_disponibles',
    ];

    editableFields.forEach((field) => {
      const oldValue = original[field];
      const newValue = edited[field];
      
      if (compareValues(oldValue, newValue)) {
        changes[field] = {
          old: oldValue,
          new: newValue,
        };
      }
    });

    return changes;
  };

  // Recargar datos después de actualización exitosa
  useEffect(() => {
    if (updateSuccess && originalData) {
      const recordId = parseInt(id, 10);
      if (!isNaN(recordId) && recordId > 0) {
        // Detectar cambios para mostrar en el mensaje de éxito
        const changes = detectChanges(originalData, editedData);
        if (Object.keys(changes).length > 0) {
          setSavedChanges(changes);
        }
        
        // Recargar los detalles actualizados
        loadDetails(recordId);
        setIsEditing(false);
        setOriginalData(null);
        
        // Limpiar el mensaje después de 8 segundos (más tiempo según README)
        // El usuario puede cerrarlo manualmente antes con el botón X
        const timeoutId = setTimeout(() => {
          setSavedChanges(null);
          resetState();
        }, 8000);
        
        // Cleanup del timeout si el componente se desmonta
        return () => clearTimeout(timeoutId);
      }
    }
  }, [updateSuccess, id, loadDetails, resetState, originalData, editedData]);

  const handleGoBack = () => {
    router.push("/search");
  };

  const handleEdit = () => {
    setIsEditing(true);
    resetState();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
    setOriginalData(null);
    setSavedChanges(null);
    resetState();
  };

  const handleSave = async () => {
    const recordId = parseInt(id, 10);
    if (!isNaN(recordId) && recordId > 0 && editedData && originalData) {
      // Limpiar errores previos y cambios guardados
      setSavedChanges(null);
      
      // Preparar datos para enviar (solo campos editables)
      // Convertir strings vacíos a null para campos numéricos y de texto
      const updateData: any = {};
      if (editedData.fase !== undefined) updateData.fase = editedData.fase === "" ? null : editedData.fase;
      if (editedData.estado !== undefined) updateData.estado = editedData.estado === "" ? null : editedData.estado;
      if (editedData.fecha_inicio !== undefined) updateData.fecha_inicio = editedData.fecha_inicio === "" ? null : editedData.fecha_inicio;
      if (editedData.fecha_entrega !== undefined) updateData.fecha_entrega = editedData.fecha_entrega === "" ? null : editedData.fecha_entrega;
      if (editedData.precio_promedio !== undefined) updateData.precio_promedio = editedData.precio_promedio === "" ? null : editedData.precio_promedio;
      if (editedData.cuota_promedio !== undefined) updateData.cuota_promedio = editedData.cuota_promedio === "" ? null : editedData.cuota_promedio;
      if (editedData.ingresos_promedio !== undefined) updateData.ingresos_promedio = editedData.ingresos_promedio === "" ? null : editedData.ingresos_promedio;
      if (editedData.unidades_disponibles !== undefined) {
        updateData.unidades_disponibles = editedData.unidades_disponibles;
      }

      // Llamar a updateRecord - el useEffect manejará el éxito y establecerá savedChanges
      await updateRecord(recordId, updateData);
    }
  };

  const handleFieldChange = (field: keyof RecordDetails, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        {/* Header sticky con botón volver, título y editar */}
        <div className="sticky top-0 z-10 mb-6 flex items-center gap-4 border-b-2 border-[#4DA3FF]/20 bg-gradient-to-r from-white via-[#F3F4F6]/30 to-white py-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 rounded-lg border-2 border-[#4DA3FF] bg-[#4DA3FF]/10 px-4 py-2 text-sm font-semibold text-[#4DA3FF] transition-all hover:bg-[#4DA3FF] hover:text-white hover:shadow-md"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
          <h1 className="flex-1 text-2xl font-semibold bg-gradient-to-r from-[#1F3A5F] to-[#4DA3FF] bg-clip-text text-transparent lg:text-3xl">
            Detalles del Proyecto
          </h1>
          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                type="button"
                onClick={() => router.push(`/records/${id}/units`)}
                className="rounded-lg border-2 border-[#10B981] bg-gradient-to-r from-[#10B981] to-[#059669] px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-[#059669] hover:to-[#10B981] hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Ver Unidades
              </button>
            )}
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEdit}
                className="rounded-lg border-2 border-[#4DA3FF] bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-8 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:from-[#1F3A5F] hover:to-[#4DA3FF] hover:shadow-xl hover:scale-105"
              >
                Editar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border-2 border-[#EF4444] bg-[#EF4444]/10 px-8 py-2 text-sm font-semibold text-[#EF4444] transition-all hover:bg-[#EF4444] hover:text-white hover:shadow-md"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Mensajes de error */}
        {updateError && (
          <div className="mb-4 rounded-lg border-2 border-[#EF4444] bg-[#EF4444]/10 p-4 text-sm text-[#EF4444]">
            {updateError}
          </div>
        )}

        {/* Mensaje de éxito con cambios guardados */}
        {savedChanges && Object.keys(savedChanges).length > 0 && (
          <div className="mb-4 rounded-lg border-2 border-[#10B981] bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5 p-4 shadow-md">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-base font-semibold text-[#10B981]">
                  ¡Tus cambios han sido guardados!
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1F3A5F] mb-2">Campos modificados:</p>
                  <ul className="space-y-1.5">
                    {Object.entries(savedChanges).map(([field, { old, new: newValue }]) => {
                      const fieldLabels: Record<string, string> = {
                        fase: "Fase",
                        estado: "Estado",
                        fecha_inicio: "Fecha Inicio",
                        fecha_entrega: "Fecha Entrega",
                        precio_promedio: "Precio Promedio",
                        cuota_promedio: "Cuota Promedio",
                        ingresos_promedio: "Ingresos Promedio",
                        unidades_disponibles: "Unidades Disponibles",
                      };

                      const formatValue = (value: any): string => {
                        if (value === null || value === undefined || value === "") return "N/A";
                        if (typeof value === "string") {
                          if (value.length >= 10) {
                            return value.slice(0, 10); // "YYYY-MM-DD"
                          }
                          return value;
                        }
                        return String(value);
                      };

                      return (
                        <li key={field} className="flex items-start gap-2 text-sm text-[#111827]">
                          <span className="font-semibold text-[#1F3A5F]">{fieldLabels[field] || field}:</span>
                          <span className="text-[#6B7280] line-through">{formatValue(old)}</span>
                          <span className="text-[#4DA3FF]">→</span>
                          <span className="font-medium text-[#10B981]">{formatValue(newValue)}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSavedChanges(null);
                  resetState();
                }}
                className="flex-shrink-0 rounded-lg p-1 text-[#6B7280] transition-colors hover:bg-[#10B981]/10 hover:text-[#10B981]"
                aria-label="Cerrar mensaje"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Contenido de detalles */}
        <div className="rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-white to-[#F3F4F6]/30 p-6 shadow-lg ring-1 ring-[#4DA3FF]/10">
          <RecordDetailsContent
            details={isEditing ? (editedData as RecordDetails) : details}
            loadingDetails={loadingDetails}
            errorDetails={errorDetails || updateError}
            isEditing={isEditing}
            onFieldChange={handleFieldChange}
          />
        </div>

        {/* Imagen del proyecto */}
        {details?.url_imagen && (
          <div className="mt-6 rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-white to-[#4DA3FF]/5 p-6 shadow-lg ring-1 ring-[#4DA3FF]/10">
            <h2 className="mb-4 text-xl font-semibold text-[#1F3A5F] flex items-center gap-2 border-b-2 border-[#4DA3FF]/20 pb-2">
              <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Imagen del Proyecto
            </h2>
            <div className="flex justify-center">
              <img
                src={details.url_imagen}
                alt={`Imagen de ${details.proyecto}`}
                className="max-h-[600px] w-full rounded-lg object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<p class="text-[#6B7280] text-center py-8">No se pudo cargar la imagen</p>';
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Footer sticky con botón guardar */}
        {isEditing && (
          <div className="sticky bottom-0 z-10 mt-6 flex justify-center border-t-2 border-[#4DA3FF]/20 bg-gradient-to-r from-white via-[#F3F4F6]/30 to-white py-4 backdrop-blur-sm">
            <button
              type="button"
              onClick={handleSave}
              disabled={updating}
              className="rounded-lg bg-gradient-to-r from-[#4DA3FF] via-[#1F3A5F] to-[#4DA3FF] bg-size-200 bg-pos-0 px-8 py-3 text-base font-semibold text-white shadow-xl transition-all hover:bg-pos-100 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Guardando..." : "Guardar"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
