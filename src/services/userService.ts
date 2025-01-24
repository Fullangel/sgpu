import { prisma } from '@/lib/prisma';
import { RegisterFormValues } from '@/lib/schemas/registerSchemas';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const createUser = async (userData: RegisterFormValues & {
    nationality_id: number;
    type: string;
    status: string;
    emailVerified: boolean;
}) => {

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    return prisma.user.create({
        data: {
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            emailVerified: userData.emailVerified,
            type: userData.type,
            specialization: userData.specialization,
            status: userData.status,
            cedula: userData.cedula,
            birthdate: userData.birthdate,
            nationality_id: userData.nationality_id,
            name: `${userData.first_name} ${userData.last_name}`,
            names: {
                create: {
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    first_surname: userData.first_surname,
                    second_surname: userData.second_surname,
                }
            },
            direction: {
                create: {
                    address: userData.address
                }
            },
            questions_secret: {
                create: {
                    question: userData.question,
                    answer: userData.answer
                }
            }
        }
    });
};