import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PatientRecords } from "./patient-records";
import { Eye } from "lucide-react";

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  healthInsurance?: string;
  insuranceNumber?: string;
  notes?: string;
  status: "active" | "inactive";
}

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

interface PatientDetailsProps {
  patient: Patient;
  medicalRecords: MedicalRecord[];
  appointments: Appointment[];
  onAddRecord: (data: any) => void;
}

export function PatientDetails({
  patient,
  medicalRecords,
  appointments,
  onAddRecord,
}: PatientDetailsProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Detalhes do Paciente</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Informações Pessoais
              </h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Nome:</span> {patient.fullName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {patient.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Telefone:</span> {patient.phone}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Data de Nascimento:</span>{" "}
                  {patient.birthDate}
                </p>
                {patient.gender && (
                  <p className="text-sm">
                    <span className="font-medium">Gênero:</span> {patient.gender}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Endereço
              </h3>
              <div className="mt-2 space-y-2">
                {patient.address && (
                  <p className="text-sm">
                    <span className="font-medium">Endereço:</span>{" "}
                    {patient.address}
                  </p>
                )}
                {patient.city && (
                  <p className="text-sm">
                    <span className="font-medium">Cidade:</span> {patient.city}
                  </p>
                )}
                {patient.state && (
                  <p className="text-sm">
                    <span className="font-medium">Estado:</span> {patient.state}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Contato de Emergência
              </h3>
              <div className="mt-2 space-y-2">
                {patient.emergencyContact && (
                  <p className="text-sm">
                    <span className="font-medium">Nome:</span>{" "}
                    {patient.emergencyContact}
                  </p>
                )}
                {patient.emergencyPhone && (
                  <p className="text-sm">
                    <span className="font-medium">Telefone:</span>{" "}
                    {patient.emergencyPhone}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Plano de Saúde
              </h3>
              <div className="mt-2 space-y-2">
                {patient.healthInsurance && (
                  <p className="text-sm">
                    <span className="font-medium">Convênio:</span>{" "}
                    {patient.healthInsurance}
                  </p>
                )}
                {patient.insuranceNumber && (
                  <p className="text-sm">
                    <span className="font-medium">Número:</span>{" "}
                    {patient.insuranceNumber}
                  </p>
                )}
              </div>
            </div>
            {patient.notes && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Observações
                </h3>
                <p className="mt-2 text-sm">{patient.notes}</p>
              </div>
            )}
          </div>
          <div className="col-span-2">
            <PatientRecords
              patientId={patient.id}
              medicalRecords={medicalRecords}
              appointments={appointments}
              onAddRecord={onAddRecord}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}