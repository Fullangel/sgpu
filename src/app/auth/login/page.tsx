"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log("Respuesta de signIn:", res);
    console.log(data);

    if (res?.error) {
      setError(res.error); // Muestra el error en la interfaz
    } else if (res?.ok) {
      router.refresh();
      router.push("/dashboard"); // Redirige al dashboard si la autenticación es exitosa
    } else {
      setError("Error desconocido. Inténtalo de nuevo."); // Maneja otros casos
    }
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - Login Form */}
      <div className="w-full lg:w-1/2 bg-gradient-to-b from-blue-500 to-blue-600 p-6 lg:p-12 flex items-center justify-center relative">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="space-y-1 text-center text-white">
            {/* Logo at bottom */}
            <div className="flex justify-center mb-4">
              <Image
                src="/sgpu.svg"
                alt="TASK Logo"
                width={120}
                height={40}
                className="w-auto h-15"
              />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight mb-2">
              INICIO DE SESIÓN
            </CardTitle>
            <CardDescription className="text-blue-100">
              Bienvenido al Sistema de Gestión de Preparaduría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <span className="bg-red-500 text-lg text-white p-3 rounded mb-2">
                  {error}
                </span>
              )}

              <div className="space-y-2 mb-3">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "El Email es requerido",
                    },
                  })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La contraseña es requerida",
                    },
                  })}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Iniciar Sesión
              </Button>
            </form>

            <div className="text-center mt-4">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:underline text-sm"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-white/90 text-sm">
                ¿No está registrado?{" "}
                <Link
                  href="/auth/register"
                  className="text-white hover:text-blue-100 underline underline-offset-4"
                >
                  Regístrese aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Section - Logo Display */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <Image
            src="/logo.svg"
            alt="SGPU Logo"
            width={400}
            height={400}
            className="w-auto h-auto max-w-md mx-auto"
          />
          <h2 className="text-2xl font-bold text-gray-900">
            Sistema de Gestión de Preparadurías Universitario
          </h2>
        </div>
      </div>
    </div>
  );
}
