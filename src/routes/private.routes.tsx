import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const token = Cookies.get("clinic_patient_token");

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
}
