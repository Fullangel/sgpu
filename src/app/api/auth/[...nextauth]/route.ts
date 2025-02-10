import NextAuth, { type AuthOptions, type Session, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';

// Definir tipos extendidos
declare module 'next-auth' {
    interface Session {
        user: {
            id?: string;
            role?: string;
            cedula?: string;
            nationality?: string;
        } & DefaultSession['user'];
    }

    interface User {
        role?: string;
        cedula?: string;
        nationality?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role?: string;
        cedula?: string;
        nationality?: string;
    }
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials.password) {
                        throw new Error('Credenciales incompletas');
                    }

                    const userFound = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        include: { nationality: true }
                    });

                    if (!userFound) {
                        throw new Error('Usuario no encontrado');
                    }

                    if (userFound.status !== 'Active') {
                        throw new Error('Cuenta inactiva');
                    }

                    const passwordValid = await bcrypt.compare(
                        credentials.password,
                        userFound.password
                    );

                    if (!passwordValid) {
                        throw new Error('Contraseña incorrecta');
                    }

                    return {
                        id: userFound.id.toString(),
                        name: userFound.username,
                        email: userFound.email,
                        role: userFound.type,
                        cedula: userFound.cedula,
                        nationality: userFound.nationality?.code
                    };

                } catch (error) {
                    console.error("Error en autenticación:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.cedula = user.cedula;
                token.nationality = user.nationality;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.cedula = token.cedula;
                session.user.nationality = token.nationality;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 24 * 60 * 60 // 24 horas
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
