import AuthBackground from "@/components/auth-background/auth-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Bell, Calendar, FilePlus, Heart, ShieldCheck, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountService from "@/services/api/account.service";
import { useQuery } from "@tanstack/react-query";
import { useLoading } from "@/context/loading-context";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { onLoading, offLoading } = useLoading();

  const { data: account, isLoading } = useQuery({
    queryKey: ["account"],
    queryFn: AccountService.getAccount,
  });

  const handleSubmit = async () => {
    try {
      onLoading();
      if (account?.id) {
        await AccountService.updateAccount({ ...account, has_onboarding: true });
      }
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      offLoading();
    }
  };

  return (
    <AuthBackground animationSide="background">
      <Card className="w-full h-dvh md:h-full max-w-3xl lg:max-w-4xl">
        <CardHeader className="bg-[#3b0764] p-6 rounded-t-lg">
          <div className="flex items-center justify-between text-white">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold">ClinicHub</h2>
              <p className="text-sm opacity-90">
                Bem-vindo, paciente!
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#2dd4bf] flex items-center justify-center shadow-lg shadow-emerald-200">
              <Heart className="h-8 w-8 text-white fill-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Bem-vindo (a), {account?.name?.split(" ")[0] || "Paciente"}! Sua saúde agora está em um só lugar.
              </h2>
              <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
                Aqui você agenda consultas, acessa seus exames e recebe lembretes
                importantes de forma simples e segura.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-[#3b0764]" />
              </div>
              <h3 className="font-semibold text-gray-900">Agendamentos</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Marque e acompanhe suas consultas com poucos cliques.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <FilePlus className="h-6 w-6 text-[#2dd4bf]" />
              </div>
              <h3 className="font-semibold text-gray-900">Histórico Médico</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Veja todos os seus exames e consultas em um só lugar.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <Bell className="h-6 w-6 text-[#3b0764]" />
              </div>
              <h3 className="font-semibold text-gray-900">Lembretes</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Receba avisos para nunca perder uma consulta ou uma informação importante.
              </p>
            </div>
          </div>

          <div className="bg-[#2dd4bf] rounded-xl p-6 text-white flex gap-4 items-start">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Seus dados estão seguros!</h4>
              <p className="text-sm text-emerald-50 leading-relaxed opacity-90">
                Protegemos suas informações médicas com os mais altos padrões de segurança.
                Vamos precisar de alguns dados básicos para criar seu perfil e personalizar sua experiência.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-8 pt-0 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#3b0764] hover:bg-[#3b0764]/90 text-white px-6 py-4 text-base font-medium rounded-lg"
          >
            Quero começar agora
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardFooter>
      </Card>
    </AuthBackground>
  );
}
