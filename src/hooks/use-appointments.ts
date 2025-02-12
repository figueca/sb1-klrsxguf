import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Appointment,
  getAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment
} from '@/lib/api/appointments';

export function useAppointments(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  const [appointments, setAppointments] = useState<(Appointment & { patients: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, [filters?.startDate, filters?.endDate, filters?.status]);

  async function loadAppointments() {
    try {
      const data = await getAppointments(filters);
      setAppointments(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar consultas",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  async function addAppointment(appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) {
    try {
      const newAppointment = await createAppointment(appointmentData);
      await loadAppointments(); // Recarrega para obter os dados do paciente
      toast({
        title: "Consulta agendada",
        description: "A consulta foi agendada com sucesso",
      });
      return newAppointment;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao agendar consulta",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function editAppointment(id: string, appointmentData: Partial<Appointment>) {
    try {
      const updatedAppointment = await updateAppointment(id, appointmentData);
      await loadAppointments(); // Recarrega para obter os dados atualizados
      toast({
        title: "Consulta atualizada",
        description: "As informações foram atualizadas com sucesso",
      });
      return updatedAppointment;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar consulta",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function cancelAppointmentById(id: string) {
    try {
      await cancelAppointment(id);
      await loadAppointments(); // Recarrega para obter os dados atualizados
      toast({
        title: "Consulta cancelada",
        description: "A consulta foi cancelada com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar consulta",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  return {
    appointments,
    loading,
    addAppointment,
    editAppointment,
    cancelAppointment: cancelAppointmentById,
    reloadAppointments: loadAppointments,
  };
}