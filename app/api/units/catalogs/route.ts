import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Leer query params
    const searchParams = request.nextUrl.searchParams;
    const recordId = searchParams.get("recordId");
    const period = searchParams.get("period");

    // 2️⃣ Validar recordId obligatorio
    if (!recordId || recordId.trim() === "") {
      return NextResponse.json(
        { error: "El parámetro 'recordId' es obligatorio" },
        { status: 400 }
      );
    }

    // Convertir recordId a número
    const recordIdNum = parseInt(recordId, 10);
    if (isNaN(recordIdNum) || recordIdNum <= 0) {
      return NextResponse.json(
        { error: "El parámetro 'recordId' debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    // 3️⃣ Obtener el registro de housing_universe para obtener cod_proyecto y periodo
    const record = await prisma.housing_universe.findUnique({
      where: { id: recordIdNum },
      select: {
        cod_proyecto: true,
        periodo: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    // 4️⃣ Construir filtros para housing_units
    const where: any = {
      cod_proyecto: record.cod_proyecto,
    };

    // Si viene period en query params, usarlo; si no, usar el del registro
    const finalPeriod = period || record.periodo;
    if (finalPeriod) {
      where.periodo = finalPeriod;
    }

    // 5️⃣ Obtener valores únicos para cada catálogo
    const units = await prisma.housing_units.findMany({
      where,
      select: {
        uso: true,
        disponibilidad: true,
        cant_dormitorios: true,
      },
    });

    // 6️⃣ Extraer y filtrar valores únicos
    const uses = Array.from(
      new Set(
        units
          .map((u) => u.uso)
          .filter((u): u is string => u !== null && u !== undefined && u.trim() !== "")
      )
    ).sort((a, b) => a.localeCompare(b));

    const availabilities = Array.from(
      new Set(
        units
          .map((u) => u.disponibilidad)
          .filter((a): a is string => a !== null && a !== undefined && a.trim() !== "")
      )
    ).sort((a, b) => a.localeCompare(b));

    const bedrooms = Array.from(
      new Set(
        units
          .map((u) => u.cant_dormitorios)
          .filter((b): b is number => b !== null && b !== undefined)
      )
    ).sort((a, b) => a - b);

    // 7️⃣ Responder en JSON
    return NextResponse.json({
      uses,
      availabilities,
      bedrooms,
    });
  } catch (error) {
    console.error("Error al obtener catálogos de unidades:", error);
    return NextResponse.json(
      { error: "Error al obtener catálogos de unidades" },
      { status: 500 }
    );
  }
}
