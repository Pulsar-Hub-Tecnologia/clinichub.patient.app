import { useAuth } from "@/context/auth-context";
import AuthService from "@/services/api/auth.service";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"

export default function ValidateEmail() {
  const navigate = useNavigate()
  const { token, email } = useParams();
  const { signIn } = useAuth()

  useEffect(() => {
    (async () => {
      if (!token || !email) return navigate('/login');

      const response = await AuthService.validateEmail(token, email);

      // Patient app has simplified auth - just patient, token, and workspaces
      await signIn({
        patient: response.data.patient,
        token: response.data.token,
        workspaces: response.data.workspaces
      }, true);

      return navigate('/dashboard');
    })()
  }, [])

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center">
      <LoaderCircle className="animate-spin" />
      <p>Validando seu email...</p>
    </div>
  )
}