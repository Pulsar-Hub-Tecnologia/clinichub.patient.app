import { api } from '.';
import { AppRoutes } from './config/enum';

export interface DashboardStats {
  total_consultations: number;
  upcoming_consultations: number;
  completed_consultations: number;
  cancelled_consultations: number;
  total_workspaces: number;
}

export interface UpcomingConsultation {
  id: string;
  workspace_name: string;
  workspace_picture?: string;
  professional_name: string;
  professional_picture?: string;
  professional_especiality?: string;
  date: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
}

export interface DashboardData {
  stats: DashboardStats;
  upcoming_consultations: UpcomingConsultation[];
}

class DashboardService {
  static async getDashboard(): Promise<DashboardData> {
    try {
      const response = await api.get(AppRoutes.PATIENT_DASHBOARD);
      return response.data;
    } catch (error) {
      // Return empty data structure in case of error
      return {
        stats: {
          total_consultations: 0,
          upcoming_consultations: 0,
          completed_consultations: 0,
          cancelled_consultations: 0,
          total_workspaces: 0,
        },
        upcoming_consultations: [],
      };
    }
  }
}

export default DashboardService;
