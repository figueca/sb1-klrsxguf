import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Report,
  getReports,
  generateReport,
  getReport
} from '@/lib/api/reports';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar relatórios",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  async function generate(type: string, parameters: any) {
    try {
      const newReport = await generateReport(type, parameters);
      setReports(prev => [newReport, ...prev]);
      toast({
        title: "Relatório solicitado",
        description: "O relatório está sendo gerado",
      });
      return newReport;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar relatório",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
      throw error;
    }
  }

  async function checkStatus(id: string) {
    try {
      const report = await getReport(id);
      setReports(prev =>
        prev.map(r => r.id === id ? report : r)
      );
      return report;
    } catch (error) {
      console.error('Erro ao verificar status do relatório:', error);
      throw error;
    }
  }

  return {
    reports,
    loading,
    generate,
    checkStatus,
    reloadReports: loadReports,
  };
}