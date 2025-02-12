import { Transaction } from "@/lib/api/transactions";
import { TRANSACTION_TYPES } from "@/lib/constants";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface FinancialReportData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    pendingIncome: number;
    pendingExpenses: number;
  };
  categories: {
    income: Record<string, number>;
    expenses: Record<string, number>;
  };
  monthly: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  transactions: Transaction[];
}

export function generateReportData(transactions: Transaction[]): FinancialReportData {
  const completedTransactions = transactions.filter(t => t.status === 'completed');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');

  const totalIncome = completedTransactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = completedTransactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingIncome = pendingTransactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingExpenses = pendingTransactions
    .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const categoriesData = transactions.reduce(
    (acc, transaction) => {
      const categoryType = transaction.type === TRANSACTION_TYPES.INCOME ? 'income' : 'expenses';
      acc[categoryType][transaction.category] = (acc[categoryType][transaction.category] || 0) + transaction.amount;
      return acc;
    },
    { income: {}, expenses: {} } as FinancialReportData['categories']
  );

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = format(new Date(transaction.date), "MMM yyyy", { locale: ptBR });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0, net: 0 };
    }
    
    if (transaction.type === TRANSACTION_TYPES.INCOME) {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += transaction.amount;
    }
    acc[month].net = acc[month].income - acc[month].expenses;
    
    return acc;
  }, {} as Record<string, FinancialReportData['monthly'][0]>);

  return {
    summary: {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      pendingIncome,
      pendingExpenses,
    },
    categories: categoriesData,
    monthly: Object.values(monthlyData),
    transactions,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
  }).format(value);
}