import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";

interface AppointmentProps {
  patient: string;
  time: string;
  type: string;
}

const appointments: AppointmentProps[] = [
  {
    patient: "Maria Silva",
    time: "09:00",
    type: "Consulta Regular"
  },
  {
    patient: "João Santos",
    time: "10:30",
    type: "Retorno"
  },
  {
    patient: "Ana Oliveira",
    time: "14:00",
    type: "Primeira Consulta"
  }
];

interface AppointmentsOverviewProps {
  className?: string;
}

export function AppointmentsOverview({ className }: AppointmentsOverviewProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Consultas de Hoje</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{appointment.patient}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  <Calendar className="h-4 w-4 text-muted-foreground ml-2" />
                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}