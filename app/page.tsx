"use client";

import { useState, useEffect, useCallback } from "react";

// 2️⃣ Tipos bien definidos (TypeScript)
interface Project {
  proyecto: string;
  categoria: string;
  zona: string | null;
  estado: string | null;
}

interface ApiResponse {
  projects: Project[];
}

export default function Home() {
  // 3️⃣ Estados mínimos y correctos
  const [query, setQuery] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 7️⃣ Debounce implementado
  useEffect(() => {
    // Si query está vacío → limpia resultados (6️⃣)
    if (!query.trim()) {
      setProjects([]);
      setError(null);
      return;
    }

    // Limpia el timeout anterior
    const timeoutId = setTimeout(() => {
      // 5️⃣ Llamada al backend correcta
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
          setProjects(data.projects || []);
        } catch (err) {
          setError("Error al buscar proyectos. Por favor, intenta nuevamente.");
          setProjects([]);
        } finally {
          setLoading(false);
        }
      };

      searchProjects();
    }, 300); // Espera 300ms antes de disparar la búsqueda

    // Limpia el timeout si el componente se desmonta o query cambia
    return () => clearTimeout(timeoutId);
  }, [query]);

  // 4️⃣ Input bien controlado
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    []
  );

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col gap-8 py-16 px-4 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
            Búsqueda de Proyectos
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Busca proyectos por nombre en la base de datos
          </p>
        </div>

        {/* 4️⃣ Input bien controlado */}
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Buscar proyecto…"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-black placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
            aria-label="Buscar proyecto"
          />
        </div>

        {/* 8️⃣ Render de estados (UX) */}
        {loading && (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            Buscando…
          </div>
        )}

        {error && !loading && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 9️⃣ Render de resultados */}
        {!loading && !error && query.trim() && projects.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50">
              Resultados ({projects.length})
            </h2>
            <div className="flex flex-col gap-3">
              {projects.map((project, index) => (
                <div
                  key={`${project.proyecto}-${index}`}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                      {project.proyecto}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <div>
                        <span className="font-medium">Categoría:</span>{" "}
                        {project.categoria}
                      </div>
                      {project.zona && (
                        <div>
                          <span className="font-medium">Zona:</span>{" "}
                          {project.zona}
                        </div>
                      )}
                      {project.estado && (
                        <div>
                          <span className="font-medium">Estado:</span>{" "}
                          {project.estado}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8️⃣ Muestra "No hay resultados" solo cuando hay texto, no está cargando, y el array viene vacío */}
        {!loading &&
          !error &&
          query.trim() &&
          projects.length === 0 && (
            <div className="text-center text-zinc-600 dark:text-zinc-400">
              No hay resultados para &quot;{query}&quot;
            </div>
          )}
      </main>
    </div>
  );
}
