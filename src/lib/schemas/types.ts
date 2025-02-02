// types.ts
import {
    type User,
    type Role,
    type State,
    type Nationality, // Importación añadida
    type Name,        // Importación añadida
    type Direction    // Importación añadida
} from '@prisma/client';

export type AuthUser = Omit<User, 'password'> & {
    nationality: Nationality;
    names: Name[];
    direction: Direction[];
};

export type AdminUser = AuthUser & {
    type: Extract<Role, 'Admin'>;
};

export type TeacherUser = AuthUser & {
    type: Extract<Role, 'Teacher'>;
    specialization: string;
};

// Tipos para operaciones CRUD
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updateAt'> & {
    nationalityCode: string;
    names: {
        firstName: string;
        lastName?: string;
        firstSurname: string;
        secondSurname?: string;
    };
    address: string;
};