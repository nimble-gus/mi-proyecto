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
        <h2 className="text-lg font-medium text-black dark:text-zinc-50">
          Resultados
        </h2>
        {totalItems > 0 && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
          </span>
        )}
      </div>

      {/* Loading mientras consulta */}
      {loadingResults && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">Cargando resultados...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && !loadingResults && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-12 text-center dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Sin resultados */}
      {!loadingResults && !error && items.length === 0 && totalItems === 0 && (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-zinc-600 dark:text-zinc-400">No hay resultados con esos filtros</p>
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
