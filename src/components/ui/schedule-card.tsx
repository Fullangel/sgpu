import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScheduleDay {
  day: string;
  sessions: number;
}

interface ScheduleCardProps {
  days: ScheduleDay[];
}

export function ScheduleCard({ days }: ScheduleCardProps) {
  return (
    <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Horarios de Preparadurías
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sesiones programadas para tus materias esta semana
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm font-medium mb-2">{day.day}</span>
              <div
                className={`w-full p-2 rounded-lg text-center ${
                  day.sessions > 0
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {day.sessions > 0
                  ? `${day.sessions} ${
                      day.sessions === 1 ? "sesión" : "sesiones"
                    }`
                  : "No hay"}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
