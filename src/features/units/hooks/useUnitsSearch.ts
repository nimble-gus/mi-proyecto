import { useState, useEffect } from "react";
import { searchUnits, SearchUnitsParams, UnitsResponse } from "../api";

export function useUnitsSearch(params: SearchUnitsParams | null) {
  const [data, setData] = useState<UnitsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Resetear página cuando cambian los filtros (excepto page)
  useEffect(() => {
    setPage(1);
  }, [params?.recordId, params?.period, params?.use, params?.availability, params?.bedrooms, params?.sort]);

  useEffect(() => {
    if (!params) {
      setData(null);
      return;
    }

    let cancelled = false;

    async function performSearch() {
      setLoading(true);
      setError(null);

      try {
        const result = await searchUnits({ ...params, page });
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al buscar unidades");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      cancelled = true;
    };
  }, [params?.recordId, params?.period, params?.use, params?.availability, params?.bedrooms, params?.sort, page]);

  const goToPage = (newPage: number) => {
    if (data && newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(page + 1);
    }
  };

  return {
    data,
    loading,
    error,
    page,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  };
}
