import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Building, IdCard, Newspaper, User, UserPlus } from 'lucide-react';

import ClinicHubLogo from '/logo.png';
import AnimatedComponent from '@/components/animated-component';
import BasicInput from '@/components/basic-input/basic-input';
import { Button } from '@/components/ui/button';
import { formatCpfCnpj } from '@/utils/formats';
import { isValidCNPJ, isValidCPF } from '@/utils/valid';
import { AxiosError } from 'axios';
import { useLoading } from '@/context/loading-context';
import AccountService from '@/services/api/account.service';
import AuthBackground from '@/components/auth-background/auth-background';

interface FormFields {
  userType: 'PERSONAL' | 'BUSINESS';
  email: string;
  password: string;
  confirmPassword: string;
  checkTerms: boolean;
  name: string;
  cpf: string;
  clinicName?: string;
  cnpj?: string;
  councilNumber?: string;
}

const isPersonalFormValid = (fields: FormFields) => {
  const { name, cpf, councilNumber } = fields;
  return (
    name.length > 3 &&
    isValidCPF(cpf) &&
    councilNumber &&
    councilNumber.length > 0
  );
};

const isBusinessFormValid = (fields: FormFields) => {
  const { name, cpf, clinicName, cnpj } = fields;
  return (
    name.length > 3 &&
    isValidCPF(cpf) &&
    clinicName &&
    clinicName.length > 3 &&
    cnpj &&
    isValidCNPJ(cnpj)
  );
};

export default function RegisterInfo() {
  const location = useLocation();
  const navigate = useNavigate();

  const previousFields: FormFields = location.state || {};
  const [formFields, setFormFields] = useState<FormFields>(previousFields);
  const { onLoading, offLoading } = useLoading();

  useEffect(() => {
    if (
      !previousFields.userType ||
      !previousFields.email ||
      !previousFields.password
    ) {
      toast.error('Informações incompletas. Comece o registro novamente.');
      navigate('/register-access');
    }
  }, [previousFields, navigate]);

  const disabledButton = useMemo(() => {
    if (formFields.userType === 'PERSONAL') {
      return !isPersonalFormValid(formFields);
    }
    return !isBusinessFormValid(formFields);
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
      workspace_type: formFields.userType,
      email: formFields.email,
      password: formFields.password,
      name: formFields.name,
      cpf: formFields.cpf,
      crm_number: formFields.councilNumber,
      workspace_name: formFields.clinicName,
      cnpj: formFields.cnpj,
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
    <AuthBackground>
      <div className="flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 space-y-6">
        <AnimatedComponent
          type="slide-from-left"
          delay={100}
          duration="duration-500"
        >
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
        </AnimatedComponent>
        <AnimatedComponent type="slide-from-left" delay={100}>
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
        </AnimatedComponent>
        <AnimatedComponent
          type="slide-from-left"
          delay={200}
          className="space-y-5 2xl:space-y-6"
        >
          <form onSubmit={handleSubmit} id="inputs" className="space-y-5">
            {formFields.userType === 'PERSONAL' ? (
              <>
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
                  id="crm-number"
                  label="Número do Conselho Regional"
                  value={formFields.councilNumber}
                  type="text"
                  autoCapitalize="characters"
                  placeholder="CRM/XX 000000"
                  leftIcon={
                    <Newspaper className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  }
                  onChange={(e) =>
                    handleInputChange(
                      'councilNumber',
                      e.target.value.toUpperCase(),
                    )
                  }
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
              </>
            ) : (
              <>
                <BasicInput
                  id="full-name"
                  label="Nome completo do administrador"
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
                  label="CPF do administrador"
                  value={formatCpfCnpj(formFields.cpf)}
                  type="text"
                  placeholder="Digite seu CPF"
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
                  id="clinic-name"
                  label="Nome da Clínica"
                  value={formFields.clinicName}
                  type="text"
                  placeholder="Digite sua clínica"
                  leftIcon={
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  }
                  onChange={(e) =>
                    handleInputChange('clinicName', e.target.value)
                  }
                />
                <BasicInput
                  id="cnpj-number"
                  label="CNPJ"
                  value={formatCpfCnpj(formFields.cnpj)}
                  type="text"
                  placeholder="Digite seu CNPJ"
                  leftIcon={
                    <Newspaper className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  }
                  onChange={(e) =>
                    handleInputChange(
                      'cnpj',
                      e.target.value.replace(/[./-]/g, ''),
                    )
                  }
                />
              </>
            )}
            <Button
              className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary-foreground text-white flex items-center justify-center space-x-2"
              disabled={disabledButton}
              type="submit"
            >
              <UserPlus className="h-5 w-5" />
              Criar conta
            </Button>
          </form>
        </AnimatedComponent>
      </div>
    </AuthBackground>
  );
}
