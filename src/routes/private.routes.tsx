import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = () => {
    return Cookies.get("clinic_token")
  }

  if (token()) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}
