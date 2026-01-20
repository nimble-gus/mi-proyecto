import { useState, useCallback, useRef } from "react";
import { RecordDetails } from "../types/domain";
import { getRecordDetails } from "../api/records.api";

export function useRecordDetails() {
  const [details, setDetails] = useState<RecordDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const detailsCache = useRef<Map<number, RecordDetails>>(new Map());

  const loadDetails = useCallback(async (id: number) => {
    setErrorDetails(null);

    // Verificar cache
    if (detailsCache.current.has(id)) {
      setDetails(detailsCache.current.get(id)!);
      setLoadingDetails(false);
      return;
    }

    // Cargar detalles desde el backend
    setLoadingDetails(true);
    try {
      const data = await getRecordDetails(id);
      setDetails(data.record);

      // Guardar en cache
      detailsCache.current.set(id, data.record);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al obtener detalles. Por favor, intenta nuevamente.";
      setErrorDetails(errorMessage);
      setDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }, []);

  return {
    details,
    loadingDetails,
    errorDetails,
    loadDetails,
  };
}
