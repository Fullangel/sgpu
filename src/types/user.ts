export interface User {
    email: string;
    id: number;
    name: string;
    username: string;
    password: string;
    emailVerified: boolean | null;
    type: Role;
    status: State;
    content: string | null;
    birthdate: Date;
    securityAnswer: string; // Agrega este campo
    specialization_id: number | null;
}