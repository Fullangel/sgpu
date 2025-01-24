import { z } from "zod";

export const registerSchema = z.object({
    first_name: z.string().nonempty("El primer nombre es requerido"),
    last_name: z.string().nonempty("El segundo nombre es requerido"),
    first_surname: z.string().nonempty("El primer apellido es requerido"),
    second_surname: z.string().nonempty("El segundo apellido es requerido"),
    birthdate: z.string().nonempty("La fecha de nacimiento es requerida"),
    nationality: z.enum(["V", "E"]).refine((val) => val !== undefined, {
        message: "La nacionalidad es requerida",
    }),
    cedula: z.string().nonempty("La cédula es requerida"),
    specialization: z.string().nonempty("La especialización es requerida"),
    address: z.string().nonempty("La dirección es requerida"),
    email: z.string().email("El correo electrónico es inválido"),
    username: z.string().nonempty("El nombre de usuario es requerido"),
    password: z.string().nonempty("La contraseña es requerida"),
    question: z.string().nonempty("La pregunta secreta es requerida"),
    answer: z.string().nonempty("La respuesta secreta es requerida"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;