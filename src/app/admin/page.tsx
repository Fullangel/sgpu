"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, ArrowUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    label: "Preparadores Asignados",
    value: "15",
    change: "+12%",
    timeframe: "vs mes anterior",
    trend: "up",
  },
  {
    icon: BookOpen,
    label: "Materias Registradas",
    value: "24",
    change: "+8%",
    timeframe: "vs mes anterior",
    trend: "up",
  },
  {
    icon: GraduationCap,
    label: "Lista de Estudiantes",
    value: "150",
    change: "+24%",
    timeframe: "vs mes anterior",
    trend: "up",
  },
];

const recentActivity = [
  {
    type: "new_tutor",
    title: "Nuevo Preparador Asignado",
    description:
      "Se ha asignado un nuevo preparador para la materia de Cálculo I",
    time: "Hace 2h",
  },
  {
    type: "subject_update",
    title: "Materia Actualizada",
    description: "Se actualizó el horario de Física II",
    time: "Hace 4h",
  },
  {
    type: "students_registered",
    title: "Estudiantes Registrados",
    description: "25 nuevos estudiantes registrados en el sistema",
    time: "Hace 6h",
  },
];

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Panel de Administrador
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bienvenido al Sistema de Gestión de Preparaduría
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <ArrowUp className="h-4 w-4" />
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.timeframe}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Actividad Reciente
          </CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Últimas actualizaciones del sistema
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
