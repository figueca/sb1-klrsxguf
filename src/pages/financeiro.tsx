import { DashboardHeader } from "@/components/dashboard/header";
import { FinancialSummary } from "@/components/finance/financial-summary";
import { TransactionList } from "@/components/finance/transaction-list";
import { RevenueChart } from "@/components/finance/charts/revenue-chart";
import { CategoryChart } from "@/components/finance/charts/category-chart";
import { CashFlowChart } from "@/components/finance/charts/cash-flow-chart";
import { ForecastChart } from "@/components/finance/charts/forecast-chart";
import { ReportGenerator } from "@/components/finance/reports/report-generator";
import { ReportPreview } from "@/components/finance/reports/report-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subDays } from "date-fns";

export function FinanceiroPage() {
  return (
    <>
      <DashboardHeader
        heading="Financeiro"
        text="Gerencie suas finanças"
      />

      <div className="space-y-8">
        <FinancialSummary />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="forecast">Previsões</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RevenueChart />
              <CategoryChart />
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList />
          </TabsContent>

          <TabsContent value="cashflow">
            <CashFlowChart />
          </TabsContent>

          <TabsContent value="forecast">
            <ForecastChart />
          </TabsContent>

          <TabsContent value="reports" className="space-y-8">
            <ReportGenerator />
            <ReportPreview
              startDate={subDays(new Date(), 30)}
              endDate={new Date()}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}