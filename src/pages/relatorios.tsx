import { DashboardHeader } from "@/components/dashboard/header";
import { ReportCard } from "@/components/reports/report-card";

const reports = [
  {
    title: "Relatório Financeiro",
    description: "Análise detalhada de receitas, despesas e lucros",
    lastGenerated: "15/03/2024 às 14:30"
  },
  {
    title: "Relatório de Pacientes",
    description: "Estatísticas e análises dos pacientes atendidos",
    lastGenerated: "14/03/2024 às 18:15"
  },
  {
    title: "Relatório de Consultas",
    description: "Métricas de atendimentos e consultas realizadas",
    lastGenerated: "13/03/2024 às 09:45"
  },
  {
    title: "Relatório de Marketing",
    description: "Análise de campanhas e resultados de marketing",
    lastGenerated: "12/03/2024 às 16:20"
  }
];

export function RelatoriosPage() {
  return (
    <>
      <DashboardHeader
        heading="Relatórios"
        text="Visualize relatórios e análises"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <ReportCard
            key={report.title}
            title={report.title}
            description={report.description}
            lastGenerated={report.lastGenerated}
            onGenerate={() => console.log(`Gerando ${report.title}...`)}
          />
        ))}
      </div>
    </>
  );
}