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

        if (!username || !email || !password || !full_name || !nationality) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Buscar el nationality_id correspondiente al código (V o E)
        // const nationalityRecord = await prisma.nationality.findFirst({
        //     where: { code: nationality },
        // });

        // if (!nationalityRecord) {
        //     return NextResponse.json(
        //         { error: 'Invalid nationality' },
        //         { status: 400 }
        //     );
        // }

        // const nationality_id = nationalityRecord.id;

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
                nationality,
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
        console.error('Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}