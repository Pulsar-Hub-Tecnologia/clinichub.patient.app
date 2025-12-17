import { AxiosError, AxiosResponse } from 'axios';
import { api } from '.';
import { AppRoutes } from './config/enum';

interface CreateAccountProps {
  workspace_type?: 'PERSONAL' | 'BUSINESS';
  email: string;
  password: string;
  name: string;
  cpf: string;
  crm_number?: string;
  workspace_name?: string;
  cnpj?: string;
  phone?: string;
  date_birth?: string;
}

export interface AccountData {
  id: string;
  name: string;
  cpf: string;
  email: string;
  regional_council_number?: string;
  phone?: string;
  especiality?: string;
  date_birth?: string;
  bio?: string;
  picture?: string;
  has_reset_pass: boolean;
  has_verified_email: boolean;
  has_onboarding: boolean;
  password_hash: string;
  token_reset_password?: string;
  reset_password_expires?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

class AccountService {
  static async createAccount(body: CreateAccountProps): Promise<AxiosResponse> {
    const response = await api.post(AppRoutes.PATIENT_ACCOUNT, body);
    return response;
  }

  static async getAccount(): Promise<AccountData> {
    try {
      const response = await api.get(AppRoutes.PATIENT_ACCOUNT);
      return response.data
    } catch {
      return {
        id: "",
        name: "",
        email: "",
        phone: "",
        cpf: "",
        regional_council_number: "",
        picture: undefined,
        especiality: "",
        date_birth: "",
        bio: "",
        has_reset_pass: false,
        has_verified_email: false,
        has_onboarding: false,
        password_hash: "",
        reset_password_expires: undefined,
        token_reset_password: undefined,
        created_at: "",
        updated_at: undefined,
        deleted_at: undefined,
      }
    }
  }

  static async updateAccount(body: AccountData): Promise<{ message: string }> {
    try {
      const response = await api.put(AppRoutes.PATIENT_ACCOUNT, body);
      return response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return { message: error.message }
      }

      return { message: "Ops! Tivemos um erro ao atualizar seus dados!" }
    }
  }

  static async updatePicture(picture: string): Promise<{ status: number, message: string }> {
    try {
      const response = await api.post(AppRoutes.PATIENT_ACCOUNT + '/picture', { picture });
      return {
        status: response.status,
        message: response.data.message
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status || 500,
          message: "Ops! Tivemos um erro ao atualizar sua foto!"
        }
      }
      return {
        status: 500,
        message: "Ops! Tivemos um erro ao atualizar sua foto!"
      }
    }
  }

  static async validateAccount({
    field,
    value,
  }: {
    field: string;
    value: string;
  }): Promise<AxiosResponse> {
    const response = await api.get(
      AppRoutes.PATIENT_ACCOUNT + `/validate?field=${field}&value=${value}`,
    );
    return response;
  }

  // Workspaces management (patient environment)
  static async getWorkspaces(): Promise<AxiosResponse> {
    const response = await api.get(AppRoutes.PATIENT_WORKSPACES);
    return response;
  }

  static async acceptWorkspace(workspace_id: string): Promise<AxiosResponse> {
    const response = await api.post(AppRoutes.PATIENT_WORKSPACES + `/${workspace_id}/accept`);
    return response;
  }

  static async rejectWorkspace(workspace_id: string): Promise<AxiosResponse> {
    const response = await api.post(AppRoutes.PATIENT_WORKSPACES + `/${workspace_id}/reject`);
    return response;
  }
}

export default AccountService;
