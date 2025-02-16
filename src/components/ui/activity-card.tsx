import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, Calendar } from "lucide-react";

interface Activity {
  id: number;
  user: string;
  action: string;
  subject: string;
  time: string;
}

interface ActivityCardProps {
  activities: Activity[];
}

export function ActivityCard({ activities }: ActivityCardProps) {
  const getIcon = (action: string) => {
    if (action.includes("subió")) return Book;
    if (action.includes("completó")) return Users;
    return Calendar;
  };

  return (
    <Card className="bg-white/50 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Actividad Reciente de Preparadores
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Últimas acciones realizadas por tus preparadores
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.action);
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-black/5 transition-colors"
              >
                <div className="p-2 rounded-full bg-blue-100">
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    <span className="text-blue-600">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{activity.subject}</span>
                    <span className="mx-2">•</span>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
