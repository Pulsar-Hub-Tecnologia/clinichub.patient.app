import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getInitials } from "@/utils/formats";
import type { Consultation } from "@/services/api/consultation.service";

interface ConsultationCardProps {
  consultation: Consultation;
  onJoinVideoCall?: (consultationId: string) => void;
}

export default function ConsultationCard({ consultation, onJoinVideoCall }: ConsultationCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800 border-green-200"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>Confirmado</Badge>;
      case "PENDING":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200"><span className="w-2 h-2 bg-orange-500 rounded-full mr-1.5"></span>Aguarda</Badge>;
      case "CANCELED":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Cancelado</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Finalizada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    if (type === "ONLINE") {
      return <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50"><Video className="w-3 h-3 mr-1" />Online</Badge>;
    }
    return <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50"><MapPin className="w-3 h-3 mr-1" />Presencial</Badge>;
  };

  const canJoinVideoCall = consultation.consultation_type === "ONLINE" &&
                          consultation.status !== "CANCELED" &&
                          consultation.status !== "COMPLETED";

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 rounded-lg flex-shrink-0">
          <AvatarImage src={consultation.professional.picture} />
          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
            {getInitials(consultation.professional.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{consultation.professional.name}</h3>
              {consultation.professional.especiality && (
                <p className="text-sm text-gray-600">{consultation.professional.especiality}</p>
              )}
              <p className="text-sm text-gray-500">{consultation.workspace.name}</p>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-gray-900">
                {format(new Date(consultation.scheduled_date), "dd 'de' MMM, yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-gray-600">
                {format(parse(consultation.scheduled_time, "HH:mm:ss", new Date(consultation.scheduled_date)), "HH:mm")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            {getTypeBadge(consultation.consultation_type)}
            {getStatusBadge(consultation.status)}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{consultation.duration} min</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canJoinVideoCall && onJoinVideoCall && (
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => onJoinVideoCall(consultation.id)}
                >
                  <Video className="w-4 h-4 mr-1.5" />
                  Entrar
                </Button>
              )}
              <Button variant="outline" size="sm">
                Reagendar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
