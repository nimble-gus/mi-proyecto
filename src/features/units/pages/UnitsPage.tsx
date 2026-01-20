"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UnitsFiltersBar } from "../components/UnitsFiltersBar";
import { UnitsList } from "../components/UnitsList";
import { useUnitsCatalogs } from "../hooks/useUnitsCatalogs";
import { useUnitsSearch } from "../hooks/useUnitsSearch";

export function UnitsPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.recordId ? parseInt(params.recordId as string, 10) : null;

  // Estados de filtros
  const [selectedUse, setSelectedUse] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [period, setPeriod] = useState<string | undefined>(undefined);

  // Validar recordId
  useEffect(() => {
    if (!recordId || isNaN(recordId) || recordId <= 0) {
      router.push("/search");
    }
  }, [recordId, router]);

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
        pageSize: 10,
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

  const handleClearFilters = () => {
    setSelectedUse("");
    setSelectedAvailability("");
    setSelectedBedrooms(null);
  };

  if (!recordId || isNaN(recordId) || recordId <= 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3F4F6] to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-gradient-to-r from-white to-[#F3F4F6]/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-all hover:border-[#4DA3FF] hover:bg-[#4DA3FF]/10 hover:text-[#4DA3FF]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] bg-clip-text text-transparent">
              Unidades del Proyecto
            </h1>
            <div className="w-24" /> {/* Spacer para centrar */}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar de filtros */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
              <UnitsFiltersBar
                uses={catalogs?.uses || []}
                availabilities={catalogs?.availabilities || []}
                bedrooms={catalogs?.bedrooms || []}
                loading={loadingCatalogs}
                selectedUse={selectedUse}
                setSelectedUse={setSelectedUse}
                selectedAvailability={selectedAvailability}
                setSelectedAvailability={setSelectedAvailability}
                selectedBedrooms={selectedBedrooms}
                setSelectedBedrooms={setSelectedBedrooms}
                onClearFilters={handleClearFilters}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Área principal de resultados */}
          <div className="lg:col-span-3">
            {data && (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-gradient-to-r from-white to-[#F3F4F6]/30 px-4 py-3">
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

            <UnitsList
              units={data?.items || []}
              loading={loadingUnits}
              error={error}
              page={page}
              totalPages={data?.totalPages || 0}
              totalItems={data?.totalItems || 0}
              pageSize={data?.pageSize || 10}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
