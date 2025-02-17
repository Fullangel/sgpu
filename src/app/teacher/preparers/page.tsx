"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

interface Preparer {
  id: string;
  name: string;
  email: string;
  subjectsAsPreparer: { name: string }[];
}

export default function PreparersPage() {
  const [preparers, setPreparers] = useState<Preparer[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPreparers = async () => {
      try {
        const response = await fetch("/api/assistant/list");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        if (Array.isArray(data.preparers)) {
          setPreparers(data.preparers);
        } else {
          console.error(
            "La respuesta de la API no contiene un array válido:",
            data
          );
        }
      } catch (error) {
        console.error("Error al obtener los preparadores:", error);
      }
    };

    fetchPreparers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/assistant/${id}`, { method: "DELETE" });
      setPreparers((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar el preparador:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Preparadores</h1>
        <Button onClick={() => router.push("/teacher/preparadores/add")}>
          <Plus className="mr-2" /> Agregar Preparador
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Materias</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {preparers.map((preparer) => (
            <TableRow key={preparer.id}>
              <TableCell>{preparer.name}</TableCell>
              <TableCell>{preparer.email}</TableCell>
              <TableCell>
                {preparer.subjectsAsPreparer
                  .map((subject) => subject.name)
                  .join(", ")}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleDelete(preparer.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
