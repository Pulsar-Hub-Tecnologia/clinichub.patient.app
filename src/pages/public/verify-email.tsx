import AuthBackground from '@/components/auth-background/auth-background';
import { Button } from '@/components/ui/button';
import { MailOpen, Send } from 'lucide-react';

import ClinicHubLogo from "/logo.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import AnimatedComponent from '@/components/animated-component';
import { toast } from 'react-toastify';
import AuthService from '@/services/api/auth.service';
import { AxiosError } from 'axios';


export default function VerifyEmail() {
  const [count, setCount] = useState<number>(15)
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation()
  const navigate = useNavigate()

  const email: string = typeof location.state === "string" ? location.state : ""

  useEffect(() => {
    if (!email) {
      toast.error("Informações incompletas. Comece o registro novamente.")
      navigate("/register-access")
    }


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


  const handleSubmit = async () => {
    try {
      await AuthService.resendValidateEmail(email);
      setCount(15)
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error("Ops! Tivemos um problema, por favor tente novamente!")
      }

      return toast.error("Ops! Tivemos um problema ao reenviar o email de confirmação!")
    }
  }

  return (
    <AuthBackground animationSide='right'>
      <section className='flex flex-col justify-center w-full py-4 space-y-2'>
        <AnimatedComponent type='slide-from-top' delay={100} duration='duration-500'>
          <section id='header'>
            <div className='space-y-2'>
              <div className="flex items-center space-x-2">
                <img src={ClinicHubLogo} />
                <span className="text-xl font-semibold">ClinicHUB</span>
              </div>
              <p className="text-sm">Sistema de Gestão em Saúde</p>
            </div>
          </section>
        </AnimatedComponent>

        <AnimatedComponent type='slide-from-left' delay={100}>
          <section id='email-check' className="flex flex-col items-center justify-center space-y-5">
            <div className='flex items-center justify-center bg-green-100 rounded-full h-16 w-16'>
              <MailOpen size={30} className='text-green-600' />
            </div>

            <div className='flex flex-col items-center justify-center gap-2'>
              <h1 className='text-xl font-semibold text-center'>Verifique seu e-mail</h1>
              <p className='text-center'>
                Enviamos um link de verificação para<br />
                <strong className='text-primary'>{email || "seu e-mail"}</strong>
              </p>
            </div>

            <div className='flex flex-col bg-accent w-full p-4 space-y-5 rounded-xl'>
              <div className='flex gap-2'>
                <span className='flex items-center justify-center bg-purple-200 rounded-full h-8 w-8 text-primary font-bold mt-1'>
                  1
                </span>
                <div className='space-y-1'>
                  <h3 className='font-semibold'>Verifique sua caixa de entrada</h3>
                  <p className='text-xs'>Procure por um e-mail da ClinicHUB com o assunto "Confirme sua conta"</p>
                </div>
              </div>

              <div className='flex gap-2'>
                <span className='flex items-center justify-center bg-purple-200 rounded-full h-8 w-8 text-primary font-bold mt-1'>
                  2
                </span>
                <div className='space-y-1'>
                  <h3 className='font-semibold'>Clique no link de verificação</h3>
                  <p className='text-xs'>O link irá confirmar sua conta e você será redirecionado automaticamente</p>
                </div>
              </div>

              <div className='flex gap-2'>
                <span className='flex items-center justify-center bg-purple-200 rounded-full h-8 w-8 text-primary font-bold mt-1'>
                  3
                </span>
                <div className='space-y-1'>
                  <h3 className='font-semibold'>Acesse sua conta</h3>
                  <p className='text-xs'>Após a verificação, você poderá fazer login normalmente</p>
                </div>
              </div>
            </div>
          </section>
        </AnimatedComponent>

        <AnimatedComponent type='slide-from-bottom' delay={100}>
          <section className='space-y-6'>
            <div className='space-y-3'>
              <Button
                className='w-full'
                disabled={count !== 0}
                onClick={handleSubmit}
              >
                <Send className="h-5 w-5" />
                {count > 0 ? `Reenviar em ${count} segundos` : "Reenviar e-mail de verificação"}
              </Button>
              {/* <Button
                variant={'outline'}
                className="w-full"
                disabled={false}
                onClick={handleSubmit}
              >
                <SquarePen className="h-5 w-5" />
                Alterar endereço de e-mail
              </Button> */}
            </div>

            <div className='flex flex-col gap-2 text-center text-xs'>
              <span>
                Não recebeu o e-mail? Verifique sua pasta de spam ou lixo eletrônico.
              </span>
              <span>
                Ainda com problemas? <a href='#' className='text-primary cursor-pointer hover:underline'>Entre em contato conosco</a>
              </span>
            </div>
          </section>
        </AnimatedComponent>
      </section>
    </AuthBackground>
  );
}
