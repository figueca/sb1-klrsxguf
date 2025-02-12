import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { VideoCall } from "@/components/telemedicine/video-call";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppointments } from "@/hooks/use-appointments";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Video } from "lucide-react";

export function TelemedicinaPage() {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const { appointments } = useAppointments({
    status: "scheduled"
  });

  const onlineAppointments = appointments.filter(app => app.online);

  return (
    <>
      <DashboardHeader
        heading="Telemedicina"
        text="Gerencie suas consultas online"
      />
      
      {activeCall ? (
        <VideoCall
          appointmentId={activeCall}
          patientName={appointments.find(app => app.id === activeCall)?.patients.full_name || ""}
          onEnd={() => setActiveCall(null)}
        />
      ) : (
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Consultas Online Agendadas</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {onlineAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {appointment.patients.full_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(`${appointment.date}T${appointment.time}`), "PPp", { locale: ptBR })}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => setActiveCall(appointment.id)}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Iniciar Consulta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {onlineAppointments.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma consulta online agendada para hoje
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}