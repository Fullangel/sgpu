"use client";

import { motion } from "framer-motion";
import { Book, Clock, FileText, Calendar } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { ScheduleTable } from "@/components/ui/schedule-table";
import { MaterialsList } from "@/components/ui/materials-list";
import { NotificationsList } from "@/components/ui/notifications-list";
import { MainNav } from "@/components/ui/main-nav";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const metrics = [
  {
    title: "Materias Inscritas",
    value: "4",
    subtitle: "Con preparaduría",
    icon: Book,
    trend: "2 activas esta semana",
  },
  {
    title: "Horas de Preparaduría",
    value: "12",
    subtitle: "Esta semana",
    icon: Clock,
    trend: "+2 horas vs semana pasada",
  },
  {
    title: "Material Disponible",
    value: "15",
    subtitle: "Documentos y recursos",
    icon: FileText,
    trend: "3 nuevos esta semana",
  },
  {
    title: "Próxima Sesión",
    value: "Mañana",
    subtitle: "10:00 AM - Cálculo I",
    icon: Calendar,
    trend: "2 sesiones esta semana",
  },
];

const nextSessions = [
  {
    id: 1,
    subject: "Cálculo I",
    tutor: "Juan Pérez",
    room: "A-101",
    date: "15 Feb 2025",
    time: "10:00 AM",
    status: "Confirmada",
  },
  {
    id: 2,
    subject: "Física Básica",
    tutor: "María González",
    room: "B-203",
    date: "16 Feb 2025",
    time: "2:00 PM",
    status: "Pendiente",
  },
  {
    id: 3,
    subject: "Química",
    tutor: "Carlos Ramírez",
    room: "C-105",
    date: "17 Feb 2025",
    time: "11:00 AM",
    status: "Confirmada",
  },
];

const recentMaterials = [
  {
    id: 1,
    name: "Guía de ejercicios - Cálculo I",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "Hace 2 días",
    downloads: 45,
  },
  {
    id: 2,
    name: "Presentación - Física Básica",
    type: "PPTX",
    size: "5.1 MB",
    uploadedAt: "Hace 4 días",
    downloads: 32,
  },
  {
    id: 3,
    name: "Práctica de laboratorio - Química",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "Hace 5 días",
    downloads: 28,
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Tu Centro de Aprendizaje
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Explora tus preparadurías, recursos y progreso académico
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {metrics.map((metric) => (
            <motion.div key={metric.title} variants={item}>
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ScheduleTable sessions={nextSessions} />
          </motion.div>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <MaterialsList materials={recentMaterials} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <NotificationsList />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
