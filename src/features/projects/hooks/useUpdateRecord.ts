import { useState, useCallback } from "react";
import { RecordDetails } from "../types/domain";
import { updateRecordDetails, UpdateRecordParams } from "../api/records.api";

export function useUpdateRecord() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateRecord = useCallback(async (
    id: number,
    data: UpdateRecordParams
  ): Promise<RecordDetails | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updateRecordDetails(id, data);
      setSuccess(true);
      return response.record;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Error al actualizar el registro. Por favor, intenta nuevamente.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    updateRecord,
    loading,
    error,
    success,
    resetState,
  };
}
