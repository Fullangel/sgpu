// src/app/api/teacher/material/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const teacherId = session.user.id;

        const materials = await prisma.material.findMany({
            where: { teacher_id: teacherId },
            select: {
                id: true,
                name: true,
                file_url: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ materials });
    } catch (error) {
        console.error("Error al listar el material:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const teacherId = session.user.id;

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const subjectName = formData.get("subject") as string;

        // Guardar el archivo en el servidor
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public/uploads", fileName);
        await writeFile(filePath, buffer);

        // Buscar el subject en la base de datos
        const subject = await prisma.subject.findUnique({
            where: { name: subjectName },
        });

        if (!subject) {
            return NextResponse.json(
                { error: "El subject no existe en la base de datos" },
                { status: 404 }
            );
        }

        // Guardar el registro en la base de datos
        const newMaterial = await prisma.material.create({
            data: {
                name,
                file_url: `/uploads/${fileName}`,
                type,
                subject: {
                    connect: {
                        id: subject.id
                    }
                },
                teacher: {
                    connect: { id: teacherId },
                },
            },
        });

        return NextResponse.json({ message: "Material subido correctamente", newMaterial }, { status: 201 });
    } catch (error) {
        console.error("Error al subir el material:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}