import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PatientWorkspace } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formats';
import { MapPin, User, Star, MoreVertical, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClinicActiveCardProps extends PatientWorkspace {
  onAccess?: (workspaceId: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Ativo', className: 'bg-green-100 text-green-700' };
    case 'PENDING':
      return { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' };
    case 'EXPIRED':
      return { label: 'Expirado', className: 'bg-red-100 text-red-600' };
    case 'ARCHIVED':
      return { label: 'Arquivado', className: 'bg-gray-100 text-gray-600' };
    default:
      return { label: status, className: 'bg-blue-100 text-blue-600' };
  }
};

export function ClinicActiveCard(props: ClinicActiveCardProps) {
  const statusBadge = getStatusBadge(props.status);

  const handleAccess = () => {
    if (props.onAccess) {
      props.onAccess(props.workspace_id);
    }
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar/Logo */}
          <Avatar className="h-12 w-12 rounded-lg flex-shrink-0">
            <AvatarImage src={props.workspace_picture} alt={props.workspace_name} />
            <AvatarFallback className="rounded-lg bg-muted text-primary-foreground">
              {getInitials(props.workspace_name || "Clínica")}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">{props.workspace_name}</h3>
                  <Badge variant="secondary" className={statusBadge.className}>
                    {statusBadge.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {props.workspace_type === "PERSONAL" ? "Clínica Pessoal" : "Clínica Empresarial"}
                </p>
              </div>
            </div>

            {/* Additional Info - Placeholder for future data */}
            <div className="space-y-1 mb-4">
              {/* Location - placeholder */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Localização não disponível</span>
              </div>

              {/* Professional - placeholder */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4 flex-shrink-0" />
                <span>Profissional não disponível</span>
              </div>

              {/* Rating - placeholder */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                <span>Sem avaliações</span>
              </div>
            </div>
          </div>

          {/* Right Side - Consultation Info & Actions */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            {/* Consultation Info */}
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Cadastrado em
              </p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(props.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAccess}>
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Histórico de consultas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
