import { hash } from 'bcryptjs';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import dotenv from 'dotenv';
// import { z } from 'zod';
dotenv.config();

export async function createAdminUser() {
    try {
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@universidad.com';
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SecurePassword123!';
        const hashedPassword = await hash(ADMIN_PASSWORD, 12);

        console.log("Verificando si existe un administrador...");
        const adminExists = await prisma.user.findFirst({
            where: { type: 'Admin' }
        });

        if (adminExists) {
            console.log("El usuario administrador ya existe:", adminExists.email);
            return;
        }

        console.log("Creando nuevo usuario administrador...");
        await prisma.user.create({
            data: {
                name: "Administrador del Sistema",
                username: "admin",
                email: ADMIN_EMAIL,
                password: hashedPassword,
                type: "Admin",
                cedula: "00000000",
                emailVerified: false,
                // subjectName: "Administración",
                status: "Active",
                birthdate: new Date("1980-01-01"),
                nationality: {
                    connectOrCreate: {
                        where: { code: 'V' },
                        create: { code: 'V', description: 'Venezolano' }
                    }
                },
                names: {
                    create: {
                        first_name: "Admin",
                        last_name: "Sistema",
                        first_surname: "Universidad",
                        second_surname: "Principal"
                    }
                },
                direction: {
                    create: {
                        address: "Edificio Administrativo, Oficina 101"
                    }
                }
            }
        });

        console.log('✅ Administrador creado exitosamente');
    } catch (error) {
        console.error("Error en createAdminUser:", error?.message || error);
        throw new Error(error?.message || "Error desconocido al crear administrador");
    }
}

// const teacherSchema = z.object({
//     firstName: z.string().min(2, "El primer nombre es requerido"),
//     secondName: z.string().optional(),
//     firstLastName: z.string().min(2, "El primer apellido es requerido"),
//     secondLastName: z.string().optional(),
//     cedula: z
//         .string()
//         .regex(/^\d{7,8}$/, "La cédula debe tener entre 7 y 8 dígitos")
//         .optional(),
//     email: z.string().email("Correo electrónico inválido"),
//     password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
//     nationality_id: z.enum(["V", "E"]),
//     address: z.string().min(5, "La dirección es requerida"),
//     specialization: z.string().min(2, "La especialización es requerida"),
// }).transform((data) => ({
//     ...data,
//     name: `${data.firstName} ${data.firstLastName}`, // Generar el campo `name`
// }));

// type TeacherData = z.infer<typeof teacherSchema>;

interface CreateTeacherResponse {
    id: number;
    name: string;
    email: string;
    subject: {
        id: number;
        name: string;
    } | null; // `subject` puede ser `null` si no hay una materia asignada
    createdAt: Date;
}

export async function createTeacher(data: {
    // name?: string;
    firstName: string;
    firstLastName: string;
    email: string;
    password: string;
    nationality_id: "V" | "E";
    address: string;
    subjectName: string;
    secondName?: string | undefined;
    secondLastName?: string | undefined;
    cedula?: string | undefined;
}): Promise<CreateTeacherResponse> {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Crear el usuario en la base de datos
        const newUser = await prisma.user.create({
            data: {
                name: `${data.firstName} ${data.firstLastName}`,
                username: `${data.firstName.toLowerCase().replace(/\s+/g, "")}-${Math.floor(
                    Math.random() * 1000
                )}`,
                email: data.email,
                password: hashedPassword,
                type: "Teacher",
                status: "Active",
                emailVerified: false,
                birthdate: new Date("1980-01-01"),
                cedula: data.cedula || "0000000", // Valor predeterminado si no se proporciona
                nationality: {
                    connectOrCreate: {
                        where: { code: data.nationality_id },
                        create: {
                            code: data.nationality_id,
                            description:
                                data.nationality_id === "V" ? "Venezolano" : "Extranjero",
                        },
                    },
                },
                names: {
                    create: {
                        first_name: data.firstName,
                        last_name: data.secondName || "",
                        first_surname: data.firstLastName || "",
                        second_surname: data.secondLastName || "",
                    },
                },
                direction: {
                    create: {
                        address: data.address,
                    },
                },
            },
        });

        //Creacion de la materia asociada al profesor
        const newSubject = await prisma.subject.create({
            data: {
                name: data.subjectName,
                teacher: {
                    connect: {
                        id: newUser.id,  //conectar la materia al profesor recien creado
                    },
                },
            },
        });

        console.log("✅ Profesor y materia creados exitosamente");

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            subject: { id: newSubject.id, name: newSubject.name },
            createdAt: new Date(),
        };

    } catch (error) {
        console.error("Error en createTeacher:", error?.message || error);
        throw new Error(error?.message || "Error desconocido al crear profesor");
    }
}