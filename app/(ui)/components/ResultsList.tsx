import { Project } from "@/src/types/domain";
import { ResultItem } from "./ResultItem";
import { Pagination } from "./Pagination";

interface ResultsListProps {
  items: Project[];
  loadingResults: boolean;
  error: string | null;
  totalItems: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function ResultsList({
  items,
  loadingResults,
  error,
  totalItems,
  page,
  totalPages,
  pageSize,
  onPreviousPage,
  onNextPage,
}: ResultsListProps) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between border-b-2 border-[#4DA3FF]/20 pb-3">
        <h2 className="text-lg font-semibold text-[#1F3A5F] flex items-center gap-2">
          <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Resultados
        </h2>
        {totalItems > 0 && (
          <span className="rounded-full bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-4 py-1.5 text-sm font-semibold text-white shadow-md">
            {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
          </span>
        )}
      </div>

      {/* Loading mientras consulta */}
      {loadingResults && (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#4DA3FF]/30 bg-gradient-to-br from-[#4DA3FF]/10 to-white p-12 text-center shadow-md">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 animate-spin text-[#4DA3FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-[#1F3A5F] font-semibold">Cargando resultados...</p>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && !loadingResults && (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#EF4444]/50 bg-gradient-to-br from-[#FEE2E2] to-white p-12 text-center shadow-lg ring-2 ring-[#EF4444]/20">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#DC2626] font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {!loadingResults && !error && items.length === 0 && totalItems === 0 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-[#F3F4F6] to-white p-12 text-center shadow-md">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-8 w-8 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[#6B7280] font-semibold">No hay resultados con esos filtros</p>
          </div>
        </div>
      )}

      {/* Lista de resultados */}
      {!loadingResults && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <ResultItem
              key={item.id}
              project={item}
            />
          ))}
        </div>
      )}

      {/* Paginación - Siempre presente si hay resultados o páginas */}
      {!loadingResults && !error && totalPages > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      )}
    </div>
  );
}
