"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [securityAnswerError, setSecurityAnswerError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSecurityAnswerError("");
    try {
      console.log("Datos enviados al backend:", { email, answer });

      // Llamada única al backend para validar y enviar el correo
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answer }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Se ha enviado un enlace de recuperación a tu correo");
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        setMessage(data.error || "Error al procesar la solicitud");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000); // Desaparece después de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [message]);
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     console.log("Datos enviados al backend:", { email, answer });
  //     // Validar la respuesta de seguridad
  //     const validationResponse = await fetch(
  //       "/api/auth/validate-security-answer",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, answer }),
  //       }
  //     );

  //     const validationData = await validationResponse.json();

  //     if (!validationResponse.ok) {
  //       setMessage(validationData.error || "Respuesta de seguridad incorrecta");
  //       setLoading(false);
  //       return;
  //     }

  //     // Si la respuesta de seguridad es válida, enviar el correo de recuperación
  //     const response = await fetch("/api/auth/forgot-password", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setMessage("Se ha enviado un enlace de recuperación a tu correo");
  //       setTimeout(() => router.push("/auth/login"), 3000);
  //     } else {
  //       setMessage(data.error || "Error al procesar la solicitud");
  //     }
  //   } catch (error) {
  //     setMessage("Error de conexión con el servidor");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/5 backdrop-blur-lg border-white/20 shadow-xl">
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
              Recuperar Contraseña
            </CardTitle>
            <p className="text-blue-100/80">
              Ingresa tu correo para restablecer tu contraseña
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Campo de correo electrónico */}
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                />

                {/* Campo de respuesta de seguridad */}
                <Input
                  type="text"
                  placeholder="Respuesta de seguridad"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-400 transition-colors h-12 rounded-xl shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  "Enviar Instrucciones"
                )}
              </Button>

              {/* Mensaje de estado */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.includes("enviado")
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  {message.includes("enviado") ? (
                    <MailCheck className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <p
                    className={
                      message.includes("enviado")
                        ? "text-green-200"
                        : "text-red-200"
                    }
                  >
                    {message}
                  </p>
                </motion.div>
              )}

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-white/70 hover:text-blue-200 underline text-sm"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
