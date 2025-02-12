import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {isPositive ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {Math.abs(change)}% em relação ao mês anterior
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function MarketingPage() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  return (
    <>
      <DashboardHeader
        heading="Marketing"
        text="Acompanhe o desempenho das suas campanhas"
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Período da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Cliques Totais"
            value="12.458"
            change={12.5}
            icon={TrendingUp}
          />
          <MetricCard
            title="Novos Pacientes"
            value="284"
            change={8.2}
            icon={Users}
          />
          <MetricCard
            title="Taxa de Conversão"
            value="3.2%"
            change={-2.4}
            icon={Target}
          />
          <MetricCard
            title="Custo por Aquisição"
            value="R$ 42,50"
            change={-5.1}
            icon={DollarSign}
          />
        </div>
      </div>
    </>
  );
}