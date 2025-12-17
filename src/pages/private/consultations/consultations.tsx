import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Search, CircleCheck, CalendarDays, XCircle } from "lucide-react";
import BasicInput from "@/components/basic-input/basic-input";
import ConsultationService, { type ConsultationFilters as ConsultationFiltersType } from "@/services/api/consultation.service";
import { useNavigate } from "react-router-dom";
import StatsCard from "@/components/stats-card/stats-card";
import TablePagination from "@/components/pagination";
import { ErrorState, LoadingSpinner } from "@/components/pagination/skeleton";
import SelectWorkspace from "./create/select-workspace";
import SelectProfessional from "./create/select-professional";
import SelectSchedule from "./create/select-schedule";
import ConfirmConsultation from "./create/confirm-consultation";
import { useConsultation } from "@/context/consultation-context";
import ConsultationCard from "@/components/consultation-card/consultation-card";
import ConsultationFilters from "@/components/consultation-filters/consultation-filters";

type BookingStep = "workspace" | "professional" | "schedule" | "confirm";

export default function PatientConsultationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ConsultationFiltersType>({});
  const [activeTab, setActiveTab] = useState("scheduled");
  const [bookingStep, setBookingStep] = useState<BookingStep>("workspace");

  const navigate = useNavigate();
  const { clearConsultation } = useConsultation();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["patient-consultations", currentPage, searchTerm, filters],
    queryFn: () => ConsultationService.getConsultations({ page: currentPage, search: searchTerm, filters }),
    placeholderData: keepPreviousData,
    retry: 2,
    enabled: activeTab === "scheduled",
  });

  const totalPending = data?.data.filter(c => c.status === "PENDING").length || 0;
  const totalCompleted = data?.data.filter(c => c.status === "COMPLETED").length || 0;
  const totalCanceled = data?.data.filter(c => c.status === "CANCELED").length || 0;
  const totalConfirmed = data?.data.filter(c => c.status === "CONFIRMED").length || 0;

  const cards = [
    {
      title: "Consultas Pendentes",
      value: totalPending,
      icon: Clock,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      change: "+12%",
    },
    {
      title: "Consultas Finalizadas",
      value: totalCompleted,
      icon: CircleCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      change: "+8%",
    },
    {
      title: "Consultas Canceladas",
      value: totalCanceled,
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      change: "-3%",
    },
    {
      title: "Consultas Confirmadas",
      value: totalConfirmed,
      icon: CalendarDays,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+5%",
    },
  ];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleJoinVideoCall = (consultationId: string) => {
    navigate(`/consultations/${consultationId}/video-call`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "schedule") {
      clearConsultation();
      setBookingStep("workspace");
    }
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case "workspace":
        return <SelectWorkspace onNext={() => setBookingStep("professional")} onBack={() => setActiveTab("scheduled")} />;
      case "professional":
        return <SelectProfessional onNext={() => setBookingStep("schedule")} onBack={() => setBookingStep("workspace")} />;
      case "schedule":
        return <SelectSchedule onNext={() => setBookingStep("confirm")} onBack={() => setBookingStep("professional")} />;
      case "confirm":
        return <ConfirmConsultation onBack={() => setBookingStep("schedule")} onSuccess={() => {
          setActiveTab("scheduled");
          setBookingStep("workspace");
          refetch();
        }} />;
      default:
        return null;
    }
  };

  if (isLoading && activeTab === "scheduled") {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Clock className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-gray-500">Carregando suas consultas...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section id="header" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas Consultas</h1>
          <p className="text-sm text-gray-500">Visualize e gerencie todas as suas consultas agendadas</p>
        </div>
      </section>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="inline-flex h-auto items-center justify-start w-full rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="scheduled"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium ring-offset-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Agendadas
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent bg-transparent px-4 py-3 text-sm font-medium ring-offset-transparent transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Agendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-5 mt-5">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <StatsCard key={card.title} card={card} isLoading={isLoading} />
            ))}
          </section>

          <ConsultationFilters
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isFetching && !isLoading && (
                <LoadingSpinner message="Atualizando..." />
              )}
            </div>
            <BasicInput
              placeholder="Pesquisar por profissional ou clínica..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-md w-80"
              leftIcon={<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
            />
          </div>

          {error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Clock className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-white rounded-lg border">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma consulta encontrada</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Você ainda não possui consultas agendadas.
              </p>
              <Button
                onClick={() => setActiveTab("schedule")}
                size="lg"
                className="gap-2"
              >
                <Calendar className="h-5 w-5" />
                Agendar Minha Primeira Consulta
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {data?.data.map((consultation) => (
                  <ConsultationCard
                    key={consultation.id}
                    consultation={consultation}
                    onJoinVideoCall={handleJoinVideoCall}
                  />
                ))}
              </div>
              {data && data.total > 10 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  totalItems={data.total}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="mt-5">
          <div className="bg-background">
            {renderBookingStep()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
