import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const teacherId = session.user.id;

        const preparers = await prisma.user.findMany({
            where: { teacher_id: teacherId },
            select: {
                id: true,
                name: true,
                email: true,
                subjectsAsPreparer: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json({ preparers });
    } catch (error) {
        console.error("Error al obtener el numero de preparadores:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}