import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
    try {
<<<<<<< HEAD
        const { token, newPassword } = await request.json();

        // 1. Buscar usuario por token válido
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() },
            },
=======
        const { email, code, newPassword } = await request.json();

        const user = await prisma.user.findFirst({
            where: {
                email,
                resetPasswordCode: code,
                resetPasswordExpires: { gt: new Date() }
            }
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
        });

        if (!user) {
            return NextResponse.json(
<<<<<<< HEAD
                { error: "Token inválido o expirado" },
=======
                { error: "Código inválido o expirado" },
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
                { status: 400 }
            );
        }

<<<<<<< HEAD
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
=======
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetPasswordCode: null,
                resetPasswordExpires: null
            }
        });

        return NextResponse.json({ message: "Contraseña actualizada exitosamente" });

    } catch (error) {
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcrypt';

// export async function POST(request: Request) {
//     try {
//         const { token, password, answer } = await request.json();

//         const user = await prisma.user.findFirst({
//             where: {
//                 resetPasswordToken: token,
//                 resetPasswordExpires: { gt: new Date() }
//             },
//             include: { questions_secret: true }
//         });

//         if (!user) {
//             return NextResponse.json(
//                 {
//                     error: 'Token Invalido o expirado'
//                 }, { status: 400 }
//             );
//         }

//         //Verifica la respuesta
//         const isValidAnswer = answer.ToLowerCase() === user.questions_secret[0].answer.toLowerCase();

//         if (!isValidAnswer) {
//             return NextResponse.json(
//                 {
//                     error: 'Respuesta Incorrecta'
//                 }, { status: 400 }
//             );
//         }

//         //Actualiza la contrase;a
//         const hashedPassword = await bcrypt.hash(password, 10);

//         await prisma.user.update({
//             where: { id: user.id },
//             data: {
//                 password: hashedPassword,
//                 resetPasswordToken: null,
//                 resetPasswordExpires: null
//             }
//         });

//         return NextResponse.json({ message: 'Contrase;a actualizada exitosamente' });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json(
//             { error: 'Error interno del servidor' },
//             { status: 500 }
//         );
//     }
// }
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
