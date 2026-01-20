import { useState, useCallback, useRef, useEffect } from "react";
import { Project, SelectedProject } from "../types/domain";
import { searchRecords, SearchRecordsParams } from "../api/records.api";

export function useRecordsSearch(
  selectedProject: SelectedProject | null,
  selectedZone: string,
  selectedCategory: string,
  selectedPeriod: string
) {
  const [items, setItems] = useState<Project[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5); // 5 proyectos por página
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef<boolean>(true);

  const performSearch = useCallback(async (pageToUse: number = 1) => {
    if (!selectedProject) {
      setItems([]);
      setTotalItems(0);
      setTotalPages(0);
      setError(null);
      return;
    }

    setLoadingResults(true);
    setError(null);

    try {
      const params: SearchRecordsParams = {
        project: selectedProject.proyecto,
        page: pageToUse,
        pageSize,
      };

      if (selectedZone) {
        params.zone = selectedZone;
      }

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      if (selectedPeriod) {
        params.period = selectedPeriod;
      }

      const data = await searchRecords(params);

      setItems(data.items || []);
      setPage(data.page);
      setPageSize(data.pageSize);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener registros. Por favor, intenta nuevamente.";
      setError(errorMessage);
      setItems([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoadingResults(false);
    }
  }, [selectedProject, selectedZone, selectedCategory, selectedPeriod, pageSize]);

  // Búsqueda automática cuando cambia el proyecto o los filtros
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedProject) {
      // Resetear página a 1 cuando cambian filtros o proyecto
      setPage(1);
      performSearch(1);
    } else {
      // Limpiar resultados si no hay proyecto
      setItems([]);
      setTotalItems(0);
      setTotalPages(0);
      setError(null);
    }
  }, [selectedProject, selectedZone, selectedCategory, selectedPeriod, performSearch]);

  // Función para cambiar de página (búsqueda automática)
  const setPageAndSearch = useCallback((newPage: number) => {
    if (!selectedProject) return;
    setPage(newPage);
    performSearch(newPage);
  }, [selectedProject, performSearch]);

  // Función manual para refrescar (opcional)
  const refresh = useCallback(() => {
    if (selectedProject) {
      performSearch(page);
    }
  }, [selectedProject, page, performSearch]);

  return {
    items,
    page,
    setPage: setPageAndSearch,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    loadingResults,
    error,
    refresh,
  };
}
