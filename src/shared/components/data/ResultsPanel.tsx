import { ReactNode } from "react";
import { Pagination } from "./Pagination";
import { LoadingState } from "../feedback/LoadingState";
import { ErrorState } from "../feedback/ErrorState";
import { EmptyState } from "../feedback/EmptyState";

interface ResultsPanelProps<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  title?: string;
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export function ResultsPanel<T>({
  items,
  loading,
  error,
  totalItems,
  page,
  totalPages,
  pageSize,
  onPreviousPage,
  onNextPage,
  title = "Resultados",
  renderItem,
  emptyMessage,
  emptyIcon,
}: ResultsPanelProps<T>) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between border-b-2 border-[#4DA3FF]/20 pb-3">
        <h2 className="text-lg font-semibold text-[#1F3A5F] flex items-center gap-2">
          <svg className="h-5 w-5 text-[#4DA3FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {title}
        </h2>
        {totalItems > 0 && (
          <span className="rounded-full bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-4 py-1.5 text-sm font-semibold text-white shadow-md">
            {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
          </span>
        )}
      </div>

      {loading && <LoadingState message="Cargando resultados..." />}

      {error && !loading && <ErrorState message={error} />}

      {!loading && !error && items.length === 0 && totalItems === 0 && (
        <EmptyState message={emptyMessage || "No hay resultados con esos filtros"} icon={emptyIcon} />
      )}

      {!loading && items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 0 && (
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
