"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Tipos bien definidos (TypeScript)
interface Project {
  proyecto: string;
  categoria: string;
  zona: string | null;
}

interface ApiResponse {
  projects: Project[];
}

interface SelectedProject {
  proyecto: string;
  categoria: string;
  zona: string | null;
}

interface ZonesResponse {
  zones: string[];
}

interface CategoriesResponse {
  categories: string[];
}

interface RecordsResponse {
  items: Project[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function Home() {
  // A) Estados necesarios
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);
  
  // Estados de filtros
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // Estados de catálogos
  const [zones, setZones] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCatalogues, setLoadingCatalogues] = useState<boolean>(false);
  
  // Estados de paginación y resultados
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [items, setItems] = useState<Project[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  // Estados generales
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingResults, setLoadingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // B) Cargar catálogos cuando se selecciona proyecto
  useEffect(() => {
    if (!selectedProject) {
      setZones([]);
      setCategories([]);
      setSelectedZone("");
      setSelectedCategory("");
      setItems([]);
      return;
    }

    // Al seleccionar proyecto: fetch zonas y categorías
    const loadCatalogues = async () => {
      setLoadingCatalogues(true);
      setError(null);

      try {
        const projectName = encodeURIComponent(selectedProject.proyecto);

        const [zonesResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/zones?project=${projectName}`),
          fetch(`/api/categories?project=${projectName}`),
        ]);

        if (!zonesResponse.ok || !categoriesResponse.ok) {
          throw new Error("Error al cargar catálogos");
        }

        const zonesData: ZonesResponse = await zonesResponse.json();
        const categoriesData: CategoriesResponse = await categoriesResponse.json();

        setZones(zonesData.zones || []);
        setCategories(categoriesData.categories || []);
        
        // Resetear filtros al cambiar de proyecto
        setSelectedZone("");
        setSelectedCategory("");
        setPage(1);
      } catch (err) {
        setError("Error al cargar catálogos. Por favor, intenta nuevamente.");
        setZones([]);
        setCategories([]);
      } finally {
        setLoadingCatalogues(false);
      }
    };

    loadCatalogues();
  }, [selectedProject]);

  // C) Función para buscar registros (ejecutada manualmente con botón "Buscar")
  const handleSearch = useCallback(async () => {
    if (!selectedProject) {
      setError("Por favor, selecciona un proyecto primero");
      return;
    }

    setLoadingResults(true);
    setError(null);

    try {
      // URLSearchParams codifica automáticamente, no necesitamos encodeURIComponent
      const params = new URLSearchParams({
        project: selectedProject.proyecto,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (selectedZone) {
        params.append("zone", selectedZone);
      }

      if (selectedCategory) {
        params.append("category", selectedCategory);
      }

      const url = `/api/records?${params.toString()}`;
      console.log("Buscando registros con URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || "Error al obtener registros");
      }

      const data: RecordsResponse = await response.json();
      console.log("Respuesta recibida:", data);
      
      setItems(data.items || []);
      setPage(data.page);
      setPageSize(data.pageSize);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      const errorMessage = err instanceof Error ? err.message : "Error al obtener registros. Por favor, intenta nuevamente.";
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoadingResults(false);
    }
  }, [selectedProject, selectedZone, selectedCategory, page, pageSize]);

  // Búsqueda de proyectos (autocomplete existente)
  useEffect(() => {
    if (!query.trim()) {
      setOptions([]);
      setError(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      const searchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
          const encodedQuery = encodeURIComponent(query.trim());
          const response = await fetch(`/api/projects?q=${encodedQuery}`);

          if (!response.ok) {
            throw new Error("Error al buscar proyectos");
          }

          const data: ApiResponse = await response.json();
          setOptions(data.projects || []);
        } catch (err) {
          setError("Error al buscar proyectos. Por favor, intenta nuevamente.");
          setOptions([]);
        } finally {
          setLoading(false);
        }
      };

      searchProjects();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Interacción: Seleccionar proyecto
  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsOpen(false);
    setOptions([]);
    setQuery("");
    setPage(1); // Resetear a página 1
  }, []);

  // Botón para limpiar selección de proyecto
  const handleClearProject = useCallback(() => {
    setSelectedProject(null);
    setQuery("");
    setOptions([]);
    setIsOpen(false);
    setSelectedZone("");
    setSelectedCategory("");
    setItems([]);
    setPage(1);
  }, []);

  // Aplicar filtros: Cambiar zona o categoría (sin ejecutar búsqueda automática)
  const handleZoneChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedZone(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  // D) Paginación en UI
  const handlePreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1); // Resetear a página 1
  }, []);

  // Botón limpiar filtros
  const handleClearFilters = useCallback(() => {
    setSelectedZone("");
    setSelectedCategory("");
    setPage(1);
  }, []);

  // Input controlado
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setIsOpen(true);
    },
    []
  );

  const handleInputFocus = useCallback(() => {
    if (query.trim()) {
      setIsOpen(true);
    }
  }, [query]);

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-8 py-16 px-4 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Filtrado de Proyectos
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Selecciona un proyecto y refina por zona y categoría
          </p>
        </div>

        {/* Selector de proyecto */}
        <div className="flex flex-col gap-2" ref={dropdownRef}>
          <label
            htmlFor="project-selector"
            className="text-sm font-medium text-black dark:text-zinc-50"
          >
            Proyecto *
          </label>

          <div className="relative">
            <div className="flex items-center gap-2">
              <input
                id="project-selector"
                type="text"
                value={selectedProject ? selectedProject.proyecto : query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Escribe para buscar…"
                disabled={!!selectedProject}
                maxLength={200}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
                aria-label="Seleccionar proyecto"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
              />

              {selectedProject && (
                <button
                  type="button"
                  onClick={handleClearProject}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  aria-label="Limpiar proyecto"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Dropdown panel */}
            {isOpen && !selectedProject && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {!query.trim() && !loading && (
                  <div className="px-4 py-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Escribe para buscar…
                  </div>
                )}

                {loading && (
                  <div className="px-4 py-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Buscando…
                  </div>
                )}

                {error && !loading && (
                  <div className="px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                {!loading && !error && query.trim() && options.length === 0 && (
                  <div className="px-4 py-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    No hay coincidencias
                  </div>
                )}

                {!loading && !error && options.length > 0 && (
                  <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
                    {options.map((project, index) => {
                      const displayText = getDisplayText(project, options);
                      return (
                        <li
                          key={`${project.proyecto}-${index}`}
                          role="option"
                          onClick={() => handleSelectProject(project)}
                          className="cursor-pointer px-4 py-2 text-sm text-black transition-colors hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
                          aria-selected={false}
                        >
                          {displayText}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* E) UX: Mostrar "Selecciona un proyecto" si no hay proyecto */}
        {!selectedProject && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400">
              Selecciona un proyecto para ver filtros y resultados
            </p>
          </div>
        )}

        {/* Filtros de Zona y Categoría */}
        {selectedProject && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="zone-selector"
                className="text-sm font-medium text-black dark:text-zinc-50"
              >
                Zona
              </label>
              <select
                id="zone-selector"
                value={selectedZone}
                onChange={handleZoneChange}
                disabled={loadingCatalogues || zones.length === 0}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
              >
                <option value="">Todas las zonas</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {loadingCatalogues && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Cargando zonas...
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="category-selector"
                className="text-sm font-medium text-black dark:text-zinc-50"
              >
                Categoría
              </label>
              <select
                id="category-selector"
                value={selectedCategory}
                onChange={handleCategoryChange}
                disabled={loadingCatalogues || categories.length === 0}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {loadingCatalogues && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Cargando categorías...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botón Buscar y Limpiar filtros */}
        {selectedProject && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loadingResults}
              className="rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
            >
              {loadingResults ? "Buscando..." : "Buscar"}
            </button>
            {(selectedZone || selectedCategory) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Resultados */}
        {selectedProject && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-black dark:text-zinc-50">
                Resultados
              </h2>
              {totalItems > 0 && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {totalItems} {totalItems === 1 ? "resultado" : "resultados"}
                </span>
              )}
            </div>

            {/* Loading mientras consulta */}
            {loadingResults && (
              <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Cargando resultados...</p>
              </div>
            )}

            {/* Mensaje de error */}
            {error && !loadingResults && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Sin resultados */}
            {!loadingResults && !error && items.length === 0 && (
              <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-zinc-600 dark:text-zinc-400">Sin resultados</p>
              </div>
            )}

            {/* Lista de resultados */}
            {!loadingResults && items.length > 0 && (
              <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.proyecto}-${item.zona}-${item.categoria}-${index}`}
                    className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                        {item.proyecto}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                        <div>
                          <span className="font-medium">Categoría:</span> {item.categoria}
                        </div>
                        {item.zona && (
                          <div>
                            <span className="font-medium">Zona:</span> {item.zona}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación - Temporalmente oculta */}
            {/* TODO: Implementar paginación en el futuro */}
          </div>
        )}
      </main>
    </div>
  );
}
