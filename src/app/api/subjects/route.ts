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