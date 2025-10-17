import Cookies from 'js-cookie';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateProps) {
  const token = () => {
    return Cookies.get("clinic_token")
  }

  if (token()) {
    return children;
  }

  return <Navigate to="/login" replace />;
}
