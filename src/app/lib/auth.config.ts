// import { betterAuth } from 'better-auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

// Iniciando Prisma
const prisma = new PrismaClient();

//Configuracion de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
const JWT_EXPIRES_IN = '1h';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  username: string;
  type: string;
  specialization: string;
  status: string;
  createdAt: Date;
  birthdate: Date;
  nationality_id: number;
  // nationality: {
  //   code: string;
  // };
}

interface DecodedToken extends JwtPayload {
  id: number; // Aquí aseguras que `id` es un número, según lo que tengas en tu payload
  email: string;
}

//Funcion para generar un JWT
const generateJWT = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const authServices = {
  hashPassword: async (password: string) => {
    const salt = await bcrypt.genSalt(10); // Generar un "salt" de 10 rondas
    return bcrypt.hash(password, salt); // Crear el hash de la contraseña
  },

  //Validar al usuario en el login
  validateUser: async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        nationality: true,
        names: true,
        direction: true,
      },
    });

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    //Generacion de JWT despues de la validacion
    const token = generateJWT(user);

    //Retorna el user con el JWT
    return { ...user, token };
  },

  //Registro de usuario
  registerUser: async (email: string, password: string, name: string) => {
    //Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //Crea el usuario en la bd
    const newUser = await prisma.user.create({
      //TODO:Hay que ver si la parte de 'username:email' no llega afectar a la hora de que el usuario cree su username
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerified: true,
        username: email, //Por default crea un username con el email
        type: 'Estudiante',
        specialization: '',
        status: 'Activo',
        birthdate: new Date(),
        questions_secret: {
          create: {
            question: '1+1',
            answer: '2',
          },
        },
        nationality: {
          create: {
            code: 'V', // Código de la nacionalidad
            description: 'Venezolano', // Descripción de la nacionalidad
          },
        },
        direction: {
          create: {
            address: '', // Dirección del usuario
          },
        },
        createdAt: new Date(),
      },
    });

    //Genera el JWT despues de registrar el usuario
    const token = generateJWT(newUser);

    return { ...newUser, token };
  },

  //Verificar JWT
  verifyJWT: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null; //En caso de que sea invalido o se haya expirado
    }
  },

  //Proteccion de rutas
  protectRoute: (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void,
  ) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(404).json({ message: 'Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      if (typeof decoded === 'string') {
        return res.status(401).json({ message: 'Token invalido' });
      }

      req.user = decoded; //Almacena los datos
      next(); //Permite el acceso a la siguiente ruta
    } catch {
      return res.status(401).json({ message: 'Token invalido o expirado' });
    }
  },
};

export default authServices;

// const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
// if (!decoded) {
//   return res.status(401).json({ message: 'Token invalido' });
// }

// const user = prisma.user.findUnique({
//   where: { id: decoded.id },
//   include: {
//     nationality: true,
//     names: true,
//   },
// });

// req.user = decoded; //Almacena los datos
// next(); //Permite el acceso a la siguiente ruta
