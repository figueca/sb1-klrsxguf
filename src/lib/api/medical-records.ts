import { supabase } from '@/lib/supabase';
import { RECORD_TYPES } from '@/lib/constants';

export interface MedicalRecord {
  id: string;
  patient_id: string;
  professional_id: string;
  date: string;
  record_type: keyof typeof RECORD_TYPES;
  description: string;
  diagnosis?: string;
  prescription?: string;
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  vital_signs?: {
    blood_pressure?: string;
    heart_rate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  symptoms?: string[];
  treatment_plan?: string;
  follow_up_date?: string;
  lab_results?: {
    test_name: string;
    result: string;
    reference_range?: string;
    date: string;
  }[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export async function getMedicalRecords(patientId: string, filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
}) {
  let query = supabase
    .from('medical_records')
    .select('*, attachments(*)')
    .eq('patient_id', patientId);

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('date', filters.endDate);
  }
  if (filters?.type) {
    query = query.eq('record_type', filters.type);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;
  return data as MedicalRecord[];
}

export async function createMedicalRecord(record: Omit<MedicalRecord, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('medical_records')
    .insert([{ ...record, professional_id: userData.user.id }])
    .select('*, attachments(*)')
    .single();

  if (error) throw error;
  return data as MedicalRecord;
}

export async function updateMedicalRecord(id: string, record: Partial<MedicalRecord>) {
  const { data, error } = await supabase
    .from('medical_records')
    .update({ ...record, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, attachments(*)')
    .single();

  if (error) throw error;
  return data as MedicalRecord;
}

export async function uploadMedicalRecordAttachment(
  recordId: string,
  file: File
) {
  const fileName = `${recordId}/${Date.now()}-${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('medical-record-attachments')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: attachmentData, error: attachmentError } = await supabase
    .from('medical_record_attachments')
    .insert([{
      medical_record_id: recordId,
      name: file.name,
      type: file.type,
      url: uploadData.path
    }])
    .select()
    .single();

  if (attachmentError) throw attachmentError;
  return attachmentData;
}

export async function deleteMedicalRecordAttachment(attachmentId: string) {
  const { data: attachment, error: fetchError } = await supabase
    .from('medical_record_attachments')
    .select('url')
    .eq('id', attachmentId)
    .single();

  if (fetchError) throw fetchError;

  const { error: storageError } = await supabase
    .storage
    .from('medical-record-attachments')
    .remove([attachment.url]);

  if (storageError) throw storageError;

  const { error: deleteError } = await supabase
    .from('medical_record_attachments')
    .delete()
    .eq('id', attachmentId);

  if (deleteError) throw deleteError;
}

export async function generateMedicalReport(patientId: string, options: {
  startDate?: string;
  endDate?: string;
  includeAttachments?: boolean;
  includeLabResults?: boolean;
  includeMedications?: boolean;
}) {
  const { data, error } = await supabase
    .rpc('generate_medical_report', {
      p_patient_id: patientId,
      p_start_date: options.startDate,
      p_end_date: options.endDate,
      p_include_attachments: options.includeAttachments,
      p_include_lab_results: options.includeLabResults,
      p_include_medications: options.includeMedications
    });

  if (error) throw error;
  return data;
}