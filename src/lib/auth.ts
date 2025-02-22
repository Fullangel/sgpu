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

interface CreateTeacherResponse {
    id: number;
    name: string;
    email: string;
    subject: {
        id: number;
        name: string;
    } | null; // `subject` puede ser `null` si no hay una materia asignada
    specialization: {
        id: number;
        name: string;
    }; // Especialización asociada al profesor
    createdAt: Date;
}

export async function createTeacher(data: {
    firstName: string;
    firstLastName: string;
    email: string;
    password: string;
    nationality_id: "V" | "E";
    address: string;
    subjectName: string;
    specialization: string;
    secondName?: string | undefined;
    secondLastName?: string | undefined;
    cedula?: string | undefined;
}): Promise<CreateTeacherResponse> {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 12);

        //Verifica si la especializacion existe
        let specialization = await prisma.specialization.findUnique({
            where: { name: data.specialization },
        });

        // En caso de que no, la crea
        if (!specialization) {
            specialization = await prisma.specialization.create({
                data: { name: data.specialization },
            });
        }

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
                specialization: {
                    connect: {
                        id: specialization.id, // Asociar la especialización al profesor
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
                specialization: {
                    connect: {
                        id: specialization.id, // Conectar la especialización a la materia
                    },
                },
            },
        });

        console.log("✅ Profesor, especializacion y materia creados exitosamente");

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            subject: { id: newSubject.id, name: newSubject.name },
            specialization: { id: specialization.id, name: specialization.name },
            createdAt: new Date(),
        };

    } catch (error) {
        console.error("Error en createTeacher:", error?.message || error);
        throw new Error(error?.message || "Error desconocido al crear profesor");
    }
}