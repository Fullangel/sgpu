import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const handleApiError = (error: unknown) => {
    console.error('Error:', error);

    if (error instanceof ZodError) {
        return NextResponse.json(
            { error: "Datos inválidos", details: error.errors },
            { status: 400 }
        );
    }

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