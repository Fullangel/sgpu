import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const handleApiError = (error: unknown) => {
    console.error('Error detallado:', error);

    if (error instanceof ZodError) {
        return NextResponse.json(
            {
                error: "Error de validación",
                details: error.errors.map(e => ({
                    campo: e.path.join('.'),
                    mensaje: e.message
                }))
            },
            { status: 400 }
        );
    }

    // Manejar errores de sintaxis JSON
    if (error instanceof Error) {
        return NextResponse.json(
            { error: "JSON inválido en el cuerpo de la solicitud" },
            { status: 400 }
        );
    }

    // Manejar otros errores conocidos
    if (error instanceof Error) {
        return NextResponse.json(
            { error: error.message || "Error interno del servidor" },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { error: "Error desconocido" },
        { status: 500 }
    );
};