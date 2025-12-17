import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { useTheme } from '@/context/theme-context.tsx';

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
import PatientRegisterWorkspace from '@/pages/public/patient-register-workspace.tsx';

import Dashboard from '@/pages/private/dashboard.tsx';
import Account from '@/pages/private/account.tsx';
import MyInvites from '@/pages/private/my-invites.tsx';
import Consultations from '@/pages/private/consultations/consultations.tsx';
import VideoCall from '@/pages/private/video-call.tsx';
import SelectWorkspace from '@/pages/private/consultations/create/select-workspace.tsx';
import SelectProfessional from '@/pages/private/consultations/create/select-professional.tsx';
import SelectSchedule from '@/pages/private/consultations/create/select-schedule.tsx';
import ConfirmConsultation from '@/pages/private/consultations/create/confirm-consultation.tsx';
import WorkspaceReception from '@/pages/private/workspace-reception.tsx';
import WelcomePage from '@/pages/private/onboarding/welcome.tsx';

export const AppRoute = () => {
  const { theme } = useTheme();

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register-access' element={<RegisterAccess />} />
            <Route path='/register-info' element={<RegisterInfo />} />
            <Route path='/register/:username' element={<PatientRegisterWorkspace />} />
            <Route path='/verify-email' element={<VerifyEmail />} />
            <Route path='/validate-email/:token/:email' element={<ValidateEmail />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/recover/:token/:email' element={<RecoverPassword />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path='/welcome' element={<WelcomePage />} />
            <Route
              path='/dashboard'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <Dashboard />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/account'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <Account />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/invites'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <MyInvites />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultations'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <Consultations />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultations/:consultationId/video-call'
              element={<VideoCall />}
            />
            <Route
              path='/consultations/create/select-workspace'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <SelectWorkspace />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultations/create/select-professional'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <SelectProfessional />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultations/create/select-schedule'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <SelectSchedule />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/consultations/create/confirm-consultation'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <ConfirmConsultation />
                  </div>
                </SidebarProvider>
              }
            />
            <Route
              path='/workspace/:workspaceId/reception'
              element={
                <SidebarProvider>
                  <AppSidebar side="left" />
                  <div className='flex flex-col h-full w-full'>
                    <SidebarHeader />
                    <WorkspaceReception />
                  </div>
                </SidebarProvider>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};
