import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-picker";
import { TransactionForm } from "./transaction-form";
import { useTransactions } from "@/hooks/use-transactions";
import { TRANSACTION_TYPES, TRANSACTION_CATEGORIES } from "@/lib/constants";
import { Search, FileDown, Edit, Trash2, Plus, FileText } from "lucide-react";

export function TransactionList() {
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    category: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  });

  const { transactions, loading, removeTransaction } = useTransactions({
    type: filters.type || undefined,
    category: filters.category || undefined,
    startDate: filters.dateRange.from?.toISOString(),
    endDate: filters.dateRange.to?.toISOString(),
  });

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
    transaction.reference_number?.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleExport = () => {
    // Implementar exportação
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      await removeTransaction(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar transações..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 w-[300px]"
            />
          </div>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value={TRANSACTION_TYPES.INCOME}>Receita</SelectItem>
              <SelectItem value={TRANSACTION_TYPES.EXPENSE}>Despesa</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {filters.type === TRANSACTION_TYPES.INCOME
                ? TRANSACTION_CATEGORIES.INCOME.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                : TRANSACTION_CATEGORIES.EXPENSE.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
          <DateRangePicker
            dateRange={filters.dateRange}
            onDateRangeChange={(range) =>
              setFilters({ ...filters, dateRange: range })
            }
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <TransactionForm
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            }
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Referência</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhuma transação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.date), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{transaction.description}</span>
                      {transaction.patients && (
                        <span className="text-sm text-muted-foreground">
                          Paciente: {transaction.patients.full_name}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.reference_number}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === TRANSACTION_TYPES.INCOME
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {transaction.type === TRANSACTION_TYPES.INCOME ? "+" : "-"}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status === "completed"
                        ? "Concluído"
                        : transaction.status === "pending"
                        ? "Pendente"
                        : "Cancelado"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {transaction.attachments?.length > 0 && (
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                      <TransactionForm
                        transaction={transaction}
                        trigger={
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}