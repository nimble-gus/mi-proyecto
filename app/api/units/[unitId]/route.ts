import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/shared/lib/prisma";

// GET /api/units/[unitId] - Obtener detalle de una unidad
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    // 1️⃣ Validar unitId
    const { unitId } = await params;

    if (!unitId || unitId.trim() === "") {
      return NextResponse.json(
        { error: "El parámetro 'unitId' es obligatorio" },
        { status: 400 }
      );
    }

    const unitIdNum = parseInt(unitId, 10);
    if (isNaN(unitIdNum) || unitIdNum <= 0) {
      return NextResponse.json(
        { error: "El parámetro 'unitId' debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    // 2️⃣ Buscar unidad por id (solo campos solicitados)
    const unit = await prisma.housing_units.findUnique({
      where: { id: unitIdNum },
      select: {
        proyecto: true,
        unidad: true,
        periodo: true,
        modelo: true,
        torre_fase: true,
        tama_o_unidad: true,
        tama_o_balcon_terraza: true,
        cant_dormitorios: true,
        cant_sanitarios: true,
        parqueo: true,
        tipo_parqueo: true,
        cant_parqueos: true,
        parqueo_moto: true,
        tama_o_parqueo: true,
        tama_o_total: true,
        uso: true,
        precio_total_usd: true,
        precio_total_qtz: true,
        precio_sin_iva_usd: true,
        precio_sin_iva_qtz: true,
        disponibilidad: true,
        precio_mantenimiento_total: true,
        categoria: true,
        hora_recoleccion: true,
        cuota: true,
        absorcion_unitaria: true,
      },
    });

    // 3️⃣ Si no existe → 404
    if (!unit) {
      return NextResponse.json(
        { error: "Unidad no encontrada" },
        { status: 404 }
      );
    }

    // 4️⃣ Responder solo con los campos solicitados
    return NextResponse.json({
      unit,
    });
  } catch (error) {
    console.error("Error al obtener detalle de la unidad:", error);
    return NextResponse.json(
      { error: "Error al obtener detalle de la unidad" },
      { status: 500 }
    );
  }
}

// PATCH /api/units/[unitId] - Actualizar campos editables de una unidad
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  try {
    // 1️⃣ Validar unitId
    const { unitId } = await params;

    if (!unitId || unitId.trim() === "") {
      return NextResponse.json(
        { error: "El parámetro 'unitId' es obligatorio" },
        { status: 400 }
      );
    }

    const unitIdNum = parseInt(unitId, 10);
    if (isNaN(unitIdNum) || unitIdNum <= 0) {
      return NextResponse.json(
        { error: "El parámetro 'unitId' debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    // 2️⃣ Validar que la unidad existe
    const existingUnit = await prisma.housing_units.findUnique({
      where: { id: unitIdNum },
    });

    if (!existingUnit) {
      return NextResponse.json(
        { error: "Unidad no encontrada" },
        { status: 404 }
      );
    }

    // 3️⃣ Leer y validar payload
    const body = await request.json();

    // 4️⃣ Whitelist de campos editables (solo los campos de la lista solicitada que pueden editarse)
    const editableFields = [
      "unidad",
      "modelo",
      "torre_fase",
      "cant_dormitorios",
      "cant_sanitarios",
      "parqueo",
      "tipo_parqueo",
      "cant_parqueos",
      "parqueo_moto",
      "uso",
      "precio_total_usd",
      "precio_total_qtz",
      "precio_sin_iva_usd",
      "precio_sin_iva_qtz",
      "disponibilidad",
      "precio_mantenimiento_total",
      "categoria",
      "cuota",
    ];

    // Filtrar solo campos editables
    const updateData: any = {};
    for (const field of editableFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    // Validar que haya al menos un campo para actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos válidos para actualizar" },
        { status: 400 }
      );
    }

    // 5️⃣ Ejecutar update en Prisma
    const updatedUnit = await prisma.housing_units.update({
      where: { id: unitIdNum },
      data: updateData,
      select: {
        proyecto: true,
        unidad: true,
        periodo: true,
        modelo: true,
        torre_fase: true,
        tama_o_unidad: true,
        tama_o_balcon_terraza: true,
        cant_dormitorios: true,
        cant_sanitarios: true,
        parqueo: true,
        tipo_parqueo: true,
        cant_parqueos: true,
        parqueo_moto: true,
        tama_o_parqueo: true,
        tama_o_total: true,
        uso: true,
        precio_total_usd: true,
        precio_total_qtz: true,
        precio_sin_iva_usd: true,
        precio_sin_iva_qtz: true,
        disponibilidad: true,
        precio_mantenimiento_total: true,
        categoria: true,
        hora_recoleccion: true,
        cuota: true,
        absorcion_unitaria: true,
      },
    });

    // 6️⃣ Retornar unidad actualizada (solo campos solicitados)
    return NextResponse.json({
      unit: updatedUnit,
    });
  } catch (error) {
    console.error("Error al actualizar la unidad:", error);
    return NextResponse.json(
      { error: "Error al actualizar la unidad" },
      { status: 500 }
    );
  }
}
