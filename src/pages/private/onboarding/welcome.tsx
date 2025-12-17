import AuthBackground from "@/components/auth-background/auth-background";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight, Bell, Calendar, FileText, Heart, Info, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountService from "@/services/api/account.service";
import { useQuery } from "@tanstack/react-query";
import { useLoading } from "@/context/loading-context";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { onLoading, offLoading } = useLoading();

  const { data: account } = useQuery({
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
      <div className="w-full max-w-3xl lg:max-w-4xl space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div>
            <h1 className="text-2xl font-bold">ClinicHub</h1>
            <p className="text-sm opacity-90">Bem-vindo, paciente!</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <User className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Main Card */}
        <Card className="w-full border-none shadow-xl">
          <CardContent className="p-8 space-y-8">
            {/* Welcome Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
              <div className="space-y-2 max-w-lg">
                <h2 className="text-2xl font-bold text-gray-900">
                  Bem-vindo (a), {account?.name?.split(" ")[0] || "Paciente"}! Sua saúde agora está em um só lugar.
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Aqui você agenda consultas, acessa seus exames e recebe lembretes
                  importantes de forma simples e segura.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3 hover:bg-gray-100 transition-colors">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Agendamentos</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Marque e acompanhe suas consultas com poucos cliques.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3 hover:bg-gray-100 transition-colors">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Histórico Médico</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Veja todos os seus exames e consultas em um só lugar.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center space-y-3 hover:bg-gray-100 transition-colors">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Lembretes</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Receba avisos para nunca perder uma consulta ou uma informação importante.
                </p>
              </div>
            </div>

            {/* Security Banner */}
            <div className="bg-emerald-600 rounded-xl p-6 text-white flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold">Seus dados estão seguros!</h4>
                <p className="text-sm text-emerald-50 leading-relaxed opacity-90">
                  Protegemos suas informações médicas com os mais altos padrões de segurança.
                  Vamos precisar de alguns dados básicos para criar seu perfil e personalizar sua experiência.
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h4 className="font-semibold text-gray-900">Onde você está:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    1
                  </div>
                  <span className="text-sm text-gray-600">Informações pessoais básicas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">
                    2
                  </div>
                  <span className="text-sm text-gray-400">Conectar à minha clínica</span>
                </div>
              </div>
            </div>

            {/* Privacy Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-sm font-semibold text-blue-900">Privacidade e Segurança</h5>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Todas as informações são criptografadas e seguem as normas da LGPD.
                  Você pode alterar ou excluir seus dados a qualquer momento.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-8 pt-0 flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 h-auto text-base font-medium rounded-lg shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40"
            >
              Quero começar agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AuthBackground>
  );
}
