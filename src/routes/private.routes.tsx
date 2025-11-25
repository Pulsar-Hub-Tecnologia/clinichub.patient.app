import { CookieController, PatientCookieName } from '@/services/cookies/cookie-controller';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = CookieController.get(PatientCookieName.TOKEN);

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}
