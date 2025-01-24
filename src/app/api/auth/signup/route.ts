import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/schemas/registerSchemas';
import { handleApiError } from '@/lib/errorHandler';
import { createUser } from '@/services/userService';

export async function POST(request: Request) {
    try {
        const rawData = await request.json();
        const parsedData = registerSchema.parse(rawData);

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
            }
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
        };

        const newUser = await createUser(userData);

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




// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';

// export async function POST(request: Request) {
//     try {
//         const data = await request.json();
//         console.log("Datos recibidos en el backend:", data);

//         // Validate the payload
//         if (!data || typeof data !== 'object') {
//             return NextResponse.json(
//                 { error: 'Invalid payload' },
//                 { status: 400 }
//             );
//         }

//         const { username, email, password, first_name,
//             last_name, first_surname, second_surname, cedula, type, specialization,
//             address, question, answer, nationality, birthdate, full_name } = data;

//         if (!username || !email || !password || !full_name || !nationality || !first_name || !last_name || !first_surname || !second_surname) {
//             return NextResponse.json(
//                 { error: 'Missing required fields' },
//                 { status: 400 }
//             );
//         }

//         // Buscar el nationality_id correspondiente al código (V o E)
//         console.log("Nationality recibida:", nationality);
//         const nationalityRecord = await prisma.nationality.findFirst({
//             where: { code: nationality },
//         });

//         console.log("Nationality encontrada:", nationalityRecord);

//         if (!nationalityRecord) {
//             return NextResponse.json(
//                 { error: 'Invalid nationality' },
//                 { status: 400 }
//             );
//         }

//         const nationality_id = nationalityRecord.id;

//         console.log("Datos para crear el usuario:", {
//             username,
//             email,
//             password,
//             emailVerified: false,
//             type: type || 'Student',
//             specialization,
//             status: 'Active',
//             cedula,
//             birthdate: new Date(birthdate),
//             nationality_id,
//             name: full_name,
//             names: {
//                 create: {
//                     first_name,
//                     last_name,
//                     first_surname: first_surname,
//                     second_surname: second_surname,
//                 },
//             },
//             direction: {
//                 create: {
//                     address,
//                 },
//             },
//             questions_secret: {
//                 create: {
//                     question,
//                     answer,
//                 },
//             },
//             createdAt: new Date(),
//         });

//         const newUser = await prisma.user.create({
//             data: {
//                 username,
//                 email,
//                 password,
//                 emailVerified: false,
//                 type: type || 'Student',
//                 specialization,
//                 status: 'Active',
//                 cedula,
//                 birthdate: new Date(birthdate),
//                 nationality_id,
//                 name: full_name,
//                 names: {
//                     create: {
//                         first_name,
//                         last_name,
//                         first_surname: first_surname,
//                         second_surname: second_surname,
//                     },
//                 },
//                 direction: {
//                     create: {
//                         address,
//                     },
//                 },
//                 questions_secret: {
//                     create: {
//                         question,
//                         answer,
//                     },
//                 },
//             },
//         });
//         console.log(data);

//         return NextResponse.json(newUser);
//     } catch (error) {
//         if (error instanceof Error) {
//             console.error('Error detallado:', error.message);
//             return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
//         } else {
//             console.error('Error desconocido: ', error);
//             return NextResponse.json({ error: 'Error interno' }, { status: 500 });
//         }
//     }
// }