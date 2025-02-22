import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { token, newPassword }: { token: string; newPassword: string } = await request.json();

        // Validar que los campos necesarios estén presentes
        if (!token || !newPassword) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        // Buscar el usuario por el token
        const user = await prisma.user.findFirst({
            where: { resetPasswordToken: token },
        });

        if (!user) {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar la contraseña del usuario
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword, // Asegúrate de hashear la contraseña antes de guardarla
                resetPasswordToken: null,
            },
        });

        return NextResponse.json({ success: true, message: "Contraseña actualizada" }, { status: 200 });
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs';

// export async function POST(request: Request) {
//     try {
//         // 1. Extraer datos del cuerpo de la solicitud
//         const { email, code, newPassword } = await request.json();

//         // 2. Validar que todos los campos estén presentes
//         if (!email || !code || !newPassword) {
//             return NextResponse.json(
//                 { error: "Todos los campos son obligatorios" },
//                 { status: 400 }
//             );
//         }

//         // 3. Buscar usuario por correo electrónico, código válido y fecha de expiración
//         const user = await prisma.user.findFirst({
//             where: {
//                 email,
//                 resetPasswordToken: code,
//                 resetPasswordExpires: { gt: new Date() }, // Verifica que el código no haya expirado
//             },
//         });

//         // 4. Si no se encuentra el usuario o el código es inválido/expirado
//         if (!user) {
//             return NextResponse.json(
//                 { error: "Código inválido o expirado" },
//                 { status: 400 }
//             );
//         }

//         // 5. Hashear la nueva contraseña
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // 6. Actualizar la contraseña y limpiar los campos de restablecimiento
//         await prisma.user.update({
//             where: { email },
//             data: {
//                 password: hashedPassword,
//                 resetPasswordToken: null,
//                 resetPasswordExpires: null,
//             },
//         });

//         // 7. Respuesta exitosa
//         return NextResponse.json({ message: "Contraseña actualizada exitosamente" });
//     } catch (error) {
//         console.error("Error al actualizar la contraseña:", error);
//         return NextResponse.json(
//             { error: "Error interno del servidor" },
//             { status: 500 }
//         );
//     }
// }