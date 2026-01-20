"use client";

import { Unit } from "../types/domain";
import { UnitItem } from "./UnitItem";
import { LoadingState, ErrorState, EmptyState } from "@/src/shared/components/feedback";
import { Pagination } from "@/src/shared/components/data";

interface UnitsListProps {
  units: Unit[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function UnitsList({
  units,
  loading,
  error,
  page,
  totalPages,
  totalItems,
  pageSize,
  onPreviousPage,
  onNextPage,
}: UnitsListProps) {
  if (loading) {
    return <LoadingState message="Cargando unidades..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (units.length === 0) {
    return (
      <EmptyState
        message="No se encontraron unidades con los filtros seleccionados"
        description="Intenta ajustar los filtros para ver más resultados"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {units.map((unit) => (
          <UnitItem key={unit.id} unit={unit} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPrevious={onPreviousPage}
        onNext={onNextPage}
      />
    </div>
  );
}
