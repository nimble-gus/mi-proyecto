"use client";

import { useState, useCallback } from "react";
import { Project, SelectedProject } from "@/src/types/domain";
import { useProjectAutocomplete } from "@/src/hooks/useProjectAutocomplete";
import { useCatalogs } from "@/src/hooks/useCatalogs";
import { useRecordsSearch } from "@/src/hooks/useRecordsSearch";
import { useRecordDetails } from "@/src/hooks/useRecordDetails";
import { ProjectAutocomplete } from "./components/ProjectAutocomplete";
import { FiltersBar } from "./components/FiltersBar";
import { ResultsList } from "./components/ResultsList";
import { DetailsModal } from "./components/DetailsModal";

export default function Home() {
  // Estado del proyecto seleccionado
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  
  // Estados de filtros
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Hook de autocomplete
  const autocomplete = useProjectAutocomplete();

  // Hook de catálogos (se cargan automáticamente cuando hay proyecto seleccionado)
  const catalogs = useCatalogs(selectedProject);

  // Hook de búsqueda de resultados
  const recordsSearch = useRecordsSearch(selectedProject, selectedZone, selectedCategory, selectedPeriod);

  // Hook de detalles del modal
  const recordDetails = useRecordDetails();

  // Handlers
  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    autocomplete.setIsOpen(false);
    autocomplete.setQuery("");
    recordsSearch.setPage(1);
    setSelectedZone("");
    setSelectedCategory("");
    setSelectedPeriod("");
  }, [autocomplete, recordsSearch]);

  const handleClearProject = useCallback(() => {
    setSelectedProject(null);
    autocomplete.setQuery("");
    autocomplete.setIsOpen(false);
    setSelectedZone("");
    setSelectedCategory("");
    setSelectedPeriod("");
    recordsSearch.setPage(1);
  }, [autocomplete, recordsSearch]);

  const handleZoneChange = useCallback((zone: string) => {
    setSelectedZone(zone);
    recordsSearch.setPage(1);
  }, [recordsSearch]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    recordsSearch.setPage(1);
  }, [recordsSearch]);

  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
    recordsSearch.setPage(1);
  }, [recordsSearch]);

  const handleClearFilters = useCallback(() => {
    setSelectedZone("");
    setSelectedCategory("");
    setSelectedPeriod("");
    recordsSearch.setPage(1);
  }, [recordsSearch]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-4 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Filtrado de Proyectos
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Selecciona un proyecto y filtra sus registros por zona, categoría y período.
          </p>
        </div>

        {/* Selector de proyecto */}
        <ProjectAutocomplete
          query={autocomplete.query}
          setQuery={autocomplete.setQuery}
          options={autocomplete.options}
          isOpen={autocomplete.isOpen}
          setIsOpen={autocomplete.setIsOpen}
          loading={autocomplete.loading}
          error={autocomplete.error}
          selectedProject={selectedProject}
          getDisplayText={autocomplete.getDisplayText}
          onSelect={handleSelectProject}
          onClear={handleClearProject}
        />

        {/* Mensaje si no hay proyecto seleccionado */}
        {!selectedProject && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400">
              Selecciona un proyecto para ver filtros y resultados
            </p>
          </div>
        )}

        {/* Filtros y botón buscar */}
        {selectedProject && (
          <>
            <FiltersBar
              zones={catalogs.zones}
              categories={catalogs.categories}
              periods={catalogs.periods}
              loadingCatalogues={catalogs.loadingCatalogues}
              selectedZone={selectedZone}
              setSelectedZone={handleZoneChange}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              selectedPeriod={selectedPeriod}
              setSelectedPeriod={handlePeriodChange}
              onClearFilters={handleClearFilters}
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => recordsSearch.handleSearch()}
                disabled={recordsSearch.loadingResults}
                className="rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
              >
                {recordsSearch.loadingResults ? "Buscando..." : "Buscar"}
              </button>
            </div>
          </>
        )}

        {/* Resultados */}
        {selectedProject && (
          <ResultsList
            items={recordsSearch.items}
            loadingResults={recordsSearch.loadingResults}
            error={recordsSearch.error}
            totalItems={recordsSearch.totalItems}
            page={recordsSearch.page}
            totalPages={recordsSearch.totalPages}
            pageSize={recordsSearch.pageSize}
            onOpenDetails={recordDetails.openDetails}
            onPreviousPage={() => recordsSearch.setPage(Math.max(1, recordsSearch.page - 1))}
            onNextPage={() => recordsSearch.setPage(Math.min(recordsSearch.totalPages, recordsSearch.page + 1))}
          />
        )}

        {/* Modal de detalles */}
        <DetailsModal
          isOpen={recordDetails.isModalOpen}
          onClose={recordDetails.closeModal}
          details={recordDetails.details}
          loadingDetails={recordDetails.loadingDetails}
          errorDetails={recordDetails.errorDetails}
        />
      </main>
    </div>
  );
}
