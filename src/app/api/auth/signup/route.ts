import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/schemas/registerSchemas';
import { handleApiError } from '@/lib/errorHandler';
import { createUser } from '@/services/userService';

export async function POST(request: Request) {
    try {

        // Verificar contenido JSON
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            return NextResponse.json(
                { error: "El contenido debe ser tipo JSON" },
                { status: 400 }
            );
        }

        const rawData = await request.json();
        if (!rawData) {
            return NextResponse.json(
                { error: "Cuerpo de solicitud vacío" },
                { status: 400 }
            );
        }
        const parsedData = registerSchema.parse(rawData);
        const validation = registerSchema.safeParse(parsedData);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Datos inválidos",
                    details: validation.error.errors
                },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: parsedData.email },
                    { username: parsedData.username },
                    { cedula: parsedData.cedula }
                ]
            },
            select: {
                email: true,
                username: true,
                cedula: true
            }
        });

        if (existingUser) {
            const conflicts = [];
            if (existingUser.email === parsedData.email) conflicts.push("email");
            if (existingUser.username === parsedData.username) conflicts.push("nombre de usuario");
            if (existingUser.cedula === parsedData.cedula) conflicts.push("cédula");

            return NextResponse.json({
                error: `Conflicto en: ${conflicts.join(", ")}`,
                details: `Los siguientes datos ya están registrados: ${conflicts.join(", ")}`
            }, { status: 409 });
        }

        const nationality = await prisma.nationality.findFirst({
            where: { code: parsedData.nationality },
        });

        if (!nationality) {
            return NextResponse.json(
                { error: "Nacionalidad no válida" },
                { status: 400 }
            );
        }

        const userData = {
            ...parsedData,
            nationality_id: nationality.id,
            type: "Student",
            status: "Active",
            emailVerified: false,
            birthdate: new Date(parsedData.birthdate).toISOString(),
        };

        const newUser = await createUser(userData);

        return NextResponse.json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            status: newUser.status
        }, { status: 201 });

    } catch (error) {
        return handleApiError(error);
    }
}
