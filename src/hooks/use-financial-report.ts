import { useState, useCallback } from 'react';
import { useTransactions } from './use-transactions';
import { generateReportData, FinancialReportData } from '@/lib/utils/financial-report';

interface ReportOptions {
  startDate: Date;
  endDate: Date;
  groupBy: 'day' | 'week' | 'month';
  categories?: string[];
  includeDetails?: boolean;
  format: 'pdf' | 'excel';
}

export function useFinancialReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<FinancialReportData | null>(null);
  const { transactions } = useTransactions();

  const generateReport = useCallback(async (options: ReportOptions) => {
    setLoading(true);
    setError(null);

    try {
      const filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const inDateRange = transactionDate >= options.startDate && transactionDate <= options.endDate;
        const inCategories = !options.categories?.length || options.categories.includes(transaction.category);
        return inDateRange && inCategories;
      });

      const data = generateReportData(filteredTransactions);
      setReportData(data);

      // Em produção, aqui faria a chamada para gerar o arquivo do relatório
      console.log('Relatório gerado com sucesso:', {
        data,
        options
      });

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [transactions]);

  return {
    loading,
    error,
    reportData,
    generateReport,
  };
}