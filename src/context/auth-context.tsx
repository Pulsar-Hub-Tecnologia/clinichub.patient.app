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

export interface Access {
  picture: string;
  workspace_id: string;
  type: "PERSONAL" | "BUSINESS";
  name: string;
  role: "ADMIN" | "OWNER" | "PROFESSIONAL" | "HYBRID";
  workspace_updatedAt?: Date;
}

interface AuthUser {
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextInterface {
  accesses: Access[];
  user: AuthUser | undefined;
  workspace?: Access;
  token: string;
  signIn: (data: { accesses: Access[]; user: AuthUser; token: string }, remember?: boolean) => void;
  signOut: () => void;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | undefined>>;
  signWorkspace: (workspace: Access, remember?: boolean) => Promise<void>;
  signInWithWorkspace: (token: string, remember?: boolean) => void;
  api: typeof api;
  headers: {
    headers: {
      workspace_id: string;
    };
  };
}

const AuthContext = createContext<AuthContextInterface | undefined>(undefined);

interface AuthProviderInterface {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderInterface) => {
  const [token, setToken] = useState('');
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [workspace, setWorkspace] = useState<Access>();
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  useEffect(() => {
    const authCookie = Cookies.get('clinic_auth') as string;
    const { user, accesses } = authCookie ? decryptData<{ user: AuthUser | undefined; accesses: Access[] }>(authCookie) : { user: undefined, accesses: [] };
    const cookieToken = Cookies.get('clinic_token') as string;
    const cookieWorkspace = Cookies.get('clinic_workspace');
    const workspace = cookieWorkspace ? JSON.parse(cookieWorkspace) : undefined;
    //Validar se o usuário possui workspace, se não tiver, redirecionar para a página de workspaces
    // if (!cookieWorkspace) {
    //   window.location.href = '/tela-de-seleção-de-workspace/clinicas';
    //   return;
    // }
    if (user && accesses && cookieToken) {
      setUser(user);
      setAccesses(accesses);
      setToken(cookieToken);
      setWorkspace(workspace);
      console.log('AuthProvider: User and accesses set from cookies');
    }
  }, []);

  const signIn = (data: { accesses: Access[]; user: AuthUser; token: string }, remember?: boolean) => {
    const { accesses, user, token } = data;
    setToken(token);
    setUser(user);
    setAccesses(accesses);
    Cookies.set('clinic_token', token, { expires: remember ? 7 : undefined });
    Cookies.set('clinic_auth', encryptData({ accesses, user }), { expires: remember ? 7 : undefined, secure: true });
  };

  const signInWithWorkspace = (token: string, remember?: boolean) => {
    Cookies.set('clinic_workspace_token', token, { expires: remember ? 7 : undefined, secure: true });
  };

  const signOut = () => {
    Cookies.remove('clinic_auth');
    Cookies.remove('clinic_workspace');
    setToken('');
    setUser(undefined);
    setAccesses([]);
    setWorkspace(undefined);
  };

  const headers = {
    headers: {
      workspace_id: workspace?.workspace_id ?? '',
    },
  };

  async function signWorkspace(workspace: Access, remember?: boolean) {
    setWorkspace(workspace);
    Cookies.set('clinic_workspace', JSON.stringify(workspace), { expires: remember ? 7 : undefined, secure: true });
  }

  return (
    <AuthContext.Provider
      value={{
        accesses,
        user,
        token,
        workspace,
        signIn,
        signOut,
        setUser,
        api,
        signWorkspace,
        headers,
        signInWithWorkspace
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
