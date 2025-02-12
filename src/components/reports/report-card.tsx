import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportCardProps {
  title: string;
  description: string;
  lastGenerated?: string;
  onGenerate: () => void;
}

export function ReportCard({
  title,
  description,
  lastGenerated,
  onGenerate,
}: ReportCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {lastGenerated && (
            <p className="text-sm text-muted-foreground">
              Último relatório: {lastGenerated}
            </p>
          )}
          <Button onClick={onGenerate}>
            <Download className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}