"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `/api/auth/forgot-password?token=${token}`
        );
        const data = await response.json();

        if (response.ok) {
          setQuestion(data.question);
        } else {
          setMessage(data.error || "Token inválido");
        }
      } catch (error) {
        setMessage("Error de conexión");
      }
    };

    if (token) fetchQuestion();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, answer }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Contraseña actualizada exitosamente");
      } else {
        setMessage(data.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <div className="text-center p-8">Token no válido</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center">
          Restablecer Contraseña
        </h1>

        {question && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {question}
              </label>
              <Input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Actualizando..." : "Actualizar Contraseña"}
            </Button>

            {message && (
              <p className="text-center text-sm text-red-600">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
