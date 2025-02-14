import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const teachers = await prisma.user.findMany({
            where: { type: "Teacher" },
            include: {
                subject: true,
                preparers: true,
            },
            // select: {
            //     id: true,
            //     name: true,
            //     subject: {
            //         select: {
            //             name: true,
            //         },
            //     },
            //     preparers: {
            //         select: { id: true, name: true },
            //     },
            // },
        });

        console.log(teachers);

        const formattedTeachers = teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            subject: teacher.subject?.name || "sin asignar",
            preparers: teacher.preparers.length,
        }));

        return NextResponse.json(formattedTeachers, { status: 200 });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json({ error: "Error al interno del servicio" }, { status: 500 });
    }
}