import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs/promises";
import { getSession } from "next-auth/react";

export async function POST(request: Request, { params }: { params: { subjectId: string } }) {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        if (session.user.role !== "Admin" && session.user.role !== "Teacher") {
            return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
        }

        const teacherId = session.user.id;

        const subjectId = parseInt(params.subjectId, 10);

        if (!subjectId) {
            return NextResponse.json({ error: "ID de asignatura no proporcionado" }, { status: 400 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Archivo no proporcionado" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);

        // Guardar el archivo en el sistema de archivos
        await fs.mkdir(path.dirname(filePath), { recursive: true }); // Crear directorio si no existe
        await fs.writeFile(filePath, buffer);

        // Guardar la URL del archivo en la base de datos
        const fileUrl = `/uploads/${fileName}`;
        const newMaterial = await prisma.material.create({
            data: {
                name: file.name || "Sin nombre",
                subject_id: subjectId,
                file_url: fileUrl,
                type: file.type || "unknown",
                teacher_id: teacherId,
            },
        });

        return NextResponse.json(newMaterial, { status: 201 });
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// async function validateSubjectId(id: string): Promise<number> {
//     const parsedId = parseInt(id, 10);

//     if (isNaN(parsedId)) {
//         throw new Error("ID inválido");
//     }

//     // Verificar si el ID existe en la base de datos
//     const subject = await prisma.subject.findUnique({
//         where: { id: parsedId },
//     });

//     if (!subject) {
//         throw new Error("Materia no encontrada");
//     }

//     return parsedId;
// }