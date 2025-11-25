import axios from 'axios';
import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({ //api é uma variável, não uma classe, ela deve ser cammelCase
  baseURL: baseURL,
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = CookieController.get(PatientCookieName.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Pacientes NÃO enviam x-workspace-token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.data.message === 'Token invalid') {
        CookieController.remove(PatientCookieName.TOKEN);
        CookieController.remove(PatientCookieName.AUTH);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const API_IBGE = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades",
  timeout: 10000
})