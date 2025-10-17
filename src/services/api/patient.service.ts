import { Invite } from '@/types/Invite';
import { api } from '.';
import { AppRoutes } from './config/enum';

export interface WorkspaceData {
  name: string;
  cnpj: string;
  phone: string;
  whatsapp: string;
  email: string;
  picture?: string;
  address: {
    cep: string;
    number: string;
    street: string;
    neighborhood: string;
    city: string;
    state: {
      acronym: string;
      name: string;
    };
  };
  updatedAt?: Date;
}

export interface Patient {
  id: string;
  name: string;
  email?: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "ARCHIVED" | "REJECTED";
  invite: Invite;
  lastConsultation?: string;
}

export interface PatientStats {
  total: number;
  actives: number;
  pending: number;
  expired: number;
}

export interface ProfessionalStats {
  total: number;
  actives: number;
  pending: number;
  expired: number;
}

export interface PatientFilterState {
  status: string[]
  inviteDateFrom: string | undefined
  inviteDateTo: string | undefined
  lastConsultationFrom: string | undefined
  lastConsultationTo: string | undefined
  consultationFilterType: "without" | "byDate" | ""
  sortBy: string
}

export interface ProfessionalFilterState {
  status: string[]
  inviteDateFrom: Date | undefined
  inviteDateTo: Date | undefined
  role: string
  sortBy: string
}

interface IPatientListData {
  page: number;
  limit?: number;
  search: string;
  filters: PatientFilterState;
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class PatientService {

  static async getPatients({
    page,
    limit = 10,
    search,
    filters
  }: IPatientListData): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);

    if (filters.status.length > 0) {
      params.append("status", filters.status.join(","));
    }

    if (filters.inviteDateFrom) params.append("inviteDateFrom", filters.inviteDateFrom);
    if (filters.inviteDateTo) params.append("inviteDateTo", filters.inviteDateTo);
    if (filters.lastConsultationFrom) params.append("lastConsultationFrom", filters.lastConsultationFrom);
    if (filters.lastConsultationTo) params.append("lastConsultationTo", filters.lastConsultationTo);
    if (filters.consultationFilterType) params.append("consultationFilterType", filters.consultationFilterType);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    const response = await api.get(AppRoutes.PATIENTS + `?${params.toString()}`)
    return response.data
  }

  static async getPatientsStats(): Promise<PatientStats> {
    const response = await api.get(AppRoutes.PATIENTS + `/stats`)
    return response.data
  }

  static async invitePatient(cpf: string, email: string): Promise<{ message: string }> {
    const response = await api.post(AppRoutes.PATIENTS + "/invite", { cpf, email })
    return response.data
  }

  static async resendInvitePatient(inviteId: string): Promise<{ message: string }> {
    const response = await api.post(AppRoutes.PATIENTS + "/resend-invite", { id: inviteId })
    return response.data
  }

  static async validateInvite(token: string, email: string) {
    const response = await api.post(AppRoutes.PATIENTS + "/validate-invite-patient", { token, email });
    return response.data;
  }

  static async handlePatientAccess(id: string): Promise<{ message: string }> {
    const response = await api.post(AppRoutes.PATIENTS + "/handle-access", { id })
    return response.data
  }

  static async updatePatientInvite(id: string, email: string): Promise<{ message: string }> {
    const response = await api.post(AppRoutes.PATIENTS + "/update-invite", { id, email })
    return response.data
  }

  static async testAccess(id: string): Promise<{ message: string }> {
    const response = await api.post(AppRoutes.PATIENTS + "/test-access", { id })
    return response.data
  }
}

export default PatientService;
