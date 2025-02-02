"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getCsrfToken } from "next-auth/react";

// Interfaces TypeScript
interface LoginFormData {
  email: string;
  password: string;
}

interface ErrorMessages {
  [key: string]: string;
}

// Constantes de configuración
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutos en milisegundos

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Obtener token CSRF
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken();
      if (token) setCsrfToken(token);
    };
    fetchCsrfToken();
  }, []);

  // Manejador de envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        setError(
          `Demasiados intentos. Espere ${LOCKOUT_TIME / 60000} minutos.`
        );
        setTimeout(() => setLoginAttempts(0), LOCKOUT_TIME);
        return;
      }

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        csrfToken,
      });

      if (res?.error) {
        const errorMapping: ErrorMessages = {
          CredentialsSignin: "Credenciales incorrectas",
          UserNotFound: "Usuario no registrado",
          InvalidPassword: "Contraseña incorrecta",
          InactiveAccount: "Cuenta inactiva",
          NetworkError: "Error de conexión",
          Default: "Error de autenticación",
        };

        const errorKey =
          Object.keys(errorMapping).find((key) => res.error?.includes(key)) ||
          "Default";

        setError(errorMapping[errorKey]);
        setLoginAttempts((prev) => prev + 1);

        if (errorKey === "CredentialsSignin") {
          router.refresh();
        }
      } else {
        const callbackUrl = new URLSearchParams(window.location.search).get(
          "callbackUrl"
        );
        router.push(callbackUrl || "/dashboard");
        router.refresh();
        setLoginAttempts(0);
      }
    } catch (err) {
      setError("Error interno del servidor");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  });

  // Animaciones
  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  const inputErrorVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

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
                priority
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
            <form
              onSubmit={onSubmit}
              aria-labelledby="login-heading"
              noValidate
            >
              <input type="hidden" name="csrfToken" value={csrfToken} />

              {error && (
                <motion.div
                  variants={errorVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-red-500/20 p-4 rounded-lg flex items-center gap-3 border border-red-500/50"
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="text-red-200">{error}</p>
                    {error === "Contraseña incorrecta" && (
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm underline hover:text-red-300 mt-1 block"
                        aria-label="Recuperar contraseña"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-white/80" htmlFor="email">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    aria-describedby="email-error"
                    {...register("email", {
                      required: "El correo electrónico es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo electrónico inválido",
                      },
                    })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.email && (
                    <motion.div
                      variants={inputErrorVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-2 text-red-300 text-sm mt-1"
                      id="email-error"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.email.message}</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80" htmlFor="password">
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    aria-describedby="password-error"
                    {...register("password", {
                      required: "La contraseña es requerida",
                      minLength: {
                        value: 8,
                        message: "Mínimo 8 caracteres",
                      },
                      validate: {
                        hasNumber: (value) =>
                          /\d/.test(value) || "Debe contener un número",
                        hasSpecial: (value) =>
                          /[!@#$%^&*]/.test(value) ||
                          "Debe contener un carácter especial",
                      },
                    })}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
                  />
                  {errors.password && (
                    <motion.div
                      variants={inputErrorVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-2 text-red-300 text-sm mt-1"
                      id="password-error"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.password.message}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || loginAttempts >= MAX_LOGIN_ATTEMPTS}
                className="w-full bg-blue-500 hover:bg-blue-400 transition-colors h-12 rounded-xl shadow-lg mt-6"
                aria-label="Iniciar sesión"
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
                  aria-label="Recuperar contraseña"
                >
                  ¿Problemas para ingresar?
                </Link>

                <p className="text-white/70">
                  ¿Primera vez aquí?{" "}
                  <Link
                    href="/auth/register"
                    className="text-white hover:text-blue-200 underline font-medium"
                    aria-label="Registrarse"
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
            priority
            className="w-full h-auto opacity-90 animate-float"
          />
          <h2 className="text-3xl font-bold text-white/90">
            Sistema de Gestión de Preparadurías Universitarias
          </h2>
          <p className="text-lg text-white/70">
            Optimiza la gestión de preparadurías con nuestra plataforma
            integrada
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Loader2, AlertCircle } from "lucide-react";
// import { motion } from "framer-motion";

// export default function LoginPage() {
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();
//   const router = useRouter();

//   const onSubmit = handleSubmit(async (data) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const res = await signIn("credentials", {
//         email: data.email,
//         password: data.password,
//         redirect: false,
//       });

//       if (res?.error) {
//         const errorMapping = { [key: string]: string } = {
//           "CredentialsSignin": "Credenciales incorrectas",
//           "UserNotFound": "Usuario no registrado",
//           "InvalidPassword": "Contraseña incorrecta",
//           "InactiveAccount": "Cuenta inactiva",
//           "NetworkError": "Error de conexión",
//           "Default": "Error de autenticación"
//         };

//         const errorKey = Object.keys(errorMapping).find(key =>
//           res.error?.toLowerCase().includes(key.toLowerCase())
//         ) || "Default";

//         setError(errorMapping[errorKey]);

//         // Forzar recarga si es error de sesión
//         if (errorKey === "CredentialsSignin") {
//           router.refresh();
//         }
//       } else {
//           router.push("/dashboard");
//           router.refresh();
//         }
//       } catch (err) {
//         setError("Error interno del servidor");
//         console.error("Login error:", err);
//     }
//   });

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-600 to-purple-700">
//       {/* Sección del formulario */}
//       <motion.div
//         initial={{ opacity: 0, x: -50 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12"
//       >
//         <Card className="w-full max-w-md bg-white/5 backdrop-blur-lg border-white/20 shadow-xl">
//           <CardHeader className="space-y-1 text-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="flex justify-center mb-4"
//             >
//               <Image
//                 src="/sgpu.svg"
//                 alt="Logo SGPU"
//                 width={140}
//                 height={50}
//                 className="w-auto h-16"
//               />
//             </motion.div>

//             <CardTitle className="text-3xl font-bold text-white">
//               Bienvenido de vuelta
//             </CardTitle>
//             <p className="text-blue-100/80 mt-2">
//               Ingresa tus credenciales para continuar
//             </p>
//           </CardHeader>

//           <CardContent>
//             <form onSubmit={onSubmit} className="space-y-6">
//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className={`bg-red-500/20 p-4 rounded-lg flex items-center gap-3 border border-red-500/50 ${
//                     error.includes("contraseña") ? "shake-animation" : ""
//                   }`}
//                 >
//                   <AlertCircle className="h-5 w-5 text-red-400" />
//                   <div>
//                     <p className="text-red-200">{error}</p>
//                     {error === "Contraseña incorrecta" && (
//                       <Link
//                         href="/auth/forgot-password"
//                         className="text-sm underline hover:text-red-300 mt-1 block"
//                       >
//                         ¿Se te olvidó tu contraseña?
//                       </Link>
//                     )}
//                   </div>
//                 </motion.div>
//               )}

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-white/80">Correo electrónico</Label>
//                   <Input
//                     {...register("email", {
//                       required: "Este campo es requerido",
//                       pattern: {
//                         value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                         message: "Correo inválido",
//                       },
//                     })}
//                     className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
//                   />
//                   {errors.email && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center gap-2 text-red-300 text-sm mt-1"
//                     >
//                       <AlertCircle className="h-4 w-4" />
//                       <span>{errors.email.message as string}</span>
//                     </motion.div>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-white/80">Contraseña</Label>
//                   <Input
//                     type="password"
//                     {...register("password", {
//                       required: "Este campo es requerido",
//                       minLength: {
//                         value: 8,
//                         message: "Mínimo 8 caracteres",
//                       },
//                     })}
//                     className="bg-white/5 border-white/20 text-white placeholder:text-white/40 hover:bg-white/10 focus:ring-2 focus:ring-blue-300"
//                   />
//                   {errors.password && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center gap-2 text-red-300 text-sm mt-1"
//                     >
//                       <AlertCircle className="h-4 w-4" />
//                       <span>{errors.password.message as string}</span>
//                     </motion.div>
//                   )}
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-blue-500 hover:bg-blue-400 transition-colors h-12 rounded-xl shadow-lg"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     <span>Verificando...</span>
//                   </div>
//                 ) : (
//                   "Iniciar Sesión"
//                 )}
//               </Button>

//               <div className="text-center space-y-4 mt-6">
//                 <Link
//                   href="/auth/forgot-password"
//                   className="text-sm text-white/70 hover:text-white/90 underline transition-colors"
//                 >
//                   ¿Problemas para ingresar?
//                 </Link>

//                 <p className="text-white/70">
//                   ¿Primera vez aquí?{" "}
//                   <Link
//                     href="/auth/register"
//                     className="text-white hover:text-blue-200 underline font-medium"
//                   >
//                     Crear cuenta
//                   </Link>
//                 </p>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>

//       {/* Sección gráfica */}
//       <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-gradient-to-br from-purple-600/20 to-blue-700/30">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="max-w-2xl text-center space-y-6"
//         >
//           <Image
//             src="/logo.svg"
//             alt="Ilustración del sistema"
//             width={600}
//             height={600}
//             className="w-full h-auto opacity-90 animate-float"
//           />
//           <h2 className="text-3xl font-bold text-white/90">
//             Sistema de Gestión de Preparadurías Universitaría
//           </h2>
//           <p className="text-lg text-white/70">
//             Optimiza la gestión de preparaduría con nuestra plataforma integrada
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
