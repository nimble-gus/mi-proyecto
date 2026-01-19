import { Project } from "@/src/types/domain";

interface ResultItemProps {
  project: Project;
  onOpenDetails: (id: number) => void;
}

export function ResultItem({ project, onOpenDetails }: ResultItemProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
            {project.proyecto}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div>
              <span className="font-medium">Categoría:</span> {project.categoria}
            </div>
            {project.zona && (
              <div>
                <span className="font-medium">Zona:</span> {project.zona}
              </div>
            )}
            <div>
              <span className="font-medium">Período:</span> {project.periodo}
            </div>
            <div>
              <span className="font-medium">Total Unidades:</span> {project.total_unidades ?? 0}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenDetails(project.id)}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 whitespace-nowrap"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
}
