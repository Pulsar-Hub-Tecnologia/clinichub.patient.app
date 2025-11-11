import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building, User, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/consultation-context";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";
import PatientService from "@/services/api/patient.service";

export default function SelectWorkspace() {
  const { setWorkspace, setProfessional, consultationData, isWorkspaceSelected, clearConsultation } = useConsultation();
  const navigate = useNavigate();

  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ["patient-workspaces-booking"],
    queryFn: () => PatientService.getWorkspaces(),
    retry: 2,
  });

  useEffect(() => {
    return () => {
      const isBookingRoute = window.location.pathname.startsWith('/consultations/create');
      if (!isBookingRoute) {
        clearConsultation();
      }
    };
  }, [clearConsultation]);

  const activeWorkspaces = workspaces?.filter((w: any) => w.status === "ACTIVE") || [];

  const handleWorkspaceSelect = async (workspace: any) => {
    setWorkspace({
      id: workspace.workspace_id,
      name: workspace.workspace_name,
      picture: workspace.workspace_picture,
      type: workspace.workspace_type
    });

    if (workspace.workspace_type === "PERSONAL") {
      if (workspace.owner) {
        setProfessional({
          id: workspace.owner.id,
          name: workspace.owner.name,
          email: workspace.owner.email,
          picture: workspace.owner.picture,
          phone: workspace.owner.phone,
          especiality: workspace.owner.especiality,
          regional_council_number: workspace.owner.regional_council_number,
          bio: workspace.owner.bio,
        });
        navigate("/consultations/create/select-schedule");
      } else {
        toast.error("Dados do profissional não encontrados");
        navigate("/consultations/create/select-professional");
      }
    } else {
      navigate("/consultations/create/select-professional");
    }
  };

  const handleBack = () => {
    navigate("/consultations");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando clínicas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Erro ao carregar clínicas. Tente novamente.</p>
        </div>
      </div>
    );
  }

  if (activeWorkspaces.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">Você não possui acesso a nenhuma clínica no momento.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/workspaces")}>
            Ver meus convites
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
        <p className="text-gray-600 mt-2">
          Etapa 1 de 4: Selecione a clínica onde deseja agendar
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
              1
            </div>
            <span className="font-medium text-primary">Clínica</span>
          </div>
          <ChevronRight className="h-4 w-4" />
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
              2
            </div>
            <span>Profissional</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeWorkspaces.map((workspace: any) => (
          <div
            key={workspace.workspace_id}
            onClick={() => handleWorkspaceSelect(workspace)}
            className={`bg-white border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${consultationData.workspace?.id === workspace.workspace_id
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-primary/50"
              }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarImage src={workspace.workspace_picture || undefined} />
                <AvatarFallback className="rounded-lg border bg-primary/10 text-primary text-xl">
                  {getInitials(workspace.workspace_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{workspace.workspace_name}</h3>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {workspace.workspace_type === "BUSINESS" ? (
                    <Building className="h-4 w-4 text-gray-500" />
                  ) : (
                    <User className="h-4 w-4 text-gray-500" />
                  )}
                  <p className="text-sm text-gray-600">
                    {workspace.workspace_type === "BUSINESS" ? "Clínica" : "Profissional Individual"}
                  </p>
                </div>
              </div>

              {consultationData.workspace?.id === workspace.workspace_id && (
                <div className="flex items-center gap-2 text-primary">
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">Selecionada</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" onClick={handleBack}>
          Cancelar
        </Button>
        <Button
          onClick={() => navigate("/consultations/create/select-professional")}
          disabled={!isWorkspaceSelected}
        >
          Próximo
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
