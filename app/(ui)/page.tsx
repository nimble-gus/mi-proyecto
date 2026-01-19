"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Tipos bien definidos (TypeScript)
interface Project {
  id: number;
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

interface RecordDetails {
  id: number;
  cod_proyecto: string | null;
  fecha_recoleccion: string | null;
  proyecto: string;
  fase: string | null;
  torre: string | null;
  periodo: string;
  categoria: string;
  pais: string;
  departamento: string | null;
  municipio: string | null;
  zona: string | null;
  subzona: string | null;
  desarrollador: string | null;
  estado: string | null;
  uso: string | null;
  fecha_inicio: string | null;
  fecha_entrega: string | null;
  meses_de_comercializacion: number | null;
  latitud: string | null;
  longitud: string | null;
  fha: string | null;
  total_unidades: number | null;
  total_m2: string | null;
  tipo_de_seguridad: string | null;
  muvi: string | null;
  unidades_disponibles: number | null;
  m2_disponibles: string | null;
  precio_promedio: string | null;
  tamano_promedio: string | null;
  precio_prom_m2: string | null;
  cuota_promedio: string | null;
  ingresos_promedio: string | null;
  nse_proyecto: string | null;
  showroom: string | null;
  casa_modelo: string | null;
  cantidad_accesos: string | null;
  mercado: string;
  precio_parqueo_adicional: string | null;
  parqueos_visita: number | null;
  parqueos_asignados: number | null;
  total_parqueos_proyecto: number;
  url_imagen: string | null;
  mig_number: number | null;
  created_at: string;
}

interface DetailsResponse {
  record: RecordDetails;
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

  // Estados del modal de detalles
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [details, setDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [detailsCache, setDetailsCache] = useState<Map<number, any>>(new Map());

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Función para abrir modal y cargar detalles
  const handleOpenDetails = useCallback(async (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
    setErrorDetails(null);

    // Verificar cache
    if (detailsCache.has(id)) {
      setDetails(detailsCache.get(id));
      setLoadingDetails(false);
      return;
    }

    // Cargar detalles desde el backend
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/records/${id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || "Error al obtener detalles");
      }

      const data: DetailsResponse = await response.json();
      setDetails(data.record);
      
      // Guardar en cache
      setDetailsCache((prev) => {
        const newCache = new Map(prev);
        newCache.set(id, data.record);
        return newCache;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al obtener detalles. Por favor, intenta nuevamente.";
      setErrorDetails(errorMessage);
      setDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }, [detailsCache]);

  // Función para cerrar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedId(null);
    // Opcional: limpiar details al cerrar (comentado para mantener cache)
    // setDetails(null);
    setErrorDetails(null);
  }, []);

  // Cerrar modal al hacer click afuera
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isModalOpen
      ) {
        // Solo cerrar si el click fue en el overlay (fondo oscuro)
        const target = event.target as HTMLElement;
        if (target.classList.contains("modal-overlay")) {
          handleCloseModal();
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutsideModal);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, handleCloseModal]);

  // Función para formatear valores
  const formatValue = useCallback((value: any): string => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "boolean") {
      return value ? "Sí" : "No";
    }
    if (typeof value === "string" && value.trim() === "") {
      return "N/A";
    }
    return String(value);
  }, []);

  // Función para formatear fechas
  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
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
                    key={`${item.id}-${item.proyecto}-${item.zona}-${item.categoria}-${index}`}
                    className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-2 flex-1">
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
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(item.id)}
                        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 whitespace-nowrap"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginación - Temporalmente oculta */}
            {/* TODO: Implementar paginación en el futuro */}
          </div>
        )}

        {/* Modal de Detalles */}
        {isModalOpen && (
          <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
              ref={modalRef}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
            >
              {/* Header del Modal */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
                <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                  Detalles del Proyecto
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                  aria-label="Cerrar modal"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="p-6">
                {loadingDetails && (
                  <div className="flex items-center justify-center py-12">
                    <p className="text-zinc-600 dark:text-zinc-400">Cargando detalles...</p>
                  </div>
                )}

                {errorDetails && !loadingDetails && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/20">
                    <p className="text-red-600 dark:text-red-400">{errorDetails}</p>
                  </div>
                )}

                {!loadingDetails && !errorDetails && details && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* Información Básica */}
                    <div className="col-span-full">
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Información Básica
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            ID:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.id)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Código Proyecto:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.cod_proyecto)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Proyecto:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.proyecto)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Categoría:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.categoria)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Estado:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.estado)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Uso:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.uso)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Fase:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.fase)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Torre:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.torre)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Período:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.periodo)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Mercado:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.mercado)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="col-span-full">
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Ubicación
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            País:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.pais)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Departamento:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.departamento)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Municipio:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.municipio)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Zona:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.zona)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Subzona:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.subzona)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Latitud:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.latitud)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Longitud:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.longitud)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div className="col-span-full">
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Fechas
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Fecha Recolección:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatDate(details.fecha_recoleccion)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Fecha Inicio:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatDate(details.fecha_inicio)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Fecha Entrega:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatDate(details.fecha_entrega)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Meses de Comercialización:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.meses_de_comercializacion)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desarrollador */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Desarrollador
                      </h3>
                      <div>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                          Desarrollador:
                        </span>
                        <p className="text-black dark:text-zinc-50">
                          {formatValue(details.desarrollador)}
                        </p>
                      </div>
                    </div>

                    {/* Unidades y Área */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Unidades y Área
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Total Unidades:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.total_unidades)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Unidades Disponibles:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.unidades_disponibles)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Total m²:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.total_m2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            m² Disponibles:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.m2_disponibles)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Tamaño Promedio:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.tamano_promedio)} m²
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Precios */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Precios
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Precio Promedio:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.precio_promedio)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Precio Promedio m²:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.precio_prom_m2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Cuota Promedio:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.cuota_promedio)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Ingresos Promedio:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.ingresos_promedio)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Precio Parqueo Adicional:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.precio_parqueo_adicional)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Parqueos */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Parqueos
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Total Parqueos Proyecto:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.total_parqueos_proyecto)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Parqueos Asignados:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.parqueos_asignados)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Parqueos Visita:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.parqueos_visita)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Información Adicional */}
                    <div className="col-span-full">
                      <h3 className="mb-3 text-lg font-semibold text-black dark:text-zinc-50">
                        Información Adicional
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Tipo de Seguridad:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.tipo_de_seguridad)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            MUVI:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.muvi)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            FHA:
                          </span>
                          <p className="text-black dark:text-zinc-50">{formatValue(details.fha)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            NSE Proyecto:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.nse_proyecto)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Showroom:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.showroom)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Casa Modelo:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.casa_modelo)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Cantidad Accesos:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.cantidad_accesos)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            URL Imagen:
                          </span>
                          <p className="break-all text-black dark:text-zinc-50">
                            {details.url_imagen ? (
                              <a
                                href={details.url_imagen}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {details.url_imagen}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Mig Number:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatValue(details.mig_number)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            Creado en:
                          </span>
                          <p className="text-black dark:text-zinc-50">
                            {formatDate(details.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer del Modal */}
              <div className="sticky bottom-0 border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-700 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
