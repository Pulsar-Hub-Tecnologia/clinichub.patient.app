import AnimatedComponent from '@/components/animated-component';
import BasicInput from '@/components/basic-input/basic-input';
import { Button } from '@/components/ui/button';
import ClinicHubLogo from "/logo.png"
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useLoading } from '@/context/loading-context';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Mail, Lock, EyeClosed, Eye } from 'lucide-react';
import { emailValidator } from '@/utils/valid';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AuthService from '@/services/api/auth.service';
import AuthBackground from '@/components/auth-background/auth-background';
import { Checkbox } from '@/components/ui/checkbox';

interface FormFields {
  email: string;
  password: string;

}

const defaultFormFields: FormFields = {
  email: "",
  password: ""
}

export default function Login() {

  const { onLoading, offLoading } = useLoading();
  const { signIn } = useAuth();
  const [data, setData] = useState(defaultFormFields);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [rememberAccess, setRememberAccess] = useState<boolean>(false);

  const setUser = (field: keyof FormFields, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();

    try {
      if (!data.email || !data.password) {
        toast.warn('Preencha as credenciais corretamente');
        return;
      }
      if (!emailValidator(data.email)) {
        setEmailError('Preencha o e-mail corretamente');
        return;
      }

      const { email, password } = data;
      const response = await AuthService.login(email, password);

      if (response.status === 200) {
        await signIn(response.data, rememberAccess);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.'
        );
      }
    } finally {
      await offLoading();
    }
  };


  const disabled = data.email === '' || data.password === '' || emailError !== undefined;

  return (
    <AuthBackground animationSide='right'>
      <AnimatedComponent type='slide-from-left' delay={100} duration='duration-500'>
        <Card className='flex flex-col justify-center'>
          <CardHeader id='header'>
            <div className='space-y-2 self-start'>
              <div className="flex items-center space-x-2">
                <img src={ClinicHubLogo} />
                <span className="text-xl font-semibold">ClinicHub</span>
              </div>
              <p className="text-sm">Sistema de Gestão em Saúde</p>
            </div>
            <div className='space-y-1 self-start'>
              <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
              <p>Acesse sua conta para continuar</p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} id="inputs" className='space-y-5'>
              <BasicInput
                label="E-mail"
                leftIcon={
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                id="email"
                type="email"
                error={emailError}
                placeholder="seu@email.com"
                value={data.email}
                onChange={(e) => {
                  setUser('email', e.target.value);
                }}
                onBlur={() => {
                  if (!emailValidator(data.email)) {
                    setEmailError('Preencha o e-mail corretamente');
                  } else {
                    setEmailError(undefined);
                  }
                }}
                autoComplete="email"
                required
              />
              <BasicInput
                label="Senha"
                placeholder="Digite sua senha"
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={data.password}
                required
                onChange={(e) => setUser('password', e.target.value)}
                leftIcon={
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                rightIcon={
                  <div onClick={() => setPasswordVisible(prev => !prev)}>
                    {passwordVisible ? (
                      <EyeClosed className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                    ) : (
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                    )}
                  </div>
                }
              />
              <div className='flex justify-between'>
                <div className='flex items-center gap-1 cursor-pointer'>
                  <Checkbox
                    id="remember"
                    checked={rememberAccess}
                    onClick={() => setRememberAccess(prev => !prev)}
                  />
                  <label htmlFor='remember' className="flex text-sm cursor-pointer">
                    Lembrar do acesso
                  </label>
                </div>
                <span className="flex text-sm text-primary hover:underline cursor-pointer" onClick={() => navigate('/forgot-password')}>
                  Esqueceu a senha?
                </span>
              </div>

              <Button
                className="w-full"
                disabled={disabled}
                type="submit"
              >
                <LogIn className="h-5 w-5" />
                Entrar
              </Button>
              <Label className="text-center block text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Não tem uma conta?
                <span className="text-primary hover:underline ml-1 cursor-pointer" onClick={() => navigate('/register-access')}>Cadastre-se gratuitamente</span>
              </Label>
            </form>
          </CardContent>

        </Card>
      </AnimatedComponent>
    </AuthBackground>
  );
}


