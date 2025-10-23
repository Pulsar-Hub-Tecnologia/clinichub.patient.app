import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteCard } from "@/components/workspace/invite-card";
import { ClinicActiveCard } from "@/components/workspace/clinic-active-card";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";

import NoInvites from "@/assets/components/workspace-selector/NoInvitesPlaceholder.svg";
import NoAccess from "@/assets/components/workspace-selector/NoAccessPlaceholder.svg";

interface PatientWorkspace {
  workspace_id: string;
  workspace_name: string;
  workspace_picture?: string;
  workspace_type: "PERSONAL" | "BUSINESS";
  status: "ACTIVE" | "PENDING" | "REJECTED" | "EXPIRED" | "ARCHIVED";
  created_at: Date;
}

export default function MyInvitesPage() {

  const { data: workspaces, isLoading, error, refetch } = useQuery<PatientWorkspace[]>({
    queryKey: ["patient-workspaces"],
    queryFn: async () => {
      const response = await api.get("/patient/workspaces");
      return response.data;
    },
    retry: 2,
  });

  const activeClinics = useMemo(() => {
    if (!workspaces) return [];
    return workspaces.filter(w => w.status === "ACTIVE");
  }, [workspaces]);

  const pendingInvites = useMemo(() => {
    if (!workspaces) return [];
    return workspaces.filter(w => w.status === "PENDING");
  }, [workspaces]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-gray-500">Carregando suas clínicas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <p className="text-red-500">Erro ao carregar clínicas</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Minhas Clínicas</h1>
            <p className="text-sm text-gray-500">
              Gerencie suas clínicas e convites pendentes
            </p>
          </div>
        </div>
      </section>

      <Tabs defaultValue="clinics" className="w-full">
        <TabsList className="grid w-fit grid-cols-2 bg-transparent p-0 h-auto border-b">
          <TabsTrigger
            value="clinics"
            className="relative px-6 py-3 text-base font-medium bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 border-0 border-b-2 border-b-transparent data-[state=active]:border-b-purple-600 rounded-none transition-all duration-300"
          >
            Minhas clínicas
          </TabsTrigger>
          <TabsTrigger
            value="invites"
            className="relative px-6 py-3 text-base font-medium bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 border-0 border-b-2 border-b-transparent data-[state=active]:border-b-purple-600 rounded-none transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Convites Pendentes
              {pendingInvites.length > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {pendingInvites.length}
                </span>
              )}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinics" className="mt-6">
          {activeClinics.length > 0 ? (
            <div className="flex flex-col gap-4">
              {activeClinics.map((clinic, index) => (
                <ClinicActiveCard
                  key={index}
                  {...clinic}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 opacity-40">
              <img src={NoAccess} className="w-32 h-32" alt="Sem clínicas" />
              <p className="text-gray-600">Você ainda não tem acesso a nenhuma clínica</p>
              <p className="text-sm text-gray-500">Aceite convites pendentes para começar</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="invites" className="mt-6">
          {pendingInvites.length > 0 ? (
            <div className="flex flex-col gap-4">
              {pendingInvites.map((invite, index) => (
                <InviteCard key={index} {...invite} onRefresh={() => refetch()} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 opacity-40">
              <img src={NoInvites} className="w-32 h-32" alt="Sem convites" />
              <p className="text-gray-600">Não há novos convites!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
