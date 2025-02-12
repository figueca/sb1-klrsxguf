import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecordForm } from "./medical-record-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Calendar } from "lucide-react";

interface MedicalRecord {
  id: string;
  recordType: string;
  description: string;
  diagnosis?: string;
  prescription?: string;
  date: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

interface PatientRecordsProps {
  patientId: string;
  medicalRecords: MedicalRecord[];
  appointments: Appointment[];
  onAddRecord: (data: any) => void;
}

export function PatientRecords({
  patientId,
  medicalRecords,
  appointments,
  onAddRecord,
}: PatientRecordsProps) {
  return (
    <Tabs defaultValue="records" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="records">Prontuário</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
        </TabsList>
        <MedicalRecordForm patientId={patientId} onSubmit={onAddRecord} />
      </div>

      <TabsContent value="records">
        <Card>
          <CardHeader>
            <CardTitle>Prontuário Médico</CardTitle>
            <CardDescription>
              Histórico completo de registros médicos do paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {medicalRecords.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{record.recordType}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(record.date), "PPp", { locale: ptBR })}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">{record.description}</p>
                      {record.diagnosis && (
                        <div>
                          <p className="text-sm font-medium">Diagnóstico:</p>
                          <p className="text-sm text-muted-foreground">
                            {record.diagnosis}
                          </p>
                        </div>
                      )}
                      {record.prescription && (
                        <div>
                          <p className="text-sm font-medium">Prescrição:</p>
                          <p className="text-sm text-muted-foreground">
                            {record.prescription}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appointments">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Consultas</CardTitle>
            <CardDescription>
              Todas as consultas realizadas e agendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between border rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(
                            new Date(`${appointment.date}T${appointment.time}`),
                            "PPp",
                            { locale: ptBR }
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        appointment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {appointment.status === "completed"
                        ? "Realizada"
                        : appointment.status === "cancelled"
                        ? "Cancelada"
                        : "Agendada"}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}