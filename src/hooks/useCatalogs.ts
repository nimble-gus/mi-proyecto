import { useState, useEffect } from "react";
import { SelectedProject } from "@/src/types/domain";
import { getZones, getCategories } from "@/src/lib/api/catalogs.api";

export function useCatalogs(selectedProject: SelectedProject | null) {
  const [zones, setZones] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCatalogues, setLoadingCatalogues] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedProject) {
      setZones([]);
      setCategories([]);
      setError(null);
      return;
    }

    const loadCatalogues = async () => {
      setLoadingCatalogues(true);
      setError(null);

      try {
        const [zonesResponse, categoriesResponse] = await Promise.all([
          getZones(selectedProject.proyecto),
          getCategories(selectedProject.proyecto),
        ]);

        setZones(zonesResponse.zones || []);
        setCategories(categoriesResponse.categories || []);
      } catch (err) {
        setError("Error al cargar zonas y categorías. Por favor, intenta nuevamente.");
        setZones([]);
        setCategories([]);
      } finally {
        setLoadingCatalogues(false);
      }
    };

    loadCatalogues();
  }, [selectedProject]);

  return {
    zones,
    categories,
    loadingCatalogues,
    error,
  };
}
