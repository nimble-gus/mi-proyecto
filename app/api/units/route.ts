import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Leer query params
    const searchParams = request.nextUrl.searchParams;
    const recordId = searchParams.get("recordId");
    const period = searchParams.get("period");
    const use = searchParams.get("use");
    const availability = searchParams.get("availability");
    const bedrooms = searchParams.get("bedrooms");
    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");
    const sort = searchParams.get("sort") || "new";

    // 2️⃣ Validar recordId obligatorio
    if (!recordId || recordId.trim() === "") {
      return NextResponse.json(
        { error: "El parámetro 'recordId' es obligatorio" },
        { status: 400 }
      );
    }

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

    // 4️⃣ Validar y procesar page y pageSize
    let page = 1;
    if (pageParam) {
      const parsed = parseInt(pageParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    let pageSize = 10; // Default
    if (pageSizeParam) {
      const parsed = parseInt(pageSizeParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        pageSize = Math.min(50, parsed); // Máximo 50
      }
    }

    // 5️⃣ Construir filtros dinámicos
    const where: any = {
      cod_proyecto: record.cod_proyecto,
    };

    // Si viene period en query params, usarlo; si no, usar el del registro
    const finalPeriod = period || record.periodo;
    if (finalPeriod) {
      where.periodo = finalPeriod;
    }

    if (use && use.trim() !== "") {
      where.uso = use;
    }

    if (availability && availability.trim() !== "") {
      where.disponibilidad = availability;
    }

    if (bedrooms) {
      const bedroomsNum = parseInt(bedrooms, 10);
      if (!isNaN(bedroomsNum)) {
        where.cant_dormitorios = bedroomsNum;
      }
    }

    // 6️⃣ Contar total de items
    const totalItems = await prisma.housing_units.count({ where });

    // 7️⃣ Calcular paginación
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalItems / pageSize);

    // 8️⃣ Definir orderBy según sort
    const orderBy: any[] = [];
    if (sort === "old") {
      orderBy.push({ id: "asc" });
    } else {
      // "new" por defecto
      orderBy.push({ id: "desc" });
    }

    // 9️⃣ Obtener items paginados (solo campos necesarios para la card)
    const items = await prisma.housing_units.findMany({
      where,
      select: {
        id: true,
        num_unidad: true,
        modelo: true,
        torre_fase: true,
        unidad: true,
        uso: true,
        disponibilidad: true,
        cant_dormitorios: true,
        precio_total_usd: true,
        precio_total_qtz: true,
        tama_o_unidad: true,
      },
      skip,
      take: pageSize,
      orderBy,
    });

    // 🔟 Respuesta estándar con metadata de paginación
    return NextResponse.json({
      items,
      page,
      pageSize,
      totalItems,
      totalPages,
    });
  } catch (error) {
    console.error("Error al buscar unidades:", error);
    return NextResponse.json(
      { error: "Error al buscar unidades" },
      { status: 500 }
    );
  }
}
