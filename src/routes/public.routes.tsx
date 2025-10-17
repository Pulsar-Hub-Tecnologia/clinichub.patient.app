import { useAuth } from '@/context/auth-context';
import { Navigate, Outlet } from 'react-router-dom';


export default function PublicRoute() {
  const { token } = useAuth()

  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
