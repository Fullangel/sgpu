import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                teacher: true,
                preparer: true,
                materials: true,
            },
        });

        return NextResponse.json(subjects, { status: 200 });
    } catch (error) {
        console.error("Error al obtener las materias:", error instanceof Error ? error.message : "Error desconocido");
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function POST(request: Request, { params }: { params: { subjectId: string } }) {
    try {
        const subjectId = parseInt(params.subjectId, 10);
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileUrl = file ? URL.createObjectURL(file) : "";

        if (!fileUrl) {
            return NextResponse.json({ error: "Archivo no valido" }, { status: 400 });
        }

        const newMaterial = await prisma.material.create({
            data: {
                subject_id: subjectId,
                file_url: fileUrl,
                type: file.type || "unknown",
            },
        });

        return NextResponse.json(newMaterial, { status: 201 });
    } catch (error) {
        console.error("Error al subir el material:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}