import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';


export default function PublicRoute() {
  const { pathname } = useLocation()

  // Rotas de validação devem ter controle total sobre sua navegação
  const isValidationRoute = pathname.startsWith('/validate-email') || pathname.startsWith('/validate-invite');

  // Rotas de registro por workspace também devem ser acessíveis para pacientes já autenticados
  const isRegisterRoute = pathname.startsWith('/register/');

  // Não redirecionar automaticamente nas rotas de validação e registro
  if (isValidationRoute || isRegisterRoute) {
    return <Outlet />;
  }

  // Acessar cookie diretamente ao invés do contexto para evitar re-renders durante signIn
  const token = CookieController.get(PatientCookieName.TOKEN);

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
