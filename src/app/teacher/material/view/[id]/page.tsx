// import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Material {
  id: string;
  name: string;
  file_url: string;
  createdAt: string;
}

export default function ViewMaterialPage({
  params,
}: {
  params: { id: string };
}) {
  const [material, setMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      const response = await fetch(`/api/teacher/material/${params.id}`);
      const data = await response.json();
      setMaterial(data.material);
    };

    fetchMaterial();
  }, [params.id]);

  if (!material) return <p>Cargando...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{material.name}</h1>
      <iframe src={material.file_url} className="w-full h-[600px]" />
    </div>
  );
}
