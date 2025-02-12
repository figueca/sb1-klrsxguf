import { supabase } from '@/lib/supabase';

export interface Report {
  id: string;
  professional_id: string;
  type: string;
  parameters: any;
  result: any;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export async function getReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Report[];
}

export async function generateReport(type: string, parameters: any) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('reports')
    .insert([{
      professional_id: userData.user.id,
      type,
      parameters,
      status: 'pending'
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Report;
}

export async function getReport(id: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Report;
}