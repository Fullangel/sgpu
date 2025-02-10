import { useState } from "react";
// import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TeacherListProps {
  teachers: { id: number; name: string; subject: string }[];
  onDelete: (id: number) => void;
}

export default function TeacherList({ teachers, onDelete }: TeacherListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);

    try {
      const response = await fetch(`/api/teachers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el profesor");
      }

      const result = await response.json();
      console.log(result.message);
      toast.success("Profesor eliminado correctamente");

      //Se actualiza el estado del front
      onDelete(id);
    } catch (error) {
      console.error("Error en la eliminación del profesor:", error);
      toast.error("Error al eliminar el profesor");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="flex justify-between items-center mb-4"
        >
          <div>
            <p className="font bold">{teacher.name}</p>
            <p className="text-sm text-gray-500">{teacher.subject}</p>
          </div>
          <Button
            variant="destructive"
            onClick={() => handleDelete(teacher.id)}
            disabled={isDeleting === teacher.id}
          >
            {isDeleting === teacher.id ? "Eliminando" : "Eliminar"}
          </Button>
        </div>
      ))}
    </div>
  );
}
