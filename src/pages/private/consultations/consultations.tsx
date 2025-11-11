import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Video, Plus } from "lucide-react";
import BasicInput from "@/components/basic-input/basic-input";
import { format, parse } from "date-fns";
import { getInitials } from "@/utils/formats";
import ConsultationService, { type ConsultationFilters, type ConsultationStatus } from "@/services/api/consultation.service";
import { useNavigate } from "react-router-dom";

export default function PatientConsultationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters] = useState<ConsultationFilters>({});

  const navigate = useNavigate();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["patient-consultations", currentPage, searchTerm, filters],
    queryFn: () => ConsultationService.getConsultations({ page: currentPage, search: searchTerm, filters }),
    placeholderData: keepPreviousData,
    retry: 2,
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmada</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case "CANCELED":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Finalizada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const canJoinVideoCall = (consultationType: string, status: ConsultationStatus) => {
    return consultationType === "ONLINE" && status !== "CANCELED" && status !== "COMPLETED";
  };

  const handleJoinVideoCall = (consultationId: string) => {
    navigate(`/consultations/${consultationId}/video-call`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Clock className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-gray-500">Carregando suas consultas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background gap-4">
        <p className="text-red-500">Erro ao carregar consultas</p>
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
      <section id="header" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Consultas</h1>
          <p className="text-sm text-gray-500">Visualize suas consultas agendadas</p>
        </div>
        <Button
          onClick={() => navigate("/consultations/create/select-workspace")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Agendar Consulta
        </Button>
      </section>

      <section className="rounded-lg bg-card shadow">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-medium">Lista de Consultas</h2>
          <div className="flex items-center gap-3">
            {isFetching && !isLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4 animate-spin" />
                Atualizando...
              </div>
            )}
            <BasicInput
              placeholder="Pesquisar por profissional ou clínica..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-80"
              leftIcon={<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">Clínica</TableHead>
              <TableHead>Profissional</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-0">
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="rounded-full bg-background p-3 mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Nenhuma consulta encontrada</h3>
                    <p className="text-gray-600 text-center max-w-md mb-4">
                      Você ainda não possui consultas agendadas.
                    </p>
                    <Button
                      onClick={() => navigate("/consultations/create/select-workspace")}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agendar Minha Primeira Consulta
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((consultation, index) => (
                <TableRow key={`${consultation.id}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={consultation.workspace.picture} />
                        <AvatarFallback>{getInitials(consultation.workspace.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{consultation.workspace.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={consultation.professional.picture} />
                        <AvatarFallback>{getInitials(consultation.professional.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{consultation.professional.name}</div>
                        {consultation.professional.especiality && (
                          <div className="text-xs text-gray-500">{consultation.professional.especiality}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{format(consultation.scheduled_date, "dd/MM/yyyy")}</div>
                      <div className="text-xs text-gray-500">
                        {format(parse(consultation.scheduled_time, "HH:mm:ss", consultation.scheduled_date), "HH:mm")} ({consultation.duration}min)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {consultation.consultation_type === "PRESENCIAL" ? "Presencial" : "Online"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(consultation.status)}</TableCell>
                  <TableCell>
                    {canJoinVideoCall(consultation.consultation_type, consultation.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleJoinVideoCall(consultation.id)}
                      >
                        <Video className="h-4 w-4" />
                        Entrar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
