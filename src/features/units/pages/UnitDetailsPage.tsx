"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUnitDetails } from "../hooks/useUnitDetails";
import { useUpdateUnit } from "../hooks/useUpdateUnit";
import { useRecordIdFromUnit } from "../hooks/useRecordIdFromUnit";
import { UnitDetails } from "../types/domain";
import { formatValue, formatDate } from "@/src/shared/utils/formatters";

interface UnitDetailsPageProps {
  unitId: string;
}

export function UnitDetailsPage({ unitId }: UnitDetailsPageProps) {
  const router = useRouter();
  const { details, loadingDetails, errorDetails, loadDetails } = useUnitDetails();
  const { updateUnit, loading: updating, error: updateError } = useUpdateUnit();

  // Obtener recordId desde proyecto y periodo
  const { recordId, loading: loadingRecordId } = useRecordIdFromUnit(
    details?.proyecto || null,
    details?.periodo || null
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UnitDetails>>({});
  const [originalData, setOriginalData] = useState<UnitDetails | null>(null);

  useEffect(() => {
    const id = parseInt(unitId, 10);
    if (!isNaN(id) && id > 0) {
      loadDetails(id);
    }
  }, [unitId, loadDetails]);

  useEffect(() => {
    if (isEditing && details) {
      setOriginalData({ ...details });
      setEditedData({ ...details });
    }
  }, [isEditing, details]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
    setOriginalData(null);
  };

  const handleSave = async () => {
    if (!details) return;

    const id = parseInt(unitId, 10);
    if (isNaN(id) || id <= 0) return;

    const updated = await updateUnit({
      unitId: id,
      data: editedData,
    });

    if (updated) {
      setIsEditing(false);
      setOriginalData(null);
      setEditedData({});
      // Recargar detalles
      loadDetails(id);
    }
  };

  const handleFieldChange = (field: keyof UnitDetails, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loadingDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F3F4F6] to-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#4DA3FF] border-t-transparent"></div>
          <p className="text-lg font-medium text-[#6B7280]">Cargando detalles de la unidad...</p>
        </div>
      </div>
    );
  }

  if (errorDetails || !details) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F3F4F6] to-white">
        <div className="text-center">
          <div className="mb-4 text-6xl text-[#EF4444]">⚠️</div>
          <p className="text-lg font-medium text-[#EF4444]">
            {errorDetails || "Error al cargar los detalles de la unidad"}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-6 py-2 text-white transition-all hover:shadow-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const dataToDisplay = isEditing ? editedData : details;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F4F6] to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-gradient-to-r from-white to-[#F3F4F6]/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                // Si tenemos recordId, navegar a la página de unidades
                if (recordId) {
                  router.push(`/records/${recordId}/units`);
                } else {
                  // Si no, intentar volver usando router.back()
                  router.back();
                }
              }}
              className="flex items-center gap-2 rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-all hover:border-[#4DA3FF] hover:bg-[#4DA3FF]/10 hover:text-[#4DA3FF]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="flex-1 text-2xl font-semibold bg-gradient-to-r from-[#1F3A5F] to-[#4DA3FF] bg-clip-text text-transparent lg:text-3xl text-center">
              Detalles de la Unidad
            </h1>
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
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {updateError && (
          <div className="mb-4 rounded-lg border-2 border-[#EF4444] bg-[#EF4444]/10 p-4 text-sm text-[#EF4444]">
            {updateError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Información Básica */}
          <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#4DA3FF]/5 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-b-2 border-[#4DA3FF]/20 pb-2 text-lg font-semibold text-[#1F3A5F]">
              <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Información Básica
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Proyecto</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.proyecto)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Unidad</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.unidad || ""}
                    onChange={(e) => handleFieldChange("unidad", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.unidad)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Período</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.periodo)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Modelo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.modelo || ""}
                    onChange={(e) => handleFieldChange("modelo", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.modelo)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Torre/Fase</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.torre_fase || ""}
                    onChange={(e) => handleFieldChange("torre_fase", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.torre_fase)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Uso</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.uso || ""}
                    onChange={(e) => handleFieldChange("uso", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.uso)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Disponibilidad</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.disponibilidad || ""}
                    onChange={(e) => handleFieldChange("disponibilidad", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.disponibilidad)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Categoría</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.categoria || ""}
                    onChange={(e) => handleFieldChange("categoria", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.categoria)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Hora Recolección</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.hora_recoleccion)}</p>
              </div>
            </div>
          </div>

          {/* Características y Tamaños */}
          <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#10B981]/5 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-b-2 border-[#10B981]/20 pb-2 text-lg font-semibold text-[#1F3A5F]">
              <svg className="h-5 w-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Características y Tamaños
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Dormitorios</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={dataToDisplay.cant_dormitorios || ""}
                    onChange={(e) => handleFieldChange("cant_dormitorios", e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.cant_dormitorios)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Sanitarios</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={dataToDisplay.cant_sanitarios || ""}
                    onChange={(e) => handleFieldChange("cant_sanitarios", e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.cant_sanitarios)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Tamaño Unidad (m²)</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.tama_o_unidad)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Tamaño Balcón/Terraza (m²)</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.tama_o_balcon_terraza)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Tamaño Total (m²)</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.tama_o_total)}</p>
              </div>
            </div>
          </div>

          {/* Parqueo */}
          <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#1F3A5F]/5 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-b-2 border-[#1F3A5F]/20 pb-2 text-lg font-semibold text-[#1F3A5F]">
              <svg className="h-5 w-5 text-[#1F3A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Parqueo
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Parqueo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.parqueo || ""}
                    onChange={(e) => handleFieldChange("parqueo", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.parqueo)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Tipo Parqueo</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.tipo_parqueo || ""}
                    onChange={(e) => handleFieldChange("tipo_parqueo", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.tipo_parqueo)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Cantidad Parqueos</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={dataToDisplay.cant_parqueos || ""}
                    onChange={(e) => handleFieldChange("cant_parqueos", e.target.value ? parseInt(e.target.value, 10) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.cant_parqueos)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Parqueo Motos</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={dataToDisplay.parqueo_moto || ""}
                    onChange={(e) => handleFieldChange("parqueo_moto", e.target.value)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.parqueo_moto)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Tamaño Parqueo (m²)</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.tama_o_parqueo)}</p>
              </div>
            </div>
          </div>

          {/* Precios */}
          <div className="rounded-lg border border-[#E5E7EB] bg-gradient-to-br from-white to-[#F59E0B]/5 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 border-b-2 border-[#F59E0B]/20 pb-2 text-lg font-semibold text-[#1F3A5F]">
              <svg className="h-5 w-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Precios
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Precio Total (USD)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={dataToDisplay.precio_total_usd || ""}
                    onChange={(e) => handleFieldChange("precio_total_usd", e.target.value ? parseFloat(e.target.value) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.precio_total_usd)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Precio Total (GTQ)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={dataToDisplay.precio_total_qtz || ""}
                    onChange={(e) => handleFieldChange("precio_total_qtz", e.target.value ? parseFloat(e.target.value) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.precio_total_qtz)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Precio Sin IVA (USD)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={dataToDisplay.precio_sin_iva_usd || ""}
                    onChange={(e) => handleFieldChange("precio_sin_iva_usd", e.target.value ? parseFloat(e.target.value) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.precio_sin_iva_usd)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Precio Sin IVA (GTQ)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={dataToDisplay.precio_sin_iva_qtz || ""}
                    onChange={(e) => handleFieldChange("precio_sin_iva_qtz", e.target.value ? parseFloat(e.target.value) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.precio_sin_iva_qtz)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Precio Mantenimiento Total</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={dataToDisplay.precio_mantenimiento_total || ""}
                    onChange={(e) => handleFieldChange("precio_mantenimiento_total", e.target.value ? parseFloat(e.target.value) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.precio_mantenimiento_total)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Cuota</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={dataToDisplay.cuota || ""}
                    onChange={(e) => handleFieldChange("cuota", e.target.value ? parseFloat(e.target.value) : null)}
                    className="mt-1 w-full rounded-lg border-2 border-[#E5E7EB] px-3 py-2 focus:border-[#4DA3FF] focus:outline-none"
                  />
                ) : (
                  <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.cuota)}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-[#1F3A5F]">Absorción Unitaria</label>
                <p className="mt-1 text-[#111827]">{formatValue(dataToDisplay.absorcion_unitaria)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botón Guardar */}
        {isEditing && (
          <div className="sticky bottom-0 mt-6 border-t border-[#E5E7EB] bg-gradient-to-r from-white to-[#F3F4F6]/50 backdrop-blur-sm py-4">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSave}
                disabled={updating}
                className="rounded-lg bg-gradient-to-r from-[#4DA3FF] via-[#1F3A5F] to-[#4DA3FF] bg-size-200 bg-pos-0 px-12 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-pos-100 hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
