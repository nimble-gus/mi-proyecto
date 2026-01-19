interface FiltersBarProps {
  zones: string[];
  categories: string[];
  loadingCatalogues: boolean;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onClearFilters: () => void;
}

export function FiltersBar({
  zones,
  categories,
  loadingCatalogues,
  selectedZone,
  setSelectedZone,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
}: FiltersBarProps) {
  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZone(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
        Filtros
      </h2>
      {loadingCatalogues && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cargando filtros...
        </p>
      )}
      {!loadingCatalogues && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="zone-selector"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Zona
            </label>
            <select
              id="zone-selector"
              value={selectedZone}
              onChange={handleZoneChange}
              disabled={loadingCatalogues || zones.length === 0}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
            >
              <option value="">Todas las zonas</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            {loadingCatalogues && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cargando zonas...
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="category-selector"
              className="text-sm font-medium text-black dark:text-zinc-50"
            >
              Categoría
            </label>
            <select
              id="category-selector"
              value={selectedCategory}
              onChange={handleCategoryChange}
              disabled={loadingCatalogues || categories.length === 0}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {loadingCatalogues && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Cargando categorías...
              </p>
            )}
          </div>
        </div>
      )}
      {(selectedZone || selectedCategory) && (
        <button
          type="button"
          onClick={onClearFilters}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
