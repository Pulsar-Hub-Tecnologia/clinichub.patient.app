import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useTheme } from '@/context/theme-context.tsx';
import { Access, useAuth } from '@/context/auth-context.tsx';

import PrivateRoute from './private.routes.tsx';
import PublicRoutes from './public.routes.tsx';

import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar.tsx';
import SidebarHeader from '@/components/app-sidebar/app-sidebar-trigger.tsx';

import Login from '@/pages/public/login.tsx';
import ForgotPassword from '@/pages/public/forgot-password.tsx';
import RecoverPassword from '@/pages/public/recover-password.tsx';
import RegisterAccess from '@/pages/public/register-access.tsx';
import RegisterInfo from '@/pages/public/register-info.tsx';
import VerifyEmail from '@/pages/public/verify-email.tsx';
import ValidateEmail from '@/pages/public/validate-email.tsx';

import Dashboard from '@/pages/private/dashboard.tsx';
import Account from '@/pages/private/account.tsx';
import WorkspaceSettings from '@/pages/private/settings/workspace.tsx';
import Workspaces from '@/pages/private/workspaces.tsx';
import PatientsListPage from '@/pages/private/patients/patient-list.tsx';
import ProfessionalListPage from '@/pages/private/professionals/professional-list.tsx';

const pagesAdmin = [
  {
    path: '/account',
    allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
    component: Account,
  },
  {
    path: '/settings/workspace',
    allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
    component: WorkspaceSettings,
  },
  {
    path: '/dashboard',
    allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
    component: Dashboard,
  },
  {
    path: '/patients',
    allowedRoles: ['ADMIN', 'OWNER', 'PROFESSIONAL', 'HYBRID'],
    component: PatientsListPage,
  },
  {
    path: '/professionals',
    allowedRoles: ['ADMIN', 'OWNER', 'HYBRID'],
    component: ProfessionalListPage,
  }
];

const pagesPaciente = [
  { path: '/pacientes-dashboard', allowedRoles: ['PACIENTES'], component: Account },
]

export const AppRoute = () => {
  const { theme } = useTheme();
  const { accesses, workspace } = useAuth();
  let workspace_id: string;
  let access: Access | undefined;

  if (workspace) {
    workspace_id = workspace.workspace_id;
    access = accesses.find(access => access.workspace_id === workspace_id)!;
  }

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path='/' element={<PublicRoutes />}>
            <Route path={'/login'} element={<Login />} />
            <Route path={'/register-access'} element={<RegisterAccess />} />
            <Route path={'/register-info'} element={<RegisterInfo />} />
            <Route path={'/verify-email'} element={<VerifyEmail />} />
            <Route path={'/validate-email/:token/:email'} element={<ValidateEmail />} />
            <Route path={'/forgot-password'} element={<ForgotPassword />} />
            <Route path={'/recover/:token/:email'} element={<RecoverPassword />} />
          </Route>
          <Route path={'/workspaces'} element={<Workspaces />} />

          {access &&
            pagesAdmin
              .filter((page) => page.allowedRoles.includes(access.role))
              .map((e) => (
                <Route
                  key={e.path}
                  path={e.path}
                  element={
                    <PrivateRoute>
                      <SidebarProvider>
                        <AppSidebar
                          side="left"
                          access={access}
                        />
                        <div className='flex flex-col h-full w-full'>
                          <SidebarHeader />
                          <e.component />
                        </div>
                      </SidebarProvider>
                    </PrivateRoute>
                  }
                />
              ))}

          {pagesPaciente
            .map((e) => (
              <Route
                key={e.path}
                path={e.path}
                element={
                  <PrivateRoute>
                    <SidebarProvider>
                      <AppSidebar
                        side="left"
                      />
                      <div className='flex flex-col h-full w-full'>
                        <SidebarHeader />
                        <e.component />
                      </div>
                    </SidebarProvider>
                  </PrivateRoute>
                }
              />
            ))}
        </Routes>
      </Router>
    </>
  );
};
