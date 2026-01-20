interface FiltersBarProps {
  zones: string[];
  categories: string[];
  periods: string[];
  loadingCatalogues: boolean;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  onClearFilters: () => void;
  hasSelectedProject: boolean;
}

export function FiltersBar({
  zones,
  categories,
  periods,
  loadingCatalogues,
  selectedZone,
  setSelectedZone,
  selectedCategory,
  setSelectedCategory,
  selectedPeriod,
  setSelectedPeriod,
  onClearFilters,
  hasSelectedProject,
}: FiltersBarProps) {
  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZone(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const isDisabled = !hasSelectedProject || loadingCatalogues;

  return (
    <div className="flex min-h-full flex-col gap-4 lg:h-full">
      <h2 className="text-base font-semibold text-[#1F3A5F] border-b-2 border-[#4DA3FF]/20 pb-2">
        Filtros
      </h2>
      
      {!hasSelectedProject && (
        <p className="text-sm text-[#6B7280]">
          Selecciona un proyecto para habilitar filtros
        </p>
      )}

      {loadingCatalogues && hasSelectedProject && (
        <p className="text-sm text-[#6B7280]">
          Cargando filtros...
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="zone-selector"
            className="text-sm font-medium text-[#1F3A5F] flex items-center gap-1.5"
          >
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Zona
          </label>
          <select
            id="zone-selector"
            value={selectedZone}
            onChange={handleZoneChange}
            disabled={isDisabled || zones.length === 0}
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
          >
            <option value="">Todas las zonas</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="category-selector"
            className="text-sm font-medium text-[#1F3A5F] flex items-center gap-1.5"
          >
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categoría
          </label>
          <select
            id="category-selector"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={isDisabled || categories.length === 0}
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="period-selector"
            className="text-sm font-medium text-[#1F3A5F] flex items-center gap-1.5"
          >
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Período
          </label>
          <select
            id="period-selector"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            disabled={isDisabled || periods.length === 0}
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
          >
            <option value="">Todos los períodos</option>
            {periods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasSelectedProject && (selectedZone || selectedCategory || selectedPeriod) && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-[#4DA3FF] bg-[#4DA3FF]/10 px-4 py-2.5 text-sm font-medium text-[#4DA3FF] transition-all hover:bg-[#4DA3FF] hover:text-white hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
