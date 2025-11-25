import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';


export default function PublicRoute() {
  const { pathname } = useLocation()

  // Rotas de validação devem ter controle total sobre sua navegação
  const isValidationRoute = pathname.startsWith('/validate-email') || pathname.startsWith('/validate-invite');

  // Não redirecionar automaticamente nas rotas de validação
  if (isValidationRoute) {
    return <Outlet />;
  }

  // Acessar cookie diretamente ao invés do contexto para evitar re-renders durante signIn
  const token = CookieController.get(PatientCookieName.TOKEN);

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
