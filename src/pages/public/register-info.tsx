import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IdCard, User, UserPlus, Phone, Calendar } from 'lucide-react';

import ClinicHubLogo from '/logo.png';
import AnimatedComponent from '@/components/animated-component';
import BasicInput from '@/components/basic-input/basic-input';
import { Button } from '@/components/ui/button';
import { formatCpfCnpj, formatPhone, formatDateInput } from '@/utils/formats';
import { isValidCPF } from '@/utils/valid';
import { AxiosError } from 'axios';
import { useLoading } from '@/context/loading-context';
import AccountService from '@/services/api/account.service';
import AuthBackground from '@/components/auth-background/auth-background';
import { Card } from '@/components/ui/card';

interface Step1Fields {
  email: string;
  password: string;
  checkTerms: boolean;
}

interface FormFields extends Step1Fields {
  name: string;
  cpf: string;
  phone: string;
  date_birth: string;
}

const isPatientFormValid = (fields: FormFields) => {
  const { name, cpf, phone, date_birth } = fields;
  return (
    name.length > 3 &&
    isValidCPF(cpf) &&
    phone &&
    phone.replace(/\D/g, '').length >= 10 &&
    date_birth &&
    date_birth.length === 10 // dd/mm/yyyy
  );
};

export default function RegisterInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const previousFields: Step1Fields = location.state || {};
  const [formFields, setFormFields] = useState<FormFields>({
    ...previousFields,
    name: '',
    cpf: '',
    phone: '',
    date_birth: '',
  });
  const { onLoading, offLoading } = useLoading();

  useEffect(() => {
    if (
      !previousFields.email ||
      !previousFields.password
    ) {
      toast.error('Informações incompletas. Comece o registro novamente.');
      navigate('/register-access');
    }
  }, [previousFields, navigate]);

  const disabledButton = useMemo(() => {
    return !isPatientFormValid(formFields);
  }, [formFields]);

  const handleInputChange = (field: keyof FormFields, value: string) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onLoading();

    await AccountService.createAccount({
      email: formFields.email,
      password: formFields.password,
      name: formFields.name,
      cpf: formFields.cpf.replace(/\D/g, ''),
      phone: formFields.phone?.replace(/\D/g, ''),
      date_birth: formFields.date_birth,
    })
      .then((response) => {
        if (response.status === 201) {
          navigate('/verify-email', { state: formFields.email });
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message);
        }
      })
      .finally(async () => {
        await offLoading();
      });
  };

  return (
    <AuthBackground animationSide="right">
      <AnimatedComponent
        type="slide-from-left"
        delay={100}
        duration="duration-500"
      >
        <Card>
          <div className="flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 space-y-6">
            <section id="header" className="space-y-10">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <img src={ClinicHubLogo} className="h-10 w-10 rounded-lg" />
                  <span className="text-2xl font-bold tracking-tight">
                    ClinicHub
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sistema de Gestão em Saúde
                </p>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold">Criar sua conta</h1>
                <p>Finalize suas informações</p>
              </div>
            </section>
            <section id="progress" className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-sm text-gray-600">Acesso</span>
              </div>
              <div className="w-full h-0.5 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-sm font-medium text-primary">
                  Informações
                </span>
              </div>
            </section>
            <form onSubmit={handleSubmit} id="inputs" className="space-y-5 2xl:space-y-6">
              <BasicInput
                id="full-name"
                label="Nome completo"
                value={formFields.name}
                type="text"
                placeholder="Digite seu nome completo"
                leftIcon={
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <BasicInput
                id="cpf-number"
                label="CPF"
                value={formatCpfCnpj(formFields.cpf)}
                type="text"
                placeholder="Digite seu CPF"
                maxLength={14}
                leftIcon={
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                onChange={(e) =>
                  handleInputChange(
                    'cpf',
                    e.target.value.replace(/[./-]/g, ''),
                  )
                }
              />
              <BasicInput
                id="phone-number"
                label="Telefone"
                value={formatPhone(formFields.phone)}
                type="text"
                placeholder="(00) 00000-0000"
                maxLength={15}
                leftIcon={
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                onChange={(e) =>
                  handleInputChange(
                    'phone',
                    e.target.value.replace(/\D/g, ''),
                  )
                }
              />
              <BasicInput
                id="date-birth"
                label="Data de nascimento"
                value={formatDateInput(formFields.date_birth || '')}
                type="text"
                placeholder="dd/mm/aaaa"
                maxLength={10}
                leftIcon={
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                }
                onChange={(e) =>
                  handleInputChange(
                    'date_birth',
                    formatDateInput(e.target.value),
                  )
                }
              />
              <Button
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary-foreground text-white flex items-center justify-center space-x-2"
                disabled={disabledButton}
                type="submit"
              >
                <UserPlus className="h-5 w-5" />
                Criar conta
              </Button>
            </form>
          </div>
        </Card>
      </AnimatedComponent>
    </AuthBackground>
  );
}
