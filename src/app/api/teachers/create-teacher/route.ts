import { NextResponse } from "next/server";
import { createTeacher } from "@/lib/auth";
import { z } from "zod";

const teacherSchema = z.object({
    firstName: z.string().min(2, "El primer nombre es requerido"),
    secondName: z.string().optional(),
    firstLastName: z.string().min(2, "El primer apellido es requerido"),
    secondLastName: z.string().optional(),
    cedula: z.string().regex(/^\d{7,8}$/, "La cédula debe tener entre 7 y 8 dígitos").optional(),
    email: z.string().email("Correo electrónico inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    nationality_id: z.enum(["V", "E"]),
    address: z.string().min(5, "La dirección es requerida"),
    subjectName: z.string().min(2, "La especialización es requerida"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validateData = teacherSchema.parse(body);
        const newTeacher = await createTeacher(validateData);

        // Formatear el objeto para eliminar propiedades no serializables
        const formattedTeacher = {
            id: newTeacher.id,
            name: newTeacher.name,
            email: newTeacher.email,
            subjectName: typeof newTeacher.subject === "object" && newTeacher.subject !== null
                ? newTeacher.subject.name || "Sin asignar"
                : "Sin asignar",
            createdAt: newTeacher.createdAt ? newTeacher.createdAt.toISOString() : null, // Convertir Date a string
        };

        console.log("Nuevo profesor creado:", formattedTeacher);

        return NextResponse.json(formattedTeacher, { status: 201 });
    } catch (error) {
        console.error("Error al crear profesor:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Datos invalidos", details: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: "Error interno del servidor", details: error?.message || "Error desconocido" }, { status: 500 });
    }
}
