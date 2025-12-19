import { useEffect, useState } from 'react';
import { useLoading } from '@/context/loading-context';
import { useQuery } from '@tanstack/react-query';
import DashboardService from '@/services/api/dashboard.service';
import AccountService from '@/services/api/account.service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Video,
  MapPin,
  AlertTriangle,
  Plus,
  RefreshCw,
  Send,
  User,
  Building
} from 'lucide-react';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Dashboard() {
  const { onLoading, offLoading } = useLoading();
  const [feeling, setFeeling] = useState('');

  const { data: account } = useQuery({
    queryKey: ['account'],
    queryFn: AccountService.getAccount,
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: DashboardService.getDashboard,
  });

  useEffect(() => {
    if (isLoading) onLoading();
    else offLoading();
  }, [isLoading, onLoading, offLoading]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMM, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-green-600 bg-green-50';
      case 'PENDING': return 'text-orange-600 bg-orange-50';
      case 'CANCELED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-500';
      case 'PENDING': return 'bg-orange-500';
      case 'CANCELED': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmado';
      case 'PENDING': return 'Aguardando';
      case 'CANCELED': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50 p-6 space-y-8">
      {/* Header */}
      <div className='flex-1 w-full'>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo(a), {account?.name?.split(' ')[0] || 'Paciente'}!</h1>
        <p className="text-gray-500">Aqui está um resumo das suas atividades de hoje</p>
      </div>

      {/* Feeling Section */}
      <Card className="border-none shadow-sm w-full">
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-2xl">♥</span>
          </div>
          <div className="flex-1 w-full">
            <h3 className="font-semibold text-gray-900 mb-3">Como você está se sentindo hoje?</h3>
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                {['🙂', '😐', '😔', '😰'].map((emoji, i) => (
                  <button key={i} className="h-10 w-10 rounded-full bg-yellow-50 hover:bg-yellow-100 flex items-center justify-center text-xl transition-colors">
                    {emoji}
                  </button>
                ))}
              </div>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Descreva como está se sentindo..."
                  className="bg-gray-50 border-gray-200"
                  value={feeling}
                  onChange={(e) => setFeeling(e.target.value)}
                />
                <Button className="bg-[#3b0764] hover:bg-[#2e054e]">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Consultations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Próximas Consultas</h2>
          <Button variant="link" className="text-[#3b0764]">Ver todas</Button>
        </div>

        <div className="space-y-4">
          {dashboardData?.upcoming_consultations && dashboardData.upcoming_consultations.length > 0 ? (
            dashboardData.upcoming_consultations.map((consultation) => (
              <Card key={consultation.id} className="border-none shadow-sm overflow-hidden">
                <div className="flex items-stretch">
                  <div className={`w-2 ${getStatusBorderColor(consultation.status)}`}></div>
                  <CardContent className="flex-1 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center text-[#3b0764]">
                        {consultation.professional_picture ? (
                          <img src={consultation.professional_picture} alt="" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{consultation.professional_name}</h3>
                        <p className="text-sm text-gray-500">{consultation.professional_specialty || 'Especialista'}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                            {consultation.consultation_type === 'ONLINE' ? (
                              <><Video className="h-3 w-3" /> Online</>
                            ) : (
                              <><MapPin className="h-3 w-3" /> Presencial</>
                            )}
                          </div>
                          {/* Assuming plan info is not directly available in consultation yet, mocking for UI consistency if needed or omitting */}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {formatDate(consultation.scheduled_date)}
                      </p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(consultation.status)}`}>
                        {getStatusLabel(consultation.status)}
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada.</p>
          )}
        </div>
      </section>

      {/* Remaining Consultations (Plans) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Consultas Restantes</h2>
          <div className="flex gap-2">
            <Button className="bg-[#3b0764] hover:bg-[#2e054e]">
              <Plus className="h-4 w-4 mr-2" />
              Contratar
            </Button>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Todas as clínicas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as clínicas</SelectItem>
                {/* Populate with workspaces if needed */}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardData?.active_plans && dashboardData.active_plans.map((plan) => (
            <Card key={plan.id} className={`border-none shadow-sm overflow-hidden ${plan.status === 'EXPIRING_SOON' ? 'bg-yellow-50/50' : 'bg-white'}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white ${plan.status === 'EXPIRING_SOON' ? 'bg-yellow-600' : 'bg-blue-600'}`}>
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{plan.workspace_name}</h3>
                      <p className="text-xs text-gray-500">{plan.plan_name}</p>
                    </div>
                  </div>
                  {plan.status === 'EXPIRING_SOON' ? (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none">Renovar</Badge>
                  ) : (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">Ativo</Badge>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className={`font-bold text-lg ${plan.status === 'EXPIRING_SOON' ? 'text-yellow-600' : 'text-blue-600'}`}>{plan.total_credits}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Usadas</p>
                    <p className="font-bold text-lg text-gray-700">{plan.used_credits}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Restam</p>
                    <p className={`font-bold text-lg ${plan.status === 'EXPIRING_SOON' ? 'text-green-600' : 'text-green-600'}`}>{plan.remaining_credits}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Utilização</span>
                    <span>{plan.usage_percentage}%</span>
                  </div>
                  <Progress value={plan.usage_percentage} className={`h-2 ${plan.status === 'EXPIRING_SOON' ? 'bg-yellow-200' : 'bg-blue-100'}`} indicatorClassName={plan.status === 'EXPIRING_SOON' ? 'bg-yellow-500' : 'bg-blue-500'} />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-6 bg-white/50 p-2 rounded border border-gray-100">
                  <span>Validade</span>
                  {plan.status === 'EXPIRING_SOON' ? (
                    <span className="flex items-center text-yellow-700 font-bold">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      18 dias
                    </span>
                  ) : (
                    <span className="font-medium">{formatDate(plan.valid_until)}</span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-xs font-bold text-gray-700">Especialidades</p>
                  {plan.specialties.map((spec, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600">
                      <span>{spec.name}</span>
                      <span className={`font-bold ${plan.status === 'EXPIRING_SOON' ? 'text-yellow-600' : 'text-blue-600'}`}>{spec.remaining}</span>
                    </div>
                  ))}
                </div>

                <Button className={`w-full ${plan.status === 'EXPIRING_SOON' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {plan.status === 'EXPIRING_SOON' ? (
                    <><RefreshCw className="h-4 w-4 mr-2" /> Renovar</>
                  ) : (
                    <><Calendar className="h-4 w-4 mr-2" /> Agendar</>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* My Clinics / Invites */}
      <section>
        <WorkspaceList />
      </section>
    </main>
  );
}
