import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Leer el query param q
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    // Normalizar el input: trim para quitar espacios
    const normalizedQuery = query?.trim() || "";

    // Validar: si q viene vacío → devolver { projects: [] }
    if (!normalizedQuery) {
      return NextResponse.json({ projects: [] });
    }

    // Validar longitud máxima (200 caracteres)
    if (normalizedQuery.length > 200) {
      return NextResponse.json(
        { error: "El término de búsqueda es demasiado largo" },
        { status: 400 }
      );
    }

    // Definir la regla de búsqueda:
    // - Si q tiene 1 letra (ej. "a") → buscar nombres que empiecen con esa letra
    // - Si q tiene más letras (ej. "al") → buscar nombres que empiecen con ese prefijo
    // Usamos startsWith para búsqueda por prefijo (case-sensitive en MySQL)
    const projects = await prisma.housing_universe.findMany({
      where: {
        proyecto: {
          startsWith: normalizedQuery,
        },
      },
      select: {
        proyecto: true,
        categoria: true,
        zona: true,
        // Solo 3 campos: proyecto, categoria, zona
      },
      take: 30, // Límite fijo de 30 resultados
      orderBy: {
        proyecto: "asc", // Ordenar alfabéticamente por nombre
      },
    });

    // Estandarizar la respuesta: siempre { projects: [...] }
    return NextResponse.json({ projects });
  } catch (error) {
    // Manejo de errores básico: status 500 + mensaje simple
    // No exponer stack traces ni detalles sensibles
    console.error("Error en búsqueda de proyectos:", error);
    return NextResponse.json(
      { error: "Error al buscar proyectos" },
      { status: 500 }
    );
  }
}
