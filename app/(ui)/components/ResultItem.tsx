"use client";

import Link from "next/link";
import { Project } from "@/src/types/domain";

interface ResultItemProps {
  project: Project;
}

export function ResultItem({ project }: ResultItemProps) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <h3 className="text-lg font-semibold text-[#111827]">
            {project.proyecto}
          </h3>
          <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
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
        <Link
          href={`/records/${project.id}`}
          className="whitespace-nowrap rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6]"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
