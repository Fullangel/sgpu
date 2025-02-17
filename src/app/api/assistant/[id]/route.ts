import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const idParam = params?.id;
        if (!idParam) {
            return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 });
        }

        // Validar que el ID sea un número
        const parsedId = parseInt(idParam, 10);
        if (isNaN(parsedId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        // Buscar el preparador en la base de datos
        const preparer = await prisma.user.findUnique({
            where: { id: parsedId },
        });

        if (!preparer) {
            return NextResponse.json({ error: "Preparador no encontrado" }, { status: 404 });
        }

        await prisma.user.delete({
            where: { id: parsedId },
        });

        return NextResponse.json({ message: "Preparador eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar preparador:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}