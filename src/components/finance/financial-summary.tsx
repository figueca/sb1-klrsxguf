import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { TRANSACTION_TYPES } from "@/lib/constants";

interface FinancialMetric {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  description: string;
}

export function FinancialSummary() {
  const { transactions } = useTransactions();

  const totalIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const pendingIncome = transactions
    .filter((t) => t.type === TRANSACTION_TYPES.INCOME && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const metrics: FinancialMetric[] = [
    {
      title: "Receita Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalIncome),
      change: 12.5,
      icon: DollarSign,
      description: "Total de receitas no período"
    },
    {
      title: "Despesas",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalExpenses),
      change: -2.3,
      icon: Wallet,
      description: "Total de despesas no período"
    },
    {
      title: "Lucro Líquido",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(netIncome),
      change: 8.4,
      icon: TrendingUp,
      description: "Lucro líquido no período"
    },
    {
      title: "Receitas Pendentes",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(pendingIncome),
      change: 4.2,
      icon: TrendingDown,
      description: "Total de receitas pendentes"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPositive = metric.change >= 0;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {isPositive ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span className={isPositive ? "text-green-500" : "text-red-500"}>
                  {Math.abs(metric.change)}%
                </span>
                <span className="ml-1">em relação ao mês anterior</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}