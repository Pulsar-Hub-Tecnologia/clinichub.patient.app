import { AxiosResponse } from 'axios';
import { api } from '.';
import { AppRoutes } from './config/enum';

export type ConsultationType = "PRESENCIAL" | "ONLINE";
export type ConsultationStatus = "CONFIRMED" | "PENDING" | "CANCELED" | "COMPLETED";

export interface Consultation {
  id: string;
  patient: {
    id: string;
    name: string;
    email: string;
    picture?: string;
  };
  professional: {
    id: string;
    name: string;
    email: string;
    especiality?: string;
    picture?: string;
  };
  workspace: {
    id: string;
    name: string;
    picture?: string;
  };
  consultation_type: ConsultationType;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  status: ConsultationStatus;
  canceled_reason?: string;
  video_call_link?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ConsultationFilters {
  status?: ConsultationStatus;
  professionalId?: string;
  workspaceId?: string;
  dateFrom?: string;
  dateTo?: string;
  consultationType?: ConsultationType;
}

export interface PaginatedConsultations {
  data: Consultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface GetConsultationsParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: ConsultationFilters;
}

class ConsultationService {
  static async getConsultations({
    page = 1,
    limit = 10,
    search = "",
    filters = {},
  }: GetConsultationsParams = {}): Promise<PaginatedConsultations> {
    const response = await api.get(AppRoutes.PATIENT_CONSULTATIONS, {
      params: {
        page,
        limit,
        search,
        ...filters,
      },
    });
    return response.data;
  }

  static async getUpcomingConsultation(): Promise<Consultation | null> {
    const response = await api.get(`${AppRoutes.PATIENT_CONSULTATIONS}/upcoming`);
    return response.data;
  }

  static async getConsultationById(id: string): Promise<Consultation> {
    const response = await api.get(`${AppRoutes.PATIENT_CONSULTATIONS}/${id}`);
    return response.data;
  }

  static async cancelConsultation(id: string, canceledReason?: string): Promise<AxiosResponse> {
    const response = await api.post(`${AppRoutes.PATIENT_CONSULTATIONS}/${id}/cancel`, {
      canceled_reason: canceledReason,
    });
    return response;
  }

  static async getVideoCallToken(consultationId: string): Promise<{ token: string; channelName: string }> {
    const response = await api.get(`${AppRoutes.PATIENT_CONSULTATIONS}/${consultationId}/video-call-token`);
    return response.data;
  }
}

export default ConsultationService;
