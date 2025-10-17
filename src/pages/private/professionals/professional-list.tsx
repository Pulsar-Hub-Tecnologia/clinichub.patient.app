import { useCallback, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, X, Search } from "lucide-react"
import { TableSkeleton, ErrorState, LoadingSpinner } from "@/components/pagination/skeleton"
import { Users, UserCheck, Clock, UserX } from "lucide-react"
import StatsCard from "@/components/stats-card/stats-card"
import BasicInput from "@/components/basic-input/basic-input"
import WorkspaceService, { type ProfessionalFilterState } from "@/services/api/workspace.service"
import TablePagination from "@/components/pagination"
import ProfessionalFilterPopover from "@/components/professional-handle/professional-filter"
import ProfessionalActionsPopover from "@/components/professional-handle/professional-actions"
import InviteProfessional from "@/components/modal/invite-professional/invite-professional"
import { format } from "date-fns"
import { useAuth } from "@/context/auth-context"
import { getInitials } from "@/utils/formats"

type AccessStatus = "ACTIVE" | "PENDING" | "EXPIRED" | "ARCHIVED" | "REJECTED"

function formatProfessionalInfo(name: string, speciality?: string, crm?: string): string {
  const prefix = "Dr(a).";

  let result = `${name.split(" ")[0]} ${name.split(" ")[1]}`

  if (speciality) {
    result = `${prefix} ${name.split(" ")[0]} ${name.split(" ")[1]} - ${speciality}`;
  }

  if (crm) {
    result += `${prefix} ${name.split(" ")[0]} ${name.split(" ")[1]} - ${crm}`;
  }
  return result;
}


export default function ProfessionalListPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<ProfessionalFilterState>({
    status: [],
    inviteDateFrom: undefined,
    inviteDateTo: undefined,
    role: "",
    sortBy: "",
  })

  const { user } = useAuth()

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["professionals", currentPage, searchTerm, filters],
    queryFn: () => WorkspaceService.getProfessionals({ page: currentPage, search: searchTerm, filters }),
    placeholderData: keepPreviousData
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["professional-stats"],
    queryFn: () => WorkspaceService.getProfessionalsStats(),
  })

  const cards = [
    {
      title: "Total de Profissionais",
      value: stats?.total || 0,
      icon: Users,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Profissionais Ativos",
      value: stats?.actives || 0,
      icon: UserCheck,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Convites Pendentes",
      value: stats?.pending || 0,
      icon: Clock,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Convites Expirados",
      value: stats?.expired || 0,
      icon: UserX,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFiltersChange = (newFilters: ProfessionalFilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
    if (hasActiveFilters()) {
      setSearchTerm("")
    }
  }

  const handleClearFilters = () => {
    setFilters({
      status: [],
      inviteDateFrom: undefined,
      inviteDateTo: undefined,
      role: "",
      sortBy: "",
    })
    setCurrentPage(1)
  }

  const hasActiveFilters = useCallback(() => {
    return (
      filters.status.length > 0 ||
      filters.inviteDateFrom ||
      filters.inviteDateTo ||
      filters.role ||
      filters.sortBy
    )
  }, [filters])

  const getStatusBadge = (status: AccessStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ativo</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Convite Pendente</Badge>
      case "EXPIRED":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Convite Expirado</Badge>
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Convite Rejeitado</Badge>
      case "ARCHIVED":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Arquivado</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Convite Pendente</Badge>
    }
  }

  const getProfessionalIcon = (status: AccessStatus, name?: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>{name ? getInitials(name) : "AP"}</AvatarFallback>
          </Avatar>
        )
      case "PENDING":
        return (
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Mail className="h-5 w-5 text-gray-600" />
          </div>
        )
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <X className="h-5 w-5 text-red-600" />
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-4 md:p-6 gap-5">
      <section id="header" className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciamento de Profissionais</h1>
          <p className="text-sm text-gray-500">Gerencie a equipe médica da sua clínica</p>
        </div>
        <InviteProfessional>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className='hidden lg:inline'>Convidar Profissional</span>
          </Button>
        </InviteProfessional>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.title} card={card} isLoading={statsLoading} />
        ))}
      </section>

      <section className="rounded-lg bg-card shadow">
        <div className="border-b border-border px-6 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-medium">Lista de Profissionais</h2>
          <div className="flex items-center gap-3">
            {isFetching && !isLoading && <LoadingSpinner message="Atualizando..." />}
            <BasicInput
              placeholder="Pesquisar por nome ou email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-64 pl-10"
              leftIcon={<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
            />
            <ProfessionalFilterPopover
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>

        {error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6">Profissional</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data do Convite</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="flex flex-col items-center justify-center py-12 px-6">
                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>

                        {Boolean(searchTerm !== "" || hasActiveFilters()) ? (
                          <>
                            <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
                            <p className="text-gray-600 text-center mb-6 max-w-md">
                              Não encontramos profissionais que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.
                            </p>
                            <Button variant="outline" onClick={() => {
                              setSearchTerm("")
                              handleClearFilters()
                            }}>
                              Limpar filtros
                            </Button>
                          </>
                        ) : (
                          <>
                            <h3 className="text-lg font-medium mb-2">Nenhum profissional cadastrado</h3>
                            <p className="text-gray-600 text-center mb-6 max-w-md">
                              Você ainda não possui profissionais cadastrados. Comece adicionando seu primeiro profissional.
                            </p>
                            <Button>
                              Adicionar primeiro profissional
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((professional) => (
                    <TableRow key={professional.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getProfessionalIcon(professional.status)}
                          <div>
                            <div className="font-medium">
                              {professional.email} {user?.email === professional.email && "(EU)"}
                            </div>
                            {professional.status === "ACTIVE" && (
                              <div className="text-xs text-gray-500">{professional.status === "ACTIVE" ? formatProfessionalInfo(professional.name!, professional.especiality, professional.crm) : professional.email}</div>
                            )}
                            {professional.status !== "ACTIVE" && (
                              <div className="text-xs text-gray-500">
                                {professional.status === "PENDING" ? "Convite enviado" : "Convite expirado"}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(professional.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{format(professional.inviteDate, "dd/MM/yyyy")}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{professional.role || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <ProfessionalActionsPopover
                          professionalId={professional.id}
                          professionalStatus={professional.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
      </section>
    </div>
  )
}
