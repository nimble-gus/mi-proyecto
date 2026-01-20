"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { UnitsFiltersBar } from "../components/UnitsFiltersBar";
import { UnitsList } from "../components/UnitsList";
import { useUnitsCatalogs } from "../hooks/useUnitsCatalogs";
import { useUnitsSearch } from "../hooks/useUnitsSearch";
import { useRecordDetails } from "@/src/features/projects/hooks/useRecordDetails";
import { LoadingState } from "@/src/shared/components/feedback";

export function UnitsSearchPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id ? parseInt(params.id as string, 10) : null;

  // Estados de filtros
  const [selectedUse, setSelectedUse] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);

  // Cargar contexto del proyecto (nombre y período)
  const { details: projectDetails, loadingDetails: loadingProject, loadDetails } = useRecordDetails();

  // Cargar detalles del proyecto al montar
  useEffect(() => {
    if (recordId && !isNaN(recordId) && recordId > 0) {
      loadDetails(recordId);
    }
  }, [recordId, loadDetails]);

  // Validar recordId
  useEffect(() => {
    if (!recordId || isNaN(recordId) || recordId <= 0) {
      router.push("/search");
    }
  }, [recordId, router]);

  // Obtener período del proyecto para los catálogos
  const period = projectDetails?.periodo || undefined;

  // Hooks para catálogos y búsqueda
  const catalogsParams = recordId
    ? { recordId, period: period || undefined }
    : null;

  const { catalogs, loading: loadingCatalogs } = useUnitsCatalogs(catalogsParams);

  const searchParams = recordId
    ? {
        recordId,
        period: period || undefined,
        use: selectedUse || undefined,
        availability: selectedAvailability || undefined,
        bedrooms: selectedBedrooms || undefined,
        pageSize: 5, // Mismo pageSize que proyectos
        sort: "new" as const,
      }
    : null;

  const {
    data,
    loading: loadingUnits,
    error,
    page,
    goToPreviousPage,
    goToNextPage,
  } = useUnitsSearch(searchParams);

  // Verificar si hay filtros activos
  const hasFilters =
    selectedUse !== "" || selectedAvailability !== "" || selectedBedrooms !== null;

  const handleClearFilters = useCallback(() => {
    setSelectedUse("");
    setSelectedAvailability("");
    setSelectedBedrooms(null);
  }, []);

  const handleUseChange = useCallback((use: string) => {
    setSelectedUse(use);
  }, []);

  const handleAvailabilityChange = useCallback((availability: string) => {
    setSelectedAvailability(availability);
  }, []);

  const handleBedroomsChange = useCallback((bedrooms: number | null) => {
    setSelectedBedrooms(bedrooms);
  }, []);

  if (!recordId || isNaN(recordId) || recordId <= 0) {
    return null;
  }

  // Mostrar loading mientras se carga el contexto del proyecto
  if (loadingProject) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <LoadingState message="Cargando información del proyecto..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans lg:flex-row">
      {/* Sidebar de Filtros - Mobile: arriba, Desktop: izquierda */}
      <aside className="w-full border-b border-[#E5E7EB] bg-[#F3F4F6] p-4 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto">
        <UnitsFiltersBar
          uses={catalogs?.uses || []}
          availabilities={catalogs?.availabilities || []}
          bedrooms={catalogs?.bedrooms || []}
          loading={loadingCatalogs}
          selectedUse={selectedUse}
          setSelectedUse={handleUseChange}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={handleAvailabilityChange}
          selectedBedrooms={selectedBedrooms}
          setSelectedBedrooms={handleBedroomsChange}
          onClearFilters={handleClearFilters}
          hasFilters={hasFilters}
        />
      </aside>

      {/* Área Principal */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-r from-[#4DA3FF]/10 via-[#1F3A5F]/5 to-[#4DA3FF]/10 p-6 border-2 border-[#4DA3FF]/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#1F3A5F] to-[#4DA3FF] bg-clip-text text-transparent lg:text-3xl">
                {projectDetails?.proyecto || "Unidades del Proyecto"}
              </h1>
              {projectDetails?.periodo && (
                <p className="mt-1 text-sm text-[#6B7280]">
                  Período: <span className="font-medium text-[#1F3A5F]">{projectDetails.periodo}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => router.push(`/records/${recordId}`)}
              className="flex items-center gap-2 rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-all hover:border-[#4DA3FF] hover:bg-[#4DA3FF]/10 hover:text-[#4DA3FF]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Regresar a proyecto
            </button>
          </div>
        </div>

        {/* Header de resultados */}
        {data && (
          <div className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-gradient-to-r from-white to-[#F3F4F6]/30 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>
                <span className="font-semibold text-[#1F3A5F]">{data.totalItems}</span>{" "}
                {data.totalItems === 1 ? "unidad encontrada" : "unidades encontradas"}
              </span>
            </div>
          </div>
        )}

        {/* Lista de resultados */}
        <UnitsList
          units={data?.items || []}
          loading={loadingUnits}
          error={error}
          page={page}
          totalPages={data?.totalPages || 0}
          totalItems={data?.totalItems || 0}
          pageSize={data?.pageSize || 5}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </main>
    </div>
  );
}
