interface UnitsFiltersBarProps {
  uses: string[];
  availabilities: string[];
  bedrooms: number[];
  loading: boolean;
  selectedUse: string;
  setSelectedUse: (use: string) => void;
  selectedAvailability: string;
  setSelectedAvailability: (availability: string) => void;
  selectedBedrooms: number | null;
  setSelectedBedrooms: (bedrooms: number | null) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function UnitsFiltersBar({
  uses,
  availabilities,
  bedrooms,
  loading,
  selectedUse,
  setSelectedUse,
  selectedAvailability,
  setSelectedAvailability,
  selectedBedrooms,
  setSelectedBedrooms,
  onClearFilters,
  hasFilters,
}: UnitsFiltersBarProps) {
  const handleUseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUse(e.target.value);
  };

  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAvailability(e.target.value);
  };

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedBedrooms(value === "" ? null : parseInt(value, 10));
  };

  const isDisabled = loading;

  return (
    <div className="flex min-h-full flex-col gap-4 lg:h-full">
      <h2 className="text-base font-semibold text-[#1F3A5F] border-b-2 border-[#4DA3FF]/20 pb-2">
        Filtros
      </h2>

      {loading && (
        <p className="text-sm text-[#6B7280]">
          Cargando filtros...
        </p>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="use-selector"
            className="text-sm font-medium text-[#1F3A5F] flex items-center gap-1.5"
          >
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Uso
          </label>
          <select
            id="use-selector"
            value={selectedUse}
            onChange={handleUseChange}
            disabled={isDisabled || uses.length === 0}
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
          >
            <option value="">Todas</option>
            {uses.map((use) => (
              <option key={use} value={use}>
                {use}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="availability-selector"
            className="text-sm font-medium text-[#1F3A5F] flex items-center gap-1.5"
          >
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Disponibilidad
          </label>
          <select
            id="availability-selector"
            value={selectedAvailability}
            onChange={handleAvailabilityChange}
            disabled={isDisabled || availabilities.length === 0}
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
          >
            <option value="">Todas</option>
            {availabilities.map((availability) => (
              <option key={availability} value={availability}>
                {availability}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="bedrooms-selector"
            className="text-sm font-medium text-[#1F3A5F] flex items-center gap-1.5"
          >
            <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dormitorios
          </label>
          <select
            id="bedrooms-selector"
            value={selectedBedrooms === null ? "" : selectedBedrooms.toString()}
            onChange={handleBedroomsChange}
            disabled={isDisabled || bedrooms.length === 0}
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
          >
            <option value="">Todos</option>
            {bedrooms.map((bedroom) => (
              <option key={bedroom} value={bedroom.toString()}>
                {bedroom} {bedroom === 1 ? "dormitorio" : "dormitorios"}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-2 w-full rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-[#1F3A5F] hover:to-[#4DA3FF] hover:shadow-lg hover:shadow-[#4DA3FF]/30"
          >
            Limpiar filtros
          </button>
        )}

        {/* Botón Agregar unidad (solo UI, sin lógica por ahora) */}
        <button
          type="button"
          disabled
          className="mt-4 w-full rounded-lg border-2 border-[#10B981] bg-gradient-to-r from-[#10B981] to-[#059669] px-4 py-2.5 text-sm font-medium text-white transition-all hover:from-[#059669] hover:to-[#10B981] hover:shadow-lg hover:shadow-[#10B981]/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar unidad
          </div>
        </button>
      </div>
    </div>
  );
}
