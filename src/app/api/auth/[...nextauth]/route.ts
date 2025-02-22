import NextAuth, { type AuthOptions, type Session, type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";

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

const port = process.env.EMAIL_SERVER_PORT
    ? parseInt(process.env.EMAIL_SERVER_PORT, 10)
    : undefined;

const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: port,
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_SERVER_USER,
        }),
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


// import NextAuth, { type AuthOptions, type Session, type User } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import EmailProvider from 'next-auth/providers/email';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs';
// import type { JWT } from 'next-auth/jwt';

// // Definir tipos extendidos
// declare module 'next-auth' {
//     interface Session {
//         user: {
//             id?: string;
//             role?: string;
//             cedula?: string;
//             nationality?: string;
//         } & DefaultSession['user'];
//     }
//     interface User {
//         role?: string;
//         cedula?: string;
//         nationality?: string;
//     }
// }

// declare module 'next-auth/jwt' {
//     interface JWT {
//         id?: string;
//         role?: string;
//         cedula?: string;
//         nationality?: string;
//     }
// }

// // Validar variables de entorno necesarias
// if (!process.env.NEXTAUTH_SECRET) {
//     throw new Error('NEXTAUTH_SECRET no está configurado en las variables de entorno.');
// }

// if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
//     throw new Error('Las variables de entorno para el servidor de correo no están configuradas.');
// }

// const port = process.env.EMAIL_SERVER_PORT
//     ? parseInt(process.env.EMAIL_SERVER_PORT, 10)
//     : undefined;

// export const authOptions: AuthOptions = {
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         EmailProvider({
//             server: {
//                 host: process.env.EMAIL_SERVER_HOST,
//                 port: port,
//                 auth: {
//                     user: process.env.EMAIL_SERVER_USER,
//                     pass: process.env.EMAIL_SERVER_PASSWORD,
//                 },
//             },
//             from: process.env.EMAIL_SERVER_USER,
//         }),
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'Email', type: 'text' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials): Promise<User | null> {
//                 try {
//                     if (!credentials?.email || !credentials.password) {
//                         throw new Error('Credenciales incompletas');
//                     }

//                     const userFound = await prisma.user.findUnique({
//                         where: { email: credentials.email },
//                         include: { nationality: true },
//                     });

//                     if (!userFound) {
//                         throw new Error('Usuario no encontrado');
//                     }

//                     if (userFound.status !== 'Active') {
//                         throw new Error('Cuenta inactiva');
//                     }

//                     const passwordValid = await bcrypt.compare(
//                         credentials.password,
//                         userFound.password
//                     );

//                     if (!passwordValid) {
//                         throw new Error('Contraseña incorrecta');
//                     }

//                     return {
//                         id: userFound.id.toString(),
//                         name: userFound.username,
//                         email: userFound.email,
//                         role: userFound.type,
//                         cedula: userFound.cedula,
//                         nationality: userFound.nationality?.code,
//                     };
//                 } catch (error) {
//                     console.error('Error en autenticación:', error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
//             if (user) {
//                 token.id = user.id;
//                 token.role = user.role;
//                 token.cedula = user.cedula;
//                 token.nationality = user.nationality;
//             }
//             return token;
//         },
//         async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
//             if (token) {
//                 session.user.id = token.id;
//                 session.user.role = token.role;
//                 session.user.cedula = token.cedula;
//                 session.user.nationality = token.nationality;
//             }
//             return session;
//         },
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     pages: {
//         signIn: '/auth/login',
//         error: '/auth/error',
//     },
//     session: {
//         strategy: 'jwt',
//         maxAge: 24 * 60 * 60, // 24 horas
//     },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

