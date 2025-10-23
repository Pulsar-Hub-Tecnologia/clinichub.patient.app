import {
  useState,
  createContext,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';
import { decryptData, encryptData } from '@/utils/encrypt';
import { api } from '@/services/api';

// Patient authentication context - aggregates all workspaces in single login
export interface Patient {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone?: string;
  picture?: string;
  date_birth?: string;
}

export interface PatientWorkspace {
  workspace_id: string;
  workspace_name: string;
  workspace_picture?: string;
  workspace_type: "PERSONAL" | "BUSINESS";
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "ARCHIVED" | "REJECTED";
  created_at: Date;
}

interface AuthContextInterface {
  patient: Patient | undefined;
  token: string;
  workspaces: PatientWorkspace[];
  signIn: (data: { patient: Patient; token: string; workspaces: PatientWorkspace[] }, remember?: boolean) => void;
  signOut: () => void;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
  acceptInvite: (workspaceId: string) => Promise<void>;
  rejectInvite: (workspaceId: string) => Promise<void>;
  refreshWorkspaces: () => Promise<void>;
  api: typeof api;
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderInterface {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [token, setToken] = useState('');
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [workspaces, setWorkspaces] = useState<PatientWorkspace[]>([]);

  useEffect(() => {
    const authCookie = Cookies.get('clinic_patient_auth') as string;
    const authData = authCookie
      ? decryptData<{ patient: Patient; workspaces: PatientWorkspace[] }>(authCookie)
      : undefined;
    const cookieToken = Cookies.get('clinic_patient_token') as string;

    if (authData && cookieToken) {
      setPatient(authData.patient);
      setWorkspaces(authData.workspaces || []);
      setToken(cookieToken);
      console.log('AuthProvider: Patient authenticated from cookies');
    }
  }, []);

  const signIn = (data: { patient: Patient; token: string; workspaces: PatientWorkspace[] }, remember?: boolean) => {
    const { patient, token, workspaces } = data;
    setToken(token);
    setPatient(patient);
    setWorkspaces(workspaces || []);

    Cookies.set('clinic_patient_token', token, { expires: remember ? 7 : undefined });
    Cookies.set('clinic_patient_auth', encryptData({ patient, workspaces }), {
      expires: remember ? 7 : undefined,
      secure: true
    });
  };

  const signOut = () => {
    Cookies.remove('clinic_patient_auth');
    Cookies.remove('clinic_patient_token');
    setToken('');
    setPatient(undefined);
    setWorkspaces([]);
  };

  const acceptInvite = async (workspaceId: string) => {
    try {
      await api.post(`/patient/workspaces/${workspaceId}/accept`);
      await refreshWorkspaces();
    } catch (error) {
      console.error('Error accepting invite:', error);
      throw error;
    }
  };

  const rejectInvite = async (workspaceId: string) => {
    try {
      await api.post(`/patient/workspaces/${workspaceId}/reject`);
      await refreshWorkspaces();
    } catch (error) {
      console.error('Error rejecting invite:', error);
      throw error;
    }
  };

  const refreshWorkspaces = async () => {
    try {
      const response = await api.get('/patient/workspaces');
      setWorkspaces(response.data);

      // Update cookie with new workspaces data
      if (patient) {
        Cookies.set('clinic_patient_auth', encryptData({ patient, workspaces: response.data }), {
          secure: true
        });
      }
    } catch (error) {
      console.error('Error refreshing workspaces:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        patient,
        token,
        workspaces,
        signIn,
        signOut,
        setPatient,
        acceptInvite,
        rejectInvite,
        refreshWorkspaces,
        api
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
