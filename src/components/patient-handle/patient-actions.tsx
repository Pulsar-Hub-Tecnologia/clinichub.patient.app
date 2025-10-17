import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLoading } from "@/context/loading-context"
import PatientService, { Patient } from "@/services/api/patient.service"
import { useQueryClient } from "@tanstack/react-query"
import { Menu, Send, Edit, Archive, MonitorCheck, Check, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "react-toastify"
import BasicInput from "../basic-input/basic-input"
import { emailValidator } from "@/utils/valid"

interface PatientActionsPopoverProps {
  patient: Patient
}

export default function PatientActionsPopover({ patient }: PatientActionsPopoverProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [count, setCount] = useState<number>(0)
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  const { onLoading, offLoading } = useLoading()
  const queryClient = useQueryClient()

  const canResendInvite = useMemo(() => {
    return patient.status !== "ACTIVE" && patient.status !== "ARCHIVED"
  }, [patient])
  const canDeleteAccess = useMemo(() => {
    return patient.status !== "EXPIRED" && patient.status !== "REJECTED" && patient.status !== "PENDING"
  }, [patient])


  useEffect(() => {
    if (isEditingEmail) setIsEditingEmail(false)

    // Contagem para liberar o botão de reenviar email
    if (count > 0) {
      timerRef.current = setTimeout(() => {
        setCount(prevCount => prevCount - 1);
      }, 1000);
    } else if (count === 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [count]);

  const getPatientAction = () => {
    switch (patient.status) {
      case "ACTIVE":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2  hover:bg-red-50 text-sm whitespace-nowrap"
            onClick={onDeletePatientAcess}
            disabled={!canDeleteAccess}
          >
            <Archive className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Arquivar o paciente</span>
          </Button>
        )
      case "ARCHIVED":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 hover:bg-green-100 text-sm whitespace-nowrap"
            onClick={onDeletePatientAcess}
            disabled={!canDeleteAccess}
          >
            <MonitorCheck className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Reativar o acesso do paciente</span>
          </Button>
        )
      case "PENDING":
        return null
      case "EXPIRED":
        return null
      case "REJECTED":
        return null
      default:
        return null
    }
  }

  const onResendInvite = async () => {
    onLoading()
    try {
      const resendInvite = await PatientService.resendInvitePatient(patient.invite.id)
      setCount(15)
      toast.success(resendInvite.message)
    } catch (error) {
      console.log(error)
      toast.error("Erro ao convidar o paciente, por favor tente novamente!")
    } finally {
      offLoading()
    }
  }

  const onDeletePatientAcess = async () => {
    onLoading()
    try {
      const deleteAccess = await PatientService.handlePatientAccess(patient.invite.id)

      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patients-stats"] })

      toast.success(deleteAccess.message)
    } catch (error) {
      toast.error("Ação indisponível no momento!")
    } finally {
      offLoading()
    }
  }

  const onEditEmail = () => {
    setIsEditingEmail(true)
    setNewEmail(patient.email || "")
  }

  const onSaveEmail = async () => {
    if (!emailValidator(newEmail)) {
      toast.error("Por favor, digite um email válido!")
      return
    }

    onLoading()
    try {
      const updateInvite = await PatientService.updatePatientInvite(patient.invite.id, newEmail)
      toast.success(updateInvite.message)

      queryClient.invalidateQueries({ queryKey: ["patients"] })
      setIsEditingEmail(false)

    } catch (error) {
      toast.error("Erro ao atualizar o email, por favor tente novamente!")
    } finally {
      setNewEmail("")
      offLoading()
    }
  }

  const onCancelEmailEdit = () => {
    setIsEditingEmail(false)
    setNewEmail("")
  }

  return (
    <Popover onOpenChange={(open) => {
      if (!open) setIsEditingEmail(false)
    }}>
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
            disabled={!canResendInvite || count > 0 || isEditingEmail}
            onClick={onResendInvite}
          >
            <Send className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Reenviar o convite {count > 0 && `(${count})`}</span>
          </Button>

          {getPatientAction()}


          {canResendInvite && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-sm whitespace-nowrap"
                onClick={onEditEmail}
                disabled={!canResendInvite || isEditingEmail}
              >
                <Edit className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Alterar o email do paciente</span>
              </Button>

              {isEditingEmail && (
                <div className="space-y-2 pt-2 border-t">
                  <BasicInput
                    id="email"
                    type="email"
                    value={newEmail}
                    placeholder="Digite o novo email"
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex gap-1">
                    <Button size="sm" onClick={onSaveEmail} className="flex-1 gap-1">
                      <Check className="h-3 w-3" />
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onCancelEmailEdit}
                      className="flex-1 gap-1 bg-transparent"
                    >
                      <X className="h-3 w-3" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
