import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
<<<<<<< HEAD
        const { email } = await request.json();

        //Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email },
        });


        if (!user) {
            return NextResponse.json(
                { error: "Usuario no registrado" },
=======
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
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
                { status: 404 }
            );
        }

<<<<<<< HEAD
        //Generar token unico
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000);

        //guardar token en la base de datos
        await prisma.user.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpires: expires,
            },
        });

        // En desarrollo Mostrar enlace en consola
        if (process.env.NODE_ENV === 'development') {
            const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;
            console.log("\x1b[36m%s\x1b[0m", `🔗 Enlace de recuperación: ${resetLink}`); // Color cyan
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
=======
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
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}