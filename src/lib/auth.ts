import { hash, compare } from 'bcrypt';
import { prisma } from './prisma';
import dotenv from 'dotenv';

dotenv.config();

export async function createAdminUser() {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@universidad.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SecurePassword123!';

    const hashedPassword = await hash(ADMIN_PASSWORD, 12);

    const adminExists = await prisma.user.findFirst({
        where: { type: 'Admin' }
    });

    if (!adminExists) {
        await prisma.user.create({
            data: {
                name: "Administrador del Sistema",
                username: "admin",
                email: ADMIN_EMAIL,
                password: hashedPassword,
                type: "Admin",
                cedula: "00000000",
                emailVerified: true,
                specialization: "Administración",
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
    } else {
        console.log('El usuario administrador ya existe');
    }
}