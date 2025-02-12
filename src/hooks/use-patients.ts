import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Patient, getPatients, createPatient, updatePatient, deletePatient } from '@/lib/api/patients';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar pacientes",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  async function addPatient(patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) {
    try {
      const newPatient = await createPatient(patientData);
      setPatients(prev => [newPatient, ...prev]);
      toast({
        title: "Paciente adicionado",
        description: "O paciente foi cadastrado com sucesso",
      });
      return newPatient;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar paciente",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function editPatient(id: string, patientData: Partial<Patient>) {
    try {
      const updatedPatient = await updatePatient(id, patientData);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      toast({
        title: "Paciente atualizado",
        description: "As informações foram atualizadas com sucesso",
      });
      return updatedPatient;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar paciente",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function removePatient(id: string) {
    try {
      await deletePatient(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Paciente removido",
        description: "O paciente foi removido com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover paciente",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  return {
    patients,
    loading,
    addPatient,
    editPatient,
    removePatient,
    reloadPatients: loadPatients,
  };
}