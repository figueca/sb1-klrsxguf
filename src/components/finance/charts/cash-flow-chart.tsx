import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/hooks/use-transactions";
import { TRANSACTION_TYPES } from "@/lib/constants";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

export function CashFlowChart() {
  const { transactions } = useTransactions({
    startDate: subDays(new Date(), 30).toISOString(),
    endDate: new Date().toISOString(),
  });

  const dailyData = transactions.reduce((acc, transaction) => {
    const day = format(new Date(transaction.date), "dd/MM", { locale: ptBR });
    const isIncome = transaction.type === TRANSACTION_TYPES.INCOME;
    
    if (!acc[day]) {
      acc[day] = {
        day,
        entrada: 0,
        saida: 0,
        saldo: 0
      };
    }

    if (isIncome) {
      acc[day].entrada += transaction.amount;
    } else {
      acc[day].saida += transaction.amount;
    }
    acc[day].saldo = acc[day].entrada - acc[day].saida;

    return acc;
  }, {});

  const data = Object.values(dailyData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa Diário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
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
              <ReferenceLine y={0} stroke="#666" />
              <Bar dataKey="entrada" name="Entradas" fill="#10b981" />
              <Bar dataKey="saida" name="Saídas" fill="#ef4444" />
              <Bar dataKey="saldo" name="Saldo" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}