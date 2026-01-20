import { useState } from "react";
import { updateUnitDetails, UpdateUnitParams, UnitDetails } from "../api";

export function useUpdateUnit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUnit = async (params: UpdateUnitParams): Promise<UnitDetails | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateUnitDetails(params);
      return response.unit;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar la unidad");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUnit,
    loading,
    error,
  };
}
