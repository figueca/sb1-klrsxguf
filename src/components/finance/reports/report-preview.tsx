import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTransactions } from "@/hooks/use-transactions";
import { TRANSACTION_TYPES } from "@/lib/constants";

interface ReportPreviewProps {
  startDate: Date;
  endDate: Date;
}

export function ReportPreview({ startDate, endDate }: ReportPreviewProps) {
  const { transactions } = useTransactions({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const totalIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const incomeByCategory = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Relatório Financeiro - {format(startDate, "dd/MM/yyyy")} a{" "}
          {format(endDate, "dd/MM/yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-50">
            <p className="text-sm text-green-600 font-medium">Receitas</p>
            <p className="text-2xl font-bold text-green-700">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalIncome)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-red-50">
            <p className="text-sm text-red-600 font-medium">Despesas</p>
            <p className="text-2xl font-bold text-red-700">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalExpenses)}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-600 font-medium">Lucro Líquido</p>
            <p className="text-2xl font-bold text-blue-700">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(netIncome)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Receitas por Categoria</h3>
            <div className="space-y-2">
              {Object.entries(incomeByCategory).map(([category, amount]) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>{category}</span>
                  <span className="font-medium text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
            <div className="space-y-2">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>{category}</span>
                  <span className="font-medium text-red-600">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Últimas Transações</h3>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.date), "dd/MM/yyyy")} -{" "}
                    {transaction.category}
                  </p>
                </div>
                <span
                  className={`font-medium ${
                    transaction.type === TRANSACTION_TYPES.INCOME
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === TRANSACTION_TYPES.INCOME ? "+" : "-"}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}