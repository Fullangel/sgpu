"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormValues,
} from "@/lib/schemas/registerSchemas";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { FormField } from "@/components/form/FormField";
import { SelectField } from "@/components/form/SelectField";
import { TextareaField } from "@/components/form/TextareaField";
import { FormSection } from "@/components/form/FormSection";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          full_name: `${data.first_name} ${data.last_name}`,
          birthdate: new Date(data.birthdate).toISOString(),
          type: "Student",
          status: "Active",
          emailVerified: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en el registro");
      }

      router.push("/auth/verify-email");
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Sección del formulario */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
      >
        <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-lg border-white/20 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex justify-center mb-4"
            >
              <Image
                src="/sgpu.svg"
                alt="Logo SGPU"
                width={140}
                height={50}
                className="w-auto h-16"
              />
            </motion.div>

            <CardTitle className="text-3xl font-bold text-white">
              Crear Nueva Cuenta
            </CardTitle>
            <p className="text-blue-100/80 mt-2">
              Complete todos los campos para registrarse
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 p-4 rounded-lg flex items-center gap-3 border border-red-500/50"
                >
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="text-red-200">{error}</p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FormSection title="Información Personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Primer Nombre"
                      id="first_name"
                      register={register("first_name")}
                      error={errors.first_name}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Segundo Nombre"
                      id="last_name"
                      register={register("last_name")}
                      error={errors.last_name}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Primer Apellido"
                      id="first_surname"
                      register={register("first_surname")}
                      error={errors.first_surname}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Segundo Apellido"
                      id="second_surname"
                      register={register("second_surname")}
                      error={errors.second_surname}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                  </div>

                  <FormField
                    label="Fecha de Nacimiento"
                    id="birthdate"
                    type="date"
                    register={register("birthdate")}
                    error={errors.birthdate}
                    inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                </FormSection>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FormSection title="Documento de Identidad">
                  <div className="flex gap-4">
                    <div className="w-24">
                      <Controller
                        name="nationality"
                        control={control}
                        render={({ field }) => (
                          <SelectField
                            label="Nacionalidad"
                            options={[
                              { value: "V", label: "V" },
                              { value: "E", label: "E" },
                            ]}
                            field={field}
                            error={errors.nationality}
                            className="bg-white/5 border-white/20 text-white"
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
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </FormSection>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <FormSection title="Información Académica">
                  <FormField
                    label="Carrera"
                    id="specialization"
                    register={register("specialization")}
                    error={errors.specialization}
                    inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                </FormSection>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FormSection title="Información de Contacto">
                  <TextareaField
                    label="Dirección"
                    id="address"
                    register={register("address")}
                    error={errors.address}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                </FormSection>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <FormSection title="Información de Cuenta">
                  <div className="space-y-4">
                    <FormField
                      label="Correo Electrónico"
                      id="email"
                      type="email"
                      register={register("email")}
                      error={errors.email}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Nombre de Usuario"
                      id="username"
                      register={register("username")}
                      error={errors.username}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Contraseña"
                      id="password"
                      type="password"
                      register={register("password")}
                      error={errors.password}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Pregunta Secreta"
                      id="question"
                      register={register("question")}
                      error={errors.question}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                    <FormField
                      label="Respuesta Secreta"
                      id="answer"
                      register={register("answer")}
                      error={errors.answer}
                      inputClassName="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                </FormSection>
              </motion.div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-400 transition-colors h-12 rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Registrando...</span>
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </Button>

              <p className="text-center text-white/70 text-sm">
                ¿Ya tiene una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="text-white hover:text-blue-200 underline font-medium"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sección gráfica */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-purple-600/20 to-blue-700/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl text-center space-y-6"
        >
          <Image
            src="/logo.svg"
            alt="Ilustración del sistema"
            width={600}
            height={600}
            className="w-full h-auto opacity-90 animate-float"
          />
          <h2 className="text-3xl font-bold text-white/90">
            Sistema de Gestión de Preparadurías Universitarias
          </h2>
          <p className="text-lg text-white/70">
            Optimiza la gestión de preparaduría con nuestra plataforma integrada
          </p>
        </motion.div>
      </div>
    </div>
  );
}
