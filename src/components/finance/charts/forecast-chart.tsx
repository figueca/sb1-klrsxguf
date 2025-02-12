import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/use-transactions";
import { TRANSACTION_TYPES } from "@/lib/constants";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

function calculateForecast(historicalData: any[]) {
  // Implementação simples de previsão linear
  const forecastMonths = 3;
  const lastValue = historicalData[historicalData.length - 1].value;
  const growth = historicalData.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return acc;
    return acc + (curr.value - arr[idx - 1].value);
  }, 0) / (historicalData.length - 1);

  const forecast = [];
  for (let i = 1; i <= forecastMonths; i++) {
    const date = addMonths(new Date(), i);
    forecast.push({
      month: format(date, "MMM yyyy", { locale: ptBR }),
      value: lastValue + growth * i,
      type: "forecast"
    });
  }

  return forecast;
}

export function ForecastChart() {
  const { transactions } = useTransactions();

  const monthlyData = transactions
    .filter(t => t.type === TRANSACTION_TYPES.INCOME)
    .reduce((acc, transaction) => {
      const month = format(new Date(transaction.date), "MMM yyyy", { locale: ptBR });
      
      if (!acc[month]) {
        acc[month] = {
          month,
          value: 0,
          type: "historical"
        };
      }

      acc[month].value += transaction.amount;
      return acc;
    }, {});

  const historicalData = Object.values(monthlyData);
  const forecastData = calculateForecast(historicalData);
  const data = [...historicalData, ...forecastData];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão de Receitas</CardTitle>
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
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Receita"
                strokeDasharray={(d: any) => d.type === "forecast" ? "5 5" : "0"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}