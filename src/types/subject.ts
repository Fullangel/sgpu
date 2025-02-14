export interface Subject {
    id: number;
    name: string;
    teacher?: {
        id: number;
        name: string;
        email: string;
    };
    preparer?: {
        id: number;
        name: string;
        email: string;
    } | null;
    materials: {
        id: number;
        file_url: string;
        type: string;
    }[];
    createdAt: string;
    updatedAt: string;
}