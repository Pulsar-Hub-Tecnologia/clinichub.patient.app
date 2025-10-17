import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({ //api é uma variável, não uma classe, ela deve ser cammelCase
  baseURL: baseURL,
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('clinic_token');
    const token_workspace = Cookies.get('clinic_workspace_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (token_workspace) {
      config.headers['x-workspace-token'] = token_workspace;
    }
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
        Cookies.remove('clinic_token');
        Cookies.remove('clinic_workspace_token');
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