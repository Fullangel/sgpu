import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { materialId: string } }) {
    try {
        const materialId = parseInt(params.materialId, 10);
        const body = await request.json();
        const { file_url, type } = body;

        if (!file_url || !type) {
            return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
        }

        const updatedMaterial = await prisma.material.update({
            where: { id: materialId },
            data: {
                file_url,
                type,
            },
        });

        return NextResponse.json(updatedMaterial, { status: 200 });
    } catch (error) {
        console.error("Error al actualizar el material:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { materialId: string } }) {
    try {
        const materialId = parseInt(params.materialId, 10);

        await prisma.material.delete({
            where: { id: materialId },
        });

        return NextResponse.json({ message: "Material elminnado" }, { status: 200 });
    } catch (error) {
        console.error("Error al eliminar el material:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}