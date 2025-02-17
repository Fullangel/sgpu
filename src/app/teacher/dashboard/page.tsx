"use client";
import { useSession } from "next-auth/react";
import { Users, BookOpen, FileText, Calendar } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { ScheduleCard } from "@/components/ui/schedule-card";
import { ActivityCard } from "@/components/ui/activity-card";

const schedule = [
  { day: "Lun", sessions: 2 },
  { day: "Mar", sessions: 1 },
  { day: "Mié", sessions: 3 },
  { day: "Jue", sessions: 2 },
  { day: "Vie", sessions: 1 },
  { day: "Sáb", sessions: 0 },
  { day: "Dom", sessions: 0 },
];

const activities = [
  {
    id: 1,
    user: "María González",
    action: "subió un nuevo material",
    subject: "Cálculo I",
    time: "Hace 2 horas",
  },
  {
    id: 2,
    user: "Carlos Ramírez",
    action: "completó una sesión",
    subject: "Física Básica",
    time: "Hace 4 horas",
  },
  {
    id: 3,
    user: "Ana Torres",
    action: "programó una nueva sesión",
    subject: "Química",
    time: "Hace 6 horas",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  const teacherName = session?.user?.name || "Profesor";
  const teacherRole = session?.user?.role || "Profesor";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md">
              {teacherName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-semibold text-xl">{teacherName}</h1>
              <p className="text-sm text-muted-foreground">{teacherRole}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <span className="sr-only">Notificaciones</span>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <span className="sr-only">Ayuda</span>
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Mis Preparadores"
            value="5"
            subtitle="En 3 materias"
            icon={Users}
            delay={0}
            href="/teacher/preparers"
          />
          <MetricCard
            title="Materias con Preparaduría"
            value="3"
            subtitle="Este semestre"
            icon={BookOpen}
            delay={0.1}
          />
          <MetricCard
            title="Material Compartido"
            value="12"
            subtitle="Documentos y recursos"
            icon={FileText}
            delay={0.2}
          />
          <MetricCard
            title="Próxima Reunión"
            value="Mañana"
            subtitle="11:00 AM - Coordinación"
            icon={Calendar}
            delay={0.3}
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <ScheduleCard days={schedule} />
          <ActivityCard activities={activities} />
        </div>
      </main>
    </div>
  );
}
