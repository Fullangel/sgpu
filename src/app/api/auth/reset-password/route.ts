import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
        const { token, password, answer } = await request.json();

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            },
            include: { questions_secret: true }
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: 'Token Invalido o expirado'
                }, { status: 400 }
            );
        }

        //Verifica la respuesta
        const isValidAnswer = answer.ToLowerCase() === user.questions_secret[0].answer.toLowerCase();

        if (!isValidAnswer) {
            return NextResponse.json(
                {
                    error: 'Respuesta Incorrecta'
                }, { status: 400 }
            );
        }

        //Actualiza la contrase;a
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        return NextResponse.json({ message: 'Contrase;a actualizada exitosamente' });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}