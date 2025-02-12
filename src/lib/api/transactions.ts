import { supabase } from '@/lib/supabase';
import { TRANSACTION_TYPES } from '@/lib/constants';

export interface Transaction {
  id: string;
  professional_id: string;
  type: keyof typeof TRANSACTION_TYPES;
  category: string;
  amount: number;
  date: string;
  description?: string;
  reference_number?: string;
  payment_method?: string;
  status: 'pending' | 'completed' | 'cancelled';
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    end_date?: string;
  };
  patient_id?: string;
  appointment_id?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: string;
    full_name: string;
  };
  appointment?: {
    id: string;
    date: string;
    time: string;
    type: string;
  };
  attachments?: {
    id: string;
    name: string;
    url: string;
  }[];
}

export interface TransactionSummary {
  total_income: number;
  total_expenses: number;
  net_income: number;
  pending_income: number;
  pending_expenses: number;
  income_by_category: Record<string, number>;
  expenses_by_category: Record<string, number>;
  monthly_comparison: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

export async function getTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  type?: keyof typeof TRANSACTION_TYPES;
  category?: string;
  status?: string;
  search?: string;
}) {
  let query = supabase
    .from('financial_transactions')
    .select(`
      *,
      patient:patients(id, full_name),
      appointment:appointments(id, date, time, type),
      attachments:transaction_attachments(id, name, url)
    `);

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte('date', filters.endDate);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.search) {
    query = query.or(`description.ilike.%${filters.search}%,reference_number.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('date', { ascending: false });

  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at' | 'professional_id'>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('financial_transactions')
    .insert([{ ...transaction, professional_id: userData.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getFinancialSummary(period: {
  startDate: string;
  endDate: string;
}) {
  const { data, error } = await supabase
    .rpc('get_financial_summary', {
      p_start_date: period.startDate,
      p_end_date: period.endDate
    });

  if (error) throw error;
  return data as TransactionSummary;
}

export async function uploadTransactionAttachment(
  transactionId: string,
  file: File
) {
  const fileName = `${transactionId}/${Date.now()}-${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('transaction-attachments')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: attachmentData, error: attachmentError } = await supabase
    .from('transaction_attachments')
    .insert([{
      transaction_id: transactionId,
      name: file.name,
      url: uploadData.path
    }])
    .select()
    .single();

  if (attachmentError) throw attachmentError;
  return attachmentData;
}

export async function deleteTransactionAttachment(attachmentId: string) {
  const { data: attachment, error: fetchError } = await supabase
    .from('transaction_attachments')
    .select('url')
    .eq('id', attachmentId)
    .single();

  if (fetchError) throw fetchError;

  const { error: storageError } = await supabase
    .storage
    .from('transaction-attachments')
    .remove([attachment.url]);

  if (storageError) throw storageError;

  const { error: deleteError } = await supabase
    .from('transaction_attachments')
    .delete()
    .eq('id', attachmentId);

  if (deleteError) throw deleteError;
}

export async function generateFinancialReport(options: {
  startDate: string;
  endDate: string;
  groupBy: 'day' | 'week' | 'month';
  includeDetails: boolean;
  categories?: string[];
  format: 'pdf' | 'excel';
}) {
  const { data, error } = await supabase
    .rpc('generate_financial_report', {
      p_start_date: options.startDate,
      p_end_date: options.endDate,
      p_group_by: options.groupBy,
      p_include_details: options.includeDetails,
      p_categories: options.categories,
      p_format: options.format
    });

  if (error) throw error;
  return data;
}