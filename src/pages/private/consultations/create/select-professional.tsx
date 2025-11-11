import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/consultation-context";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formats";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import PatientService from "@/services/api/patient.service";

export default function SelectProfessional() {
  const [searchTerm, setSearchTerm] = useState("");
  const { setProfessional, consultationData, isProfessionalSelected, isWorkspaceSelected, clearConsultation } = useConsultation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWorkspaceSelected) {
      toast.error("Selecione uma clínica primeiro.");
      navigate("/consultations/create/select-workspace");
    }
  }, [isWorkspaceSelected, navigate]);

  useEffect(() => {
    return () => {
      const isBookingRoute = window.location.pathname.startsWith('/consultations/create');
      if (!isBookingRoute) {
        clearConsultation();
      }
    };
  }, [clearConsultation]);

  const { data: professionals, isLoading } = useQuery({
    queryKey: ["patient-professionals", consultationData.workspace?.id, searchTerm],
    queryFn: () => PatientService.getProfessionalsByWorkspace(consultationData.workspace!.id, searchTerm),
    enabled: !!consultationData.workspace?.id,
    retry: 2,
  });

  const { data: recentProfessionals, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["patient-recent-professionals", consultationData.workspace?.id],
    queryFn: () => PatientService.getRecentProfessionals(consultationData.workspace!.id, 3),
    enabled: !!consultationData.workspace?.id,
    retry: 1,
  });

  const handleProfessionalSelect = (professional: any) => {
    setProfessional({
      id: professional.id,
      name: professional.name,
      email: professional.email,
      picture: professional.picture,
      phone: professional.phone,
      especiality: professional.especiality,
      regional_council_number: professional.regional_council_number,
      bio: professional.bio,
    });
  };

  const handleNext = () => {
    if (isProfessionalSelected) {
      navigate("/consultations/create/select-schedule");
    } else {
      toast.error("Selecione um profissional.");
    }
  };

  const handleBack = () => {
    navigate("/consultations/create/select-workspace");
  };

  const renderProfessionalCard = (professional: any, isRecent: boolean = false) => {
    const isSelected = consultationData.professional?.id === professional.id;

    return (
      <div
        key={professional.id}
        onClick={() => handleProfessionalSelect(professional)}
        className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${isSelected
            ? "border-primary bg-primary/5"
            : isRecent
              ? "border-blue-200 bg-blue-50/50 hover:border-blue-300"
              : "border-gray-200 hover:border-primary/50"
          }`}
      >
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 rounded-lg flex-shrink-0">
            <AvatarImage src={professional.picture || undefined} />
            <AvatarFallback className="rounded-lg border bg-primary/10 text-primary">
              {getInitials(professional.name || professional.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 truncate">
                  {professional.name}
                </h3>
                {professional.especiality && (
                  <p className="text-sm text-primary mt-1">{professional.especiality}</p>
                )}
                {professional.regional_council_number && (
                  <p className="text-xs text-gray-500 mt-1">
                    CRM: {professional.regional_council_number}
                  </p>
                )}
              </div>

              {isSelected && (
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>

            {professional.bio && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{professional.bio}</p>
            )}

            {isRecent && professional.lastConsultationDate && (
              <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                <Clock className="h-3 w-3" />
                <span>
                  {professional.totalConsultations}{" "}
                  {professional.totalConsultations === 1 ? "consulta" : "consultas"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
        <p className="text-gray-600 mt-2">Etapa 2 de 4: Selecione o profissional</p>
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
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <span className="font-medium text-primary">Profissional</span>
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
              3
            </div>
            <span>Horário</span>
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

      {consultationData.workspace && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Clínica Selecionada</h2>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              <AvatarImage src={consultationData.workspace.picture || undefined} />
              <AvatarFallback className="rounded-lg border bg-primary/10 text-primary">
                {getInitials(consultationData.workspace.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">{consultationData.workspace.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {consultationData.workspace.type === "BUSINESS" ? "Clínica" : "Profissional Individual"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por nome, especialidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {!isLoadingRecent && recentProfessionals && recentProfessionals.length > 0 && (
        <section className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-gray-900">
              Profissionais Consultados Recentemente
            </h2>
          </div>
          <div className="grid gap-4">
            {recentProfessionals.map((professional: any) => renderProfessionalCard(professional, true))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Todos os Profissionais</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando profissionais...</p>
          </div>
        ) : professionals && professionals.length > 0 ? (
          <div className="grid gap-4">
            {professionals.map((professional: any) => renderProfessionalCard(professional))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">
              {searchTerm
                ? "Nenhum profissional encontrado com este termo de busca."
                : "Nenhum profissional disponível nesta clínica."}
            </p>
          </div>
        )}
      </section>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handleNext} disabled={!isProfessionalSelected}>
          Próximo
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
