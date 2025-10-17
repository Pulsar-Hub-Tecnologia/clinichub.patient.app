import { RecoverPassword } from '@/types/User';
import { api } from '.';
import { AppRoutes } from './config/enum';

//   async function get2FaQrCode(email: string) {
//     const response = await api.get(`/auth/2fa/${email}`);
//     return response;
//   }

//   async function verifySecret(data: { email: string; secret: string }) {
//     const response = await api.post('/auth/2fa/verify', data);
//     return response;
//   }

class AuthService {
  static async login(email: string, password: string) {
    const response = await api.post(AppRoutes.AUTH, { email, password });
    return response;
  }

  static async validateEmail(token: string, email: string) {
    const response = await api.post(AppRoutes.AUTH + "/validate-email", { token, email });
    return response;
  }

  static async resendValidateEmail(email: string) {
    const response = await api.post(AppRoutes.AUTH + "/resend-validate-email", { email });
    return response;
  }

  static async forgotPassword(email: string) {
    const response = await api.post(AppRoutes.AUTH + '/forgot-password/', {
      email,
    });
    return response;
  }

  static async recoverPassword(data: RecoverPassword) {
    const response = await api.post(
      AppRoutes.AUTH + '/recover-password/',
      data,
    );
    return response;
  }
}

export default AuthService;
