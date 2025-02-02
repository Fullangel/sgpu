import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/client';

export const checkAdminExists = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const adminExists = await prisma.user.findFirst({
        where: { type: 'Admin' }
    });

    if (!adminExists && req.path === '/register') {
        return next();
    }

    if (!adminExists) {
        return res.status(503).json({
            message: 'Sistema no inicializado. Primero registre un administrador'
        });
    }

    next();
};