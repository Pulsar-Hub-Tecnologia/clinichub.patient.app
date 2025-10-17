

import { User } from '@/types/User';
import { AxiosResponse } from 'axios';
import { api } from '.';
import { AppRoutes } from './config/enum';

export class UserService {
  static async getUser(id: string): Promise<AxiosResponse> {
    return api.get(AppRoutes.USER + `/${id}`);
  }

  static async getUsers(): Promise<AxiosResponse> {
    return api.get(AppRoutes.USER);
  }

  static async createUser(data: User): Promise<AxiosResponse> {
    return api.post('/user', data);
  }

  static async updateUser(data: User): Promise<AxiosResponse> {
    return api.put('/user/', data);
  }

  static async deleteUser(id: string): Promise<AxiosResponse> {
    return api.delete(`/user/${id}`);
  }

  static async getRole(id: string): Promise<AxiosResponse> {
    return api.get(`/user/role/${id}`);
  }
}