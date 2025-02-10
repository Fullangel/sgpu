import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // Verificar que `params` esté disponible
        const idParam = params?.id;

        if (!idParam) {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        // Validar que el ID sea un número
        const parsedId = parseInt(idParam, 10);
        if (isNaN(parsedId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        // Buscar el profesor en la base de datos
        const teacher = await prisma.user.findUnique({
            where: { id: parsedId },
        });

        if (!teacher) {
            return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 });
        }

        // Eliminar registros relacionados (por ejemplo, tutores)
        await prisma.user.deleteMany({
            where: { teacher_id: parsedId }, // Eliminar tutores asociados al profesor
        });

        // Eliminar al profesor
        await prisma.user.delete({
            where: { id: parsedId },
        });

        return NextResponse.json({ message: "Profesor eliminado exitosamente" }, { status: 200 });
    } catch (error) {
        console.error("Error al eliminar al profesor:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}