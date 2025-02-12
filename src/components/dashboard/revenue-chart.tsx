import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lazy, Suspense } from "react";

const data = [
  { month: "Jan", revenue: 35000 },
  { month: "Fev", revenue: 42000 },
  { month: "Mar", revenue: 38000 },
  { month: "Abr", revenue: 45000 },
  { month: "Mai", revenue: 43000 },
  { month: "Jun", revenue: 48000 }
];

interface RevenueChartProps {
  className?: string;
}

const Chart = lazy(() => import("../revenue-chart-component"));

export function RevenueChart({ className }: RevenueChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Suspense fallback={
            <div className="h-[300px] flex items-center justify-center">
              Carregando gráfico...
            </div>
          }>
            <Chart data={data} />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  );
}