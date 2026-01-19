import { useState, useCallback } from "react";
import { Project, SelectedProject } from "@/src/types/domain";
import { searchRecords, SearchRecordsParams } from "@/src/lib/api/records.api";

export function useRecordsSearch(
  selectedProject: SelectedProject | null,
  selectedZone: string,
  selectedCategory: string
) {
  const [items, setItems] = useState<Project[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!selectedProject) {
      setError("Por favor, selecciona un proyecto primero");
      return;
    }

    setLoadingResults(true);
    setError(null);

    try {
      const params: SearchRecordsParams = {
        project: selectedProject.proyecto,
        page,
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener registros. Por favor, intenta nuevamente.";
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoadingResults(false);
    }
  }, [selectedProject, selectedZone, selectedCategory, page, pageSize]);

  return {
    items,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    loadingResults,
    error,
    handleSearch,
  };
}
