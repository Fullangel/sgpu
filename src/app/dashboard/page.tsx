"use client"; // <─ Agrega esto al inicio para convertirla en Client Component

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // <─ Usa next/navigation, no next/router
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Bienvenido, {session?.user?.name}</h1>
      {/* Contenido del dashboard */}
    </div>
  );
}
