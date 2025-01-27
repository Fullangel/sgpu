import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';


const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {

                console.log("Credenciales recibidas:", credentials);
                console.log("Intentando autenticar:", credentials?.email);

                if (!credentials?.email || credentials?.password) {
                    console.log("No se proporcionaron credenciales");
                    return null;
                }

                const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!userFound) {
                    console.log("Usuario no encontrado:", credentials.email);
                    return null;
                }

                const matchPassword = await bcrypt.compare(credentials.password, userFound.password)

                console.log(matchPassword);

                if (!matchPassword) {
                    console.log("Contraseña incorrecta para el usuario:", credentials.email);
                    return null;
                }

                if (!isValid) {
                    throw new Error("invalid-password"); // Mantener este formato exacto
                }

                console.log("Autenticación exitosa para el usuario:", userFound.email);

                return {
                    id: userFound.id,
                    name: userFound.username,
                    email: userFound.email
                }

            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    }
}

console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }