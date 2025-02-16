"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

interface AddTeacherFormProps {
  onClose: () => void;
  onAddTeacher: (teacher: { name: string; subject: string }) => void;
}

interface FormData {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  cedula?: string;
  email: string;
  password: string;
  username: string;
  nationality_id: "V" | "E";
  address: string;
  subjectName: string;
}

export default function AddTeacherForm({
  onClose,
  onAddTeacher,
}: AddTeacherFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      firstLastName: "",
      email: "",
      password: "",
      nationality_id: "V",
      address: "",
      subjectName: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const teacherData = {
        ...data,
        name: `${data.firstName} ${data.firstLastName}`,
        subject: data.subjectName,
        email: data.email,
        password: data.password,
        nationality_id: data.nationality_id,
        address: data.address,
        subjectName: data.subjectName,
        secondName: data.secondName || undefined,
        secondLastName: data.secondLastName || undefined,
        cedula: data.cedula || undefined,
      };

      const response = await fetch("/api/teachers/create-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherData),
      });
      console.log("Datos enviados al backend:", teacherData);

      if (!response.ok) {
        throw new Error("Error al agregar al profesor");
      }

      const result = await response.json();
      console.log(result);
      onAddTeacher({
        name: teacherData.name,
        subject: teacherData.subjectName,
      });

      toast.success("Profesor agregado correctamente");
      onClose();
    } catch (error) {
      console.error("Error al agregar profesor:", error);
      toast.error("Error al agregar profesor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Primer Nombre</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="w-full"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondName">Segundo Nombre</Label>
            <Input
              id="secondName"
              {...register("secondName")}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="firstLastName">Primer Apellido</Label>
            <Input
              id="firstLastName"
              {...register("firstLastName")}
              className="w-full"
            />
            {errors.firstLastName && (
              <p className="text-red-500 text-sm">
                {errors.firstLastName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondLastName">Segundo Apellido</Label>
            <Input
              id="secondLastName"
              {...register("secondLastName")}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cedula">Cédula</Label>
            <div className="flex space-x-2">
              <Controller
                name="nationality_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder="V/E" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="V">V</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Input
                id="cedula"
                type="text"
                {...register("cedula")}
                className="w-full"
              />
            </div>
            {errors.cedula && (
              <p className="text-red-500 text-sm">{errors.cedula.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="w-full"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de Usuario</Label>
          <Input id="username" {...register("username")} className="w-full" />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
              className="w-full pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <Textarea id="address" {...register("address")} className="w-full" />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subjectName">Nombre de la Materia</Label>
          <Input
            id="subjectName"
            {...register("subjectName")}
            className="w-full"
          />
          {errors.subjectName && (
            <p className="text-red-500 text-sm">{errors.subjectName.message}</p>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              "Agregar Profesor"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
