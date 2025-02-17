import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getSession } from "next-auth/react";

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
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }
        const teacherId = session.user.id;

        const subjectId = parseInt(params.subjectId, 10);
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const fileUrl = file ? URL.createObjectURL(file) : "";
        if (!fileUrl) {
            return NextResponse.json({ error: "Archivo no valido" }, { status: 400 });
        }
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
        console.error("Error al subir el material:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { getSession } from "next-auth/react";
// import { v4 as uuidv4 } from "uuid";
// import { writeFile } from "fs/promises";
// import path from "path";

// export async function GET() {
//     try {
//         const subjects = await prisma.subject.findMany({
//             include: {
//                 teacher: true,
//                 preparer: true,
//                 materials: true,
//             },
//         });

//         return NextResponse.json(subjects, { status: 200 });
//     } catch (error) {
//         console.error("Error al obtener las materias:", error instanceof Error ? error.message : "Error desconocido");
//         return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
//     }
// }

// export async function POST(request: Request, { params }: { params: { subjectId: string } }) {
//     try {
//         const subjectId = parseInt(params.subjectId, 10);
//         if (isNaN(subjectId)) {
//             return NextResponse.json({ error: "ID de asignatura inválido" }, { status: 400 });
//         }

//         // Procesar el archivo enviado
//         const formData = await request.formData();
//         const file = formData.get("file") as File | null;

//         if (!file) {
//             return NextResponse.json({ error: "No se ha subido ningún archivo" }, { status: 400 });
//         }

//         const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//         if (!allowedTypes.includes(file.type)) {
//             return NextResponse.json(
//                 { error: "Tipo de archivo no permitido" },
//                 { status: 400 }
//             );
//         }

//         // Guardar el archivo en el servidor
//         const buffer = Buffer.from(await file.arrayBuffer());
//         const fileName = `${uuidv4()}-${file.name}`;
//         const filePath = path.join(process.cwd(), "public/uploads", fileName);
//         await writeFile(filePath, buffer);

//         const session = await getSession();
//         if (!session || !session.user?.id) {
//             return NextResponse.json({ error: "No autorizado" }, { status: 401 });
//         }

//         const teacherId = session.user.id;

//         const newMaterial = await prisma.material.create({
//             data: {
//                 name: file.name || "Sin nombre",
//                 file_url: `/uploads/${fileName}`,
//                 type: file.type || "unknown",
//                 subject_id: subjectId,
//                 teacher_id: teacherId,
//             },
//         });

//         return NextResponse.json(newMaterial, { status: 201 });
//     } catch (error) {
//         console.error("Error al subir el archivo:", error);
//         return NextResponse.json(
//             { error: "Error interno del servidor" },
//             { status: 500 }
//         );
//     }
// }
