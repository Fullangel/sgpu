"use client";
import { useState } from "react";
<<<<<<< HEAD
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const token = useSearchParams().get("token");
=======
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = useSearchParams().get("email");
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
<<<<<<< HEAD
    setMessage("");
=======
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("¡Contraseña actualizada! Redirigiendo...");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setMessage(data.error || "Error al actualizar la contraseña");
      }
    } catch (error) {
      setMessage("Error de conexión");
=======
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message || data.error);
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 text-white"
        >
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Token inválido o expirado</h2>
        </motion.div>
      </div>
    );
  }

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
              Restablecer Contraseña
            </CardTitle>
            <p className="text-blue-100/80">Crea una nueva contraseña segura</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                    <span>Actualizando...</span>
                  </div>
                ) : (
                  "Cambiar Contraseña"
                )}
              </Button>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center gap-3 ${
                    message.includes("actualizada")
                      ? "bg-green-500/20 border border-green-500/50"
                      : "bg-red-500/20 border border-red-500/50"
                  }`}
                >
                  {message.includes("actualizada") ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <p
                    className={
                      message.includes("actualizada")
                        ? "text-green-200"
                        : "text-red-200"
                    }
                  >
                    {message}
                  </p>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
=======
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-4 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold">Restablecer Contraseña</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Código de verificación</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Nueva Contraseña</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Procesando..." : "Restablecer"}
          </Button>
        </form>

        {message && <p className="text-center text-sm">{message}</p>}
      </div>
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
    </div>
  );
}

// "use client";
<<<<<<< HEAD
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// export default function ResetPassword() {
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const token = useSearchParams().get("token");
=======
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export default function ResetPasswordPage() {
//   const [password, setPassword] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [question, setQuestion] = useState("");
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   useEffect(() => {
//     const fetchQuestion = async () => {
//       try {
//         const response = await fetch(
//           `/api/auth/forgot-password?token=${token}`
//         );
//         const data = await response.json();

//         if (response.ok) {
//           setQuestion(data.question);
//         } else {
//           setMessage(data.error || "Token inválido");
//         }
//       } catch (error) {
//         setMessage("Error de conexión");
//       }
//     };

//     if (token) fetchQuestion();
//   }, [token]);
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
//         body: JSON.stringify({ token, newPassword: password }),
=======
//         body: JSON.stringify({ token, password, answer }),
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
//       });

//       const data = await response.json();

//       if (response.ok) {
<<<<<<< HEAD
//         setMessage("¡Contraseña actualizada! Redirigiendo...");
//         setTimeout(() => (window.location.href = "/auth/login"), 2000);
//       } else {
//         setMessage(data.error || "Error al actualizar");
//       }
=======
//         setMessage("Contraseña actualizada exitosamente");
//       } else {
//         setMessage(data.error || "Error al actualizar la contraseña");
//       }
//     } catch (error) {
//       setMessage("Error de conexión");
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
//     } finally {
//       setLoading(false);
//     }
//   };

<<<<<<< HEAD
//   if (!token) return <div className="text-center p-8">Token inválido</div>;

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-4">
//         <h1 className="text-2xl font-bold">Nueva Contraseña</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             type="password"
//             placeholder="Nueva contraseña"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <Button type="submit" disabled={loading} className="w-full">
//             {loading ? "Actualizando..." : "Cambiar Contraseña"}
//           </Button>
//         </form>

//         {message && <p className="text-center text-sm">{message}</p>}
=======
//   if (!token) return <div className="text-center p-8">Token no válido</div>;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold text-center">
//           Restablecer Contraseña
//         </h1>

//         {question && (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 {question}
//               </label>
//               <Input
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Nueva Contraseña
//               </label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="mt-1"
//               />
//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700"
//             >
//               {loading ? "Actualizando..." : "Actualizar Contraseña"}
//             </Button>

//             {message && (
//               <p className="text-center text-sm text-red-600">{message}</p>
//             )}
//           </form>
//         )}
>>>>>>> 6f7fd1c4257e360cd27bc392a0d83738da5507f7
//       </div>
//     </div>
//   );
// }
