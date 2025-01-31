"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        const errorMessages = {
          CredentialsSignIn: "Credenciales incorrectas",
          UserNotFound: "Usuario no encontrado",
          NetWorkError: "Error de conexión",
          InvalidPassword: "Contraseña incorrecta",
          AccountNotVerified: "Verifique su correo electrónico",
        };

        const errorKey = res.error.toLowerCase();

        setError(errorMessages[errorKey] || "Credenciales inválidas");
      } else if (res?.ok) {
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Error en el servidor");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Sección del formulario */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
      >
        <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-white/20 shadow-xl">
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
              Bienvenido de vuelta
            </CardTitle>
            <p className="text-blue-100/80 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-red-500/20 p-4 rounded-lg flex items-center gap-3 border border-red-500/50 ${
                    error.includes("contraseña") ? "shake-animation" : ""
                  }`}
                >
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-red-200">{error}</p>
                    {error === "Contraseña incorrecta" && (
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm underline hover:text-red-300 mt-1 block"
                      >
                        ¿Se te olvidó tu contraseña?
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Correo electrónico</Label>
                  <Input
                    {...register("email", {
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo inválido",
                      },
                    })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.email && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-red-300 text-sm mt-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email.message as string}</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Contraseña</Label>
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Este campo es requerido",
                      minLength: {
                        value: 8,
                        message: "Mínimo 8 caracteres",
                      },
                    })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.password && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-red-300 text-sm mt-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.password.message as string}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-400 transition-colors h-12 rounded-xl shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verificando...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              <div className="text-center space-y-4 mt-6">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-white/70 hover:text-white/90 underline transition-colors"
                >
                  ¿Problemas para ingresar?
                </Link>

                <p className="text-white/70">
                  ¿Primera vez aquí?{" "}
                  <Link
                    href="/auth/register"
                    className="text-white hover:text-blue-200 underline font-medium"
                  >
                    Crear cuenta
                  </Link>
                </p>
              </div>
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
            Sistema de Gestión de Preparadurías Universitaría
          </h2>
          <p className="text-lg text-white/70">
            Optimiza la gestión de preparaduría con nuestra plataforma integrada
          </p>
        </motion.div>
      </div>
    </div>
  );
}
