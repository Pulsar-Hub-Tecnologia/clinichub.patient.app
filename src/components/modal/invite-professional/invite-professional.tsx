import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Send } from "lucide-react"
import BasicInput from "@/components/basic-input/basic-input"
import { formatCpfCnpj } from "@/utils/formats"
import { toast } from "react-toastify"

interface InviteProfessionalModalProps {
  children?: React.ReactNode;
}

export default function InviteProfessional({ children }: InviteProfessionalModalProps) {
  const [open, setOpen] = useState(false)
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("Profissional")

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpfCnpj(e.target.value)
    if (formatted.length <= 14) {
      setCpf(formatted)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    setCpf("")
    setEmail("")
    setRole("Profissional")
    toast.error("Ação em desenvolvimento!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Novo Profissional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicInput
            id="cpf"
            label="CPF do Profissional"
            value={cpf}
            onChange={handleCPFChange}
            placeholder="000.000.000-00"
            required
          />
          <BasicInput
            label="Email do Profissional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="profissional@email.com"
            required
          />

          <div className="space-y-3">
            <Label>Função</Label>
            <RadioGroup value={role} onValueChange={setRole}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Profissional" id="professional" />
                <Label htmlFor="professional">Profissional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Administrador" id="adm" />
                <Label htmlFor="adm">Administrador</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid">Administrador/Profissional</Label>
              </div>
            </RadioGroup>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4 mr-2" />
            Enviar Convite
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
