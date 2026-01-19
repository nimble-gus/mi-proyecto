"use client";

import Link from "next/link";
import { Project } from "@/src/types/domain";

interface ResultItemProps {
  project: Project;
}

export function ResultItem({ project }: ResultItemProps) {
  return (
    <div className="group rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-white to-[#F3F4F6]/30 p-5 shadow-sm transition-all hover:border-[#4DA3FF]/50 hover:shadow-lg hover:shadow-[#4DA3FF]/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-lg font-semibold text-[#1F3A5F] group-hover:text-[#4DA3FF] transition-colors">
            {project.proyecto}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 rounded-md bg-[#4DA3FF]/10 px-2.5 py-1">
              <span className="font-medium text-[#1F3A5F]">Categoría:</span>
              <span className="text-[#4DA3FF] font-medium">{project.categoria}</span>
            </div>
            {project.zona && (
              <div className="flex items-center gap-1.5 rounded-md bg-[#1F3A5F]/10 px-2.5 py-1">
                <span className="font-medium text-[#1F3A5F]">Zona:</span>
                <span className="text-[#1F3A5F] font-medium">{project.zona}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 rounded-md bg-[#F59E0B]/10 px-2.5 py-1">
              <span className="font-medium text-[#1F3A5F]">Período:</span>
              <span className="text-[#F59E0B] font-medium">{project.periodo}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-[#10B981]/10 px-2.5 py-1">
              <span className="font-medium text-[#1F3A5F]">Unidades:</span>
              <span className="text-[#10B981] font-semibold">{project.total_unidades ?? 0}</span>
            </div>
          </div>
        </div>
        <Link
          href={`/records/${project.id}`}
          className="whitespace-nowrap rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-[#1F3A5F] hover:to-[#4DA3FF] hover:shadow-lg hover:shadow-[#4DA3FF]/30 hover:-translate-y-0.5"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
