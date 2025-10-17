import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Menu, Send, Trash2, Edit } from "lucide-react"
import { toast } from "react-toastify"

interface ProfessionalActionsPopoverProps {
  professionalId: string
  professionalStatus: "ACTIVE" | "PENDING" | "EXPIRED" | "ARCHIVED" | "REJECTED"
}

export default function ProfessionalActionsPopover({
  // professionalId,
  professionalStatus,
}: ProfessionalActionsPopoverProps) {
  const canResendInvite = professionalStatus !== "ACTIVE"
  const canDeleteAccess = professionalStatus !== "EXPIRED" && professionalStatus !== "REJECTED"

  const getPatientAction = () => {
    switch (professionalStatus) {
      case "ACTIVE":
        return (
          <span className="truncate">Arquivar o acesso do profissional</span>
        )
      case "PENDING":
        return (
          <span className="truncate">Arquivar o convite</span>
        )
      case "REJECTED":
        return (
          <span className="truncate">Arquivar o convite</span>
        )
      case "EXPIRED":
        return (
          <span className="truncate">Arquivar o convite</span>
        )
      default:
        return (
          <span className="truncate">Reativar o acesso do profissional</span>
        )
    }
  }

  const onResendInvite = () => {
    toast.error("Ação em desenvolvimento!")
  }

  const onDeletePatientAcess = async () => {
    toast.error("Ação em desenvolvimento!")
    // try {
    //   await PatientService.deletePatientAccess(patientId)
    // } catch (error) {
    //   toast.error("Ação indisponível no momento!")
    // } finally {

    // }
  }

  const onEditEmail = () => {
    toast.error("Ação em desenvolvimento!")
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2" align="end">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sm whitespace-nowrap"
            disabled={!canResendInvite}
            onClick={onResendInvite}
          >
            <Send className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Reenviar o convite</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm whitespace-nowrap"
            disabled={!canDeleteAccess}
            onClick={onDeletePatientAcess}
          >
            <Trash2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{getPatientAction()}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-sm whitespace-nowrap"
            disabled={!canResendInvite}
            onClick={onEditEmail}
          >
            <Edit className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Alterar o email do profissional</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
