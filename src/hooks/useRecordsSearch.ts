import { useState, useCallback, useRef } from "react";
import { Project, SelectedProject } from "@/src/types/domain";
import { searchRecords, SearchRecordsParams } from "@/src/lib/api/records.api";

export function useRecordsSearch(
  selectedProject: SelectedProject | null,
  selectedZone: string,
  selectedCategory: string
) {
  const [items, setItems] = useState<Project[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5); // 5 proyectos por página
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const hasSearchedRef = useRef<boolean>(false); // Para saber si ya se hizo una búsqueda inicial

  const handleSearch = useCallback(async (pageToUse?: number) => {
    if (!selectedProject) {
      setError("Por favor, selecciona un proyecto primero");
      return;
    }

    const currentPage = pageToUse ?? page;

    setLoadingResults(true);
    setError(null);

    try {
      const params: SearchRecordsParams = {
        project: selectedProject.proyecto,
        page: currentPage,
        pageSize,
      };

      if (selectedZone) {
        params.zone = selectedZone;
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const data = await searchRecords(params);

      setItems(data.items || []);
      setPage(data.page);
      setPageSize(data.pageSize);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 0);
      hasSearchedRef.current = true; // Marcar que ya se hizo una búsqueda
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener registros. Por favor, intenta nuevamente.";
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoadingResults(false);
    }
  }, [selectedProject, selectedZone, selectedCategory, page, pageSize]);

  // Función para cambiar de página y ejecutar búsqueda automáticamente si ya se buscó antes
  const setPageAndSearch = useCallback((newPage: number) => {
    setPage(newPage);
    // Si ya se hizo una búsqueda inicial, ejecutar automáticamente al cambiar de página
    if (hasSearchedRef.current && selectedProject) {
      handleSearch(newPage);
    }
  }, [selectedProject, handleSearch]);

  return {
    items,
    page,
    setPage: setPageAndSearch, // Usar la función que ejecuta búsqueda automática
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    loadingResults,
    error,
    handleSearch,
  };
}
