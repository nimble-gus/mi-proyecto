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

    // 2️⃣ Consulta: Obtener 1 registro por su ID
    const record = await prisma.housing_universe.findUnique({
      where: {
        id: id,
      },
    });

    // 3️⃣ Si no existe → responder 404
    if (!record) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    // 4️⃣ Respuesta consistente: Devolver todos los campos del registro
    // Nota: Si en el futuro hay campos sensibles o muy grandes,
    // se pueden excluir o truncar aquí
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
