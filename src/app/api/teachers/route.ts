import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const teachers = await prisma.user.findMany({
            where: { type: "Teacher" },
            include: {
                subjectsAsTeacher: true,
                // preparers: true,
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
            subjectName: teacher.subjectsAsTeacher[0]?.name || "Sin asignar",
            createdAt: teacher.createdAt?.toISOString() || null,
        }));

        return NextResponse.json(formattedTeachers, { status: 200 });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json({ error: "Error al interno del servicio" }, { status: 500 });
    }
}