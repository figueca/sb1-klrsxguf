import { supabase } from '@/lib/supabase';
import { PATIENT_STATUS } from '@/lib/constants';

export interface Patient {
  id: string;
  professional_id: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  health_insurance?: string;
  insurance_number?: string;
  insurance_type?: string;
  insurance_expiration?: string;
  blood_type?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  medications?: string[];
  family_history?: string;
  occupation?: string;
  marital_status?: string;
  notes?: string;
  status: keyof typeof PATIENT_STATUS;
  last_visit?: string;
  next_appointment?: string;
  total_appointments?: number;
  created_at: string;
  updated_at: string;
  documents?: {
    id: string;
    type: string;
    name: string;
    url: string;
    created_at: string;
  }[];
}

export async function getPatients(filters?: {
  status?: string;
  search?: string;
  insurance?: string;
  lastVisitStart?: string;
  lastVisitEnd?: string;
}) {
  let query = supabase
    .from('patients')
    .select('*, appointments(count)');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }

  if (filters?.insurance) {
    query = query.eq('health_insurance', filters.insurance);
  }

  if (filters?.lastVisitStart) {
    query = query.gte('last_visit', filters.lastVisitStart);
  }

  if (filters?.lastVisitEnd) {
    query = query.lte('last_visit', filters.lastVisitEnd);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data as Patient[];
}

export async function getPatient(id: string) {
  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      appointments(
        id,
        date,
        time,
        type,
        status,
        notes
      ),
      medical_records(
        id,
        date,
        record_type,
        description,
        diagnosis,
        prescription
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Patient & {
    appointments: Array<{
      id: string;
      date: string;
      time: string;
      type: string;
      status: string;
      notes?: string;
    }>;
    medical_records: Array<{
      id: string;
      date: string;
      record_type: string;
      description: string;
      diagnosis?: string;
      prescription?: string;
    }>;
  };
}

export async function createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('patients')
    .insert([{ ...patient, professional_id: userData.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
}

export async function updatePatient(id: string, patient: Partial<Patient>) {
  const { data, error } = await supabase
    .from('patients')
    .update({ ...patient, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Patient;
}

export async function deletePatient(id: string) {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function uploadPatientDocument(
  patientId: string,
  file: File,
  type: string
) {
  const fileName = `${patientId}/${type}/${Date.now()}-${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('patient-documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: documentData, error: documentError } = await supabase
    .from('patient_documents')
    .insert([{
      patient_id: patientId,
      type,
      name: file.name,
      url: uploadData.path
    }])
    .select()
    .single();

  if (documentError) throw documentError;
  return documentData;
}

export async function getPatientDocuments(patientId: string) {
  const { data, error } = await supabase
    .from('patient_documents')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deletePatientDocument(documentId: string) {
  const { data: document, error: fetchError } = await supabase
    .from('patient_documents')
    .select('url')
    .eq('id', documentId)
    .single();

  if (fetchError) throw fetchError;

  const { error: storageError } = await supabase
    .storage
    .from('patient-documents')
    .remove([document.url]);

  if (storageError) throw storageError;

  const { error: deleteError } = await supabase
    .from('patient_documents')
    .delete()
    .eq('id', documentId);

  if (deleteError) throw deleteError;
}

export async function getPatientStatistics() {
  const { data, error } = await supabase
    .rpc('get_patient_statistics');

  if (error) throw error;
  return data as {
    total_patients: number;
    active_patients: number;
    new_patients_this_month: number;
    patients_by_insurance: Array<{
      insurance: string;
      count: number;
    }>;
    patients_by_status: Array<{
      status: string;
      count: number;
    }>;
    appointments_per_patient: number;
    average_session_duration: number;
  };
}