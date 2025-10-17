import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { PatientFilterState } from "@/services/api/workspace.service"

interface AdvancedFilterPopoverProps {
  filters: PatientFilterState
  onFiltersChange: (filters: PatientFilterState) => void
  onClearFilters: () => void
}

export default function PatientFilterPopover({ filters, onFiltersChange, onClearFilters }: AdvancedFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<PatientFilterState>(filters)

  const statusOptions = [
    { value: "Ativo", label: "Ativo" },
    { value: "Convite Pendente", label: "Convite Pendente" },
    { value: "Convite Expirado", label: "Convite Expirado" },
  ]

  const sortOptions = [
    { value: "email-asc", label: "Email (A-Z)" },
    { value: "email-desc", label: "Email (Z-A)" },
  ]

  const handleStatusChange = (statusValue: string, checked: boolean) => {
    const newStatus = checked
      ? [...localFilters.status, statusValue]
      : localFilters.status.filter((s) => s !== statusValue)

    setLocalFilters({ ...localFilters, status: newStatus })
  }

  const handleDateChange = (field: keyof PatientFilterState, date: Date | undefined) => {
    setLocalFilters({ ...localFilters, [field]: date })
  }

  const handleSortChange = (value: string) => {
    console.log(value)
    setLocalFilters({ ...localFilters, sortBy: value })
  }

  const handleConsultationFilterTypeChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      consultationFilterType: value as "without" | "byDate" | "",
      lastConsultationFrom: value === "without" ? undefined : localFilters.lastConsultationFrom,
      lastConsultationTo: value === "without" ? undefined : localFilters.lastConsultationTo,
    })
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }

  const clearAllFilters = () => {
    const emptyFilters: PatientFilterState = {
      status: [],
      inviteDateFrom: undefined,
      inviteDateTo: undefined,
      lastConsultationFrom: undefined,
      lastConsultationTo: undefined,
      consultationFilterType: "",
      sortBy: "",
    }
    setLocalFilters(emptyFilters)
    onClearFilters()
    setIsOpen(false)
  }

  const hasActiveFilters = useMemo(() => {
    return filters.status.length > 0 ||
      filters.inviteDateFrom ||
      filters.inviteDateTo ||
      filters.lastConsultationFrom ||
      filters.lastConsultationTo ||
      filters.consultationFilterType ||
      filters.sortBy
  }, [filters])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2 bg-transparent",
            hasActiveFilters && "border-purple-500 text-purple-700",
          )}
        >
          <Filter className="h-4 w-4" />
          {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-purple-500" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Filtros Avançados</h4>
            {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-600 hover:text-red-700">
              <X className="h-4 w-4" />
              Limpar Tudo
            </Button>}
          </div>

          <div className="space-y-1 border-t pt-2">
            <Label className="text-sm font-medium">Ordenar por:</Label>
            <Select value={localFilters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar ordenação" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1 border-t pt-2">
            <Label className="text-sm font-medium">Status:</Label>
            <div className="space-y-1">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={localFilters.status.includes(option.value)}
                    onCheckedChange={(checked) => handleStatusChange(option.value, checked as boolean)}
                  />
                  <Label htmlFor={option.value} className="text-sm mt-1">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Date Filter */}
          <div className="border-t pt-2">
            <Label className="text-sm font-medium">Data do Convite:</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-500">De</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localFilters.inviteDateFrom && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />

                      <span className="mt-1">
                        {localFilters.inviteDateFrom
                          ? format(localFilters.inviteDateFrom, "dd/MM/yyyy", { locale: ptBR })
                          : "Selecionar"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(localFilters.inviteDateFrom || "")}
                      onSelect={(date) => handleDateChange("inviteDateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Até</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !localFilters.inviteDateTo && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span className="mt-1">
                        {localFilters.inviteDateTo
                          ? format(localFilters.inviteDateTo, "dd/MM/yyyy", { locale: ptBR })
                          : "Selecionar"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(localFilters.inviteDateTo || "")}
                      onSelect={(date) => handleDateChange("inviteDateTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t pt-2">
            <Label className="text-sm font-medium">Última Consulta:</Label>
            <RadioGroup
              value={localFilters.consultationFilterType}
              onValueChange={handleConsultationFilterTypeChange}
              className=""
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="without" id="without" />
                <Label htmlFor="without" className="text-sm mt-1">
                  Pacientes sem Consulta
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="byDate" id="byDate" />
                <Label htmlFor="byDate" className="ext-sm mt-1">
                  Por Data
                </Label>
              </div>
            </RadioGroup>

            {localFilters.consultationFilterType === "byDate" && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <Label className="text-xs text-gray-500">De</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.lastConsultationFrom && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="mt-1">
                          {localFilters.lastConsultationFrom
                            ? format(localFilters.lastConsultationFrom, "dd/MM/yyyy", { locale: ptBR })
                            : "Selecionar"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(localFilters.lastConsultationFrom || "")}
                        onSelect={(date) => handleDateChange("lastConsultationFrom", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Até</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !localFilters.lastConsultationTo && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                        <span className="mt-1">
                          {localFilters.lastConsultationTo
                            ? format(localFilters.lastConsultationTo, "dd/MM/yyyy", { locale: ptBR })
                            : "Selecionar"}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(localFilters.lastConsultationTo || "")}
                        onSelect={(date) => handleDateChange("lastConsultationTo", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t">
            <Button onClick={applyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
