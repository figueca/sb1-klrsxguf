import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/use-transactions";
import { TRANSACTION_TYPES } from "@/lib/constants";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export function RevenueChart() {
  const { transactions } = useTransactions({
    startDate: subMonths(new Date(), 6).toISOString(),
    endDate: new Date().toISOString(),
  });

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = format(new Date(transaction.date), "MMM yyyy", { locale: ptBR });
    const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
    const isExpense = transaction.type === TRANSACTION_TYPES.EXPENSE;
    
    if (!acc[month]) {
      acc[month] = {
        month,
        receita: 0,
        despesa: 0,
        lucro: 0
      };
    }

    if (isIncome) {
      acc[month].receita += transaction.amount;
    }
    if (isExpense) {
      acc[month].despesa += transaction.amount;
    }
    acc[month].lucro = acc[month].receita - acc[month].despesa;

    return acc;
  }, {});

  const data = Object.values(monthlyData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    notation: "compact",
                  }).format(value)
                }
              />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value)
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="receita"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Receita"
              />
              <Line
                type="monotone"
                dataKey="despesa"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Despesa"
              />
              <Line
                type="monotone"
                dataKey="lucro"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Lucro"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}