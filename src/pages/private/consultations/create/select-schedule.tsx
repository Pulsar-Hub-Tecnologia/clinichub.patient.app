import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Video, Building } from "lucide-react";
import { format, addDays, isSameDay, addMonths, getMonth, getYear, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useConsultation } from "@/context/consultation-context";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const timeSlots = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "16:00", available: true },
];

interface SelectScheduleProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function SelectSchedule({ onNext, onBack }: SelectScheduleProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MMMM yyyy", { locale: ptBR }));
  const [consultationType, setConsultationType] = useState<"PRESENCIAL" | "ONLINE">("PRESENCIAL");
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [availableMonths, setAvailableMonths] = useState<{ value: string; label: string }[]>([]);

  const {
    isProfessionalSelected,
    isWorkspaceSelected,
    setSchedule,
    setConsultationType: setConsultationTypeContext,
    consultationData,
    clearConsultation,
  } = useConsultation();

  useEffect(() => {
    if (!isWorkspaceSelected || !isProfessionalSelected) {
      toast.error("Complete as etapas anteriores primeiro.");
      onBack ? onBack() : navigate("/consultations/create/select-professional");
    }
  }, [isWorkspaceSelected, isProfessionalSelected, onBack, navigate]);

  useEffect(() => {
    const days = Array.from({ length: 4 }, (_, i) => addDays(new Date(), i));
    setWeekDays(days);

    const months = Array.from({ length: 6 }, (_, i) => {
      const monthDate = addMonths(new Date(), i);
      return {
        value: format(monthDate, "MMMM yyyy", { locale: ptBR }),
        label: format(monthDate, "MMMM 'de' yyyy", { locale: ptBR }),
      };
    });
    setAvailableMonths(months);
  }, []);

  useEffect(() => {
    return () => {
      const isBookingRoute = window.location.pathname.startsWith("/consultations/create");
      if (!isBookingRoute) {
        clearConsultation();
      }
    };
  }, [clearConsultation]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const getSelectedMonthInfo = () => {
    try {
      const selectedMonthDate = parse(selectedMonth, "MMMM yyyy", new Date(), { locale: ptBR });
      if (isNaN(selectedMonthDate.getTime())) {
        throw new Error("Invalid date");
      }
      return {
        monthIndex: getMonth(selectedMonthDate),
        yearNum: getYear(selectedMonthDate),
        date: selectedMonthDate,
      };
    } catch (error) {
      const currentDate = new Date();
      return {
        monthIndex: getMonth(currentDate),
        yearNum: getYear(currentDate),
        date: currentDate,
      };
    }
  };

  const handleMonthChange = (monthValue: string) => {
    setSelectedMonth(monthValue);

    try {
      const selectedMonthDate = parse(monthValue, "MMMM yyyy", new Date(), { locale: ptBR });
      if (isNaN(selectedMonthDate.getTime())) {
        throw new Error("Invalid date");
      }

      const firstDayOfMonth = new Date(getYear(selectedMonthDate), getMonth(selectedMonthDate), 1);
      const days = Array.from({ length: 4 }, (_, i) => addDays(firstDayOfMonth, i));
      setWeekDays(days);
    } catch (error) {
      const days = Array.from({ length: 4 }, (_, i) => addDays(new Date(), i));
      setWeekDays(days);
    }

    setSelectedDate(null);
  };

  const handlePreviousWeek = () => {
    const newDays = weekDays.map((day) => addDays(day, -4));
    const { monthIndex, yearNum } = getSelectedMonthInfo();
    const hasDateInMonth = newDays.some(
      (day) => getMonth(day) === monthIndex && getYear(day) === yearNum
    );

    if (hasDateInMonth) {
      setWeekDays(newDays);
    }
  };

  const handleNextWeek = () => {
    const newDays = weekDays.map((day) => addDays(day, 4));
    const { monthIndex, yearNum } = getSelectedMonthInfo();
    const hasDateInMonth = newDays.some(
      (day) => getMonth(day) === monthIndex && getYear(day) === yearNum
    );

    if (hasDateInMonth) {
      setWeekDays(newDays);
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime && consultationType) {
      setSchedule(selectedDate, selectedTime, 50);
      setConsultationTypeContext(consultationType);
      onNext ? onNext() : navigate("/consultations/create/confirm-consultation");
    } else {
      toast.error("Por favor, selecione data, horário e modalidade.");
    }
  };


  const selectedProfessional = consultationData.professional;

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
        <p className="text-gray-600 mt-2">
          Etapa 3 de 4: Selecione data, horário e modalidade da consulta
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
              ✓
            </div>
            <span>Clínica</span>
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
              ✓
            </div>
            <span>Profissional</span>
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
              3
            </div>
            <span className="font-medium text-primary">Horário</span>
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
              4
            </div>
            <span>Confirmar</span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-sm font-medium text-gray-600 mb-3">Profissional Selecionado</h2>
        {selectedProfessional && (
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={selectedProfessional.picture || undefined} />
              <AvatarFallback className="rounded-lg border bg-primary/10 text-primary">
                {getInitials(selectedProfessional.name || selectedProfessional.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">{selectedProfessional.name}</h3>
              <p className="text-sm text-gray-600">{selectedProfessional.especiality}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-900">Selecione a data</h2>
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handlePreviousWeek} className="flex-shrink-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2 flex-1 justify-center">
            {weekDays.map((day, index) => {
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const { monthIndex, yearNum } = getSelectedMonthInfo();
              const isInSelectedMonth = getMonth(day) === monthIndex && getYear(day) === yearNum;

              return (
                <button
                  key={index}
                  onClick={() => isInSelectedMonth && handleDateSelect(day)}
                  disabled={!isInSelectedMonth}
                  className={`flex flex-col items-center justify-center px-6 py-3 rounded-lg border-2 transition-all min-w-[100px] ${
                    !isInSelectedMonth
                      ? "bg-gray-50 border-gray-100 cursor-not-allowed opacity-40"
                      : isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-gray-200 hover:border-primary"
                  }`}
                >
                  <span className={`text-xs font-medium uppercase ${!isInSelectedMonth ? "text-gray-400" : isSelected ? "text-white" : "text-gray-600"}`}>
                    {format(day, "EEE", { locale: ptBR })}
                  </span>
                  <span className={`text-2xl font-bold ${!isInSelectedMonth ? "text-gray-400" : isSelected ? "text-white" : "text-gray-900"}`}>
                    {format(day, "dd")}
                  </span>
                  <span className={`text-xs ${!isInSelectedMonth ? "text-gray-400" : isSelected ? "text-white" : "text-gray-600"}`}>
                    {format(day, "MMM", { locale: ptBR })}
                  </span>
                </button>
              );
            })}
          </div>

          <Button variant="ghost" size="icon" onClick={handleNextWeek} className="flex-shrink-0">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Horários disponíveis:</h2>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            return (
              <Button
                key={slot.time}
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                disabled={!slot.available}
                variant={isSelected ? "default" : "outline"}
                className={`h-12 text-base ${
                  isSelected
                    ? "bg-primary hover:bg-primary/90"
                    : slot.available
                      ? "border-gray-300 hover:border-primary"
                      : "bg-gray-100 cursor-not-allowed"
                }`}
              >
                {slot.time}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Modalidade da consulta:</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => setConsultationType("PRESENCIAL")}
            variant={consultationType === "PRESENCIAL" ? "default" : "outline"}
            className={`h-12 text-base ${
              consultationType === "PRESENCIAL"
                ? "bg-primary hover:bg-primary/90"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <Building className="w-4 h-4 mr-2" />
            Presencial
          </Button>
          <Button
            onClick={() => setConsultationType("ONLINE")}
            variant={consultationType === "ONLINE" ? "default" : "outline"}
            className={`h-12 text-base ${
              consultationType === "ONLINE"
                ? "bg-primary hover:bg-primary/90"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <Video className="w-4 h-4 mr-2" />
            Online
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={() => onBack ? onBack() : navigate("/consultations/create/select-professional")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime || !consultationType}
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
