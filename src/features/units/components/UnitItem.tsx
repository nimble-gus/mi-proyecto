"use client";

import Link from "next/link";
import { Unit } from "../types/domain";

interface UnitItemProps {
  unit: Unit;
}

export function UnitItem({ unit }: UnitItemProps) {
  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return "N/A";
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSize = (size: number | null) => {
    if (size === null || size === undefined) return "N/A";
    return `${size.toFixed(2)} m²`;
  };

  return (
    <div className="group rounded-lg border-2 border-[#E5E7EB] bg-gradient-to-br from-white to-[#F3F4F6]/30 p-5 shadow-sm transition-all hover:border-[#4DA3FF]/50 hover:shadow-lg hover:shadow-[#4DA3FF]/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 flex-col gap-3">
          <h3 className="text-lg font-semibold text-[#1F3A5F] group-hover:text-[#4DA3FF] transition-colors">
            {unit.unidad || unit.num_unidad || `Unidad #${unit.id}`}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm">
            {unit.uso && (
              <div className="flex items-center gap-1.5 rounded-md bg-[#F59E0B]/10 px-2.5 py-1">
                <span className="font-medium text-[#1F3A5F]">Uso:</span>
                <span className="text-[#F59E0B] font-medium">{unit.uso}</span>
              </div>
            )}
            {unit.disponibilidad && (
              <div className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 ${
                unit.disponibilidad === "Disponible" 
                  ? "bg-[#10B981]/10" 
                  : "bg-[#EF4444]/10"
              }`}>
                <span className="font-medium text-[#1F3A5F]">Disponibilidad:</span>
                <span className={`font-semibold ${
                  unit.disponibilidad === "Disponible" 
                    ? "text-[#10B981]" 
                    : "text-[#EF4444]"
                }`}>
                  {unit.disponibilidad}
                </span>
              </div>
            )}
            {unit.cant_dormitorios !== null && (
              <div className="flex items-center gap-1.5 rounded-md bg-[#4DA3FF]/10 px-2.5 py-1">
                <span className="font-medium text-[#1F3A5F]">Dormitorios:</span>
                <span className="text-[#4DA3FF] font-semibold">{unit.cant_dormitorios}</span>
              </div>
            )}
          </div>
        </div>
        <Link
          href={`/units/${unit.id}`}
          className="whitespace-nowrap rounded-lg bg-gradient-to-r from-[#4DA3FF] to-[#1F3A5F] px-5 py-2.5 text-sm font-medium text-white transition-all hover:from-[#1F3A5F] hover:to-[#4DA3FF] hover:shadow-lg hover:shadow-[#4DA3FF]/30 hover:-translate-y-0.5"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
