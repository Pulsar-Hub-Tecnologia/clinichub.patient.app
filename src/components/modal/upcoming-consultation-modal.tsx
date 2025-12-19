import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Video, MapPin, AlertTriangle, Check, LogIn } from "lucide-react";
import { Consultation } from "@/services/api/consultation.service";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UpcomingConsultationModalProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
}

export function UpcomingConsultationModal({
  consultation,
  isOpen,
  onClose,
  onJoin,
}: UpcomingConsultationModalProps) {
  if (!consultation) return null;

  const isOnline = consultation.consultation_type === "ONLINE";

  // Format date and time
  // Assuming scheduled_date is a Date object or string
  const date = new Date(consultation.scheduled_date);
  const formattedDate = format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
  const time = consultation.scheduled_time.substring(0, 5); // HH:MM

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#3b0764] flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-[#3b0764]">Consulta Próxima</DialogTitle>
              <p className="text-sm text-gray-500">Notificação de agendamento</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4 bg-gray-50/50">
          {/* Date and Time */}
          <Card className="p-4 border-none shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Data e Hora</p>
              <p className="font-semibold text-gray-900">
                {formattedDate} - {time}
              </p>
            </div>
          </Card>

          {/* Professional */}
          <Card className="p-4 border-none shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-[#3b0764] flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Profissional</p>
              <p className="font-semibold text-gray-900">{consultation.professional.name}</p>
              <p className="text-sm text-gray-500">{consultation.professional.especiality || "Especialista"}</p>
            </div>
          </Card>

          {/* Patient */}
          <Card className="p-4 border-none shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-teal-700 flex items-center justify-center flex-shrink-0">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paciente</p>
              <p className="font-semibold text-gray-900">{consultation.patient.name}</p>
              <p className="text-sm text-gray-500">Consulta de Rotina</p>
            </div>
          </Card>

          {/* Type */}
          <Card className="p-4 border-none shadow-sm flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              {isOnline ? (
                <Video className="h-5 w-5 text-white" />
              ) : (
                <MapPin className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Tipo de Consulta</p>
              <p className="font-semibold text-gray-900">
                {isOnline ? "Consulta Online" : "Consulta Presencial"}
              </p>
            </div>
          </Card>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 text-yellow-800">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              Lembrete: Sua consulta começará em breve
            </p>
          </div>
        </div>

        <div className="p-6 border-t bg-white flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 text-gray-600 border-gray-200 hover:bg-gray-50"
            onClick={onClose}
          >
            <Check className="mr-2 h-4 w-4" />
            Confirmar Recebimento
          </Button>
          <Button
            className="flex-1 h-12 bg-[#3b0764] hover:bg-[#2e054e]"
            onClick={onJoin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Entrar na Consulta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
