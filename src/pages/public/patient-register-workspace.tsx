import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone, Calendar, ArrowRight, Eye, EyeClosed, FileText } from 'lucide-react';

import TermsModal from '@/components/terms-modal/terms-modal';
import { Checkbox } from '@/components/ui/checkbox';
import PasswordInput from '@/components/password-input/password-input';
import BasicInput from '@/components/basic-input/basic-input';
import { useNavigate, useParams } from 'react-router-dom';
import AnimatedComponent from '@/components/animated-component';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import AuthBackground from '@/components/auth-background/auth-background';
import { emailValidator } from '@/utils/valid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/utils/formats';
import { api } from '@/services/api';
import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';

interface Workspace {
  id: string;
  name: string;
  picture: string;
  type: string;
  username: string;
}

interface FormFields {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  date_birth: string;
  password: string;
  confirmPassword: string;
  checkTerms: boolean;
}

const defaultFormFields: FormFields = {
  name: "",
  email: "",
  cpf: "",
  phone: "",
  date_birth: "",
  password: "",
  confirmPassword: "",
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

function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}

function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  }
  return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').substring(0, 15);
}

function formatDate(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 10);
}

export default function PatientRegisterWorkspace() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [openTerms, setOpenTerms] = useState<boolean>(false);
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        // Verificar se está autenticado
        const token = CookieController.get(PatientCookieName.TOKEN);
        setIsAuthenticated(!!token);

        const response = await api.get(`/patient/workspace/${username}`);
        setWorkspace(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message || "Clínica não encontrada");
        } else {
          toast.error("Erro ao carregar informações da clínica");
        }
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      loadWorkspace();
    }
  }, [username, navigate]);

  const handleFormFields = useCallback(<T extends keyof FormFields>(field: T, value: FormFields[T]) => {
    if (field === "email") {
      if (emailValidator(value as string)) {
        setEmailError(undefined)
      } else {
        setEmailError("Preencha o e-mail corretamente")
      }
    }

    if (field === "cpf") {
      const formatted = formatCPF(value as string);
      setFormFields(prev => ({ ...prev, [field]: formatted }));
      return;
    }

    if (field === "phone") {
      const formatted = formatPhone(value as string);
      setFormFields(prev => ({ ...prev, [field]: formatted }));
      return;
    }

    if (field === "date_birth") {
      const formatted = formatDate(value as string);
      setFormFields(prev => ({ ...prev, [field]: formatted }));
      return;
    }

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
      validatePasswordCharacteristic(formFields.password, "has_upper_letter") &&
      validatePasswordCharacteristic(formFields.password, "has_number") &&
      validatePasswordCharacteristic(formFields.password, "has_special_char") &&
      formFields.password === formFields.confirmPassword &&
      formFields.password.length >= 8
    );
  }, [formFields.password, formFields.confirmPassword]);

  const disabled_button = useMemo(() => {
    const cpfValid = formFields.cpf.replace(/\D/g, '').length === 11;
    const phoneValid = formFields.phone.replace(/\D/g, '').length >= 10;
    const dateValid = formFields.date_birth.length === 10;

    return !(
      formFields.name.length > 0 &&
      formFields.email.length > 0 &&
      emailValidator(formFields.email) &&
      cpfValid &&
      phoneValid &&
      dateValid &&
      password_valid &&
      formFields.checkTerms
    );
  }, [formFields, password_valid]);

  const handleLinkAuthenticatedPatient = async () => {
    try {
      setSubmitting(true);

      // Para paciente autenticado, apenas precisa vincular ao workspace
      // O backend identifica o paciente pelo CPF/email existente
      const auth = CookieController.get(PatientCookieName.AUTH);
      if (!auth?.patient) {
        toast.error("Dados do paciente não encontrados. Faça login novamente.");
        navigate("/login");
        return;
      }

      const response = await api.post(`/patient/register/${username}`, {
        name: auth.patient.name,
        email: auth.patient.email,
        cpf: auth.patient.cpf,
        phone: auth.patient.phone,
        date_birth: auth.patient.date_birth,
        password: "dummy", // Senha não será usada pois paciente já existe
      });

      toast.success(response.data.message);
      navigate("/invites");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Erro ao vincular workspace");
      } else {
        toast.error("Erro ao vincular workspace");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const cpf = formFields.cpf.replace(/\D/g, '');
      const phone = formFields.phone.replace(/\D/g, '');
      const [day, month, year] = formFields.date_birth.split('/');
      const date_birth = `${year}-${month}-${day}`;

      const response = await api.post(`/patient/register/${username}`, {
        name: formFields.name,
        email: formFields.email,
        cpf,
        phone,
        date_birth,
        password: formFields.password,
      });

      toast.success(response.data.message);

      if (response.data.patientExists) {
        // Paciente já existe e foi vinculado ao workspace
        navigate("/login");
      } else {
        // Novo paciente - redirecionar para verificação de email
        navigate("/verify-email", {
          state: {
            email: formFields.email,
            message: "Cadastro realizado com sucesso! Verifique seu e-mail para validar sua conta."
          }
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || "Erro ao realizar cadastro");
      } else {
        toast.error("Erro ao realizar cadastro");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AuthBackground animationSide='right'>
        <div className="flex flex-col justify-center items-center px-4 py-4 space-y-5">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </AuthBackground>
    );
  }

  if (!workspace) {
    return null;
  }

  const workspaceName = workspace.type === "PERSONAL"
    ? `Clínica de ${workspace.username}`
    : workspace.name || workspace.username;

  // Se o paciente já está autenticado, mostrar tela simplificada
  if (isAuthenticated) {
    return (
      <AuthBackground animationSide='right'>
        <div className="flex flex-col justify-center px-4 py-4 space-y-6 max-w-md mx-auto">
          <AnimatedComponent type='slide-from-left' delay={100} duration='duration-500'>
            <section className="space-y-8 text-center">
              <div className='space-y-4'>
                <div className="flex justify-center">
                  <Avatar className="h-20 w-20 rounded-lg">
                    <AvatarImage src={workspace.picture} alt={workspaceName} />
                    <AvatarFallback className="rounded-lg text-2xl">
                      {getInitials(workspaceName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{workspaceName}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {workspace.type === "PERSONAL" ? "Clínica Pessoal" : "Clínica Empresarial"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Vincular-se a esta clínica?</h2>
                <p className="text-sm text-gray-600">
                  Você será vinculado a esta clínica e poderá agendar consultas e acessar seus serviços.
                </p>
              </div>
            </section>
          </AnimatedComponent>

          <AnimatedComponent type='slide-from-bottom' delay={200} duration='duration-700' className="space-y-4">
            <Button
              variant={'default'}
              className="w-full py-4 text-base font-semibold text-white flex items-center justify-center space-x-2"
              disabled={submitting}
              onClick={handleLinkAuthenticatedPatient}
            >
              {submitting ? "Vinculando..." : "Vincular à clínica"}
              {!submitting && <ArrowRight className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              className="w-full py-4 text-base"
              onClick={() => navigate("/invites")}
              disabled={submitting}
            >
              Voltar para Minhas Clínicas
            </Button>
          </AnimatedComponent>
        </div>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground animationSide='right'>
      <div className="flex flex-col justify-center px-4 py-4 space-y-5">
        <AnimatedComponent type='slide-from-left' delay={100} duration='duration-500'>
          <section id="header" className="space-y-10">
            <div className='space-y-2'>
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10 rounded-lg">
                  <AvatarImage src={workspace.picture} alt={workspaceName} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(workspaceName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-2xl font-bold tracking-tight">{workspaceName}</span>
              </div>
              <p className="text-xs text-muted-foreground">Cadastro de paciente</p>
            </div>
            <div className='space-y-1'>
              <h1 className="text-2xl font-bold">Crie sua conta</h1>
              <p className="text-sm">Preencha seus dados para começar</p>
            </div>
          </section>
        </AnimatedComponent>

        <AnimatedComponent type='slide-from-bottom' delay={200} duration='duration-700' className="space-y-6">
          <section id="inputs" className='space-y-4'>
            <BasicInput
              label="Nome completo"
              leftIcon={<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
              id="name"
              type="text"
              placeholder="Seu nome completo"
              value={formFields.name}
              required={true}
              onChange={(e) => handleFormFields("name", e.target.value)}
            />

            <BasicInput
              label="E-mail"
              leftIcon={<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={formFields.email}
              error={emailError}
              required={true}
              onChange={(e) => handleFormFields("email", e.target.value)}
              onBlur={() => {
                if (!emailValidator(formFields.email)) {
                  setEmailError("Preencha o e-mail corretamente");
                } else {
                  setEmailError(undefined);
                }
              }}
            />

            <BasicInput
              label="CPF"
              leftIcon={<FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formFields.cpf}
              required={true}
              onChange={(e) => handleFormFields("cpf", e.target.value)}
            />

            <BasicInput
              label="Telefone"
              leftIcon={<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
              id="phone"
              type="text"
              placeholder="(00) 00000-0000"
              value={formFields.phone}
              required={true}
              onChange={(e) => handleFormFields("phone", e.target.value)}
            />

            <BasicInput
              label="Data de nascimento"
              leftIcon={<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
              id="date_birth"
              type="text"
              placeholder="DD/MM/AAAA"
              value={formFields.date_birth}
              required={true}
              onChange={(e) => handleFormFields("date_birth", e.target.value)}
            />

            <div className='space-y-4'>
              <PasswordInput
                label="Senha"
                value={formFields.password}
                required
                onChange={(e) => handleFormFields("password", e.target.value)}
              />

              <BasicInput
                id="confirmPassword"
                label="Confirmar senha"
                placeholder="Confirme sua senha"
                type={passwordVisible ? "text" : "password"}
                value={formFields.confirmPassword}
                required
                onChange={(e) => handleFormFields("confirmPassword", e.target.value)}
                leftIcon={<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />}
                rightIcon={
                  <div onClick={() => setPasswordVisible(prev => !prev)}>
                    {passwordVisible ? (
                      <EyeClosed className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                    ) : (
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                    )}
                  </div>
                }
                error={formFields.password !== formFields.confirmPassword && formFields.confirmPassword.length > 0 ? "As senhas não coincidem. Por favor, tente novamente." : undefined}
              />
            </div>
          </section>

          <section id='terms-check' className='flex space-x-2 items-start pt-2'>
            <Checkbox
              id="terms"
              checked={formFields.checkTerms}
              onClick={() => handleFormFields("checkTerms", !formFields.checkTerms)}
              className="mt-1"
            />
            <Label className="text-xs font-normal leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
            disabled={disabled_button || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Cadastrando..." : "Criar conta"}
            {!submitting && <ArrowRight className="h-5 w-5" />}
          </Button>

          <Label className="text-center block text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Já possui cadastro?
            <span className="text-primary hover:underline ml-1 cursor-pointer" onClick={() => navigate("/login")}>Acesse sua conta</span>
          </Label>
        </AnimatedComponent>
      </div>
    </AuthBackground>
  );
}
