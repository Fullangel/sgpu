import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const pathname = request.nextUrl.pathname;

    console.log("Middleware ejecutado para:", pathname); // Log personalizado
    console.log("Token:", token); // Verifica si el token existe

    if (!token && !pathname.startsWith("/auth")) {
        console.log("Usuario no autenticado. Redirigiendo a /auth/login");
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/teacher/dashboard") && token?.role !== "Teacher") {
        console.log("Acceso denegado a /teacher/dashboard. Rol del usuario:", token?.role);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/admin") && token?.role !== "Admin") {
        console.log("Acceso denegado a /admin. Rol del usuario:", token?.role);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/assistant") && token?.role !== "Assistant") {
        console.log("Acceso denegado a /assistant. Rol del usuario:", token?.role);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    console.log("Acceso permitido a:", pathname);
    return NextResponse.next();
}

export const config = {
    matcher: ["/teacher/:path*", "/admin/:path*", "/assistant/:path*", "/api/subjects/:path*",],
};