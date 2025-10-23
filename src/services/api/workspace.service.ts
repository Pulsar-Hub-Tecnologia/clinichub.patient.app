import { AxiosError } from 'axios';
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

export interface PatientStats {
  total: number;
  actives: number;
  pending: number;
  expired: number;
}

interface Professional {
  id: string;
  email: string;
  name?: string;
  especiality?: string;
  crm?: string;
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "ARCHIVED" | "REJECTED";
  inviteDate: Date;
  // role removed - not applicable for patient app
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
  // role removed - not applicable for patient app
  sortBy: string
}

interface IProfessionalListData {
  page: number;
  limit?: number;
  search: string;
  filters: ProfessionalFilterState;
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class WorkspaceService {
  static async getWorkspace(): Promise<Partial<WorkspaceData>> {
    try {
      const response = await api.get(AppRoutes.WORKSPACE);
      return response.data
    } catch {
      return {
        name: "",
        cnpj: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: {
          cep: "",
          number: "",
          street: "",
          neighborhood: "",
          city: "",
          state: {
            acronym: "",
            name: "",
          }
        }
      }
    }
  }

  static async updateWorkspace(body: Partial<WorkspaceData>): Promise<Partial<WorkspaceData>> {
    try {
      const response = await api.put(AppRoutes.WORKSPACE, body);
      return response.data
    } catch {
      return {
        name: "",
        cnpj: "",
        phone: "",
        whatsapp: "",
        email: "",
        address: {
          cep: "",
          number: "",
          street: "",
          neighborhood: "",
          city: "",
          state: {
            acronym: "",
            name: "",
          }
        }
      }
    }
  }

  static async updatePicture(picture: string): Promise<{ status: number, message: string }> {
    try {
      const response = await api.post(AppRoutes.WORKSPACE + '/picture', { picture });
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

  static async getProfessionals({
    page,
    limit = 10,
    search,
    filters
  }: IProfessionalListData): Promise<PaginatedResponse<Professional>> {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);

    if (filters.status.length > 0) {
      params.append("status", filters.status.join(","));
    }

    if (filters.inviteDateFrom) params.append("inviteDateFrom", filters.inviteDateFrom.toString());
    if (filters.inviteDateTo) params.append("inviteDateTo", filters.inviteDateTo.toString());
    // role filter removed - not applicable for patient app
    if (filters.sortBy) params.append("sortBy", filters.sortBy);

    const response = await api.get(AppRoutes.WORKSPACE + `/professionals?${params.toString()}`)
    return response.data
  }

  static async getProfessionalsStats(): Promise<ProfessionalStats> {
    const response = await api.get(AppRoutes.WORKSPACE + `/professionals/stats`)
    return response.data
  }
}

export default WorkspaceService;
