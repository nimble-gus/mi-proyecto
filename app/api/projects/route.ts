import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Leer el query param q
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    // Limpiar espacios y validar
    const searchTerm = query?.trim() || "";

    // Si q viene vacío → responder { projects: [] }
    if (!searchTerm) {
      return NextResponse.json({ projects: [] });
    }

    // Hacer la consulta con Prisma
    // Filtrar por nombre usando "contiene" (búsqueda parcial)
    // Limitar resultados (top 20) y ordenar por nombre
    const projects = await prisma.housing_universe.findMany({
      where: {
        proyecto: {
          contains: searchTerm,
        },
      },
      select: {
        proyecto: true,
        categoria: true,
        zona: true,
        estado: true,
      },
      take: 20, // Limitar a 20 resultados
      orderBy: {
        proyecto: "asc", // Ordenar por nombre ascendente
      },
    });

    // Formatear la respuesta
    return NextResponse.json({ projects });
  } catch (error) {
    // Manejo de errores: status 500 + mensaje simple
    console.error("Error en búsqueda de proyectos:", error);
    return NextResponse.json(
      { error: "Error al buscar proyectos" },
      { status: 500 }
    );
  }
}
