import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationsList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-sm">
                Nueva sesión programada para Cálculo I
              </p>
              <p className="text-xs text-muted-foreground">Hace 2 horas</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
