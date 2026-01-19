"use client";

import { useEffect, useRef } from "react";
import { Project, SelectedProject } from "@/src/types/domain";

interface ProjectAutocompleteProps {
  query: string;
  setQuery: (query: string) => void;
  options: Project[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  loading: boolean;
  error: string | null;
  selectedProject: SelectedProject | null;
  getDisplayText: (project: Project, allOptions: Project[]) => string;
  onSelect: (project: Project) => void;
  onClear: () => void;
}

export function ProjectAutocomplete({
  query,
  setQuery,
  options,
  isOpen,
  setIsOpen,
  loading,
  error,
  selectedProject,
  getDisplayText,
  onSelect,
  onClear,
}: ProjectAutocompleteProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, [setIsOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  return (
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
            value={selectedProject?.proyecto || query}
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
              onClick={onClear}
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
                      onClick={() => onSelect(project)}
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
  );
}
