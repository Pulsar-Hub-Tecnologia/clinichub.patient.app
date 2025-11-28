import { useCallback, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, ArrowRight } from 'lucide-react';

import ClinicHubLogo from "/logo.png";
import TermsModal from '@/components/terms-modal/terms-modal';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordInput from '@/components/password-input/password-input';
import BasicInput from '@/components/basic-input/basic-input';
import { useNavigate } from 'react-router-dom';
import AnimatedComponent from '@/components/animated-component';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import AccountService from '@/services/api/account.service';
import AuthBackground from '@/components/auth-background/auth-background';
import { Card } from '@/components/ui/card';

interface FormFields {
  email: string;
  password: string;
  checkTerms: boolean;
}

const defaultFormFields: FormFields = {
  email: "",
  password: "",
  checkTerms: false,
};

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

export default function RegisterAccess() {
  const [openTerms, setOpenTerms] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);

  const navigate = useNavigate();

  const handleFormFields = useCallback(<T extends keyof FormFields>(field: T, value: FormFields[T]) => {
    setFormFields(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleAcceptTerms = useCallback(() => {
    handleFormFields("checkTerms", true);
    setOpenTerms(false);
  }, [handleFormFields]);

  const password_valid = useMemo(() => {
    return (
      formFields.password.length >= 8 &&
      validatePasswordCharacteristic(formFields.password, "has_upper_letter") &&
      validatePasswordCharacteristic(formFields.password, "has_number") &&
      validatePasswordCharacteristic(formFields.password, "has_special_char")
    );
  }, [formFields.password]);

  const disabled_button = useMemo(() => {
    return !(
      formFields.email.length > 0 &&
      password_valid &&
      formFields.checkTerms
    );
  }, [formFields.email, password_valid, formFields.checkTerms]);

  const handleSubmit = async () => {
    try {
      const response = await AccountService.validateAccount({ field: "email", value: formFields.email });

      if (!response.data.has_user) {
        return navigate("/register-info", { state: formFields });
      }

      return toast.error("Já existe um usuário com este e-mail!")
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message)
      }
      toast.error("Parece que estamos enfrentando problemas técnicos. Tente novamente mais tarde!")
    }
  };

  return (
    <AuthBackground animationSide='right'>
      <AnimatedComponent type='slide-from-left' delay={100} duration='duration-500'>
        <Card>
          <div className="flex flex-col justify-center px-4 py-4 space-y-5">
            <section id='header' className='space-y-2'>
              <div className='space-y-2'>
                <div className="flex items-center space-x-2">
                  <img src={ClinicHubLogo} alt="ClinicHUB Logo" className="h-10 w-10 rounded-lg" />
                  <span className="text-2xl font-bold tracking-tight">ClinicHub</span>
                </div>
                <p className="text-xs text-muted-foreground">Sistema de Gestão em Saúde</p>
              </div>
              <div className='space-y-1'>
                <h1 className="text-2xl sm:text-3xl font-bold">Crie sua conta</h1>
                <p className="text-sm">Portal do Paciente - Acesse suas consultas e histórico médico</p>
              </div>
            </section>

            <section id='progress' className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-xs font-medium text-primary">Acesso</span>
              </div>
              <div className="w-full h-0.5 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-xs">Informações</span>
              </div>
            </section>

            <section id="inputs" className='space-y-3'>
              <BasicInput
                label="E-mail"
                leftIcon={
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                id="email"
                type="email"
                autoComplete='email'
                placeholder="seu@email.com"
                onChange={(e) => handleFormFields("email", e.target.value)}
                value={formFields.email}
              />

              <PasswordInput
                label="Senha"
                value={formFields.password}
                onChange={(e) => handleFormFields("password", e.target.value)}
              />
            </section>

            <section id='terms-check' className='flex space-x-2 items-center pt-2'>
              <Checkbox
                id="terms"
                checked={formFields.checkTerms}
                onClick={() => handleFormFields("checkTerms", !formFields.checkTerms)}
              />
              <Label
                className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Concordo com os
                <span className="text-primary hover:underline ml-1 cursor-pointer" onClick={() => setOpenTerms(true)}>Termos de Uso</span> e
                <span className="text-primary hover:underline ml-1 cursor-pointer" onClick={() => setOpenTerms(true)}>Política de Privacidade</span>
              </Label>
            </section>
            <TermsModal
              isOpen={openTerms}
              onClose={() => setOpenTerms(false)}
              onAccept={handleAcceptTerms}
            />

            <Button
              variant={'default'}
              className="w-full py-4 text-base font-semibold text-white flex items-center justify-center space-x-2"
              disabled={disabled_button}
              onClick={handleSubmit}
            >
              Continuar
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </AnimatedComponent>
    </AuthBackground>
  );
}
