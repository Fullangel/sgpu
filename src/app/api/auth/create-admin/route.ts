import { createAdminUser } from '@/lib/auth';

export async function GET() {
    console.log("Endpoint /api/auth/create-admin llamado");
    try {
        await createAdminUser();
        return Response.json({ message: 'Administrador creado o ya existe' });
    } catch (error) {
        console.error('Error al crear administrador:', error);
        return Response.json(
            { error: error?.message || 'Error desconocido al crear administrador' },
            { status: 500 }
        );
    }
}