import { useForm, Controller } from "react-hook-form";

type FormValues = {
    // Definir todos los tipos de campos
    first_name: string;
    // ... otros campos
};

export const useRegisterForm = () => {
    const { control, register, handleSubmit, formState } = useForm<FormValues>();

    return { control, register, handleSubmit, errors: formState.errors };
};