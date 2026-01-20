import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 3️⃣ Validación de parámetros
    // project (obligatorio)
    // URLSearchParams ya decodifica automáticamente, no necesitamos decodeURIComponent
    const projectParam = searchParams.get("project");

    // Si project no viene → no ejecutar consulta (error 400 o respuesta vacía)
    if (!projectParam || !projectParam.trim()) {
      return NextResponse.json(
        { error: "El parámetro 'project' es obligatorio" },
        { status: 400 }
      );
    }

    const project = projectParam.trim();

    // zone, category y period solo se aplican si vienen (verificar que no sean strings vacíos)
    // URLSearchParams ya decodifica automáticamente
    const zoneParam = searchParams.get("zone");
    const categoryParam = searchParams.get("category");
    const periodParam = searchParams.get("period");
    
    const zone = zoneParam && zoneParam.trim() ? zoneParam.trim() : null;
    const category = categoryParam && categoryParam.trim() ? categoryParam.trim() : null;
    const period = periodParam && periodParam.trim() ? periodParam.trim() : null;

    // page y pageSize tienen valores por defecto seguros
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    // Validar y parsear page (asegurar que sea un número válido)
    let page = 1;
    if (pageParam) {
      const parsedPage = parseInt(pageParam, 10);
      if (!isNaN(parsedPage) && parsedPage > 0) {
        page = parsedPage;
      }
    }
    
    // pageSize dentro de límites (default 5, max 50)
    const maxPageSize = 50;
    let pageSize = 5; // Valor por defecto: 5 proyectos por página
    if (pageSizeParam) {
      const parsedPageSize = parseInt(pageSizeParam, 10);
      if (!isNaN(parsedPageSize) && parsedPageSize > 0) {
        pageSize = Math.min(maxPageSize, parsedPageSize);
      }
    }
    
    const finalPageSize = Math.min(pageSize, maxPageSize);

    // 4️⃣ Construcción del filtro
    // Filtrar siempre por project
    const where: any = {
      proyecto: project,
    };

    // Agregar filtro por zone solo si se envía
    if (zone) {
      where.zona = zone;
    }

    // Agregar filtro por category solo si se envía
    if (category) {
      where.categoria = category;
    }

    // Agregar filtro por period solo si se envía
    if (period) {
      where.periodo = period;
    }

    // Debug: Log para verificar filtros (remover en producción)
    console.log("Filtros aplicados:", JSON.stringify(where, null, 2));

    // 5️⃣ Paginación
    // Calcular offset (skip) según page y pageSize
    const skip = (page - 1) * finalPageSize;

    // Obtener totalItems para calcular totalPages
    const totalItems = await prisma.housing_universe.count({ where });
    const totalPages = Math.ceil(totalItems / finalPageSize);

    // Limitar resultados con take
    // Ordenar resultados de forma estable (por proyecto e id para consistencia)
    const records = await prisma.housing_universe.findMany({
      where,
      select: {
        // Performance: Seleccionar solo los campos necesarios
        id: true, // ID necesario para el botón "Ver detalles"
        proyecto: true,
        categoria: true,
        zona: true,
        periodo: true, // Período del registro
        // total_unidades ya no se obtiene de housing_universe, se calcula desde housing_units
        // Agregar más campos según necesidad futura
      },
      skip: skip, // Siempre incluir skip, incluso si es 0
      take: finalPageSize,
      orderBy: [
        {
          proyecto: "asc", // Orden estable por proyecto
        },
        {
          id: "asc", // Segundo criterio para consistencia en paginación
        },
      ],
    });

    // 6️⃣ Calcular total_unidades y unidades_disponibles desde housing_units para cada registro
    // Contar unidades donde proyecto y periodo coincidan con el registro de housing_universe
    const recordsWithCounts = await Promise.all(
      records.map(async (record) => {
        // Contar total de unidades
        const totalUnidades = await prisma.housing_units.count({
          where: {
            proyecto: record.proyecto,
            periodo: record.periodo,
          },
        });

        // Contar unidades disponibles (donde disponibilidad = "Disponible")
        const unidadesDisponibles = await prisma.housing_units.count({
          where: {
            proyecto: record.proyecto,
            periodo: record.periodo,
            disponibilidad: "Disponible",
          },
        });

        return {
          ...record,
          total_unidades: totalUnidades || 0,
          unidades_disponibles: unidadesDisponibles || 0,
        };
      })
    );

    // 7️⃣ Respuesta estándar con metadata de paginación
    return NextResponse.json({
      items: recordsWithCounts,
      page,
      pageSize: finalPageSize,
      totalItems,
      totalPages,
    });
  } catch (error) {
    // Manejo de errores: Error controlado si falla la DB (500)
    // No exponer stack trace, respuesta consistente
    console.error("Error al obtener registros:", error);
    return NextResponse.json(
      { error: "Error al obtener registros" },
      { status: 500 }
    );
  }
}
