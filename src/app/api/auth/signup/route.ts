import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/schemas/registerSchemas';
import { handleApiError } from '@/lib/errorHandler';
import { createUser } from '@/services/userService';
import nodemailer from 'nodemailer';
import { google } from "googleapis";

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
            },
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
            specialization_id: Number(parsedData.specialization_id),
        };

        // Crear el usuario usando la función createUser
        const newUser = await createUser(userData);

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

        // Enviar el correo de bienvenida
        const mailOptions = {
            from: `"SGPU - Sistema de Gestión de Preparadurías Universitarias" <${process.env.EMAIL_USER}>`,
            to: newUser.email,
            subject: '¡Bienvenido/a al Sistema de Gestión de Preparadurías Universitarias!',
            text: `Hola ${newUser.username},\n\n¡Gracias por registrarte en nuestro sistema! Estamos emocionados de tenerte como parte de nuestra comunidad.`,
            html: ` 
                    <h1>¡Bienvenido/a, ${newUser.username}!</h1>
                    <p>Gracias por registrarte en el <strong>Sistema de Gestión de Preparadurías Universitarias</strong>.</p>
                    <p>Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
                    <p>Por favor, verifica tu correo electrónico para completar el proceso de registro.</p>
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <br>
                    <p>Atentamente,<br>El equipo de SGPU</p>
                    `,
        };

        await transporter.sendMail(mailOptions);

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
