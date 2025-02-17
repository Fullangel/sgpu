// src/app/(teacher)/material/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Edit, Eye } from "lucide-react";

interface Material {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
}

export default function MaterialPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/teacher/material");
        const data = await response.json();
        setMaterials(data.materials);
      } catch (error) {
        console.error("Error al obtener el material:", error);
      }
    };

    fetchMaterials();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/teacher/material/${id}`, { method: "DELETE" });
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar el material:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi Material</h1>
        <Button onClick={() => router.push("/teacher/material/add")}>
          <Plus className="mr-2" /> Subir Material
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de Subida</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.name}</TableCell>
              <TableCell>
                {new Date(material.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <button
                  onClick={() =>
                    router.push(`/teacher/material/view/${material.id}`)
                  }
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Eye />
                </button>
                <button
                  onClick={() =>
                    router.push(`/teacher/material/edit/${material.id}`)
                  }
                  className="text-green-500 hover:text-green-700"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(material.id)}
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
