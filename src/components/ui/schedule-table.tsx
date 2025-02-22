import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Session {
  id: number;
  subject: string;
  tutor: string;
  room: string;
  date: string;
  time: string;
  enrolled: string;
}

interface ScheduleTableProps {
  sessions: Session[];
}

export function ScheduleTable({ sessions }: ScheduleTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas Sesiones</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Materia</TableHead>
              <TableHead>Preparador</TableHead>
              <TableHead>Salón</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Inscritos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="font-medium">{session.subject}</TableCell>
                <TableCell>{session.tutor}</TableCell>
                <TableCell>{session.room}</TableCell>
                <TableCell>{session.date}</TableCell>
                <TableCell>{session.time}</TableCell>
                <TableCell>{session.enrolled}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
