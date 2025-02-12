import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Transaction,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '@/lib/api/transactions';

export function useTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  type?: string;
  category?: string;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, [filters?.startDate, filters?.endDate, filters?.type, filters?.category]);

  async function loadTransactions() {
    try {
      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar transações",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(transactionData: Omit<Transaction, 'id' | 'created_at' | 'professional_id'>) {
    try {
      const newTransaction = await createTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      toast({
        title: "Transação adicionada",
        description: "A transação foi registrada com sucesso",
      });
      return newTransaction;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar transação",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function editTransaction(id: string, transactionData: Partial<Transaction>) {
    try {
      const updatedTransaction = await updateTransaction(id, transactionData);
      setTransactions(prev =>
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      toast({
        title: "Transação atualizada",
        description: "As alterações foram salvas com sucesso",
      });
      return updatedTransaction;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar transação",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function removeTransaction(id: string) {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover transação",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  return {
    transactions,
    loading,
    addTransaction,
    editTransaction,
    removeTransaction,
    reloadTransactions: loadTransactions,
  };
}