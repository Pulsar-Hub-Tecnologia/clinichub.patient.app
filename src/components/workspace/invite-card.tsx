import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Check, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PatientWorkspace, useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formats';
import { Alert, AlertDescription } from '@/components/ui/alert';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' };
    case 'EXPIRED':
      return { label: 'Expirado', className: 'bg-red-100 text-red-600' };
    case 'REJECTED':
      return { label: 'Rejeitado', className: 'bg-gray-100 text-gray-600' };
    default:
      return { label: status, className: 'bg-blue-100 text-blue-600' };
  }
};

interface InviteCardProps extends PatientWorkspace {
  onRefresh?: () => void;
}

export function InviteCard({ onRefresh, ...workspace }: InviteCardProps) {
  const { onLoading, offLoading } = useLoading();
  const { acceptInvite, rejectInvite } = useAuth();
  const statusBadge = getStatusBadge(workspace.status);

  async function handleAcceptInvite() {
    await onLoading();
    try {
      await acceptInvite(workspace.workspace_id);
      toast.success('Convite aceito com sucesso!');
      // Atualizar lista de workspaces após aceitar convite
      onRefresh?.();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
      toast.error('Erro ao aceitar convite');
    } finally {
      await offLoading();
    }
  }

  async function handleRejectInvite() {
    await onLoading();
    try {
      await rejectInvite(workspace.workspace_id);
      toast.success('Convite rejeitado');
      // Atualizar lista de workspaces após rejeitar convite
      onRefresh?.();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
      toast.error('Erro ao rejeitar convite');
    } finally {
      await offLoading();
    }
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar/Logo */}
          <Avatar className="h-12 w-12 rounded-lg flex-shrink-0">
            <AvatarImage src={workspace.workspace_picture} alt={workspace.workspace_name} />
            <AvatarFallback className="rounded-lg bg-yellow-500 text-white">
              {getInitials(workspace.workspace_name || "Clínica")}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">{workspace.workspace_name}</h3>
                  <Badge variant="secondary" className={statusBadge.className}>
                    {statusBadge.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {workspace.workspace_type === "PERSONAL" ? "Clínica Pessoal" : "Clínica Empresarial"}
                </p>
              </div>

              {/* Date Info */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3" />
                  Recebido em
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(workspace.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Alert for pending invites */}
            {workspace.status === "PENDING" && (
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Esta clínica convidou você para compartilhar seus dados de saúde. Ao aceitar, você permitirá que os profissionais desta clínica acessem seu histórico médico.
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            {workspace.status === "PENDING" && (
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectInvite}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  Rejeitar
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptInvite}
                  className="gap-1 bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4" />
                  Aceitar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
