import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        //Buscar usuario
        const user = await prisma.user.findUnique({
            where: { email },
        });


        if (!user) {
            return NextResponse.json(
                { error: "Usuario no registrado" },
                { status: 404 }
            );
        }

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
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}