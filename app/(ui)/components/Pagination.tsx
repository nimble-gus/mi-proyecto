interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPrevious,
  onNext,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null; // No mostrar paginación si hay una sola página o menos
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <div className="text-sm text-[#6B7280]">
        Mostrando {startItem} - {endItem} de {totalItems} resultados
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page === 1}
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          aria-label="Página anterior"
        >
          Anterior
        </button>

        <div className="flex items-center gap-1">
          <span className="px-4 py-2 text-sm font-medium text-[#111827]">
            Página {page} de {totalPages}
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
