import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(request: Request) {
    try {
        //Se verifica que no este vacio
        const rawBody = await request.text();
        if (!rawBody) {
            return NextResponse.json(
                { error: "Cuerpo de solicitud vacío" },
                { status: 400 }
            );
        }

        // Se parsea manualmente el JSON
        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (error) {
            return NextResponse.json(
                { error: "Formato JSON inválido" },
                { status: 400 }
            );
        }

        const { email } = await request.json();

        // Validar estructura básica
        if (!body.email || typeof body.email !== 'string') {
            return NextResponse.json(
                { error: "Email requerido" },
                { status: 400 }
            );
        }


        const user = await prisma.user.findUnique({
            where: { email },
            include: { questions_secret: true },
        });

        if (!user || !user.questions_secret.length) {
            return NextResponse.json(
                { error: "Usuario no encontrado o sin pregunta de seguridad" },
                { status: 404 }
            );
        }

        //Generacion de token con expiracion de 1hora
        const token = crypto.randomBytes(20).toString('hex');
        const expires = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        });

        await sendPasswordResetEmail(user.email, token, user.questions_secret[0].question);

        return NextResponse.json({ message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}