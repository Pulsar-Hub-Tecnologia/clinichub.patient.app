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
  professional_specialty?: string;
  scheduled_date: string;
  scheduled_time: string;
  consultation_type: "PRESENCIAL" | "ONLINE";
  status: 'CONFIRMED' | 'PENDING' | 'CANCELED' | 'COMPLETED';
}

export interface PlanSpecialty {
  name: string;
  remaining: number;
}

export interface ActivePlan {
  id: string;
  workspace_name: string;
  plan_name: string;
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
  usage_percentage: number;
  valid_until: string;
  specialties: PlanSpecialty[];
}

export interface DashboardData {
  stats: DashboardStats;
  upcoming_consultations: UpcomingConsultation[];
  active_plans: ActivePlan[];
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
        active_plans: [],
      };
    }
  }
}

export default DashboardService;
