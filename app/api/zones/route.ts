import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Leer el query param project
    const searchParams = request.nextUrl.searchParams;
    const project = searchParams.get("project");

    // Validar: Si no viene project → devolver zones: []
    if (!project || !project.trim()) {
      return NextResponse.json({ zones: [] });
    }

    const projectName = project.trim();

    // Consultar la tabla housing_universe:
    // - Filtrar por proyecto = project
    // - Obtener valores únicos de zona
    // - Excluir valores nulos o vacíos
    // - Ordenar las zonas alfabéticamente (A–Z)
    const records = await prisma.housing_universe.findMany({
      where: {
        proyecto: projectName,
        zona: {
          not: null,
        },
      },
      select: {
        zona: true,
      },
      distinct: ["zona"], // Obtener valores únicos
    });

    // Extraer zonas, filtrar valores vacíos y ordenar
    const zones = records
      .map((record) => record.zona)
      .filter((zona): zona is string => zona !== null && zona.trim() !== "")
      .sort((a, b) => a.localeCompare(b)); // Orden alfabético A-Z

    // Devolver solo lo necesario: { zones: [...] }
    return NextResponse.json({ zones });
  } catch (error) {
    // Manejo de errores: Error controlado si falla la DB (500)
    // No exponer stack trace, respuesta consistente
    console.error("Error al obtener zonas:", error);
    return NextResponse.json(
      { error: "Error al obtener zonas" },
      { status: 500 }
    );
  }
}
