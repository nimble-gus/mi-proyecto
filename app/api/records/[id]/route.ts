import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1️⃣ Validación del identificador único
    const { id: idParam } = await params;

    // Validar que id venga y sea del tipo correcto (number)
    if (!idParam || idParam.trim() === "") {
      return NextResponse.json(
        { error: "El parámetro 'id' es obligatorio" },
        { status: 400 }
      );
    }

    // Convertir a número y validar
    const id = parseInt(idParam, 10);

    // Si no es un número válido → error 400
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "El parámetro 'id' debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    // 2️⃣ Consulta: Obtener 1 registro por su ID (solo campos necesarios)
    const record = await prisma.housing_universe.findUnique({
      where: {
        id: id,
      },
      select: {
        proyecto: true,
        fase: true,
        torre: true,
        periodo: true,
        categoria: true,
        pais: true,
        departamento: true,
        municipio: true,
        zona: true,
        desarrollador: true,
        estado: true,
        fecha_inicio: true,
        fecha_entrega: true,
        total_unidades: true,
        unidades_disponibles: true,
        tipo_de_seguridad: true,
        precio_promedio: true,
        cuota_promedio: true,
        ingresos_promedio: true,
        cantidad_accesos: true,
        url_imagen: true,
        latitud: true,
        longitud: true,
      },
    });

    // 3️⃣ Si no existe → responder 404
    if (!record) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    // 4️⃣ Respuesta consistente: Devolver solo los campos seleccionados
    return NextResponse.json({
      record: record,
    });
  } catch (error) {
    // Manejo de errores: Error controlado si falla la DB (500)
    // No exponer stack trace, respuesta consistente
    console.error("Error al obtener detalle del registro:", error);
    return NextResponse.json(
      { error: "Error al obtener detalle del registro" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;

    // Validar ID
    if (!idParam || idParam.trim() === "") {
      return NextResponse.json(
        { error: "El parámetro 'id' es obligatorio" },
        { status: 400 }
      );
    }

    const id = parseInt(idParam, 10);
    if (isNaN(id) || id <= 0) {
      return NextResponse.json(
        { error: "El parámetro 'id' debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    // Obtener datos del body
    const body = await request.json();
    
    // Validar que el registro existe
    const existingRecord = await prisma.housing_universe.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    // Preparar datos para actualizar (solo campos editables permitidos)
    const updateData: any = {};

    // Campos editables según especificación del usuario
    if (body.fase !== undefined) updateData.fase = body.fase || null;
    if (body.estado !== undefined) updateData.estado = body.estado || null;
    if (body.fecha_inicio !== undefined) {
      updateData.fecha_inicio = body.fecha_inicio ? new Date(body.fecha_inicio) : null;
    }
    if (body.fecha_entrega !== undefined) {
      updateData.fecha_entrega = body.fecha_entrega ? new Date(body.fecha_entrega) : null;
    }
    if (body.precio_promedio !== undefined) {
      updateData.precio_promedio = body.precio_promedio !== null && body.precio_promedio !== "" 
        ? parseFloat(String(body.precio_promedio)) 
        : null;
    }
    if (body.cuota_promedio !== undefined) {
      updateData.cuota_promedio = body.cuota_promedio !== null && body.cuota_promedio !== "" 
        ? parseFloat(String(body.cuota_promedio)) 
        : null;
    }
    if (body.ingresos_promedio !== undefined) {
      updateData.ingresos_promedio = body.ingresos_promedio !== null && body.ingresos_promedio !== "" 
        ? parseFloat(String(body.ingresos_promedio)) 
        : null;
    }
    if (body.unidades_disponibles !== undefined) {
      updateData.unidades_disponibles = body.unidades_disponibles !== null && body.unidades_disponibles !== "" 
        ? parseInt(String(body.unidades_disponibles), 10) 
        : null;
    }

    // Actualizar registro
    const updatedRecord = await prisma.housing_universe.update({
      where: { id },
      data: updateData,
      select: {
        proyecto: true,
        fase: true,
        torre: true,
        periodo: true,
        categoria: true,
        pais: true,
        departamento: true,
        municipio: true,
        zona: true,
        desarrollador: true,
        estado: true,
        fecha_inicio: true,
        fecha_entrega: true,
        total_unidades: true,
        unidades_disponibles: true,
        tipo_de_seguridad: true,
        precio_promedio: true,
        cuota_promedio: true,
        ingresos_promedio: true,
        cantidad_accesos: true,
        url_imagen: true,
        latitud: true,
        longitud: true,
      },
    });

    return NextResponse.json({
      record: updatedRecord,
      message: "Registro actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar registro:", error);
    return NextResponse.json(
      { error: "Error al actualizar el registro" },
      { status: 500 }
    );
  }
}
