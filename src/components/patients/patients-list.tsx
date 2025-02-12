"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2, Phone, Mail, Plus } from "lucide-react";
import { PatientForm } from "./patient-form";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  lastVisit: string;
  status: "Ativo" | "Inativo";
}

const initialPatients: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 98765-4321",
    birthDate: "15/03/1985",
    lastVisit: "10/03/2024",
    status: "Ativo"
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 97654-3210",
    birthDate: "22/07/1990",
    lastVisit: "08/03/2024",
    status: "Ativo"
  },
  {
    id: "3",
    name: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    phone: "(11) 96543-2109",
    birthDate: "30/11/1978",
    lastVisit: "05/03/2024",
    status: "Inativo"
  }
];

export function PatientsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleAddPatient = (data: Omit<Patient, "id" | "lastVisit">) => {
    const newPatient: Patient = {
      ...data,
      id: crypto.randomUUID(),
      lastVisit: "Sem consultas"
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const handleEditPatient = (id: string, data: Omit<Patient, "id" | "lastVisit">) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === id
          ? { ...patient, ...data }
          : patient
      )
    );
  };

  const handleDeletePatient = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      setPatients(prev => prev.filter(patient => patient.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
          <Button size="sm" variant="ghost">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <PatientForm
          onSubmit={handleAddPatient}
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Última Consulta</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{patient.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.birthDate}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    patient.status === "Ativo" 
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {patient.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <PatientForm
                      patient={patient}
                      onSubmit={(data) => handleEditPatient(patient.id, data)}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePatient(patient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}