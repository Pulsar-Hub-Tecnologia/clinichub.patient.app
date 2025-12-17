import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ConsultationFiltersProps {
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}

export default function ConsultationFilters({ onFilterChange, onClearFilters }: ConsultationFiltersProps) {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [modality, setModality] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleStatusChange = (value: string) => {
    const newStatus = value === "all" ? undefined : value;
    setStatus(newStatus);
    onFilterChange({ status: newStatus, type, modality, dateFrom, dateTo });
  };

  const handleTypeChange = (value: string) => {
    const newType = value === "all" ? undefined : value;
    setType(newType);
    onFilterChange({ status, type: newType, modality, dateFrom, dateTo });
  };

  const handleModalityChange = (value: string) => {
    const newModality = value === "all" ? undefined : value;
    setModality(newModality);
    onFilterChange({ status, type, modality: newModality, dateFrom, dateTo });
  };

  const handleClearAll = () => {
    setStatus(undefined);
    setType(undefined);
    setModality(undefined);
    setDateFrom(undefined);
    setDateTo(undefined);
    onClearFilters();
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        <Button variant="link" size="sm" onClick={handleClearAll} className="text-purple-600">
          Limpar filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Status</label>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="PENDING">Aguardando</SelectItem>
              <SelectItem value="COMPLETED">Finalizada</SelectItem>
              <SelectItem value="CANCELED">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tipo</label>
          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
              <SelectItem value="PRESENCIAL">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Modalidade</label>
          <Select value={modality || "all"} onValueChange={handleModalityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="INDIVIDUAL">Individual</SelectItem>
              <SelectItem value="GRUPO">Grupo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Período</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? (
                  format(dateFrom, "dd/MM/yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
