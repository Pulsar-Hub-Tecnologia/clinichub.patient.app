import { ModeToggle } from '@/components/mode-toggle/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useLoading } from '@/context/loading-context';
import AuthService from '@/services/api/auth.service';
import { AxiosError } from 'axios';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '/logo.png';
import BasicInput from '@/components/basic-input/basic-input';
import PasswordInput from '@/components/password-input/password-input';

export default function RecoverPassword() {
  const { onLoading, offLoading } = useLoading();

  const navigate = useNavigate();
  const { email, token } = useParams()

  const [data, setData] = useState({
    password: '',
    confirm_password: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    await onLoading();

    try {
      e.preventDefault();
      if (data.password === '' || data.confirm_password === '') {
        toast.warn('Preencha as senhas corretamnete');
      } else if (data.password !== data.confirm_password) {
        toast.warn('As senhas não coincidem');
      } else {
        const response = await AuthService.recoverPassword({ ...data, email: email!, token: token! });
        if (response.status === 200) {
          toast.success(response.data.message);
          await navigate(`/login`);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        return toast.error(
          error.response?.data?.message || 'Algo deu errado, tente novamente.',
        );
      }
    } finally {
      await offLoading();
    }
  };

  const password_valid = useMemo(() => {
    return (
      validatePasswordCharacteristic(data.password, "has_upper_letter") &&
      validatePasswordCharacteristic(data.password, "has_number") &&
      validatePasswordCharacteristic(data.password, "has_special_char") &&
      data.password === data.confirm_password
    );
  }, [data.password, data.confirm_password]);

  const disabled = !password_valid;

  return (
    <section className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <Card className="w-full max-w-md flex flex-col items-center justify-center p-6">
        <img src={logo} className="font-medium h-[4rem]" />
        <form onSubmit={handleSubmit}>
          <Card className="border-none items-center shadow-none max-w-[400px]">
            <CardHeader>
              <CardTitle>Redefina sua senha</CardTitle>
              <CardDescription>
                Crie uma nova senha para acessar o ClinicHub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <PasswordInput
                  label="Nova Senha"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="">
                  Confirme sua Senha
                </Label>
                <BasicInput
                  id="confirm_password"
                  type='password'
                  placeholder="••••••••"
                  value={data.confirm_password}
                  onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
                  error={data.password !== data.confirm_password && data.confirm_password.length > 0 ? "As senhas não coincidem. Por favor, tente novamente." : undefined}

                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={disabled}>
                Redefinir
              </Button>
            </CardFooter>
          </Card>
        </form>
        <ModeToggle />
      </Card>
    </section>

  );
}

function validatePasswordCharacteristic(text: string, checkType: "has_upper_letter" | "has_number" | "has_special_char"): boolean {
  switch (checkType) {
    case "has_upper_letter":
      return /[A-Z]/.test(text);
    case "has_number":
      return /[0-9]/.test(text);
    case "has_special_char":
      return /[^a-zA-Z0-9\s]/.test(text);
    default:
      return false;
  }
}
