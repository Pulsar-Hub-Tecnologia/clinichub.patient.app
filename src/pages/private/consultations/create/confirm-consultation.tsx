import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/consultation-context";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formats";
import { Check, Calendar, Clock, Building, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import PatientService from "@/services/api/patient.service";

function calculateEndTime(startTime: string, duration: number): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}

export default function ConfirmConsultation() {
  const navigate = useNavigate();
  const {
    consultationData,
    isProfessionalSelected,
    isWorkspaceSelected,
    isScheduleSelected,
    clearConsultation,
  } = useConsultation();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataShareAccepted, setDataShareAccepted] = useState(false);
  const [cancellationPolicyAccepted, setCancellationPolicyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isWorkspaceSelected || !isProfessionalSelected || !isScheduleSelected) {
      toast.error("Complete todas as etapas anteriores primeiro.");
      navigate("/consultations/create/select-workspace");
    }
  }, [isWorkspaceSelected, isProfessionalSelected, isScheduleSelected, navigate]);

  useEffect(() => {
    return () => {
      const isBookingRoute = window.location.pathname.startsWith("/consultations/create");
      if (!isBookingRoute) {
        clearConsultation();
      }
    };
  }, [clearConsultation]);

  const handleConfirm = async () => {
    if (!termsAccepted || !dataShareAccepted || !cancellationPolicyAccepted) {
      toast.error("Por favor, aceite todos os termos e condições para continuar.");
      return;
    }

    if (
      !consultationData.workspace ||
      !consultationData.professional ||
      !consultationData.scheduledDate ||
      !consultationData.scheduledTime ||
      !consultationData.duration ||
      !consultationData.consultationType
    ) {
      toast.error("Dados da consulta incompletos. Por favor, revise as etapas anteriores.");
      return;
    }

    setIsSubmitting(true);

    try {
      await PatientService.createPatientConsultation({
        professionalId: consultationData.professional.id,
        workspaceId: consultationData.workspace.id,
        consultationType: consultationData.consultationType,
        scheduledDate: consultationData.scheduledDate,
        scheduledTime: consultationData.scheduledTime,
        duration: consultationData.duration,
      });

      toast.success("Consulta agendada com sucesso!");
      await navigate("/consultations");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao agendar consulta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate("/consultations/create/select-schedule");
  };

  const selectedProfessional = consultationData.professional;
  const selectedWorkspace = consultationData.workspace;
  const consultationType = consultationData.consultationType;

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Confirmar Agendamento</h1>
        <p className="text-gray-600 mt-2">Revise e confirme os detalhes da sua consulta</p>
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
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
              ✓
            </div>
            <span>Horário</span>
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
              4
            </div>
            <span className="font-medium text-primary">Confirmar</span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes da Consulta</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Clínica</h3>
            {selectedWorkspace && (
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 rounded-lg">
                  <AvatarImage src={selectedWorkspace.picture || undefined} />
                  <AvatarFallback className="rounded-lg border bg-primary/10 text-primary">
                    {getInitials(selectedWorkspace.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-base">{selectedWorkspace.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {selectedWorkspace.type === "BUSINESS" ? "Clínica" : "Profissional Individual"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Profissional</h3>
            {selectedProfessional && (
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 rounded-lg">
                  <AvatarImage src={selectedProfessional.picture || undefined} />
                  <AvatarFallback className="rounded-lg border bg-primary/10 text-primary">
                    {getInitials(selectedProfessional.name || selectedProfessional.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-base">{selectedProfessional.name}</h4>
                  <p className="text-sm text-primary">{selectedProfessional.especiality}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Data e Horário</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {consultationData.scheduledDate
                    ? format(consultationData.scheduledDate, "EEEE, dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })
                    : "-"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {consultationData.scheduledTime
                    ? `${consultationData.scheduledTime} - ${calculateEndTime(
                      consultationData.scheduledTime,
                      consultationData.duration || 50
                    )}`
                    : "-"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-3">Modalidade</h3>
            <div className="flex gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${consultationType === "PRESENCIAL"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-gray-50"
                  }`}
              >
                <Building className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Presencial</p>
                  <p className="text-xs text-gray-500">Na clínica</p>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${consultationType === "ONLINE"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-gray-50"
                  }`}
              >
                <Video className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Online</p>
                  <p className="text-xs text-gray-500">Telemedicina</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Termos e Condições</h2>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              Concordo com os{" "}
              <a href="#" className="text-primary underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-primary underline">
                Política de Privacidade
              </a>
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="dataShare"
              checked={dataShareAccepted}
              onCheckedChange={(checked) => setDataShareAccepted(checked as boolean)}
              className="mt-1"
            />
            <Label
              htmlFor="dataShare"
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              Autorizo o compartilhamento dos meus dados de saúde com o profissional selecionado para
              fins de consulta e acompanhamento médico
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="cancellation"
              checked={cancellationPolicyAccepted}
              onCheckedChange={(checked) => setCancellationPolicyAccepted(checked as boolean)}
              className="mt-1"
            />
            <Label
              htmlFor="cancellation"
              className="text-sm text-gray-700 cursor-pointer leading-relaxed"
            >
              Estou ciente da{" "}
              <a href="#" className="text-primary underline">
                Política de Cancelamento
              </a>
              : cancelamentos devem ser feitos com pelo menos 24 horas de antecedência
            </Label>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={
            !termsAccepted ||
            !dataShareAccepted ||
            !cancellationPolicyAccepted ||
            isSubmitting
          }
        >
          {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
          <Check className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
