import { API_IBGE } from '@/services/api';
import { RoutesIBGE } from './config/enum';

export interface GetState {
  id: number,
  sigla: string,
  nome: string,
  regiao: {
    id: number
    sigla: string
    nome: string
  }
}

class AddressService {
  static async getStates(): Promise<GetState[]> {
    try {
      const response = await API_IBGE.get(RoutesIBGE.ESTADOS + "?orderBy=nome");
      return response.data;
    } catch {
      return []
    }
  }
}

export default AddressService;
