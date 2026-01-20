import { useState, useRef } from "react";
import { getUnitDetails, UnitDetailsResponse } from "../api";
import { UnitDetails } from "../types/domain";

// Cache simple en memoria (useRef)
const detailsCache = new Map<number, UnitDetails>();

export function useUnitDetails() {
  const [details, setDetails] = useState<UnitDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef(detailsCache);

  const loadDetails = async (unitId: number) => {
    // Verificar cache primero
    if (cacheRef.current.has(unitId)) {
      setDetails(cacheRef.current.get(unitId)!);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: UnitDetailsResponse = await getUnitDetails(unitId);
      const unitData = response.unit;

      // Guardar en cache
      cacheRef.current.set(unitId, unitData);

      setDetails(unitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar detalles de la unidad");
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = () => {
    cacheRef.current.clear();
    setDetails(null);
  };

  return {
    details,
    loading,
    error,
    loadDetails,
    clearCache,
  };
}
