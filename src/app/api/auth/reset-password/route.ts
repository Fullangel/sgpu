import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        // 1. Buscar usuario por token válido
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Token inválido o expirado" },
                { status: 400 }
            );
        }

        // 2. Hashear nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Actualizar contraseña y limpiar token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al actualizar contraseña" },
            { status: 500 }
        );
    }
}