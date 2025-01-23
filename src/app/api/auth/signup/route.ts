import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        console.log("Datos recibidos en el backend:", data);

        // Validate the payload
        if (!data || typeof data !== 'object') {
            return NextResponse.json(
                { error: 'Invalid payload' },
                { status: 400 }
            );
        }

        const { username, email, password, first_name,
            last_name, first_surname, second_surname, cedula, type, specialization,
            address, question, answer, nationality, birthdate, full_name } = data;

        if (!username || !email || !password || !full_name || !nationality || !first_name || !last_name || !first_surname || !second_surname) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Buscar el nationality_id correspondiente al código (V o E)
        console.log("Nationality recibida:", nationality);
        const nationalityRecord = await prisma.nationality.findFirst({
            where: { code: nationality },
        });

        console.log("Nationality encontrada:", nationalityRecord);

        if (!nationalityRecord) {
            return NextResponse.json(
                { error: 'Invalid nationality' },
                { status: 400 }
            );
        }

        const nationality_id = nationalityRecord.id;

        console.log("Datos para crear el usuario:", {
            username,
            email,
            password,
            emailVerified: false,
            type: type || 'Student',
            specialization,
            status: 'Active',
            cedula,
            birthdate: new Date(birthdate),
            nationality_id,
            name: full_name,
            names: {
                create: {
                    first_name,
                    last_name,
                    first_surname: first_surname,
                    second_surname: second_surname,
                },
            },
            direction: {
                create: {
                    address,
                },
            },
            questions_secret: {
                create: {
                    question,
                    answer,
                },
            },
            createdAt: new Date(),
        });

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password,
                emailVerified: false,
                type: type || 'Student',
                specialization,
                status: 'Active',
                cedula,
                birthdate: new Date(birthdate),
                nationality_id,
                // nationality,
                name: full_name,
                names: {
                    create: {
                        first_name,
                        last_name,
                        first_surname: first_surname,
                        second_surname: second_surname,
                    },
                },
                direction: {
                    create: {
                        address,
                    },
                },
                questions_secret: {
                    create: {
                        question,
                        answer,
                    },
                },
            },
        });
        console.log(data);

        return NextResponse.json(newUser);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error detallado:', error.message);
            return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
        } else {
            console.error('Error desconocido: ', error);
            return NextResponse.json({ error: 'Error interno' }, { status: 500 });
        }
    }
}