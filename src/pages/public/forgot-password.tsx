import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ClinicHubLogo from "/logo.png"
import AnimatedComponent from '@/components/animated-component';
import BasicInput from '@/components/basic-input/basic-input';
import { Mail, Phone, Send } from 'lucide-react';
import { emailValidator } from '@/utils/valid';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/api/auth.service';
import AuthBackground from '@/components/auth-background/auth-background';
import { Card, CardHeader } from '@/components/ui/card';
import { CardContent } from '@mui/material';

export default function ForgotPassword() {
  const { onLoading, offLoading } = useLoading();
  const navigate = useNavigate();

  const [data, setData] = useState('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onLoading();

    e.preventDefault();
    if (data === '') {
      toast.warn('Preencha as credenciais corretamnete');
    } else {
      await AuthService.forgotPassword(data).then((response) => {
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate('/login');
      }
    })
    .catch((error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    })
    .finally(async () => {
      await offLoading();
    })};
  };

  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const disabled = data === '' || emailError !== undefined;

  return (
      <AuthBackground>
        <AnimatedComponent type="slide-from-left" delay={100} duration="duration-500">
          <Card>
              <CardHeader id="header">
                <div className="self-start">
                  <div className="flex items-center space-x-2 self-start">
                    <img src={ClinicHubLogo} className="h-10 w-10 rounded-lg" />
                    <span className="text-xl font-semibold">ClinicHub</span>
                  </div>
                  <p className="text-sm self-start">Sistema de Gestão em Saúde</p>
                </div>
                <div className="space-y-1 mt-2">
                  <h1 className="text-2xl font-bold">Esqueceu sua senha?</h1>
                  <p>Não se preocupe, enviaremos instruções para redefinir sua senha</p>
                </div>
              </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} id="inputs" className="space-y-6">
                <BasicInput
                  label="E-mail"
                  leftIcon={
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  }
                  id="email"
                  type="email"
                  error={emailError}
                  placeholder="Digite seu e-mail cadastrado"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  onBlur={() => {
                    if (!emailValidator(data)) {
                      setEmailError('Preencha o e-mail corretamente');
                    } else {
                      setEmailError(undefined);
                    }
                  }}
                  autoComplete="email"
                  required
                />

                <Button
                  className="w-full"
                  disabled={disabled}
                  type="submit"
                >
                  <Send className="h-5 w-5" />
                  Enviar instruções
                </Button>

                <div
                  id="help-section"
                  className="mt-4 p-4 sm:p-5 bg-background rounded-xl shadow border flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 512 512">
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
                      </svg>
                    </span>
                    <h3 className="text-base font-semibold text-gray-800">Precisa de ajuda?</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam ou entre em contato com o suporte.
                  </p>
                  <div className="flex flex-col gap-1 mt-2">
                    <a
                      href="tel:+551112345678"
                      className="flex items-center text-base font-semibold text-primary hover:underline transition-colors"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      +55 11 1234-5678
                    </a>
                    <a
                      href="mailto:suporte@clinichub.com.br"
                      className="flex items-center text-base font-semibold text-primary hover:underline transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      suporte@clinichub.com.br
                    </a>
                  </div>
                </div>

                <Label className="text-center block text-sm font-normal leading-none mt-2">
                  Lembrou da senha?
                  <span
                    className="text-primary hover:underline ml-1 cursor-pointer font-medium"
                    onClick={() => {
                      navigate('/login');
                    }}
                  >
                    Fazer login
                  </span>
                </Label>
              </form>
            </CardContent>
          </Card>
        </AnimatedComponent>
      </AuthBackground>
  );
}
