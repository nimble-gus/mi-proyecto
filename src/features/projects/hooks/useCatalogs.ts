import { useState, useEffect } from "react";
import { SelectedProject } from "../types/domain";
import { getZones, getCategories, getPeriods } from "../api/catalogs.api";

export function useCatalogs(selectedProject: SelectedProject | null) {
  const [zones, setZones] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [loadingCatalogues, setLoadingCatalogues] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProject) {
      setZones([]);
      setCategories([]);
      setPeriods([]);
      setError(null);
      return;
    }

    const loadCatalogues = async () => {
      setLoadingCatalogues(true);
      setError(null);

      try {
        const [zonesResponse, categoriesResponse, periodsResponse] = await Promise.all([
          getZones(selectedProject.proyecto),
          getCategories(selectedProject.proyecto),
          getPeriods(selectedProject.proyecto),
        ]);

        setZones(zonesResponse.zones || []);
        setCategories(categoriesResponse.categories || []);
        setPeriods(periodsResponse.periods || []);
      } catch (err) {
        setError("Error al cargar zonas, categorías y períodos. Por favor, intenta nuevamente.");
        setZones([]);
        setCategories([]);
        setPeriods([]);
      } finally {
        setLoadingCatalogues(false);
      }
    };

    loadCatalogues();
  }, [selectedProject]);

  return {
    zones,
    categories,
    periods,
    loadingCatalogues,
    error,
  };
}
