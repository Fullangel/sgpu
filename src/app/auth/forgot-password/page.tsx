"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      setMessage("Por favor ingrese su email");
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "usuario@ejemplo.com" }), // <- Asegurar este formato
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage("Se ha enviado un correo con las instrucciones");
      } else {
        setMessage(data.error || "Error al procesar la solicitud");
      }
    } catch (error) {
      setMessage("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">Recuperar Contraseña</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Enviando..." : "Enviar Instrucciones"}
          </Button>

          {message && (
            <p className="text-center text-sm text-red-600">{message}</p>
          )}
        </form>

        <div className="text-center mt-4">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
}
