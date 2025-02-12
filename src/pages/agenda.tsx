import { DashboardHeader } from "@/components/dashboard/header";
import { CalendarView } from "@/components/calendar/calendar-view";

export function AgendaPage() {
  return (
    <>
      <DashboardHeader
        heading="Agenda"
        text="Gerencie suas consultas e horários"
      />
      <CalendarView />
    </>
  );
}