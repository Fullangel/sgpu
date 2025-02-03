// src/app/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

// Middleware principal
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const pathname = request.nextUrl.pathname;

    // Verificar si el usuario está autenticado
    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Redirigir al dashboard correspondiente si está en la raíz
    if (pathname === "/") {
        switch (token.role) {
            case "Admin":
                return NextResponse.redirect(new URL("/admin", request.url));
            case "Teacher":
                return NextResponse.redirect(new URL("/teacher", request.url));
            case "Assistant":
                return NextResponse.redirect(new URL("/assistant", request.url));
            default:
                return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }


    // Proteger rutas específicas según el rol
    if (pathname.startsWith("/admin") && token.role !== "Admin") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/teacher") && token.role !== "Teacher") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/assistant") && token.role !== "Assistant") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Permitir acceso a la ruta
    return NextResponse.next();
}

// Configuración del middleware
export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/assistant/:path*"], // Aplica el middleware solo a estas rutas
};