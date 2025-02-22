import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function POST(request: Request) {
    try {
        // Parsear el cuerpo de la solicitud
        const rawBody = await request.json();
        const { email, answer }: { email?: string; answer?: string } = rawBody;

        // Validar que se proporcionen los campos necesarios
        if (!email || typeof email !== 'string' || !answer || typeof answer !== 'string') {
            return NextResponse.json(
                { error: "Faltan campos requeridos o tienen un formato incorrecto" },
                { status: 400 }
            );
        }

        // Buscar al usuario en la base de datos por su correo electrónico
        const user = await prisma.user.findUnique({
            where: { email },
            include: { questions_secret: true }, // Incluir la relación con las preguntas secretas
        });

        // Si no se encuentra el usuario, devolver un error
        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        // Verificar si el usuario tiene una pregunta secreta registrada
        if (!user.questions_secret || user.questions_secret.length === 0) {
            return NextResponse.json(
                { error: "No hay pregunta secreta registrada para este usuario" },
                { status: 400 }
            );
        }

        // Obtener la primera pregunta secreta (asumiendo que solo hay una)
        const questionSecret = user.questions_secret[0];

        // Comparar la respuesta de seguridad proporcionada con la almacenada en la base de datos
        if (questionSecret.answer.trim() !== answer.trim()) {
            return NextResponse.json(
                { error: "Respuesta incorrecta" },
                { status: 400 }
            );
        }

        // Si la respuesta es válida, generar un token de restablecimiento de contraseña
        const resetPasswordToken = generateResetPasswordToken();

        // Guardar el token en la base de datos
        await prisma.user.update({
            where: { email },
            data: { resetPasswordToken },
        });

        // Devolver una respuesta exitosa con la URL de redirección
        return NextResponse.json(
            {
                success: true,
                message: "Respuesta válida",
                redirectUrl: `/auth/reset-password?token=${resetPasswordToken}`,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al validar la respuesta de seguridad:", error);

        // Manejar errores internos del servidor
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// Función para generar un token de restablecimiento de contraseña
function generateResetPasswordToken(): string {
    return Math.random().toString(36).substring(2, 15); // Genera un token aleatorio
}