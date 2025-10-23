import { useAuth } from "@/context/auth-context";
import AuthService from "@/services/api/auth.service";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ValidateEmail() {
  const navigate = useNavigate()
  const { token, email } = useParams();
  const { signIn } = useAuth()

  useEffect(() => {
    (async () => {
      if (!token || !email) return navigate('/login');

      const response = await AuthService.validateEmail(token, email);

      if (response.status === 200) {
        // Simplified validation for patient app - no workspace selection needed
        signIn(response.data);
        navigate('/dashboard');
      }

      return navigate('/login');
    })()
  }, [])

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      <LoaderCircle className="animate-spin" />
      <p>Validando seu email...</p>
    </div>
  )
}