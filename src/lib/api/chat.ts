import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as ChatMessage[];
}

export async function sendMessage(message: Omit<ChatMessage, 'id' | 'created_at' | 'read'>) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([message])
    .select()
    .single();

  if (error) throw error;
  return data as ChatMessage;
}

export async function markAsRead(messageId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .update({ read: true })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data as ChatMessage;
}