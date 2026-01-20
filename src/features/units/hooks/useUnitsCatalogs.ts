import { useState, useEffect } from "react";
import { getUnitsCatalogs, UnitsCatalogsResponse } from "../api";
import { UnitsCatalogsParams } from "../api/units.api";

export function useUnitsCatalogs(params: UnitsCatalogsParams | null) {
  const [catalogs, setCatalogs] = useState<UnitsCatalogsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) {
      setCatalogs(null);
      return;
    }

    let cancelled = false;

    async function fetchCatalogs() {
      setLoading(true);
      setError(null);

      try {
        const data = await getUnitsCatalogs(params);
        if (!cancelled) {
          setCatalogs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error al cargar catálogos");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCatalogs();

    return () => {
      cancelled = true;
    };
  }, [params?.recordId, params?.period]);

  return { catalogs, loading, error };
}
