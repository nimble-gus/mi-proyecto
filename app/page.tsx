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

export default function Home() {
  // Estados nuevos
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<SelectedProject | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Función para obtener el texto a mostrar en la lista (hasta 100 caracteres)
  const getDisplayText = useCallback((project: Project, allOptions: Project[]) => {
    const firstWord = project.proyecto.split(" ")[0];
    const duplicates = allOptions.filter(
      (p) => p.proyecto.split(" ")[0] === firstWord
    );

    if (duplicates.length > 1) {
      // Si hay duplicados, mostrar más palabras para diferenciar
      const words = project.proyecto.split(" ");
      const displayText = words.slice(0, Math.min(5, words.length)).join(" ");
      // Limitar a 100 caracteres para la visualización
      return displayText.length > 100 ? displayText.substring(0, 100) + "..." : displayText;
    }

    // Si no hay duplicados, mostrar más del nombre (hasta 100 caracteres)
    const displayText = project.proyecto.length > 100 
      ? project.proyecto.substring(0, 100) + "..." 
      : project.proyecto;
    return displayText;
  }, []);

  // Regla de llamadas al backend: Si query tiene 1+ letras → llamar /api/projects?q=query
  // Aplicar debounce (300ms)
  useEffect(() => {
    // Si query está vacío → options = [] y no llamar
    if (!query.trim()) {
      setOptions([]);
      setError(null);
      return;
    }

    // Limpia el timeout anterior
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
    }, 300); // Debounce de 300ms

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

  // Interacción: Click en una opción
  const handleSelectOption = useCallback((project: Project) => {
    setSelected(project);
    setIsOpen(false);
    setOptions([]);
    setQuery("");
  }, []);

  // Botón para limpiar selección
  const handleClearSelection = useCallback(() => {
    setSelected(null);
    setQuery("");
    setOptions([]);
    setIsOpen(false);
  }, []);

  // Input bien controlado
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
      <main className="flex w-full max-w-2xl flex-col gap-8 py-16 px-4 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Seleccionar Proyecto
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Selecciona un proyecto escribiendo una letra o prefijo
          </p>
        </div>

        {/* Selector de proyecto */}
        <div className="flex flex-col gap-2" ref={dropdownRef}>
          <label
            htmlFor="project-selector"
            className="text-sm font-medium text-black dark:text-zinc-50"
          >
            Proyecto
          </label>

          <div className="relative">
            <div className="flex items-center gap-2">
              <input
                id="project-selector"
                type="text"
                value={selected ? selected.proyecto : query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder={
                  selected ? selected.proyecto : "Escribe para buscar…"
                }
                disabled={!!selected}
                maxLength={200}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-400"
                aria-label="Seleccionar proyecto"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
              />

              {selected && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  aria-label="Limpiar selección"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Dropdown panel */}
            {isOpen && !selected && (
              <div className="absolute z-10 mt-2 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                {/* Mostrar "Escribe para buscar…" cuando está abierto y vacío */}
                {!query.trim() && !loading && (
                  <div className="px-4 py-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Escribe para buscar…
                  </div>
                )}

                {/* Mostrar "Buscando…" cuando loading */}
                {loading && (
                  <div className="px-4 py-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    Buscando…
                  </div>
                )}

                {/* Mostrar error si existe */}
                {error && !loading && (
                  <div className="px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Mostrar "No hay coincidencias" si options viene vacío con query lleno */}
                {!loading &&
                  !error &&
                  query.trim() &&
                  options.length === 0 && (
                    <div className="px-4 py-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
                      No hay coincidencias
                    </div>
                  )}

                {/* Lista de opciones */}
                {!loading && !error && options.length > 0 && (
                  <ul
                    role="listbox"
                    className="max-h-60 overflow-y-auto py-1"
                  >
                    {options.map((project, index) => {
                      const displayText = getDisplayText(project, options);
                      return (
                        <li
                          key={`${project.proyecto}-${index}`}
                          role="option"
                          onClick={() => handleSelectOption(project)}
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

        {/* Mostrar el proyecto seleccionado arriba o dentro del input (ya está en el input disabled) */}
        {selected && (
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Proyecto seleccionado:
            </p>
            <p className="mt-1 text-base font-semibold text-black dark:text-zinc-50">
              {selected.proyecto}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
