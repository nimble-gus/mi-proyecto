"use client";

import { useState, useCallback } from "react";
import { Project, SelectedProject } from "@/src/types/domain";
import { useProjectAutocomplete } from "@/src/hooks/useProjectAutocomplete";
import { useCatalogs } from "@/src/hooks/useCatalogs";
import { useRecordsSearch } from "@/src/hooks/useRecordsSearch";
import { ProjectAutocomplete } from "../(ui)/components/ProjectAutocomplete";
import { FiltersBar } from "../(ui)/components/FiltersBar";
import { ResultsList } from "../(ui)/components/ResultsList";

export default function SearchPage() {
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
    <div className="flex min-h-screen flex-col bg-white font-sans lg:flex-row">
      {/* Sidebar de Filtros - Mobile: arriba, Desktop: izquierda */}
      <aside className="w-full border-b border-[#E5E7EB] bg-[#F3F4F6] p-4 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto">
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
        <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-r from-[#4DA3FF]/10 via-[#1F3A5F]/5 to-[#4DA3FF]/10 p-6 border-2 border-[#4DA3FF]/20">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#1F3A5F] to-[#4DA3FF] bg-clip-text text-transparent lg:text-3xl">
            Filtrado de Proyectos
          </h1>
          <p className="text-sm text-[#6B7280] lg:text-base flex items-center gap-2">
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
            <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-[#4DA3FF]/5 via-white to-[#1F3A5F]/5 p-12 text-center shadow-md">
              <div className="flex flex-col items-center gap-3">
                <svg className="h-12 w-12 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-[#1F3A5F] font-semibold text-lg">
                  Selecciona un proyecto para ver resultados
                </p>
                <p className="text-[#6B7280] text-sm">
                  Utiliza el buscador de proyectos para comenzar
                </p>
              </div>
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
              onPreviousPage={() => recordsSearch.setPage(Math.max(1, recordsSearch.page - 1))}
              onNextPage={() => recordsSearch.setPage(Math.min(recordsSearch.totalPages, recordsSearch.page + 1))}
            />
          )}
        </div>
      </main>
    </div>
  );
}
