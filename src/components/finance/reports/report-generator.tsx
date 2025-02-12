import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FileDown, FileText, Loader2 } from "lucide-react";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { useFinancialReport } from "@/hooks/use-financial-report";
import { useToast } from "@/components/ui/use-toast";

export function ReportGenerator() {
  const { toast } = useToast();
  const { loading, generateReport } = useFinancialReport();
  
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("month");
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [includeDetails, setIncludeDetails] = useState(true);

  const handleGenerateReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um período para o relatório",
      });
      return;
    }

    try {
      await generateReport({
        startDate: dateRange.from,
        endDate: dateRange.to,
        groupBy,
        categories: selectedCategories,
        includeDetails,
        format,
      });

      toast({
        title: "Sucesso",
        description: "Relatório gerado com sucesso",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao gerar relatório",
      });
    }
  };

  const handleReset = () => {
    setDateRange({ from: undefined, to: undefined });
    setGroupBy("month");
    setFormat("pdf");
    setSelectedCategories([]);
    setIncludeDetails(true);
  };

  const allCategories = [
    ...TRANSACTION_CATEGORIES.INCOME,
    ...TRANSACTION_CATEGORIES.EXPENSE
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Relatório Financeiro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Período</Label>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Agrupar por</Label>
            <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Dia</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mês</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={format} onValueChange={(value: any) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Categorias (opcional)</Label>
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            {allCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category)
                      );
                    }
                  }}
                />
                <Label htmlFor={category}>{category}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="details"
            checked={includeDetails}
            onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
          />
          <Label htmlFor="details">Incluir detalhes das transações</Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            Limpar
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={loading || !dateRange.from || !dateRange.to}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : format === "pdf" ? (
              <FileText className="mr-2 h-4 w-4" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Gerar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}