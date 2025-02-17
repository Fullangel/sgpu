"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AddMaterialPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file as File);
      formData.append("name", name);
      formData.append("type", type);
      formData.append("subject", subject);

      const response = await fetch("/api/teacher/material", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/teacher/material");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error al subir el material");
      }
    } catch (error) {
      console.error("Error al subir el material:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Subir Material</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <Label htmlFor="name" className="block mb-2">
          Nombre del Material
        </Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4"
        />

        <Label htmlFor="file" className="block mb-2">
          Archivo
        </Label>
        <Input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          className="mb-4"
        />

        <Label htmlFor="type" className="block mb-2">
          Tipo de Material
        </Label>
        <Input
          type="text"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
          className="mb-4"
        />

        <Label htmlFor="subject" className="block mb-2">
          Asignatura
        </Label>
        <Input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="mb-4"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Subiendo..." : "Subir Material"}
        </Button>
      </form>
    </div>
  );
}
