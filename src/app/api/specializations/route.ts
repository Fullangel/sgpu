// import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/prisma";

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     if (req.method === "POST") {
//         try {
//             const { specialization_name, ...rest } = req.body;

//             // Validar que se proporcionó una especialización
//             if (!specialization_name || specialization_name.trim().length === 0) {
//                 return res.status(400).json({ error: "La especialización es obligatoria." });
//             }

//             // Buscar el ID de la especialización en la base de datos
//             const specializationResponse = await fetch(
//                 `/api/specializations?name=${encodeURIComponent(specialization_name)}`
//             );
//             const specializations = await specializationResponse.json();

//             if (specializations.length === 0) {
//                 return res.status(400).json({ error: "La especialización no existe." });
//             }

//             const specializationId = specializations[0].id;

//             // Crear el usuario con el ID de la especialización
//             const user = {
//                 ...rest,
//                 specialization_id: specializationId,
//             };

//             await prisma.user.create({ data: user });

//             // Guardar el usuario en la base de datos (aquí va tu lógica de guardado)
//             // Ejemplo: await db.collection("users").insertOne(user);

//             return res.status(200).json({ message: "Usuario registrado correctamente." });
//         } catch (error) {
//             console.error("Error al registrar usuario:", error);
//             return res.status(500).json({ error: "Error interno del servidor." });
//         }
//     }

//     return res.status(405).json({ error: "Método no permitido." });
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");

    // Validación del parámetro 'name'
    if (!name || name.trim().length < 3) {
        return NextResponse.json(
            { error: "El nombre de la especialización debe tener al menos 3 caracteres." },
            { status: 400 }
        );
    }

    // Validación de caracteres permitidos
    const isValidName = /^[a-zA-Z0-9\s]+$/.test(name);
    if (!isValidName) {
        return NextResponse.json(
            { error: "El nombre de la especialización contiene caracteres no válidos." },
            { status: 400 }
        );
    }

    try {
        // Consulta a la base de datos usando Prisma
        const specializations = await prisma.specialization.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive", // Ignorar mayúsculas/minúsculas
                },
            },
            select: {
                id: true,
                name: true,
            },
            take: 10, // Limitar a 10 resultados
        });

        return NextResponse.json(specializations);
    } catch (error) {
        console.error("Error fetching specializations:", error instanceof Error ? error.message : error);
        return NextResponse.json(
            { error: "Error al cargar las especializaciones. Por favor, intenta de nuevo más tarde." },
            { status: 500 }
        );
    }
}