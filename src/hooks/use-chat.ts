import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  ChatMessage,
  getMessages,
  sendMessage,
  markAsRead
} from '@/lib/api/chat';

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  async function loadMessages() {
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar mensagens",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  async function send(content: string, receiverId: string) {
    try {
      const newMessage = await sendMessage({
        conversation_id: conversationId,
        receiver_id: receiverId,
        content
      });
      setMessages(prev => [...prev, newMessage]);
      return newMessage;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function markMessageAsRead(messageId: string) {
    try {
      const updatedMessage = await markAsRead(messageId);
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? updatedMessage : msg)
      );
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error);
    }
  }

  return {
    messages,
    loading,
    send,
    markAsRead: markMessageAsRead,
    reloadMessages: loadMessages,
  };
}