import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Barcode,
  QrCode,
  User,
  MapPin,
  Edit2,
  Check,
  ShieldCheck,
  Phone,
  Mail,
  Lock,
  Building,
  Headphones,
  ShoppingCart
} from "lucide-react";
import AccountService from "@/services/api/account.service";
import CheckoutService from "@/services/api/checkout.service";
import { toast } from "react-toastify";
import { useLoading } from "@/context/loading-context";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { onLoading, offLoading } = useLoading();
  const { item, type, workspace } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const { data: account } = useQuery({
    queryKey: ["account"],
    queryFn: AccountService.getAccount,
  });

  if (!item || !workspace) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">Nenhum item selecionado para checkout.</p>
        <Button onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  const calculateTotal = () => {
    if (type === 'plan') {
      // Logic for plan total (sum of steps or fixed price if available)
      // Assuming item has a price or we calculate from steps
      if (item.price) return item.price;
      if (item.steps) {
        return item.steps.reduce((acc: number, step: any) => {
          return acc + (step.service?.price || 0) * step.quantity;
        }, 0);
      }
      return 0;
    } else {
      return item.price || 0;
    }
  };

  const total = calculateTotal();
  const discount = 50.00; // Mocked discount from image
  const finalTotal = Math.max(0, total - discount);

  const handleFinish = async () => {
    try {
      onLoading();
      await CheckoutService.buyPlan({
        planId: item.id,
        workspaceId: workspace.id,
        paymentMethod,
      });
      toast.success("Contratação realizada com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao realizar contratação");
    } finally {
      offLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-8 w-8 text-[#3b0764]" />
          <h1 className="text-3xl font-bold text-[#3b0764]">Finalizar Contratação</h1>
        </div>
        <p className="text-gray-600 mb-8 -mt-6 ml-11">Complete os dados para contratar seu {type === 'plan' ? 'plano' : 'serviço'}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">

            {/* Personal Data */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-[#3b0764]" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Dados Pessoais</CardTitle>
                    <p className="text-sm text-gray-500">Informações cadastradas</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="bg-purple-50 text-[#3b0764] hover:bg-purple-100">
                  <Edit2 className="h-3 w-3 mr-2" />
                  Alterar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Nome:</span>
                    <span className="font-medium ml-2">{account?.name || "João Silva"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">CPF:</span>
                    <span className="font-medium ml-2">{account?.cpf || "123.456.789-00"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">Endereço</CardTitle>
                    <p className="text-sm text-gray-500">Informações de localização</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
                  <Edit2 className="h-3 w-3 mr-2" />
                  Alterar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">CEP:</span>
                    <span className="font-medium ml-2">01310-100</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <span className="font-medium ml-2">São Paulo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-6">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Forma de Pagamento</CardTitle>
                  <p className="text-sm text-gray-500">Escolha como deseja pagar</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-4">
                  <div>
                    <RadioGroupItem value="credit_card" id="credit_card" className="peer sr-only" />
                    <Label
                      htmlFor="credit_card"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#3b0764] peer-data-[state=checked]:text-[#3b0764] cursor-pointer"
                    >
                      <CreditCard className="mb-3 h-6 w-6" />
                      Cartão de Crédito
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="boleto" id="boleto" className="peer sr-only" />
                    <Label
                      htmlFor="boleto"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#3b0764] peer-data-[state=checked]:text-[#3b0764] cursor-pointer"
                    >
                      <Barcode className="mb-3 h-6 w-6" />
                      Boleto
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                    <Label
                      htmlFor="pix"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#3b0764] peer-data-[state=checked]:text-[#3b0764] cursor-pointer"
                    >
                      <QrCode className="mb-3 h-6 w-6" />
                      PIX
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit_card" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_number">Número do Cartão *</Label>
                      <Input id="card_number" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card_name">Nome no Cartão *</Label>
                      <Input id="card_name" placeholder="Como está impresso no cartão" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card_expiry">Validade *</Label>
                        <Input id="card_expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card_cvv">CVV *</Label>
                        <Input id="card_cvv" placeholder="000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="installments">Parcelas</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o parcelamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1x de {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</SelectItem>
                          <SelectItem value="2">2x de {(finalTotal / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</SelectItem>
                          <SelectItem value="3">3x de {(finalTotal / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Li e aceito os <span className="text-[#3b0764] font-bold">termos de uso</span> e a <span className="text-[#3b0764] font-bold">política de privacidade</span>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="marketing" />
                  <Label htmlFor="marketing" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Aceito receber comunicações sobre novidades, promoções e atualizações do plano
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox id="info" />
                  <Label htmlFor="info" className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Confirmo que todas as informações fornecidas são verdadeiras e estou ciente de que informações falsas podem resultar no cancelamento do plano
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6 space-y-6">
                {/* Clinic Info */}
                <div className="flex items-center gap-3 pb-6 border-b">
                  <div className="h-12 w-12 rounded-lg bg-[#3b0764] flex items-center justify-center text-white">
                    {workspace.workspace_picture ? (
                      <img src={workspace.workspace_picture} alt="" className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <Building className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{workspace.workspace_name}</h3>
                    <p className="text-sm text-gray-500">{item.name}</p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3 bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-bold text-[#3b0764] flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Benefícios inclusos:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {type === 'plan' && item.steps?.map((step: any, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        {step.quantity}x {step.service?.name}
                      </li>
                    ))}
                    {type === 'service' && (
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        1x {item.name}
                      </li>
                    )}
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Agendamento prioritário
                    </li>
                  </ul>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Valor {type === 'plan' ? 'do plano' : 'do serviço'}</span>
                    <span>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxa de adesão</span>
                    <span>R$ 0,00</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Desconto primeira mensalidade</span>
                    <span>-R$ {discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div>
                  <div className="flex justify-between items-end mb-1">
                    <span className="font-bold text-gray-900">Total a pagar hoje</span>
                    <span className="text-2xl font-bold text-[#3b0764]">
                      {finalTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <p className="text-xs text-right text-gray-500">
                    Renovação: {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
                  </p>
                </div>

                {/* Promo Box */}
                <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">Promoção de Boas-vindas!</p>
                    <p className="text-xs text-green-700">Economize R$ 50,00 na primeira mensalidade</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full bg-[#3b0764] hover:bg-[#3b0764]/90 h-12 text-base" onClick={handleFinish}>
                    <Lock className="mr-2 h-4 w-4" />
                    Finalizar Contratação
                  </Button>
                  <Button variant="outline" className="w-full h-12" onClick={() => navigate(-1)}>
                    Voltar
                  </Button>
                </div>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Pagamento Seguro
                  </div>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    SSL Certificado
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="bg-emerald-50 border-none">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Headphones className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Precisa de ajuda?</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Nossa equipe está pronta para auxiliá-lo
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    (11) 3456-7890
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-600" />
                    (11) 98765-4321
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    suporte@clinichub.com.br
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
