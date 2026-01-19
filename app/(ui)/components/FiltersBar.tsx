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
      <h2 className="text-base font-medium text-[#111827]">
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
            className="text-sm font-medium text-[#111827]"
          >
            Zona
          </label>
          <select
            id="zone-selector"
            value={selectedZone}
            onChange={handleZoneChange}
            disabled={isDisabled || zones.length === 0}
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
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
            className="text-sm font-medium text-[#111827]"
          >
            Categoría
          </label>
          <select
            id="category-selector"
            value={selectedCategory}
            onChange={handleCategoryChange}
            disabled={isDisabled || categories.length === 0}
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
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
            className="text-sm font-medium text-[#111827]"
          >
            Período
          </label>
          <select
            id="period-selector"
            value={selectedPeriod}
            onChange={handlePeriodChange}
            disabled={isDisabled || periods.length === 0}
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/20 focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
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
          className="mt-auto text-sm font-medium text-[#4DA3FF] transition-colors hover:text-[#1F3A5F] hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
