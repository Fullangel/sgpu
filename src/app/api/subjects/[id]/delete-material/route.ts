import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const parsedId = parseInt(id, 10);

        if (isNaN(parsedId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        // Buscar el material en la base de datos
        const material = await prisma.material.findUnique({
            where: { id: parsedId },
        });

        if (!material) {
            return NextResponse.json({ error: "Material no encontrado" }, { status: 404 });
        }

        // Eliminar el archivo del servidor
        const filePath = path.join(process.cwd(), "public", material.file_url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Eliminar el material de la base de datos
        await prisma.material.delete({
            where: { id: parsedId },
        });

        return NextResponse.json({ message: "Material eliminado exitosamente" }, { status: 200 });
    } catch (error) {
        console.error("Error al eliminar el material:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}