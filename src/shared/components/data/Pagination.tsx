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
    <div className="flex flex-col items-center gap-4 rounded-lg border border-[#E5E7EB] bg-gradient-to-r from-white to-[#F3F4F6]/30 p-4 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
        <svg className="h-4 w-4 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Mostrando <span className="font-semibold text-[#1F3A5F]">{startItem}</span> - <span className="font-semibold text-[#1F3A5F]">{endItem}</span> de <span className="font-semibold text-[#4DA3FF]">{totalItems}</span> resultados
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page === 1}
          className="flex items-center gap-1.5 rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-all hover:border-[#4DA3FF] hover:bg-[#4DA3FF]/10 hover:text-[#4DA3FF] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#E5E7EB] disabled:hover:bg-white disabled:hover:text-[#111827]"
          aria-label="Página anterior"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-4 py-2 shadow-md">
          <span className="text-sm font-semibold text-white">
            Página {page} de {totalPages}
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="flex items-center gap-1.5 rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-all hover:border-[#4DA3FF] hover:bg-[#4DA3FF]/10 hover:text-[#4DA3FF] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#E5E7EB] disabled:hover:bg-white disabled:hover:text-[#111827]"
          aria-label="Página siguiente"
        >
          Siguiente
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
