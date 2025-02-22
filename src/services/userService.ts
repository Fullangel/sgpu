import { prisma } from '@/lib/prisma';
import { RegisterFormValues } from '@/lib/schemas/registerSchemas';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const VALID_ROLES = ["Admin", "Teacher", "Student", "Preparer"] as const;
const VALID_STATES = ["Active", "Inactive"] as const;

export const createUser = async (userData: RegisterFormValues & {
    nationality_id: number;
    type: string;
    status: string;
    emailVerified: boolean;
    // subject_id: number;
    specialization_id: number;
}) => {

    //Validar el tipo de usuario
    if (!VALID_ROLES.includes(userData.type as typeof VALID_ROLES[number])) {
        throw new Error('Invalid user type');
    }

    //Validar el estado
    if (!VALID_STATES.includes(userData.status as typeof VALID_STATES[number])) {
        throw new Error('Invalid user status');
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
        data: {
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            emailVerified: userData.emailVerified,
            type: userData.type as typeof VALID_ROLES[number],
            status: userData.status as typeof VALID_STATES[number],
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
            },
            specialization_id: userData.specialization_id,
        },
    });

    // await prisma.userSpecialization.create({
    //     data: {
    //         user_id: newUser.id,
    //         // subject_id: userData.subject_id,
    //         specialization_id: userData.specialization_id,
    //     },
    // });

    return newUser;
}
    ;