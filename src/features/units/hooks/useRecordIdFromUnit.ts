import { useState, useEffect } from "react";
import { searchRecords } from "@/src/features/projects/api/records.api";

export function useRecordIdFromUnit(proyecto: string | null, periodo: string | null) {
  const [recordId, setRecordId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proyecto || !periodo) {
      setRecordId(null);
      return;
    }

    let cancelled = false;

    async function findRecordId() {
      setLoading(true);
      try {
        // Buscar el registro usando proyecto y periodo
        const response = await searchRecords({
          project: proyecto,
          period: periodo,
          page: 1,
          pageSize: 1,
        });

        if (!cancelled && response.items && response.items.length > 0) {
          // El primer resultado debería ser el registro que buscamos
          setRecordId(response.items[0].id);
        } else {
          setRecordId(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error al buscar recordId:", error);
          setRecordId(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    findRecordId();

    return () => {
      cancelled = true;
    };
  }, [proyecto, periodo]);

  return { recordId, loading };
}
