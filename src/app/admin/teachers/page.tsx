"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import AddTeacherForm from "../AddTeacherForm";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TeachersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [professors, setProfessors] = useState<
    { id: number; name: string; subject: string; tutors: number }[]
  >([]);

  //Carga a los profesores desde el back
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch("/api/teachers");
        if (!response.ok) {
          throw new Error("Error al cargar profesores");
        }
        const data = await response.json();
        setProfessors(data);
      } catch (error) {
        console.error("Error al cargar profesores:", error);
        toast.error("Error al cargar al profesor");
      }
    };

    fetchProfessors();
  }, []);

  const handleAddTeacher = async (teacher: {
    name: string;
    subject: string;
  }) => {
    try {
      const response = await fetch("/api/teachers/create-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al agregar al profesor");
      }

      const newTeacher = await response.json();

      setProfessors((prevProfessors) => [
        ...prevProfessors,
        {
          id: newTeacher.id,
          name: newTeacher.name,
          subject: newTeacher.subjectName,
          tutors: 0,
        },
      ]);

      toast.success("Profesor agregado correctamente");
    } catch (error) {
      console.error("Error al agregar al profesor", error);
      toast.error("Error al agregar profesor");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Error desconocido";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || "Error al eliminar al profesor";
        } catch (jsonError) {
          errorMessage = "Respuesta invalida del servidor";
        }
        throw new Error(errorMessage);
      }

      setProfessors((prevProfessors) =>
        prevProfessors.filter((professor) => professor.id !== id)
      );

      toast.success("Profesor eliminado con exito");
    } catch (error) {
      console.error("Error al eliminar al profesor", error);
      toast.error("Error al eliminar al profesor");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestión de Profesores</h1>
      <Button onClick={() => setIsModalOpen(true)} className="mb-6">
        Agregar Profesor
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Nuevo Profesor"
      >
        <AddTeacherForm
          onClose={() => setIsModalOpen(false)}
          onAddTeacher={handleAddTeacher}
        />
      </Modal>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Materia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Preparadores
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {professors.map((professor) => (
                <motion.tr
                  key={professor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {professor.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {professor.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      {professor.tutors}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(professor.id)}
                      className="inline-flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
