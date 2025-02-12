import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePatients } from "@/hooks/use-patients";

interface Message {
  id: string;
  sender: 'user' | 'patient';
  content: string;
  timestamp: Date;
}

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "patient",
      content: "Olá doutor, gostaria de confirmar minha consulta de amanhã",
      timestamp: new Date("2024-03-15T14:30:00")
    },
    {
      id: "2",
      sender: "user",
      content: "Olá! Sim, sua consulta está confirmada para amanhã às 15h",
      timestamp: new Date("2024-03-15T14:32:00")
    }
  ]
};

export function ComunicacaoPage() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { patients } = usePatients();

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (content: string) => {
    console.log("Enviando mensagem:", content);
  };

  return (
    <>
      <DashboardHeader
        heading="Comunicação"
        text="Gerencie a comunicação com seus pacientes"
      />
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPatient === patient.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <p className="font-medium">{patient.full_name}</p>
                    <p className="text-sm opacity-70">{patient.email}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-8">
          {selectedPatient ? (
            <ChatInterface
              patientName={patients.find(p => p.id === selectedPatient)?.full_name || ""}
              messages={mockMessages[selectedPatient] || []}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                Selecione um paciente para iniciar uma conversa
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}