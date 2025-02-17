import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const teacherId = session.user.id;
        const body = await request.json();

        const { name, email, password, subjectName } = body;

        const preparer = await prisma.user.create({
            data: {
                name,
                email,
                password,
                username: email.split("@")[0], // Genera un nombre de usuario basado en el correo electrónico
                nationality_id: 1, // ID de nacionalidad predeterminado
                status: "Active", // Estado predeterminado
                type: "Preparer",
                teacher_id: teacherId,
                subjectsAsPreparer: {
                    connectOrCreate: {
                        where: { name: subjectName },
                        create: {
                            name: subjectName,
                            teacher: {
                                connect: { id: teacherId },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ message: "Preparador agregado correctamente", preparer });
    } catch (error) {
        console.error("Error al agregar preparador:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}