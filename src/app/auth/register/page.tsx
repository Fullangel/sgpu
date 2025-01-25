"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/form/FormField";
import { SelectField } from "@/components/form/SelectField";
import { TextareaField } from "@/components/form/TextareaField";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormValues,
} from "@/lib/schemas/registerSchemas";
import { FormSection } from "@/components/form/FormSection";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...data,
          full_name: `${data.first_name} ${data.last_name}`,
          birthdate: new Date(data.birthdate).toISOString(),
          type: "Student",
          status: "Active",
          emailVerified: false,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || "Error en el registro");
        } catch {
          throw new Error(`Error ${response.status}: ${responseText}`);
        }
      }

      const result = JSON.parse(responseText);
      console.log("Registro exitoso:", result);
      alert("¡Registro completado con éxito!");
    } catch (error) {
      console.error("Error en registro:", error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-2/3 bg-gradient-to-b from-blue-500 to-blue-600 p-6 lg:p-12">
        <Card className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="space-y-1 text-center text-white">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Registro de Usuario
            </CardTitle>
            <CardDescription className="text-blue-100">
              Complete todos los campos para crear su cuenta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormSection title="Información Personal">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Primer Nombre"
                    id="first_name"
                    register={register("first_name")}
                    error={errors.first_name}
                  />
                  <FormField
                    label="Segundo Nombre"
                    id="last_name"
                    register={register("last_name")}
                    error={errors.last_name}
                  />
                  <FormField
                    label="Primer Apellido"
                    id="first_surname"
                    register={register("first_surname")}
                    error={errors.first_surname}
                  />
                  <FormField
                    label="Segundo Apellido"
                    id="second_surname"
                    register={register("second_surname")}
                    error={errors.second_surname}
                  />
                </div>

                <FormField
                  label="Fecha de Nacimiento"
                  id="birthdate"
                  type="date"
                  register={register("birthdate")}
                  error={errors.birthdate}
                />
              </FormSection>

              <FormSection title="Documento de Identidad">
                <div className="flex space-x-4">
                  <div className="w-24">
                    <Controller
                      name="nationality"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label="Nacionalidad"
                          options={[
                            { value: "V", label: "Venezolano" },
                            { value: "E", label: "Extranjero" },
                          ]}
                          field={field}
                          error={errors.nationality}
                        />
                      )}
                    />
                  </div>

                  <FormField
                    label="Número de Cédula"
                    id="cedula"
                    register={register("cedula")}
                    error={errors.cedula}
                    className="flex-1"
                  />
                </div>
              </FormSection>

              <FormSection title="Información Académica">
                <FormField
                  label="Carrera"
                  id="specialization"
                  register={register("specialization")}
                  error={errors.specialization}
                />
              </FormSection>

              <FormSection title="Información de Contacto">
                <TextareaField
                  label="Dirección"
                  id="address"
                  register={register("address")}
                  error={errors.address}
                />
              </FormSection>

              <FormSection title="Información de Cuenta">
                <FormField
                  label="Correo Electrónico"
                  id="email"
                  type="email"
                  register={register("email")}
                  error={errors.email}
                />
                <FormField
                  label="Nombre de Usuario"
                  id="username"
                  register={register("username")}
                  error={errors.username}
                />
                <FormField
                  label="Contraseña"
                  id="password"
                  type="password"
                  register={register("password")}
                  error={errors.password}
                />
                <FormField
                  label="Pregunta Secreta"
                  id="question"
                  register={register("question")}
                  error={errors.question}
                />
                <FormField
                  label="Respuesta Secreta"
                  id="answer"
                  register={register("answer")}
                  error={errors.answer}
                />
              </FormSection>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <span className="mr-2">Procesando...</span>
                    <svg
                      className="animate-spin h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  "Registrarse"
                )}
              </Button>

              <p className="text-center text-white/90 text-sm">
                ¿Ya tiene una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="text-white hover:text-blue-100 underline"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Section - Logo Display */}
      <div className="hidden lg:flex lg:w-1/3 bg-gray-50 items-center justify-center p-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <Image
            src="/logo.svg"
            alt="SGPU Logo"
            width={300}
            height={300}
            className="w-auto h-auto max-w-[300px] mx-auto"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            Sistema de Gestión de Preparadurías Universitario
          </h2>
        </div>
      </div>
    </div>
  );
}
