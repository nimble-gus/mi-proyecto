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
        className="text-sm font-medium text-[#1F3A5F]"
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
            className="w-full rounded-lg border-2 border-[#E5E7EB] bg-white px-4 py-3 text-base text-[#111827] placeholder:text-[#9CA3AF] transition-all focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]/30 focus:ring-offset-0 hover:border-[#4DA3FF]/50 disabled:cursor-not-allowed disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF]"
            aria-label="Seleccionar proyecto"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          />

          {selectedProject && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg border border-[#4DA3FF] bg-[#4DA3FF]/10 px-4 py-3 text-sm font-medium text-[#4DA3FF] transition-all hover:bg-[#4DA3FF] hover:text-white hover:shadow-md"
              aria-label="Limpiar proyecto"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Dropdown panel */}
        {isOpen && !selectedProject && (
          <div className="absolute z-10 mt-2 w-full rounded-lg border border-[#E5E7EB] bg-white shadow-xl ring-1 ring-[#4DA3FF]/10">
            {!query.trim() && !loading && (
              <div className="px-4 py-3 text-center text-sm text-[#9CA3AF]">
                Escribe para buscar…
              </div>
            )}

            {loading && (
              <div className="px-4 py-3 text-center text-sm text-[#6B7280]">
                Buscando…
              </div>
            )}

            {error && !loading && (
              <div className="px-4 py-3 text-center text-sm text-[#EF4444]">
                {error}
              </div>
            )}

            {!loading && !error && query.trim() && options.length === 0 && (
              <div className="px-4 py-3 text-center text-sm text-[#6B7280]">
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
                      className="cursor-pointer px-4 py-2 text-sm text-[#111827] transition-all hover:bg-gradient-to-r hover:from-[#4DA3FF]/10 hover:to-[#4DA3FF]/5 hover:text-[#1F3A5F] hover:font-medium border-l-2 border-transparent hover:border-[#4DA3FF]"
                      aria-selected={false}
                      title={displayText}
                    >
                      <span className="truncate block">{displayText}</span>
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
