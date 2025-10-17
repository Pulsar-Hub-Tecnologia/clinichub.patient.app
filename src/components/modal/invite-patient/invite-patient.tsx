import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"
import BasicInput from "@/components/basic-input/basic-input"
import { formatCpfCnpj } from "@/utils/formats"
import { emailValidator } from "@/utils/valid"
import { useLoading } from "@/context/loading-context"
import { toast } from "react-toastify"
import { useQueryClient } from "@tanstack/react-query"
import PatientService from "@/services/api/patient.service"

interface InvitePatientModalProps {
  children?: React.ReactNode;
}

export default function InvitePatient({ children }: InvitePatientModalProps) {
  const [open, setOpen] = useState(false)
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    cpf: "",
    email: "",
    planBilling: "services",
    selectedPlan: "",
  })

  const { onLoading, offLoading } = useLoading()
  const queryClient = useQueryClient()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onLoading()
    try {
      const invite = await PatientService.invitePatient(formData.cpf, formData.email)
      toast.success(invite.message)

      queryClient.invalidateQueries({ queryKey: ["patients"] })
      queryClient.invalidateQueries({ queryKey: ["patients-stats"] })
    } catch (error) {
      console.log(error)
      toast.error("Erro ao convidar o paciente, por favor tente novamente!")
    } finally {
      setOpen(false)
      setFormData({
        cpf: "",
        email: "",
        planBilling: "services",
        selectedPlan: "",
      })
      offLoading()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Novo Paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInput
            id="cpf-number"
            label="CPF"
            value={formatCpfCnpj(formData.cpf)}
            type="text"
            placeholder="000.000.000-00"
            maxLength={14}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, cpf: e.target.value.replace(/[./-]/g, '') }))
            }
          />
          <BasicInput
            id="email"
            type="email"
            label="Email do Paciente"
            placeholder="paciente@email.com"
            required
            value={formData.email}
            error={emailError}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            onBlur={() => {
              if (!emailValidator(formData.email)) {
                setEmailError("Preencha o e-mail corretamente")
              } else {
                setEmailError(undefined)
              }
            }}
          />

          <div className="space-y-3">
            <Label>Vincular cobrança de plano?</Label>
            <RadioGroup
              value={formData.planBilling}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, planBilling: value }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="services" id="services" />
                <Label htmlFor="services">Cobrança apenas avulsa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="plan" id="plan" />
                <Label htmlFor="plan">Sim, Plano</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.planBilling === "plan" && (
            <div className="space-y-2">
              <Label htmlFor="plan-select">Selecionar Plano</Label>
              <Select
                value={formData.selectedPlan}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectedPlan: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Plano Básico</SelectItem>
                  <SelectItem value="premium">Plano Premium</SelectItem>
                  <SelectItem value="enterprise">Plano Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              !formData.cpf ||
              !emailValidator(formData.email) ||
              (formData.planBilling === "plan" && !formData.selectedPlan)
            }
          >
            <Send className="h-4 w-4" />
            Enviar Convite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
