import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { AuthUser } from '@/lib/schemas/types';

export class AuthService {
    async login(username: string, password: string): Promise<AuthUser | null> {
        const user = await prisma.user.findUnique({
            where: { username },
            include: { nationality: true, names: true, direction: true }
        });

        if (!user || (await compare(password, user.password))) {
            return null;
        }

        const { password: _, ...userWithoutPasword } = user;
        return userWithoutPasword;

    }

    async isAdminRegistered(): Promise<boolean> {
        return !!(await prisma.user.findFirst({
            where: { type: 'Admin' }
        }));
    }
}
