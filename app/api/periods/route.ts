import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Leer el query param project
    const searchParams = request.nextUrl.searchParams;
    const project = searchParams.get("project");

    // Validar: Si no viene project → devolver periods: []
    if (!project || !project.trim()) {
      return NextResponse.json({ periods: [] });
    }

    const projectName = project.trim();

    // Consultar la tabla housing_universe:
    // - Filtrar por proyecto = project
    // - Obtener valores únicos de periodo
    // - Excluir valores nulos o vacíos
    // - Ordenar alfabéticamente (A–Z)
    const records = await prisma.housing_universe.findMany({
      where: {
        proyecto: projectName,
        periodo: {
          not: "",
        },
      },
      select: {
        periodo: true,
      },
      distinct: ["periodo"], // Obtener valores únicos
    });

    // Extraer períodos, filtrar valores vacíos y ordenar
    const periods = records
      .map((record) => record.periodo)
      .filter((periodo): periodo is string => periodo.trim() !== "")
      .sort((a, b) => a.localeCompare(b)); // Orden alfabético A-Z

    // Devolver: { periods: [...] }
    return NextResponse.json({ periods });
  } catch (error) {
    // Manejo de errores: Error controlado si falla la DB (500)
    // No exponer stack trace, respuesta consistente
    console.error("Error al obtener períodos:", error);
    return NextResponse.json(
      { error: "Error al obtener períodos" },
      { status: 500 }
    );
  }
}
