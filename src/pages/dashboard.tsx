import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardMetrics } from "@/components/dashboard/metrics";
import { AppointmentsOverview } from "@/components/dashboard/appointments-overview";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentPatients } from "@/components/dashboard/recent-patients";

export function DashboardPage() {
  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text="Visão geral da clínica"
      />
      <div className="grid gap-4 md:gap-8">
        <DashboardMetrics />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <AppointmentsOverview className="col-span-4" />
          <RevenueChart className="col-span-3" />
        </div>
        <RecentPatients />
      </div>
    </>
  );
}