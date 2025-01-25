import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();

        // Verificar cuerpo vacío
        if (!rawBody.trim()) {
            return NextResponse.json(
                { error: "Cuerpo de solicitud vacío" },
                { status: 400 }
            );
        }

        // Parsear y validar JSON
        let body: { email?: string };
        try {
            body = JSON.parse(rawBody);
        } catch (error) {
            return NextResponse.json(
                { error: "Formato JSON inválido" },
                { status: 400 }
            );
        }

        // Validar email
        if (!body.email || typeof body.email !== 'string') {
            return NextResponse.json(
                { error: "Email requerido" },
                { status: 400 }
            );
        }

        // Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email: body.email },
            include: { questions_secret: true }
        });

        // Verificar usuario y pregunta secreta
        if (!user || !user.questions_secret?.[0]?.question) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Generar y guardar código
        const resetCode = crypto.randomInt(100000, 999999).toString();
        await prisma.user.update({
            where: { email: body.email },
            data: {
                resetPasswordCode: resetCode,
                resetPasswordExpires: new Date(Date.now() + 900000) // 15 minutos
            }
        });

        // Log de desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔑 Código para ${body.email}: ${resetCode}`);
        }

        return NextResponse.json({
            message: 'Código generado',
            code: process.env.NODE_ENV === 'development' ? resetCode : null
        });

    } catch (error) {
        console.error("Error en recuperación:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}