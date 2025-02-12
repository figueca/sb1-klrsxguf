import { supabase } from '@/lib/supabase';

export interface Appointment {
  id: string;
  patient_id: string;
  professional_id: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  online: boolean;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

export async function getAppointments(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) {
  let query = supabase
    .from('appointments')
    .select('*, patients(full_name)');

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('date', filters.endDate);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('date', { ascending: true });

  if (error) throw error;
  return data as (Appointment & { patients: { full_name: string } })[];
}

export async function getPatientAppointments(patientId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patientId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

export async function createAppointment(appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('appointments')
    .insert([{ ...appointment, professional_id: userData.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function updateAppointment(id: string, appointment: Partial<Appointment>) {
  const { data, error } = await supabase
    .from('appointments')
    .update(appointment)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

export async function cancelAppointment(id: string) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}