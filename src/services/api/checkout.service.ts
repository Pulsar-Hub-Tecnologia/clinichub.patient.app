import { api } from '.';

export interface BuyPlanParams {
  planId: string;
  workspaceId: string;
  paymentMethod: string;
}

class CheckoutService {
  static async buyPlan(params: BuyPlanParams) {
    const response = await api.post('/patient/checkout/plan', params);
    return response.data;
  }
}

export default CheckoutService;
