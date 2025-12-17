import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AccountService from '@/services/api/account.service';

export default function PrivateRoute() {
  const token = CookieController.get(PatientCookieName.TOKEN);
  const location = useLocation();

  const { data: account, isLoading } = useQuery({
    queryKey: ['account'],
    queryFn: AccountService.getAccount,
    enabled: !!token,
    retry: false,
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se o usuário precisa de onboarding e não está na página de welcome
  if (account && !account.has_onboarding && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }

  // Se o usuário já fez onboarding e tenta acessar a página de welcome
  if (account && account.has_onboarding && location.pathname === '/welcome') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
