import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Leer el query param project
    const searchParams = request.nextUrl.searchParams;
    const project = searchParams.get("project");

    // Validar: Si no viene project → devolver categories: []
    if (!project || !project.trim()) {
      return NextResponse.json({ categories: [] });
    }

    const projectName = project.trim();

    // Consultar la tabla housing_universe:
    // - Filtrar por proyecto = project
    // - Obtener valores únicos de categoria
    // - Excluir valores nulos o vacíos
    // - Ordenar alfabéticamente (A–Z)
    const records = await prisma.housing_universe.findMany({
      where: {
        proyecto: projectName,
        categoria: {
          not: "",
        },
      },
      select: {
        categoria: true,
      },
      distinct: ["categoria"], // Obtener valores únicos
    });

    // Extraer categorías, filtrar valores vacíos y ordenar
    const categories = records
      .map((record) => record.categoria)
      .filter((categoria): categoria is string => categoria.trim() !== "")
      .sort((a, b) => a.localeCompare(b)); // Orden alfabético A-Z

    // Devolver: { categories: [...] }
    return NextResponse.json({ categories });
  } catch (error) {
    // Manejo de errores: Error controlado si falla la DB (500)
    // No exponer stack trace, respuesta consistente
    console.error("Error al obtener categorías:", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}
