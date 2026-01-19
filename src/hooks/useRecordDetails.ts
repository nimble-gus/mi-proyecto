import { useState, useCallback } from "react";
import { RecordDetails } from "@/src/types/domain";
import { getRecordDetails } from "@/src/lib/api/records.api";

export function useRecordDetails() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<RecordDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [detailsCache, setDetailsCache] = useState<Map<number, RecordDetails>>(new Map());

  const openDetails = useCallback(async (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
    setErrorDetails(null);

    // Verificar cache
    if (detailsCache.has(id)) {
      setDetails(detailsCache.get(id)!);
      setLoadingDetails(false);
      return;
    }

    // Cargar detalles desde el backend
    setLoadingDetails(true);
    try {
      const data = await getRecordDetails(id);
      setDetails(data.record);

      // Guardar en cache
      setDetailsCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(id, data.record);
        return newCache;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener detalles. Por favor, intenta nuevamente.";
      setErrorDetails(errorMessage);
      setDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [detailsCache]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
    setErrorDetails(null);
    // Mantener details en cache (no se limpia)
  }, []);

  return {
    isModalOpen,
    selectedId,
    details,
    loadingDetails,
    errorDetails,
    openDetails,
    closeModal,
  };
}
