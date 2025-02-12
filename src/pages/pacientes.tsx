import { DashboardHeader } from "@/components/dashboard/header";
import { PatientsList } from "@/components/patients/patients-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function PacientesPage() {
  return (
    <>
      <DashboardHeader
        heading="Pacientes"
        text="Gerencie seus pacientes"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Paciente
        </Button>
      </DashboardHeader>
      <PatientsList />
    </>
  );
}