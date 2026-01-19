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

  // Hook de búsqueda de resultados (búsqueda automática)
  const recordsSearch = useRecordsSearch(selectedProject, selectedZone, selectedCategory, selectedPeriod);

  // Hook de detalles del modal
  const recordDetails = useRecordDetails();

  // Handlers
  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    autocomplete.setIsOpen(false);
    autocomplete.setQuery("");
    // Limpiar filtros al seleccionar nuevo proyecto
    setSelectedZone("");
    setSelectedCategory("");
    setSelectedPeriod("");
  }, [autocomplete]);

  const handleClearProject = useCallback(() => {
    setSelectedProject(null);
    autocomplete.setQuery("");
    autocomplete.setIsOpen(false);
    setSelectedZone("");
    setSelectedCategory("");
    setSelectedPeriod("");
  }, [autocomplete]);

  const handleZoneChange = useCallback((zone: string) => {
    setSelectedZone(zone);
    // La búsqueda se ejecuta automáticamente en useRecordsSearch
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    // La búsqueda se ejecuta automáticamente en useRecordsSearch
  }, []);

  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
    // La búsqueda se ejecuta automáticamente en useRecordsSearch
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedZone("");
    setSelectedCategory("");
    setSelectedPeriod("");
    // La búsqueda se ejecuta automáticamente en useRecordsSearch
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans lg:flex-row dark:bg-black">
      {/* Sidebar de Filtros - Mobile: arriba, Desktop: izquierda */}
      <aside className="w-full border-b border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto">
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
          hasSelectedProject={!!selectedProject}
        />
      </aside>

      {/* Área Principal */}
      <main className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50 lg:text-3xl">
            Filtrado de Proyectos
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 lg:text-base">
            Selecciona un proyecto para ver resultados filtrados
          </p>
        </div>

        {/* Selector de Proyecto */}
        <div className="flex flex-col gap-4">
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
        </div>

        {/* Área de Resultados */}
        <div className="flex flex-1 flex-col gap-4">
          {!selectedProject && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Selecciona un proyecto para ver resultados
              </p>
            </div>
          )}

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
        </div>
      </main>

      {/* Modal de detalles */}
      <DetailsModal
        isOpen={recordDetails.isModalOpen}
        onClose={recordDetails.closeModal}
        details={recordDetails.details}
        loadingDetails={recordDetails.loadingDetails}
        errorDetails={recordDetails.errorDetails}
      />
    </div>
  );
}
