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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#111827]">
          Resultados
        </h2>
        {totalItems > 0 && (
          <span className="text-sm text-[#6B7280]">
            {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
          </span>
        )}
      </div>

      {/* Loading mientras consulta */}
      {loadingResults && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
          <p className="text-[#6B7280]">Cargando resultados...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && !loadingResults && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-[#EF4444]/30 bg-[#FEE2E2] p-12 text-center">
          <p className="text-[#DC2626]">{error}</p>
        </div>
      )}

      {/* Sin resultados */}
      {!loadingResults && !error && items.length === 0 && totalItems === 0 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
          <p className="text-[#6B7280]">No hay resultados con esos filtros</p>
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
