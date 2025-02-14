import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const parsedId = parseInt(id, 10);

        if (isNaN(parsedId)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "Archivo no encontrado" }, { status: 400 });
        }

        //Guarda el archivo en el servidor
        const buffer: Buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}=${file.name}`;
        const filePath = path.join(process.cwd(), 'public/uploads', fileName);
        await writeFile(filePath, buffer);

        //Guardar el archivo en la bd
        const material = await prisma.material.create({
            data: {
                subject_id: parsedId,
                file_url: `/uploads/${fileName}`,
                type: file.type,
            },
        });

        return NextResponse.json(material, { status: 201 });
    } catch (error) {
        console.error("Error al subir al archivo:", error instanceof Error ? error.message : "Error desconocido")
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}