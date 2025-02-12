import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, Calendar } from "lucide-react";

interface PatientProps {
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
}

const patients: PatientProps[] = [
  {
    name: "Carlos Ferreira",
    phone: "(11) 98765-4321",
    email: "carlos.f@email.com",
    lastVisit: "15/03/2024"
  },
  {
    name: "Patricia Santos",
    phone: "(11) 91234-5678",
    email: "patricia.s@email.com",
    lastVisit: "14/03/2024"
  },
  {
    name: "Roberto Lima",
    phone: "(11) 99876-5432",
    email: "roberto.l@email.com",
    lastVisit: "13/03/2024"
  }
];

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pacientes Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {patients.map((patient, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{patient.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{patient.phone}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{patient.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{patient.lastVisit}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}