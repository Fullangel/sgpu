
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { google } from "googleapis";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { email, answer }: { email: string; answer: string } = await request.json();

        // Validar que los campos necesarios estén presentes
        if (!email || !answer) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        const body: { email?: string } = { email };

        // Buscar al usuario en la base de datos
        const user = await prisma.user.findUnique({
            where: { email: body.email },
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

        // Comparar la respuesta de seguridad
        const questionSecret = user.questions_secret[0];
        if (questionSecret.answer.trim() !== answer.trim()) {
            return NextResponse.json(
                { error: "Respuesta incorrecta" },
                { status: 400 }
            );
        }

        // Generar un token de restablecimiento de contraseña
        const resetPasswordToken = Math.random().toString(36).substring(2, 15);

        // Guardar el token en la base de datos
        await prisma.user.update({
            where: { email: body.email },
            data: { resetPasswordToken },
        });

        // Configurar el transporte de correo
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

        // Obtener un token de acceso a partir del refresh token
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    console.error("Error al obtener el token de acceso:", err);
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });

        // Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST, // Por ejemplo, 'smtp.gmail.com'
            port: Number(process.env.EMAIL_SERVER_PORT), // Por ejemplo, 587
            secure: false, // Usa `true` si el puerto es 465 (SSL)
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken as string, // Asegúrate de que sea una cadena
            },
        });

        // Enviar el correo con el enlace de restablecimiento
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetPasswordToken}`;
        const mailOptions = {
            from: `"SGPU EMAIL" <${process.env.EMAIL_USER}>`,
            to: body.email,
            subject: 'Recuperación de Contraseña',
            text: ` <p>Hola ${user.name || 'usuario'}.</p><p>Has solicitado restablecer tu contraseña.
            Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
            html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`,
        };

        await transporter.sendMail(mailOptions);

        // Devolver una respuesta exitosa
        return NextResponse.json(
            {
                success: true,
                message: "Correo enviado correctamente",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error al procesar la solicitud de recuperación:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import crypto from 'crypto';
// import nodemailer from 'nodemailer';
// import { google } from "googleapis";

// export async function POST(request: Request) {
//     try {
//         // Parsear y validar el cuerpo de la solicitud
//         const rawBody = await request.text();
//         if (!rawBody.trim()) {
//             return NextResponse.json({ error: "Cuerpo de solicitud vacío" }, { status: 400 });
//         }
//         let body: { email?: string };
//         try {
//             body = JSON.parse(rawBody);
//         } catch (error) {
//             return NextResponse.json({ error: "Formato JSON inválido" }, { status: 400 });
//         }
//         if (!body.email || typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
//             return NextResponse.json({ error: "Correo electrónico inválido" }, { status: 400 });
//         }

//         // Buscar usuario en la base de datos
//         const user = await prisma.user.findUnique({
//             where: { email: body.email },
//             include: { questions_secret: true },
//         });
//         if (!user) {
//             return NextResponse.json({ error: "Usuario no registrado" }, { status: 404 });
//         }
//         if (!user.questions_secret?.[0]?.question) {
//             return NextResponse.json(
//                 { error: "No se han configurado preguntas de seguridad para este usuario" },
//                 { status: 400 }
//             );
//         }

//         // // Limpiar tokens expirados
//         // await prisma.user.updateMany({
//         //     where: {
//         //         email: body.email,
//         //         resetPasswordExpires: { lt: new Date() },
//         //     },
//         //     data: {
//         //         resetPasswordToken: resetToken,
//         //         resetPasswordExpires,
//         //     },
//         // });

//         // // Generar un código de restablecimiento único
//         const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
//         const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

//         // Guardar el código en la base de datos
//         await prisma.user.update({
//             where: { email: body.email },
//             data: {
//                 resetPasswordToken: resetCode,
//                 resetPasswordExpires,
//             },
//         });

//         // Configuración de OAuth 2.0
//         const OAuth2 = google.auth.OAuth2;
//         const oauth2Client = new OAuth2(
//             process.env.GOOGLE_CLIENT_ID,
//             process.env.GOOGLE_CLIENT_SECRET,
//             "https://developers.google.com/oauthplayground"
//         );
//         oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

//         // Obtener un token de acceso a partir del refresh token
//         const accessToken = await new Promise((resolve, reject) => {
//             oauth2Client.getAccessToken((err, token) => {
//                 if (err) {
//                     console.error("Error al obtener el token de acceso:", err);
//                     reject(err);
//                 } else {
//                     resolve(token);
//                 }
//             });
//         });

//         // Configurar el transporte de correo electrónico con OAuth 2.0
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_SERVER_HOST, // Por ejemplo, 'smtp.gmail.com'
//             port: Number(process.env.EMAIL_SERVER_PORT), // Por ejemplo, 587
//             secure: false, // Usa `true` si el puerto es 465 (SSL)
//             auth: {
//                 type: 'OAuth2',
//                 user: process.env.EMAIL_USER,
//                 clientId: process.env.GOOGLE_CLIENT_ID,
//                 clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//                 refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//                 accessToken: accessToken as string, // Asegúrate de que sea una cadena
//             },
//         });

//         // Contenido del correo electrónico
//         const mailOptions = {
//             from: `"SGPU EMAIL" <${process.env.EMAIL_USER}>`,
//             to: body.email,
//             subject: 'Recuperación de Contraseña',
//             html: `
//                 <p>Hola ${user.name || 'usuario'},</p>
//                 <p>Has solicitado restablecer tu contraseña. A continuación, se muestran tus preguntas de seguridad:</p>
//                 <p>Para continuar, responde a la pregunta de seguridad o usa el siguiente enlace:</p>
//                 <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetCode}">Restablecer Contraseña</a></p>
//                 <p>Este enlace expira en 15 minutos.</p>
//                 <p>Si no solicitaste este correo, ignóralo.</p>
//             `,
//         };

//         // Enviar el correo electrónico
//         await transporter.sendMail(mailOptions);

//         // Logs de desarrollo
//         if (process.env.NODE_ENV === 'development') {
//             console.log(`🔑 Código para ${body.email}: ${crypto.createHash('sha256').update(resetCode).digest('hex')}`);
//         }

//         return NextResponse.json({
//             message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.',
//             code: process.env.NODE_ENV === 'development' ? resetCode : undefined,
//         }, { status: 200 });

//     } catch (error) {
//         console.error("Error en recuperación:", error);
//         return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
//     }
// }