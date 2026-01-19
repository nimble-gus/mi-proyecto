import { useState, useEffect, useCallback } from "react";
import { Project } from "@/src/types/domain";
import { searchProjects } from "@/src/lib/api/projects.api";

export function useProjectAutocomplete() {
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el texto a mostrar en la lista
  const getDisplayText = useCallback((project: Project, allOptions: Project[]) => {
    const firstWord = project.proyecto.split(" ")[0];
    const duplicates = allOptions.filter(
      (p) => p.proyecto.split(" ")[0] === firstWord
    );

    if (duplicates.length > 1) {
      const words = project.proyecto.split(" ");
      const displayText = words.slice(0, Math.min(5, words.length)).join(" ");
      return displayText.length > 100 ? displayText.substring(0, 100) + "..." : displayText;
    }

    const displayText = project.proyecto.length > 100 
      ? project.proyecto.substring(0, 100) + "..." 
      : project.proyecto;
    return displayText;
  }, []);

  // Búsqueda con debounce
  useEffect(() => {
    if (!query.trim()) {
      setOptions([]);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const performSearch = async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await searchProjects(query);
          setOptions(data.projects || []);
        } catch (err) {
          setError("Error al buscar proyectos. Por favor, intenta nuevamente.");
          setOptions([]);
        } finally {
          setLoading(false);
        }
      };

      performSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return {
    query,
    setQuery,
    options,
    isOpen,
    setIsOpen,
    loading,
    error,
    getDisplayText,
  };
}
