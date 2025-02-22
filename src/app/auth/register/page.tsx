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
  const [specializationError, setSpecializationError] = useState<string | null>(
    null
  );

  // useEffect(() => {
  //   fetch("/api/specializations")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setSpecializations(
  //         data.map((specialization: { id: number; name: string }) => ({
  //           value: specialization.id.toString(),
  //           label: specialization.name,
  //         }))
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("Error al cargar las especializaciones:", error);
  //     });
  // }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Validar la existencia de la especialización por ID
  const validateSpecialization = async (specializationName: string) => {
    if (!specializationName || specializationName.trim().length === 0) {
      setSpecializationError("La especialización es obligatoria.");
      return false;
    }

    try {
      const response = await fetch(
        `/api/specializations?name=${encodeURIComponent(specializationName)}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setSpecializationError("La especialización no existe.");
        return false;
      }

      // Si existe, limpiar el error
      setSpecializationError(null);
      return true;
    } catch (error) {
      console.error("Error al validar la especialización:", error);
      setSpecializationError("Error al verificar la especialización.");
      return false;
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    // Validar la especialización antes de enviar el formulario
    const isValidSpecialization = await validateSpecialization(
      data.specialization_name
    );

    if (!isValidSpecialization) {
      setIsLoading(false);
      return;
    }

    try {
      //Envia los datos al back
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
          specialization_name: data.specialization_name,
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
                  <input
                    {...register("specialization_name")}
                    placeholder="Ingresa o selecciona una especialización"
                    onChange={(e) => {
                      setValue("specialization_name", e.target.value); // Actualizar el valor del formulario
                    }}
                  />
                  {specializationError && <p>{specializationError}</p>}
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

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Link from "next/link";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   registerSchema,
//   type RegisterFormValues,
// } from "@/lib/schemas/registerSchemas";
// import { Loader2 } from "lucide-react";
// import { FormField } from "@/components/form/FormField";
// import { SelectField } from "@/components/form/SelectField";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [specializations, setSpecializations] = useState<
//     { value: string; label: string }[]
//   >([]);
//   const [inputValue, setInputValue] = useState("");
//   const [showSelect, setShowSelect] = useState(false);
//   const [activeTab, setActiveTab] = useState("email");

//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//   } = useForm<RegisterFormValues>({
//     resolver: zodResolver(registerSchema),
//   });

//   // Cargar especializaciones desde el backend
//   useEffect(() => {
//     fetch("/api/specializations")
//       .then((res) => res.json())
//       .then((data) => {
//         setSpecializations(
//           data.map((spec: { id: string; name: string }) => ({
//             value: spec.id,
//             label: spec.name,
//           }))
//         );
//       })
//       .catch((error) => {
//         console.error("Error al cargar las especializaciones:", error);
//       });
//   }, []);

//   // Buscar especializaciones existentes mientras el usuario escribe
//   useEffect(() => {
//     if (inputValue.length > 2) {
//       fetch(`/api/specializations?name=${encodeURIComponent(inputValue)}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setSpecializations(
//             data.map((spec: { id: string; name: string }) => ({
//               value: spec.id,
//               label: spec.name,
//             }))
//           );
//           setShowSelect(data.length > 0);
//         })
//         .catch((error) => {
//           console.error("Error al buscar especializaciones:", error);
//         });
//     } else {
//       setShowSelect(false);
//     }
//   }, [inputValue]);
//   // // Validar la existencia de la especialización por nombre
//   // const validateSpecialization = async (specializationName: string) => {
//   //   if (!specializationName || specializationName.trim().length === 0) {
//   //     setSpecializationError("La especialización es obligatoria.");
//   //     return false;
//   //   }

//   //   try {
//   //     const response = await fetch(
//   //       `/api/specializations?name=${encodeURIComponent(specializationName)}`
//   //     );
//   //     const data = await response.json();

//   //     if (data.length === 0) {
//   //       setSpecializationError("La especialización no existe.");
//   //       return false;
//   //     }

//   //     setSpecializationError(null);
//   //     return true;
//   //   } catch (error) {
//   //     console.error("Error al validar la especialización:", error);
//   //     setSpecializationError("Error al verificar la especialización.");
//   //     return false;
//   //   }
//   // };

//   // Manejador de envío del formulario
//   const onSubmit = async (data: RegisterFormValues) => {
//     setIsLoading(true);
//     setError(null);

//     const isValidSpecialization = await validateSpecialization(
//       data.specialization_name
//     );

//     if (!isValidSpecialization) {
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...data,
//           full_name: `${data.first_name} ${data.last_name}`,
//           birthdate: new Date(data.birthdate).toISOString(),
//           type: "Student",
//           status: "Active",
//           emailVerified: false,
//           specialization_name: data.specialization_name,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Error en el registro");
//       }

//       router.push("/auth/verify-email");
//     } catch (error) {
//       console.error("Error en registro:", error);
//       setError(error instanceof Error ? error.message : "Error desconocido");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Manejador de inicio de sesión con Google
//   const handleGoogleSignIn = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Simulación de inicio de sesión con Google
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       router.push("/dashboard");
//     } catch (error) {
//       console.error("Error en inicio de sesión con Google:", error);
//       setError(
//         "Error al iniciar sesión con Google. Por favor, intente de nuevo."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sección del formulario */}
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <Card>
//           <CardHeader>
//             <CardTitle>Crear Nueva Cuenta</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Tabs value={activeTab} onValueChange={setActiveTab}>
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="email">Email</TabsTrigger>
//                 <TabsTrigger value="google">Google</TabsTrigger>
//               </TabsList>

//               {/* Registro con Email */}
//               <TabsContent value="email">
//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                   {error && (
//                     <div className="p-3 text-red-600 bg-red-100 rounded">
//                       {error}
//                     </div>
//                   )}

//                   <FormField
//                     label="Primer Nombre"
//                     id="first_name"
//                     error={errors.first_name}
//                     register={register("first_name")}
//                   />
//                   <FormField
//                     label="Segundo Nombre"
//                     id="last_name"
//                     error={errors.last_name}
//                     register={register("last_name")}
//                   />
//                   <FormField
//                     label="Primer Apellido"
//                     id="first_surname"
//                     error={errors.first_surname}
//                     register={register("first_surname")}
//                   />
//                   <FormField
//                     label="Segundo Apellido (Opcional)"
//                     id="second_surname"
//                     error={errors.second_surname}
//                     register={register("second_surname")}
//                   />
//                   <FormField
//                     label="Cédula"
//                     id="cedula"
//                     error={errors.cedula}
//                     register={register("cedula")}
//                   />
//                   <FormField
//                     label="Correo Electrónico"
//                     id="email"
//                     type="email"
//                     error={errors.email}
//                     register={register("email")}
//                   />
//                   <FormField
//                     label="Nombre de Usuario"
//                     id="username"
//                     error={errors.username}
//                     register={register("username")}
//                   />
//                   <FormField
//                     label="Contraseña"
//                     type="password"
//                     error={errors.password}
//                     register={register("password")}
//                   />
//                   <FormField
//                     label="Fecha de Nacimiento"
//                     id="birthdate"
//                     type="date"
//                     error={errors.birthdate}
//                     register={register("birthdate")}
//                   />
//                   <FormField
//                     label="Dirección"
//                     id="address"
//                     error={errors.address}
//                     register={register("address")}
//                   />
//                   <Controller
//                     name="nationality"
//                     control={control}
//                     render={({ field }) => (
//                       <SelectField
//                         label="Nacionalidad"
//                         options={[
//                           { value: "V", label: "V" },
//                           { value: "E", label: "E" },
//                         ]}
//                         field={field}
//                         error={errors.nationality}
//                         className="bg-white/5 border-white/20 text-white"
//                       />
//                     )}
//                   />
//                   <FormField label="Especialización">
//                     <div className="mb-4">
//                       <label
//                         htmlFor="specialization"
//                         className="block text-sm font-medium"
//                       >
//                         Especialización
//                       </label>
//                       <input
//                         id="specialization"
//                         {...register("specialization", {
//                           required: "La especialización es requerida",
//                         })}
//                         value={inputValue}
//                         onChange={(e) => {
//                           setInputValue(e.target.value); // Actualizar el valor del input
//                           setValue("specialization", e.target.value); // Actualizar el valor del formulario
//                         }}
//                         placeholder="Ingresa o selecciona una especialización"
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       />
//                       {showSelect && (
//                         <select
//                           onChange={(e) => {
//                             setValue("specialization", e.target.value); // Actualizar el ID de la especialización
//                             setInputValue(
//                               e.target.options[e.target.selectedIndex].text
//                             ); // Actualizar el valor del input
//                             setShowSelect(false); // Ocultar el select
//                           }}
//                           className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         >
//                           {specializations.map((spec) => (
//                             <option key={spec.value} value={spec.value}>
//                               {spec.label}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                       {errors.specialization && (
//                         <p className="text-red-500 text-sm">
//                           {errors.specialization.message}
//                         </p>
//                       )}
//                     </div>
//                   </FormField>
//                   <FormField
//                     label="Pregunta Secreta"
//                     id="question"
//                     error={errors.question}
//                     register={register("question")}
//                   />
//                   <FormField
//                     label="Respuesta Secreta"
//                     id="answer"
//                     error={errors.answer}
//                     register={register("answer")}
//                   />

//                   <Button type="submit" disabled={isLoading} className="w-full">
//                     {isLoading ? (
//                       <Loader2 className="animate-spin" />
//                     ) : (
//                       "Crear Cuenta"
//                     )}
//                   </Button>
//                 </form>
//               </TabsContent>

//               {/* Registro con Google */}
//               <TabsContent value="google">
//                 <Button
//                   onClick={handleGoogleSignIn}
//                   disabled={isLoading}
//                   className="w-full"
//                 >
//                   {isLoading ? (
//                     <Loader2 className="animate-spin" />
//                   ) : (
//                     "Iniciar con Google"
//                   )}
//                 </Button>
//               </TabsContent>
//             </Tabs>

//             <div className="mt-4 text-center">
//               ¿Ya tienes una cuenta?{" "}
//               <Link
//                 href="/auth/login"
//                 className="text-blue-600 hover:underline"
//               >
//                 Iniciar Sesión
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Sección gráfica */}
//       <div className="flex-1 bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">
//             Sistema de Gestión de Preparadurías Universitarias
//           </h1>
//           <p className="mt-4 text-gray-600">
//             Optimiza la gestión de preparaduría con nuestra plataforma integrada
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
